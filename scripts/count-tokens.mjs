import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import tiktoken from 'tiktoken';

// 使用 cl100k_base 编码（GPT-3.4/4 使用的编码器）
const encoding = tiktoken.get_encoding('cl100k_base');

// 统计单个文件的 token 数
function countFileTokens(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const tokens = encoding.encode(content);
    return tokens.length;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return 0;
  }
}

const README_STATS_START = '<!-- token-stats:start -->';
const README_STATS_END = '<!-- token-stats:end -->';

function collectMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(filePath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(filePath);
    }
  }

  return files;
}

// 更新 README 中的 token 数和递归文件统计区块
function updateReadme(readmePath, tokenCounts) {
  let content = readFileSync(readmePath, 'utf-8');

  for (const { path, tokens } of tokenCounts.filter(({ path }) => path.startsWith('rules/'))) {
    // 匹配模式：(path) (数字 tokens)
    const regex = new RegExp(`\\(${escapeRegex(path)}\\) \\([0-9]+ tokens\\)`, 'g');
    content = content.replace(regex, `(${path}) (${tokens} tokens)`);
  }

  const rows = tokenCounts
    .map(({ path, tokens }) => `| [${path}](${path}) | ${tokens} |`)
    .join('\n');
  const stats = [
    '## 文件 Token 统计',
    '',
    `${README_STATS_START}`,
    '',
    '> 由 `scripts/count-tokens.mjs` 自动生成。',
    '',
    '| 文件 | Tokens |',
    '| --- | ---: |',
    rows,
    '',
    `${README_STATS_END}`,
  ].join('\n');
  const statsPattern = new RegExp(
    `## 文件 Token 统计[\\s\\S]*?${README_STATS_END}`,
  );
  content = statsPattern.test(content)
    ? content.replace(statsPattern, stats)
    : content.replace('\n## 如何新建 Skill', `\n${stats}\n\n## 如何新建 Skill`);

  writeFileSync(readmePath, content, 'utf-8');
}

// 转义正则特殊字符
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 主函数
function main() {
  console.log('开始统计 token 数...');

  const tokenCounts = [];
  const files = [...collectMarkdownFiles('rules'), ...collectMarkdownFiles('skills')]
    .sort();

  for (const file of files) {
    const tokens = countFileTokens(file);
    tokenCounts.push({ path: file.replaceAll('\\', '/'), tokens });
    console.log(`  ${file}: ${tokens} tokens`);
  }

  // 更新 README.md
  updateReadme('README.md', tokenCounts);

  const totalTokens = tokenCounts.reduce((total, { tokens }) => total + tokens, 0);
  console.log(`统计完成！总计 ${totalTokens} tokens`);

  // 释放编码器资源
  encoding.free();
}

main();
