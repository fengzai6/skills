# Skills 仓库

本仓库用于存放和管理 Claude Code 自定义 skills。

## 目录结构

```
skills/
├── _template/                  # Skill 模板（新建 skill 时复制此目录）
│   ├── SKILL.template.md       # 【必需】核心文件模板（复制后重命名为 SKILL.md）
│   ├── README.md               # 【强烈推荐】给人类看的说明
│   ├── examples.md             # Few-shot 示例（输入/输出对）
│   ├── scripts/                # 可执行脚本（Python、Bash、JS 等）
│   ├── references/             # 参考资料、API 文档、知识库
│   ├── assets/                 # 模板、schema、数据文件
│   └── tests/                  # 测试用例或验证脚本
├── CLAUDE.md                   # 项目级指令
└── README.md                   # 本文件
```

## 如何新建 Skill

1. 复制 `_template/` 目录并重命名为你的 skill 名称（kebab-case）
2. 将 `SKILL.template.md` 重命名为 `SKILL.md`，填写 YAML 元数据和工作流指令
3. 编写 `README.md` 描述 skill 的用途和使用方式
4. 按需添加 `examples.md`、`scripts/`、`references/`、`assets/`、`tests/`

## Skill 核心文件说明

### SKILL.md（必需，模板中为 SKILL.template.md）

Skill 的核心定义文件，包含 YAML frontmatter 元数据和 markdown 工作流指令。复制模板后需重命名为 `SKILL.md`。

frontmatter 字段：

- `name`: skill 名称（kebab-case）
- `description`: 简短描述
- `version`: 版本号
- `author`: 作者
- `triggers`: 触发条件列表
- `tools`: 可用工具列表
- `model`: 使用的模型（sonnet / opus / haiku）

### examples.md（推荐）

Few-shot 示例，帮助模型理解期望的输入/输出格式。

### scripts/（可选）

可执行脚本，用于数据处理、验证等自动化任务。

### references/（推荐）

参考资料、API 文档、最佳实践等知识库文件，按需加载。

### assets/（可选）

模板文件、JSON schema、图片等静态资源。

### tests/（大型 skill 推荐）

测试用例或验证脚本，确保 skill 行为符合预期。

## 已有 Skills

| Skill      | 描述              |
| ---------- | ----------------- |
| \_template | 新建 skill 的模板 |
