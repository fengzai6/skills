# Skills 仓库

本仓库用于存放和管理自定义 rules 与 skills。

## 当前内容

### 可用 Rules

- `main`
  - 路径: [rules/main.md](rules/main.md) (2883 tokens)
  - 用途: 默认通用规则，全局行为约束与通用编码规范，所有项目通用，应放置在 `~/.claude/CLAUDE.md` 中始终生效，正常使用时复制这个文件内容即可
- `codegraph`
  - 路径: [rules/codegraph.md](rules/codegraph.md) (438 tokens)
  - 用途: CodeGraph 相关补充规则，只有在用户明确需要 CodeGraph 约束时才和 `main` 一起复制

### 可用 Skills

- `ts-standards`
  - 路径: [skills/ts-standards/SKILL.md](skills/ts-standards/SKILL.md) (2180 tokens)
  - 用途: TypeScript、React、Next.js、Vue + TS 前端项目编码规范
- `task-planner`
  - 路径: [skills/task-planner/SKILL.md](skills/task-planner/SKILL.md) (3614 tokens)
  - 用途: 将复杂任务文档化为可追踪的计划，支持子任务编排、状态管理和跨会话上下文传递
- `spec-review`
  - 路径: [skills/spec-review/SKILL.md](skills/spec-review/SKILL.md) (764 tokens)
  - 用途: 审查 spec、设计文档或技术方案文档，给出修改建议、设计改进意见和补充建议

## 目录结构

```text
skills/
├── _template/                  # Skill 模板
│   ├── SKILL.template.md       # 【必需】核心文件模板（复制后重命名为 SKILL.md）
│   ├── README.md               # 给人类看的说明模板
│   └── examples.md             # Few-shot 示例模板
├── rules/                      # 通用规则与可选补充规则
│   ├── main.md                 # 默认通用规则
│   └── codegraph.md            # CodeGraph 可选规则
├── skills/                     # Skills 目录
│   ├── ts-standards/           # TypeScript / React 相关 skill
│   │   └── SKILL.md
│   ├── task-planner/           # 任务规划与文档化 skill
│   │   └── SKILL.md
│   └── spec-review/            # Spec 文档审查 skill
│       └── SKILL.md
├── CLAUDE.md                   # 本仓库编写规范
└── README.md                   # 本文件
```

## 如何新建 Skill

1. 复制 `_template/` 目录并重命名为你的 skill 名称（kebab-case）
2. 将 `SKILL.template.md` 重命名为 `SKILL.md`
3. 按需补充 `README.md`、`examples.md`、`scripts/`、`references/`、`assets/`、`tests/`
4. 保持内容与本仓库规范一致，避免和通用 rules 重复

## Skill 结构约定

- 每个 skill 一个独立目录，使用 kebab-case 命名
- 每个 skill 目录必须包含 `SKILL.md`
- 其余文件按需创建：
  - `README.md`
  - `examples.md`
  - `scripts/`
  - `references/`
  - `assets/`
  - `tests/`

## SKILL.md 说明

`SKILL.md` 使用 YAML frontmatter 定义元信息，markdown 正文定义工作流。

### frontmatter 支持字段

- `name`: skill 名称（kebab-case）
- `description`: 简短描述
- `argument-hint`: 参数提示（可选）
- `user-invocable`: 是否可由用户直接调用（true / false）
- `compatibility`: 兼容性信息
- `context`: 上下文配置
- `disable-model-invocation`: 是否禁止模型自动调用（true / false）
- `license`: 许可证
- `metadata`: 额外元数据
