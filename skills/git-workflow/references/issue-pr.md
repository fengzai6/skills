# Issue 与 PR 交付

## 触发与前置

用户明确说开 PR / 建 issue / 收尾 / ship 等时执行。本地提交完成不自动进入本流程。

有未提交改动时，先按主 SKILL.md 的本地提交流程处理；仍在主分支且要开 PR 时，同样先询问建分支，用户坚持则不拦。

## 交付流程

1. **Push** 当前分支到 origin（沙箱外）
2. **Issue（默认）**
   - 标题 = 即将使用的 PR 标题（英文）
   - body：**空**
   - 用户说不要 issue → 跳过
   - 用户给已有 `#N` → 不新建，PR 关联该号
3. **PR**
   - 标题：英文（有 issue 则与 issue 标题一致）
   - body：中文，按下方模板与核验规则撰写
   - 有 issue → 含 `Closes #N`
   - assignee：`gh api user -q .login`（失败则省略并告知）
   - **非** draft；不默认 label / reviewer
4. 输出 issue / PR 链接
5. **可选 PR review**
   - PR 创建完成并输出链接后，询问用户是否需要 review 该 PR
   - 用户同意 → 调用 `/pr-review`，按该 skill 的输入与回复方式约定执行
   - 用户拒绝或未要求 → 不 review，不阻塞收尾

**例外**：

| 用户说     | 行为                                 |
| ---------- | ------------------------------------ |
| 只要 PR    | 跳过建 issue                         |
| 已有 #N    | 不建 issue，按要求 `Closes` / `Refs` |
| 只要 issue | 只建 issue                           |
| 先 draft   | 加 `--draft`                         |

## 描述核验

- 写 Summary 和 Changes 前，以目标分支与 PR head 之间的实际差异为依据，逐条确认描述的是本 PR 最终交付的行为；功能分支内部的早期提交和中间状态不算相对目标分支的变更。
- 声称“新增”时确认目标分支没有、PR 最终状态有；声称“移除”时确认目标分支有、PR 最终状态没有。若某能力在目标分支原本就不存在，只描述 PR 最终状态或新增内容，不写成移除。
- 只有在有助于理解且来源可核实时，才单独标注历史背景；不要把分支演进过程写成交付项。

## PR 正文模板

```markdown
## Summary

## Related

Closes #<n>

## Changes

- [x] ...

## Test plan

- [x] 场景
- [ ] 仅测试盖不住的手测
```

- 无 issue：删除 `Related` 整节，或按用户改为 `Refs #n`
- Summary：中文，概括最终交付及其目的；交付事实以实际 PR diff 为准，已确认的设计理由可引用对应需求或决策依据。按改动规模写清，不人为压短。大 PR 可分段，必要时补兼容性和背景。
- Changes：本 PR 的交付点（行为/约定变化），不要写成文件名清单
- Test plan：写之前先扫本 PR 测试文件。禁止空节。无测试也无手测时写 `N/A - <原因>`
  - 测试已覆盖：只写中文场景，不要文件名。已跑 `[x]`，未跑 `[ ]`。不要写成祈使手测
  - 手测：仅测试盖不住的（真环境、UI、需人工看、本 PR 无对应测试）。有测试覆盖的对等场景不得再列手测
  - 自动 + 手测都有才拆 `### Automated` / `### Manual`；只有一类直接列
  - 已确认完成勾 `[x]`，未跑/未确认保持 `[ ]`
- 标题英文，body 中文；模板标题固定英文
- 不要把 skill 里的说明性文字写入最终 PR body
- PR 描述中的交付事实须由实际 PR diff 支持；决策理由须来自已确认的需求或设计依据。不要将未合入的分支中间状态写成交付或既有行为。

## 条件章节

不满足条件的章节整节删除，禁止留空。

| 节                    | 何时写入                                                                 | 写什么                                           |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `## Design decisions` | 需求或设计依据中明确存在已确认且会影响实现边界、兼容性或后续维护的重要取舍 | 最终选择、实际评估过的替代方案及取舍理由；准确标明未采纳方案，不写成 PR 交付或基线已有行为。命中条件时必须保留本节，即使 Summary 已概括最终选择 |
| `## Risk`             | 存在具体风险，且没有符合 `Impact` 条件的实际影响                         | 风险发生的条件与后果，以及已知的缓解或回滚方式 |
| `## Impact`           | 存在实际影响，且没有具体风险                                             | 受影响对象及实际变化；breaking 细节写在 `Breaking changes`，避免重复 |
| `## Risk & Impact`    | 具体风险与实际影响同时存在                                               | 分别用 `Risk:` 和 `Impact:` 标明风险及受影响对象；breaking 细节写在 `Breaking changes`，避免重复 |
| `## Breaking changes` | 有实际 breaking（调用方必须改）                                          | 什么变了、谁受影响、迁移/替代                    |

`Risk` 不写「无明显风险」等空泛结论。风险与影响的触发条件独立：只有一项成立时使用对应标题；两项都成立时使用 `Risk & Impact`，并在节内分别标明两类内容。合同变化写在 `Breaking changes`，不要重复同一段内容。

`Design decisions` 只记录有依据的最终取舍；若没有符合条件的重要取舍，删除该节。

## 命令备忘

```bash
# 当前用户（assignee）
gh api user -q .login

# Issue（空 body）— 先创建并拿到 #N
gh issue create --title "English title" --body ""

# PR（非 draft；等 issue 成功后再建；有 issue 时正文含 Closes #N）
gh pr create --title "English title" --body-file ./pr-body.md --assignee "$(gh api user -q .login)"
```

示例中的 `./pr-body.md` 是按本文件模板准备的 PR 正文文件；`gh` / `glab` / `git push` 按仓库约定在沙箱外执行。

## 红线

- PR 创建后未经用户同意就自动派子智能体 review
- PR 无 Test plan 节或 Test plan 空白
- 未扫本 PR 测试文件就写 Test plan
- 把测试已覆盖的场景写成手测步骤
- 风险或影响章节未匹配实际情况：有风险却未在 `Risk` 或 `Risk & Impact` 中说明，有影响却未在 `Impact` 或 `Risk & Impact` 中说明；两者都有却未用 `Risk & Impact`，或仅有一者却用了该标题；含风险的章节为空或写「无明显风险」
- 无 breaking 却保留 `Breaking changes` 节
- 存在已确认的重要设计取舍却缺少 `Design decisions`，或无此类取舍却保留该节
- PR 描述包含无法由实际差异、已确认需求或设计依据支持的事实，或把未合入状态写成本 PR 交付或基线行为
