# Agent Note: Code Review 区分缺陷与设计建议

Status: implemented

## Problem

现有 `code-review` 规则集中于有证据、可定位的缺陷，虽会检查系统方案与现有能力复用，但缺少非阻断设计建议的输出契约。对于功能正确、但存在值得权衡的职责划分或重复逻辑的变更，容易直接给出 LGTM，也可能把可选改进误判为必须修复。

## Decision

`skills/code-review/SKILL.md` 采用双层审查：先识别本次变更造成的实际缺陷与风险（Findings），再评估与变更直接相关、收益和代价都能说明的可选设计改进（Design Suggestions）。实际影响需求、契约或可靠性的方案缺陷仍归入 Findings；纯改进不阻断合入，没有明确价值时不输出建议。

Findings 保留 `Where: file:line` 精确定位；Design Suggestions 使用 `Scope` 定位到实际受影响的函数、模块、业务流程或架构范围，并提供相应证据，不强制关联单行代码。这样既能审查跨模块设计，也不放宽建议的真实性要求。

`skills/pr-review/SKILL.md` 复用该标准，完整输出中包含有价值的非阻断设计建议（如有），保留原有 verdict 与 PR 回复授权边界。

## Alternatives considered

### 独立增加 design-review skill

可以进行更深入的架构审查，并隔离意见输出；但每次都需要单独触发和补充上下文，对于已有 diff 与需求信息的代码审查增加重复成本。当前将轻量设计评估纳入常规 Review。

### 将所有设计意见作为 Findings

输出格式更统一，但会让可选改进与实际缺陷共享严重等级和合入 verdict，鼓励为实现个人设计偏好而阻断交付，因此不采用。

### 保持仅报告缺陷

最能限制噪声且结论明确，但无法帮助用户识别当前正确实现中的具体设计取舍，不满足本次需要主动补充建议的目标。

## Consequences

- Review 可以在不阻断合入的前提下报告有证据、收益明确的设计改进；PR 审查沿用同一输出口径。
- 设计建议的定位不再局限于具体代码行，但仍须说明变更涉及的范围及证据。
- 需要额外评估建议是否值得现在实施，也增加少量审查篇幅；用变更相关性、证据及收益/代价要求限制无关建议。

## Verification

- 独立审查场景中，两个发票入口共享业务规则且下一迭代确认新增税务豁免时，输出独立 Design Suggestion、不报告缺陷，最终 verdict 为 LGTM。
- 对没有已确认扩展需求的简单重复报表逻辑，输出 LGTM，未强制提出设计建议。
- 检查两类输出格式：Findings 保留 `Where: file:line`，Design Suggestions 使用 `Scope` 并明确跨模块定位与证据要求。
- 两份 skill 的 YAML frontmatter 解析、名称与描述约束、100 行限制通过校验；笔记结构、格式与归档校验通过。
- 官方 `quick_validate.py` 不识别两份 skill 原本具有的 `user-invocable` 字段，故使用独立 frontmatter 校验补充验证，不改动该现有字段。
