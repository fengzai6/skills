# Agent Note: PR 创建后的 Review 执行方式选择

Status: implemented

## Problem

PR 创建后，用户可能直接要求 review 而不指定执行方式。当前会话刚刚参与实现，容易受实现思路影响；独立 reviewer 又需要明确上下文边界、用户交互责任和回复 PR 的授权边界。审查结束是否应询问回复 PR，还取决于 PR 作者是否为当前登录用户；commit author、assignee 等信号不能可靠表示 PR 归属。

## Decision

`skills/git-workflow/references/issue-pr.md` 在 PR 创建后的可选 review 步骤中询问用户是否需要 review，并给出两个带简短说明的选项：独立 reviewer（推荐）和当前会话；选项中不展开具体执行规则。用户未指定执行方式但直接要求 review 时，按推荐方式（独立 reviewer）执行；用户明确表示不需要 review 时不执行 review，不阻塞 PR 收尾。

- **独立 reviewer**：优先推荐。主会话派发一个全新、只读的 reviewer subagent，执行 `/pr-review` 的获取输入与审查流程，只传入仓库路径、PR 编号或 URL、需求与验收摘要，不复刻当前实现对话。subagent 不修改文件、不直接向用户提问、不回复 PR、不再派子智能体，只返回完整 review、需澄清项、超出范围汇总和 verdict。
- **当前会话**：由当前会话直接执行 `/pr-review`，沿用已有上下文。

`skills/pr-review/SKILL.md` 保持通用的 PR 审查流程，不区分执行者。独立 reviewer 的职责边界由派发者在 prompt 中明确；用户澄清和 PR 回复由主会话处理。

独立 reviewer 的审查结果由主会话核对与 PR diff 的一致性后向用户展示；需澄清项和是否回复 PR 都仍由主会话向用户确认。当前环境不支持 subagent 时，显式说明原因并回退到当前会话。

`skills/pr-review/SKILL.md` 在获取 PR 时比较 `author.login` 与 `gh api user` 返回的当前登录账号：

- 两者相同：按自审处理，不询问是否回复 PR，也不默认写 PR；用户明确要求时才回复。
- 两者不同：按审查他人 PR 处理，输出 review 后询问是否回复。
- 无法取得任一侧身份：按归属未知处理，先询问用户，不猜测为自审。

该判断只表示 PR 作者是否为当前 `gh` 登录账号，不表示当前 Agent 是否创建了 PR。`gh` 查询按仓库约定在沙箱外执行。

## Alternatives considered

### 始终由当前会话审查

实现简单且不需要额外上下文交接，但当前会话已经参与实现，存在自审偏差，也无法提供独立 reviewer 的新鲜视角。

### 始终派发独立 reviewer

可以提高独立性，但会增加调用和上下文交接成本；部分运行环境没有 subagent 能力，用户也可能只希望快速收尾。强制派发会把执行方式变成不可控的硬依赖。

### 只保留“是否 review”而不询问执行方式

保持流程最短，但会让独立审查与当前会话审查混在一起，用户无法预期实际由谁执行，也无法明确上下文和回复责任。

### 在 `pr-review/SKILL.md` 中区分执行方式

可以直接约束当前会话与独立 reviewer 的行为，但会让通用 PR 审查 skill 绑定具体编排方式。派发者已在 prompt 中提供审查范围和交互边界，因此不在该 skill 中重复。

### 使用 commit author 或 assignee 判断 PR 归属

实现简单，但这些字段不等于 PR 作者，且当前 Agent 通常复用用户凭证；用它们判断自审会把本机提交信息或分配关系误当成 PR 所有权。

### 判断是否为当前 Agent 创建的 PR

更贴近会话来源，但 GitHub 不记录 Agent 与会话身份；要可靠实现必须在创建 PR 时额外记录 provenance。当前采用账号级归属，不引入会话状态。

## Consequences

- 用户可以在审查独立性、速度和使用当前上下文之间主动选择。
- 独立审查需要更明确的 brief 和结果核对，增加一次上下文交接；无 subagent 时会回退到当前会话，不阻塞交付。
- 是否将 review 结论回复到 PR 仍由用户单独授权，review 本身不等于远程写操作。
- 自审不再询问是否回复；该判断基于当前 `gh` 登录账号，不覆盖同一账号下多个操作者或 Agent 的差异。

## Verification

- 检查 `skills/git-workflow/references/issue-pr.md` 的可选 PR review 步骤包含两个带简短说明的选项、直接要求 review 时默认使用推荐方式、无 review 分支、回退规则和用户确认边界。
- 检查 `skills/pr-review/SKILL.md` 保持通用 PR 审查流程，独立 reviewer 的职责边界只由派发者 prompt 传递。
- 检查 `skills/pr-review/SKILL.md` 使用 PR `author.login` 与 `gh api user` 判断归属，并覆盖自审、他人 PR 和未知三种回复分支。
- 使用仓库的 agent note 校验脚本检查新增决策记录的目录、格式和链接。
