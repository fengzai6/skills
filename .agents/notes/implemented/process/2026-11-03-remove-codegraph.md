# Agent Note: 移除 CodeGraph 规则

Status: implemented

## Problem

用户不再需要 CodeGraph 的 rule，而仓库仍提供独立规则、通用规范中的优先调用要求及 README 索引，需要删除这些规则入口；MCP 配置和工具权限不在删除范围内。

## Decision

- 删除 `rules/codegraph.md` 和 `rules/main.md` 中对应的代码探索条目。
- `jsons/mcp.json` 的服务注册及 `jsons/claude-settings.json` 的工具权限保持原样。
- 删除 README 对应索引并重新生成 token 统计。
- 只删除规则及其入口，不修改仓库配置示例、全局安装、MCP 运行时配置或其他已确认规范。

已检索现有笔记，无同主题决策需要替代。

## Alternatives considered

无，按用户明确的删除要求执行。

## Verification

- 检索当前规则和 README，确认不再存在 CodeGraph 引用；决策笔记保留删除依据。
- 对照修改前已暂存的内容，确认两份 JSON 配置文件完全一致。
- 运行 `node scripts/count-tokens.mjs` 更新统计、`git diff --check` 检查空白，并核对暂存区未变。
- 从仓库根目录使用 Node.js 24 运行已加载笔记 skill 的目录、格式及归档校验脚本，不增加项目依赖。

## Consequences

- 仓库不再分发 CodeGraph 的独立规则和优先调用要求；配置示例仍保留该服务注册和工具权限，工具是否使用由具体任务决定。
- 本次不会卸载或停止已安装的工具，也不改变使用者本机已有的配置。
