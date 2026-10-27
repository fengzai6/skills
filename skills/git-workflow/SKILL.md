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

用户明确要求开 PR / 建 issue / 收尾 / ship，或需要撰写、更新 PR 正文时，必须先读取 [Issue 与 PR 交付](references/issue-pr.md)。阶段 1 完成不自动进入本阶段，读取参考文件也不代表获得 push 或创建 issue/PR 的授权。

## 红线

- 未到阶段 2 就 push / 建 issue / 建 PR
- 把本地配置（或混有本地配置的文件）stage / commit；用 `git add -A` 或 `git add .`
- 主分支上未询问就直接 commit（应先问；用户拒绝建分支后可 commit）
- 在沙箱内跑 `gh` / `glab`
- 无必要就创建 worktree（默认当前工作区；worktree 常缺依赖）
- 把「开发完成」自行升级成收尾
