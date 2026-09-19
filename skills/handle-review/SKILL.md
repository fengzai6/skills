---
name: handle-review
description: Use when handling pull request review comments or user-provided review findings and deciding which fixes to implement.
user-invocable: true
metadata:
  author: nacho
  version: 0.1.0
---

# 处理 Review

作为编排者验证 review 结论，再把确认成立的修复批次交给一个 subagent。

## 输入

- PR review comment：使用 `gh` 获取；按仓库约定在沙箱外执行。
- 用户直接提供的 review 结论、comment 或建议。

同时读取相关 diff、需求和周边代码；review 结论本身不是事实依据。

## 判断结论

逐条核对并分类：

- **成立**：问题存在，需要修
- **部分成立**：问题存在，但描述或范围需要修正
- **不成立**：有代码、行为或验证证据可以反驳，不修
- **需确认**：缺少信息，或涉及产品、契约、架构决策

对每条结论给出简要依据。不要机械照做，也不要为了显得配合而接受不成立的建议。

存在「需确认」项时先向用户确认；其余已确认项可合并成一个修复批次。

## 派发修复

1. 把成立和部分成立的结论合并成一份边界清晰的修复 brief。
2. 只派一个 subagent，不复刻对话历史；提供目标、必读文件、结论依据、修复范围和验证要求。
3. 要求 subagent 禁止再派子智能体；完成最小修复、运行项目已有相关测试，并按项目约定提交本地 commit。
4. 修复完成后，按 [code-review](../code-review/SKILL.md) 基于修复前后的 diff 做一次 scoped re-review，逐条确认结论是否关闭。

## 返回结果

按结论汇总：

- 原文结论
- 成立 / 部分成立 / 不成立 / 需确认
- 判断依据
- 修复或未修原因
- 修复 commit 和复核结果

收尾时询问用户是否需要 push、回复 PR comment、resolve thread 等远程操作；未获明确要求不执行。

## 红线

- 未验证结论就派发修复。
- 给每条 comment 单独派 subagent。
- 把不成立或需确认的结论硬改。
- 自动 push、回复 PR、resolve thread 或合并 PR。
