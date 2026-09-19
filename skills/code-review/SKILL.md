---
name: code-review
description: Use when reviewing a code change, diff, commit, or implementation for correctness, security, performance, maintainability, and test gaps.
user-invocable: true
metadata:
  author: nacho
  version: 0.1.0
---

# 代码审查

以资深软件工程师视角做冷静、友好、建设性的只读审查。

## 输入

- 代码 diff
- 需求或 PR 描述（如有）
- lint、测试输出（如有）

## 审查优先级

严格按以下顺序判断：

1. **正确性**：bug、边界、竞态、控制流
2. **安全**：输入校验、认证授权、密钥泄露
3. **性能**：N+1、缺失索引、阻塞 I/O
4. **可维护性**：命名、重复、死代码、缺失测试
5. **风格**：仅当前四项无问题时考虑，并优先项目现有规范

## 范围与真实性

- 有明确需求或 PR 描述时，只审查与描述直接相关的内容。
- 超出范围的问题汇总列出，建议另开 issue，不按 inline finding 提出。
- 只报告由本次变更引入、可定位且可行动的问题。
- 不报告推测性问题、既有问题、无影响风格偏好。
- 不修改文件；不运行测试，除非用户明确要求。
- 可复用当前环境提供的独立 reviewer 或更强 agent；不要为了遵循固定流程而限制审查质量。

## 输出

每条发现使用：

```text
[Severity] 一行摘要
Where: file:line
Why: 一句话说明影响
Fix: 具体代码或明确指令
```

`Severity`: `Critical` / `High` / `Medium` / `Low`。

规则：

- 不输出无发现的等级。
- 简单 diff 且无问题时，直接输出 `LGTM`，不要硬找问题。
- 最后一行固定输出 verdict：`Verdict: LGTM` 或 `Verdict: Changes requested`。
