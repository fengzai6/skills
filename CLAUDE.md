# Skills 仓库规范

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

## 文档同步规则

新增或修改 skill 后，必须同步更新以下文档：

1. **`rules/main.md`** — 在「可用 Skill」中添加条目，说明调用时机
2. **`README.md`** — 在「可用 Skills」中添加条目（路径、用途），并更新目录结构图；路径后需附带 `(N tokens)` 占位（husky 正则依赖此格式）
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
description: Brief description of capability. Use when [specific triggers].
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

description 是代理决定加载哪个技能时看到的**唯一内容**，与所有已安装技能一起出现在系统提示中。

**目标**：让代理知道：
- 该技能提供什么能力
- 何时/为何触发（特定关键字、上下文、文件类型）

**格式要求**：
- 最多 1024 字符
- 以第三人称撰写
- 第一句：说明功能
- 第二句："在 [特定触发因素] 时使用"

**好例子**：
> 从 PDF 文件中提取文本和表格、填写表单、合并文档。在处理 PDF 文件或用户提及 PDF、表单、文档提取时使用。

**坏例子**：
> 帮助处理文档。

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
- [ ] description 包含触发条件（"在……时使用"）
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
