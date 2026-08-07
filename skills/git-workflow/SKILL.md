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
- commit message：一句简单英文，与 diff 一致，无 AI 署名、无无关键堆砌
- stage 前看 `git status`；不提交密钥或明显无关文件

## 分支命名

- **默认**：`feat|fix|chore|refactor|docs|test|ci/<kebab-desc>`（按改动选前缀）
- **用户要求版本号开头**：`v0.1.0-xxx-xxx`（不再加 type 前缀）
- 主分支：`main` / `master`，或 `origin/HEAD` 指向的默认分支

## 阶段 1：本地提交

**触发**：用户要 commit/提交，或同意提交当前改动。到此为止：**不 push、不建 issue/PR**。

1. 查看 status / diff；需要时看近期 log 对齐 message 风格
2. **当前是主分支** → 询问是否新建本地分支再 commit  
   - 是 → 按上方命名建分支 → stage → commit  
   - 否（用户坚持主分支）→ 直接 stage + commit，**不二次拦截**
3. **已在功能分支** → 直接 stage + commit
4. 可一句提示：需要开 PR/收尾时再说

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

**逃逸**：

| 用户说 | 行为 |
|--------|------|
| 只要 PR | 跳过建 issue |
| 已有 #N | 不建 issue，按要求 `Closes` / `Refs` |
| 只要 issue | 只建 issue |
| 先 draft | 加 `--draft` |

## PR body 模板

```markdown
## 关联
Closes #<n>

## 总结
<!-- 2–5 句中文：做了什么、为什么 -->

## 已完成
- [x] ...

## Test plan
- [ ] ...
```

- 无 issue：删除「关联」整节，或按用户改为 `Refs #n`
- Test plan 无步骤时写：`N/A - <原因>`，禁止空节
- 标题英文，body 中文

## 命令备忘

```bash
# 当前用户（assignee）
gh api user -q .login

# Issue（空 body）
gh issue create --title "English title" --body ""

# PR（非 draft；有 issue 时 body 含 Closes #N）
gh pr create --title "English title" --body "$(cat <<'EOF'
## 关联
Closes #N

## 总结
...

## 已完成
- [x] ...

## Test plan
- [ ] ...
EOF
)" --assignee "$(gh api user -q .login)"
```

`gh` / `glab` / `git push`：沙箱外执行。

## 红线

- 未到阶段 2 就 push / 建 issue / 建 PR
- 主分支上未询问就直接 commit（应先问；用户拒绝建分支后可 commit）
- 在沙箱内跑 `gh` / `glab`
- PR 无 Test plan 节或 Test plan 空白
- 把「开发完成」自行升级成收尾
