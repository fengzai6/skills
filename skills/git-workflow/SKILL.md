---
name: git-workflow
description: Use when committing, creating branches, opening issues or PRs, push/ship/finishing delivery, or any git/gh/glab workflow including sandbox constraints for those CLIs.
user-invocable: true
metadata:
  author: nacho
  version: 0.1.0
---

# Git 工作流

本地提交与远程收尾（issue/PR）的固定约定。

## 硬规则

- **`gh` / `glab` 必须在沙箱外执行**（需网络与鉴权）
- **仅用户要求时**才 commit；**仅用户明确收尾**（开 PR / 建 issue / ship 等）才 push、建 issue、建 PR
- 不 force push 主分支；不修改 git config
- commit message：一句简单英文，与 diff 一致，无 AI 署名、无无相关堆砌
- **标题字段纯文本**：issue / PR / commit 的 title 默认纯文本，**禁止** Markdown（`` `code` ``、`**bold**`、链接等）；仅 body 保留 Markdown。用户给了带 Markdown 的标题 → **先剥成纯文本再写入**
- stage 前看 `git status`；**只 stage 本次相关文件**（具名 `git add`，禁止 `git add -A` / `git add .`）；不提交密钥、本地配置、明显无关文件
- **默认不用 worktree**：能在当前工作区完成就不要建 worktree。worktree 常缺 `node_modules` 等依赖，测试/命令跑不起来。仅用户明确要求隔离，或当前工作区确实无法安全并行时才用

## 分支命名

- **默认**：`feat|fix|chore|refactor|docs|test|ci/<kebab-desc>`（按改动选前缀）
- **用户要求版本号开头**：`v0.1.0-xxx-xxx`（不再加 type 前缀）
- 主分支：`main` / `master`，或 `origin/HEAD` 指向的默认分支

## 阶段 1：本地提交

**触发**：用户要 commit/提交，或同意提交当前改动。到此为止：**不 push、不建 issue/PR**。

1. 查看 status / diff；需要时看近期 log 对齐 message 风格
2. **排除本地配置**（已跟踪改动和未跟踪都算）：不 stage、不删、不 stash，保持 dirty。对话里一句列出跳过的文件，**不写进 commit / PR**
   - 判定：文件不属于这次要提交的改动，且像本机覆盖（`.env*`、`*.local.*`、`settings.local.json`、`.claude/settings.local.json`、IDE 配置等）→ 跳过
   - 同一文件混了任务改动和本地配置 → **整文件不 stage**，指出像本地配置的 hunk，等用户拆开或确认
   - 拿不准 → 问，不要猜着提交
3. **当前是主分支** → 询问是否新建本地分支再 commit
   - 是 → 按上方命名建分支 → stage → commit
   - 否（用户坚持主分支）→ 直接 stage + commit，**不二次拦截**
4. **已在功能分支** → 直接 stage + commit
5. 可一句提示：需要开 PR/收尾时再说

## 阶段 2：Issue + PR

**触发**：用户明确说开 PR / 建 issue / 收尾 / ship 等。阶段 1 完成**不**自动进入本阶段。

**前置**：有未提交改动 → 先走阶段 1；仍在主分支且要开 PR → 同阶段 1 询问建分支（用户坚持则不拦）。

1. **Push** 当前分支到 origin（沙箱外）
2. **Issue（默认）**
   - 标题 = 即将使用的 PR 标题（英文）
   - body：**空**
   - 用户说不要 issue → 跳过
   - 用户给已有 `#N` → 不新建，PR 关联该号
3. **PR**
   - 标题：英文（有 issue 则与 issue 标题一致）
   - body：中文，用下方模板
   - 有 issue → 含 `Closes #N`
   - assignee：`gh api user -q .login`（失败则省略并告知）
   - **非** draft；不默认 label / reviewer
4. 输出 issue / PR 链接
5. **可选 PR review**
   - PR 创建完成并输出链接后，询问用户是否需要派子智能体 review 该 PR
   - 用户同意 → 派子智能体基于 PR diff / 链接做 review，并回收报告
   - 用户拒绝或未要求 → 不派，不阻塞收尾

**逃逸**：

| 用户说     | 行为                                 |
| ---------- | ------------------------------------ |
| 只要 PR    | 跳过建 issue                         |
| 已有 #N    | 不建 issue，按要求 `Closes` / `Refs` |
| 只要 issue | 只建 issue                           |
| 先 draft   | 加 `--draft`                         |

## PR body 模板

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
- Summary：中文，只写最终行为（做了什么、为什么）；按改动规模写清，不人为压短。大 PR 可分段，必要时补兼容性、背景。diff 里看不出来的取舍、从未合入的状态一律不写
- Changes：本 PR 的交付点（行为/约定变化），不要写成文件名清单
- Test plan：写之前先扫本 PR 测试文件。禁止空节。无测试也无手测时写 `N/A - <原因>`
  - 测试已覆盖：只写中文场景，不要文件名。已跑 `[x]`，未跑 `[ ]`。不要写成祈使手测
  - 手测：仅测试盖不住的（真环境、UI、需人工看、本 PR 无对应测试）。有测试覆盖的对等场景不得再列手测
  - 自动 + 手测都有才拆 `### Automated` / `### Manual`；只有一类直接列
  - 已确认完成勾 `[x]`，未跑/未确认保持 `[ ]`
- 标题英文，body 中文；**模板标题固定英文**
- 不要把 skill 里的说明性文字写入最终 PR body
- PR 描述只写最终行为；diff 里看不出来的取舍、从未合入的状态一律不写

**条件节**（不命中则整节删除，禁止空节）：

| 节                    | 何时写入                                                                 | 写什么                                           |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `## Risk / Impact`    | 行为变化 / 迁移 / breaking API；权限、安全、数据；跨模块或默认工作流变化 | 影响面、可能坏的路径、兼容、回滚（只写实际有的） |
| `## Breaking changes` | 有实际 breaking（调用方必须改）                                          | 什么变了、谁受影响、迁移/替代                    |

`Risk / Impact` 禁止写「无明显风险」。合同变化写在 `Breaking changes`，不要两节重复同一段话。

## 命令备忘

```bash
# 当前用户（assignee）
gh api user -q .login

# Issue（空 body）— 先创建并拿到 #N
gh issue create --title "English title" --body ""

# PR（非 draft；等 issue 成功后再建；body 含 Closes #N）
gh pr create --title "English title" --body "$(cat <<'EOF'
## Summary
...

## Related
Closes #N

## Changes
- [x] ...

## Test plan
- [x] 场景
- [ ] 仅测试盖不住的手测
EOF
)" --assignee "$(gh api user -q .login)"
```

`gh` / `glab` / `git push`：沙箱外执行。

## 红线

- 未到阶段 2 就 push / 建 issue / 建 PR
- 把本地配置（或混有本地配置的文件）stage / commit；用 `git add -A` 或 `git add .`
- 主分支上未询问就直接 commit（应先问；用户拒绝建分支后可 commit）
- 在沙箱内跑 `gh` / `glab`
- 无必要就创建 worktree（默认当前工作区；worktree 常缺依赖）
- PR 无 Test plan 节或 Test plan 空白
- 未扫本 PR 测试文件就写 Test plan
- 把测试已覆盖的场景写成手测步骤
- 命中条件却缺失 `Risk / Impact`，或该节空 / 写「无明显风险」
- 无 breaking 却保留 `Breaking changes` 节
- PR 创建后未经用户同意就自动派子智能体 review
- 把「开发完成」自行升级成收尾
- PR 描述写了 diff 里看不出来的取舍，或从未合入的状态
