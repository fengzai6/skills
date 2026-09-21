---
name: pr-review
description: Use when reviewing a pull request, PR diff, or branch change set against its PR description.
user-invocable: true
metadata:
  author: nacho
  version: 0.1.0
---

# PR 审查

复用 [code-review](../code-review/SKILL.md) 的审查口径，对 PR 做只读审查。

## 获取输入

支持：

- PR 编号或 URL：使用 `gh pr view`、`gh pr diff` 获取描述与变更；`gh` 按仓库约定在沙箱外执行。
- 当前分支或目标分支：按 merge-base 确定实际待合入 diff。
- 用户直接提供的 diff、PR 描述、lint 或测试输出。

优先获取 PR 描述。缺少描述时仍可审查，但无法判断是否属于范围内的内容，放入「超出范围」汇总，不自行猜测需求。

## 审查

1. 阅读 PR 描述、完整 diff，以及理解变更所需的周边代码。
2. 按 [code-review](../code-review/SKILL.md) 的优先级、真实性约束和输出格式审查。
3. 只审查与 PR 描述直接相关的内容；超范围问题单独汇总并建议另开 issue。
4. 不修改文件；不运行测试，除非用户明确要求。

## 输出与回复

1. 先输出完整 review，至少包含所有 findings、超出范围汇总和 verdict。
2. 输出完成后，询问用户是否需要将结论回复到 PR。
3. 用户不需要回复时到此结束。
4. 用户需要回复时，使用 `gh` 按用户指定的形式回复到目标 PR；`gh` 按仓库约定在沙箱外执行。
5. 回复失败时保留完整 review 文本，并报告失败原因，不改成猜测性摘要。

## 红线

- 未经用户确认就将结论回复到 PR。
- PR 创建、push、合并或 resolve thread；这些不属于本 skill。
- 审查与 PR 描述无关的既有问题并 inline 提出。
- 未读完整 diff 或未核对上下文就给 verdict。
