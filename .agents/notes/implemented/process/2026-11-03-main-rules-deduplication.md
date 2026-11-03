# Agent Note: 通用规范的保守去重

Status: implemented

## Problem

本轮修改前的 `rules/main.md` 为 235 行、6,858 tokens（`cl100k_base`）。任务分流在核心原则、闭环工程和 Skill 匹配中重复定义，Skill 调用顺序又以正向流程、禁止项和陷阱表反复表达。作为常驻规范，这些重复增加上下文和多处维护成本。

## Decision

本篇记录第一轮保守去重；确认与模块化边界的后续调整见 [查证确认与文件拆分边界](2026-11-03-main-rules-execution-boundaries.md)。下述保留项和验证以第一轮结果为准。

- 任务分流统一放在闭环工程章节，其他章节引用该处；退出条件并入闭环步骤。
- Skill 章节保留调用顺序、适用范围和匹配表，合并同义强调；通用原则和测试规范仅压缩重复表达。
- 保留原有确认条件、文件拆分要求、测试策略、笔记要求和 Git 授权边界，不改各 skill 的触发范围，也不迁移尚未核实承接关系的规则。
- 仅更新 README 的自动 token 统计，不改 skill、仓库级规范或安装目录中的副本。

既有 [TypeScript 规范分册决策](../../implemented/architecture/2026-10-22-ts-standards-reference-split.md) 与本主题部分重叠，继续适用；本轮只合并入口中同一 skill 的匹配条目，不改变分册或读取条件。

## Alternatives considered

- **仅合并重复表达（采用）**：降低常驻和维护成本，同时可以通过前后条目核对保留约束；代价是仍保留部分较长的执行细节。
- **同时调整确认、拆文件条件并下沉执行细节（未采用）**：可以进一步缩短入口，但会改变执行行为或引入对外部 skill 的依赖，超出本轮保守精简范围。

## Verification

- 相对本轮修改前的 `HEAD:rules/main.md` 核对条目，确认任务分流、skill 触发范围和关键约束均有对应。
- 比较命名、复用、文件拆分、模块化、笔记要求及工具规则章节，确认原文保持不变；核对 skill 引用集合和章节引用有效性。
- 使用 `node scripts/count-tokens.mjs` 更新 README，以 `cl100k_base` 比较前后 token 数，并复核 README 统计与当前文件一致。
- 运行 `git diff --check`；从仓库根目录使用 Node.js 24 的原生 TypeScript 支持运行已加载笔记 skill 中的 `verify-agent-note-tree.ts`、`verify-agent-note-format.ts`、`verify-archived-agent-notes.ts`，不新增项目依赖或校验工具链。

## Consequences

- 常驻正文合并重复分流和同义强调，相关规则只需在一个位置维护；各 skill 和仓库级编写规范不变。
- 第一轮去重结果保留原有较宽的确认条件及拆分要求，也保留笔记执行细节；进一步调整执行行为或下沉规则时，需要单独确认适用范围和承接位置。
- 自动校验只能证明结构有效，不能证明语义完全等价，正文的条件保留仍依赖前后审查。
