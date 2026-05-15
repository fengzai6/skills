# Skills 仓库规范

## 结构约定

- 每个 skill 一个独立目录，使用 kebab-case 命名
- 每个 skill 目录必须包含 `SKILL.md`（核心指令文件）
- 其余文件按需创建，根据 skill 复杂程度决定：
  - `README.md` — 当 skill 逻辑复杂、需要给人类额外说明时才创建
  - `examples.md` — 当需要 few-shot 示例辅助模型理解时才创建
  - `scripts/` — 当需要可执行脚本时才创建
  - `references/` — 当需要参考资料或知识库时才创建
  - `assets/` — 当需要模板、schema 等静态资源时才创建
  - `tests/` — 当 skill 足够复杂需要验证时才创建
- `_template/` 为参考模板，不需要完整复制，按需取用

## 编写规范

- `SKILL.md` 使用 YAML frontmatter 定义元信息，markdown 正文定义工作流
- 所有文档使用中文编写
- 文件名使用 kebab-case
- 脚本文件需有可执行权限

## SKILL.md frontmatter 支持字段

- `name`: skill 名称（kebab-case）
- `description`: 简短描述（显示在 skill 列表中）
- `argument-hint`: 参数提示（可选）
- `user-invocable`: 是否可由用户直接调用（true/false）
- `compatibility`: 兼容性信息
- `context`: 上下文配置
- `disable-model-invocation`: 是否禁止模型自动调用（true/false）
- `license`: 许可证
- `metadata`: 额外元数据
