---
name: ts-standards
description: Use when the task involves TypeScript code, TS/TSX files, tsconfig.json, package.json dependencies, type definitions, or writing code in any TypeScript project (frontend, Node.js backend, scripts, tooling).
user-invocable: true
metadata:
  author: fengzai6
  version: 0.1.0
---

# TypeScript 编码规范

本规范适用于所有 TypeScript 项目（前端、Node.js 后端、脚本、工具链）。

## 参考文件索引

命中对应场景时，必须先读取对应参考文件再写代码：

| 场景                                        | 参考文件                                       |
| ------------------------------------------- | ---------------------------------------------- |
| 写或改 React 组件、Hook、路由、状态、样式     | [references/react.md](references/react.md)     |
| 列表/画布节点数量大、拖拽、渲染卡顿           | [references/performance.md](references/performance.md) |
| 删除、清空、覆盖、批量操作、支付、发布等      | [references/interaction.md](references/interaction.md) |

## 1. 命名与导入规范

- **文件/目录**: kebab-case（如 `user-service.ts`、`use-current-conversation.ts`）
- **类型/接口/类**: PascalCase（如 `UserService`、`IUserStore`）
- **函数/变量**: camelCase（如 `getResolvedTheme`）
- **常量**: UPPER_CASE（如 `PATHS`、`THEME`、`MESSAGE_ROLE`）
- **接口**: `I` 前缀（如 `IChatStore`、`IMessage`）
- **路径别名**: `@/` 指向 `src/`（如 `import { cn } from "@/utils/cn"`）

## 2. 导出规范

- **命名导出**: 优先使用命名导出（`export const UserService = ...`），不用默认导出。
- **禁止桶导出**: 不用 barrel export（`index.ts` 里 re-export 一堆模块），避免打包体积膨胀与循环依赖。
- **单一职责文件**: 一个文件只导出一个主要实体；类型、工具、业务实体分文件存放。

## 3. 目录结构

按目标项目已有的目录约定执行，不擅自新增层级或重命名既有目录。新建目录前先确认项目内同类代码放在哪里。

## 4. TypeScript 最佳实践

- **No Any**: 尽量不使用 `any`；无法确定类型时用 `unknown` 再收窄。
- **类型复用**: 优先复用项目已有类型，不应自己创建重复类型。
- **全面的强类型**: 在整个代码库中确保完善的强类型定义，以保证类型安全。
- **接口与类型别名**: 适当地使用 Interface（接口）和 Type Aliases（类型别名）。
- **清晰的定义**: 编写清晰且易读的类型定义。
- **常量对象替代枚举**: 使用带有 `as const` 的常量对象来替代 enum。
  ```ts
  export const ROLE = {
    USER: "user",
    SYSTEM: "system",
  } as const;
  export type Role = (typeof ROLE)[keyof typeof ROLE];
  ```

## 5. 数据处理

- **深拷贝**:
  - 当数据后续操作存在影响原对象的风险时，优先使用 `structuredClone` 进行深拷贝。
  - 不要使用 `JSON.parse(JSON.stringify(...))` 这类有信息丢失风险的方案。

## 6. 依赖安全

- **Minimum Release Age 检查**: 在项目初始化或添加新依赖时，应检查项目是否配置了 Minimum Release Age，防止使用刚发布不到 1 天的新版本包。
  - **检测方式**: 检查项目根目录是否存在对应的包管理器配置文件，以及其中是否包含 Minimum Release Age 相关配置。
  - **各包管理器建议配置**:
    - **npm**: 在 `.npmrc` 文件中添加 `minimum-release-age=1`。
    - **yarn**: 在 `.yarnrc.yml` 中添加 `npmMinimalAgeGate: 1440`。
    - **pnpm**: 要求 pnpm >= 11（默认启用 1 天的 Minimum Release Age，无需额外配置）。
