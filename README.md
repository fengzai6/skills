# Skills 仓库

本仓库用于存放和管理自定义 rules 与 skills。

## 当前内容

### 可用 Rules

- `main`
  - 路径: [rules/main.md](rules/main.md) (6858 tokens)
  - 用途: 默认通用规则，全局行为约束与通用编码规范，所有项目通用，应放置在 `~/.claude/CLAUDE.md` 中始终生效，正常使用时复制这个文件内容即可
- `codegraph`
  - 路径: [rules/codegraph.md](rules/codegraph.md) (438 tokens)
  - 用途: CodeGraph 相关补充规则，只有在用户明确需要 CodeGraph 约束时才和 `main` 一起复制

### 可用 Skills

- `ts-standards`
  - 路径: [skills/ts-standards/SKILL.md](skills/ts-standards/SKILL.md)
  - 用途: TypeScript 项目编码规范（前端、Node.js 后端、脚本、工具链），前端细节见 `references/`
- `business-roadmap`
  - 路径: [skills/business-roadmap/SKILL.md](skills/business-roadmap/SKILL.md)
  - 用途: 用户主动调用时进行业务宏观规划，梳理发展方向、演进阶段、关键依赖与成功判据
- `code-review`
  - 路径: [skills/code-review/SKILL.md](skills/code-review/SKILL.md)
  - 用途: 对代码变更、diff、commit 或实现做只读审查，按正确性、安全、性能、可维护性、风格排序输出 findings
- `pr-review`
  - 路径: [skills/pr-review/SKILL.md](skills/pr-review/SKILL.md)
  - 用途: 基于 code-review 审查 PR，结尾询问是否将结论回复到 PR
- `handle-review`
  - 路径: [skills/handle-review/SKILL.md](skills/handle-review/SKILL.md)
  - 用途: 验证 PR review 或用户提供的 review 结论，并派一个 subagent 处理确认成立的修复
- `spec-review`
  - 路径: [skills/spec-review/SKILL.md](skills/spec-review/SKILL.md)
  - 用途: 审查 spec、设计文档或技术方案文档，给出修改建议、设计改进意见和补充建议
- `git-workflow`
  - 路径: [skills/git-workflow/SKILL.md](skills/git-workflow/SKILL.md)
  - 用途: Git 本地提交约定（分支命名、commit、gh 沙箱）；Issue/PR 交付流程与正文规则见 `references/`
- `test-review`
  - 路径: [skills/test-review/SKILL.md](skills/test-review/SKILL.md)
  - 用途: 用户点名、即将开 PR、或大任务完成怕遗漏时审查测试完备性并按需补测
- `man-day-quote`
  - 路径: [skills/man-day-quote/SKILL.md](skills/man-day-quote/SKILL.md)
  - 用途: 人天报价（调用后先问方式与落地路径；线 A 直接估 / 线 B 先设计再估；确认后 py 生成 xlsx）

## 文件 Token 统计

<!-- token-stats:start -->

> 由 `scripts/count-tokens.mjs` 自动生成。

| 文件 | Tokens |
| --- | ---: |
| [rules/codegraph.md](rules/codegraph.md) | 438 |
| [rules/main.md](rules/main.md) | 6858 |
| [skills/business-roadmap/SKILL.md](skills/business-roadmap/SKILL.md) | 636 |
| [skills/code-review/SKILL.md](skills/code-review/SKILL.md) | 1143 |
| [skills/git-workflow/SKILL.md](skills/git-workflow/SKILL.md) | 1194 |
| [skills/git-workflow/references/issue-pr.md](skills/git-workflow/references/issue-pr.md) | 2230 |
| [skills/handle-review/SKILL.md](skills/handle-review/SKILL.md) | 678 |
| [skills/man-day-quote/SKILL.md](skills/man-day-quote/SKILL.md) | 2162 |
| [skills/pr-review/SKILL.md](skills/pr-review/SKILL.md) | 993 |
| [skills/spec-review/SKILL.md](skills/spec-review/SKILL.md) | 764 |
| [skills/test-review/SKILL.md](skills/test-review/SKILL.md) | 1235 |
| [skills/ts-standards/SKILL.md](skills/ts-standards/SKILL.md) | 1141 |
| [skills/ts-standards/references/interaction.md](skills/ts-standards/references/interaction.md) | 263 |
| [skills/ts-standards/references/performance.md](skills/ts-standards/references/performance.md) | 515 |
| [skills/ts-standards/references/react.md](skills/ts-standards/references/react.md) | 1827 |

<!-- token-stats:end -->

## 如何新建 Skill

1. 复制 `_template/` 目录并重命名为你的 skill 名称（kebab-case）
2. 将 `SKILL.template.md` 重命名为 `SKILL.md`
3. 按需补充 `README.md`、`examples.md`、`scripts/`、`references/`、`assets/`、`tests/`
4. 保持内容与本仓库规范一致，避免和通用 rules 重复

## Skill 结构约定

- 每个 skill 一个独立目录，使用 kebab-case 命名
- 每个 skill 目录必须包含 `SKILL.md`
- 其余文件按需创建：
  - `README.md`
  - `examples.md`
  - `scripts/`
  - `references/`
  - `assets/`
  - `tests/`

## SKILL.md 说明

`SKILL.md` 使用 YAML frontmatter 定义元信息，markdown 正文定义工作流。

### frontmatter 支持字段

- `name`: skill 名称（kebab-case）
- `description`: 简短描述
- `argument-hint`: 参数提示（可选）
- `user-invocable`: 是否可由用户直接调用（true / false）
- `compatibility`: 兼容性信息
- `context`: 上下文配置
- `disable-model-invocation`: 是否禁止模型自动调用（true / false）
- `license`: 许可证
- `metadata`: 额外元数据
