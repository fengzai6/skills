import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'fs';
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

// 更新 README 中的 token 数
function updateReadme(readmePath, tokenCounts) {
  let content = readFileSync(readmePath, 'utf-8');

  for (const { path, tokens } of tokenCounts) {
    // 匹配模式：(path) (数字 tokens)
    const regex = new RegExp(`\\(${escapeRegex(path)}\\) \\([0-9]+ tokens\\)`, 'g');
    content = content.replace(regex, `(${path}) (${tokens} tokens)`);
  }

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
  let totalTokens = 0;

  // 统计 rules 目录下的 .md 文件
  const rulesFiles = ['rules/main.md', 'rules/codegraph.md'];
  for (const file of rulesFiles) {
    const tokens = countFileTokens(file);
    tokenCounts.push({ path: file, tokens });
    totalTokens += tokens;
    console.log(`  ${file}: ${tokens} tokens`);
  }

  // 统计 skills 目录下的 SKILL.md 文件
  const skillsDir = 'skills';
  const skillFiles = ['skills/ts-standards/SKILL.md']; // 可以动态扩展
  for (const file of skillFiles) {
    const tokens = countFileTokens(file);
    tokenCounts.push({ path: file, tokens });
    totalTokens += tokens;
    console.log(`  ${file}: ${tokens} tokens`);
  }

  // 更新 README.md
  updateReadme('README.md', tokenCounts);

  console.log(`统计完成！总计 ${totalTokens} tokens`);

  // 释放编码器资源
  encoding.free();
}

main();
