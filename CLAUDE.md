# Skills 仓库规范

本仓库进行的 skill 编辑都是编辑本仓库内的文件，而不是 `~/.claude/skills/` 下已安装的运行时副本。

## 结构约定

- 每个 skill 一个独立目录，使用 kebab-case 命名
- 每个 skill 目录必须包含 `SKILL.md`（核心指令文件，模板中为 `SKILL.template.md` 以避免被识别）
- 其余文件按需创建，根据 skill 复杂程度决定：
  - `README.md` — 当 skill 逻辑复杂、需要给人类额外说明时才创建
  - `examples.md` — 当需要 few-shot 示例辅助模型理解时才创建
  - `scripts/` — 当需要可执行脚本时才创建
  - `references/` — 当需要参考资料或知识库时才创建
  - `assets/` — 当需要模板、schema 等静态资源时才创建
  - `tests/` — 当 skill 足够复杂需要验证时才创建
- `_template/` 为参考模板，不需要完整复制，按需取用

## 编写规范

- `SKILL.md` 使用 YAML frontmatter 定义元信息，markdown 正文定义工作流
- 所有文档使用中文编写
- 文件名使用 kebab-case
- 脚本文件需有可执行权限
- 脚本调用说明应明确运行目录；默认写「从本 skill 目录执行 `scripts/xxx`」，不要假设业务项目 cwd 下存在同名 `scripts/`
- 脚本依赖第三方包时，优先在 `SKILL.md` 写明安装命令和脚本友好错误提示；单个轻量依赖不单独添加 `requirements.txt`

## 规范归属规则

新增规范时，先判断适用范围，再放入对应文件：

- 如果规范**跨所有项目通用** → 放入 `rules/main.md`
- 如果规范**只在特定技术栈或领域下有意义** → 放入对应的 skill 的 `SKILL.md`
- 不确定归属时，先查看现有的 `rules/` 和 `skills/` 目录，找到最匹配的文件

## 文档同步规则

新增或修改 skill 后，必须同步更新以下文档：

1. **`rules/main.md`** — 在「额外可用 Skills」中添加条目，说明调用时机
2. **`README.md`** — 在「可用 Skills」中添加条目（路径、用途），并更新目录结构图；新增 skill 初始路径后写 `(0 tokens)`，提交时由 husky 自动计算并替换
3. **根目录 `CLAUDE.md`** — 如涉及新的编写规范或流程变更，同步更新本文档

## 写作流程

1. **收集需求** — 询问用户：
   - 该技能涵盖哪些任务/领域？
   - 应该处理哪些特定用例？
   - 需要可执行脚本还是只需要指令？
   - 有需要包含的参考资料吗？

2. **起草技能** — 创建：
   - `SKILL.md` 附带简明说明
   - 如果内容超过 500 行，拆分为额外的参考文件
   - 如果需要确定性操作，编写实用脚本

3. **与用户审查** — 提交草稿并确认：
   - 是否涵盖了您的用例？
   - 有什么遗漏或不清楚的吗？
   - 哪些部分应该更详细/更不详细？

## SKILL.md 模板

```
---
name: skill-name
description: Use when [specific triggering conditions].
---

# Skill Name

## 快速开始

[最简可用示例]

## 工作流

[分步流程，复杂任务附带检查清单]

## 高级功能

[链接到独立文件：参见 [REFERENCE.md](REFERENCE.md)]
```

## 说明要求（description）

description 是代理决定是否读取某个 skill 时看到的关键信息。它必须回答“什么时候应该读取这个 skill”。

**目标**：只描述触发条件，不概括执行流程。

**格式要求**：

- 必须以 `Use when...` 开头
- 聚焦具体场景、症状、文件、技术栈或任务类型
- 不要概括 skill 的执行流程、产出物或内部步骤，避免 agent 只按摘要执行而跳过正文
- 技术栈专项 skill 应在触发条件中明确技术栈；非技术栈专项 skill 不要绑定无关技术细节
- 尽量保持简短，优先控制在 500 字符以内

**好例子**：

> Use when working with PDF files, form filling, document extraction, text extraction, table extraction, or document merging.

**坏例子**：

> Extracts text and tables from PDFs, fills forms, and merges documents.

## 何时添加脚本

在以下情况添加实用脚本：

- 操作是确定性的（验证、格式化）
- 相同代码会被重复生成
- 错误需要显式处理

脚本相比生成的代码可节省 token 并提高可靠性。

## 何时拆分文件

在以下情况拆分为独立文件：

- `SKILL.md` 超过 100 行
- 内容涉及不同领域（如财务 vs 销售 schema）
- 高级功能很少被需要

## 审查清单

起草后逐项验证：

- [ ] description 以 `Use when...` 开头，且只描述触发条件
- [ ] `SKILL.md` 不超过 100 行
- [ ] 无时效性信息
- [ ] 术语一致
- [ ] 包含具体示例
- [ ] 引用文件层级不超过一级

## SKILL.md frontmatter 支持字段

- `name`: skill 名称（kebab-case）
- `description`: 简短描述（显示在 skill 列表中）
- `argument-hint`: 参数提示（可选）
- `user-invocable`: 是否可由用户直接调用（true/false）
- `compatibility`: 兼容性信息
- `context`: 上下文配置
- `disable-model-invocation`: 是否禁止模型自动调用（true/false）
- `license`: 许可证
- `metadata`: 额外元数据
