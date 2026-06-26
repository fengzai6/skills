---
name: ts-standards
description: Use when the task involves TypeScript frontend code, React, Next.js, Vue + TS, TSX/TS files, tsconfig.json, package.json frontend dependencies, components, hooks, routing, state management, styling, or TypeScript types.
user-invocable: true
metadata:
  author: fengzai6
  version: 0.1.0
---

# TypeScript/React 前端编码规范

本规范适用于 TypeScript + React 技术栈的前端项目。

---

## 1. 命名与导入规范

- **文件/目录**: kebab-case（如 `chat-input/`、`use-current-conversation.ts`）
- **组件**: PascalCase，使用命名导出（`export const ChatInput = ...`），不用默认导出
- **函数/变量**: camelCase（如 `getResolvedTheme`）
- **常量**: UPPER_CASE（如 `PATHS`、`THEME`、`MESSAGE_ROLE`）
- **接口**: `I` 前缀（如 `IChatStore`、`IMessage`）
- **组件 Props**: `组件名Props`（如 `IChatInputProps`）
- **路径别名**: `@/` 指向 `src/`（如 `import { cn } from "@/utils/cn"`）
- **SVG 导入**: `?react` 后缀导入为组件（如 `import LogoIcon from "@/assets/icons/logo.svg?react"`）

---

## 2. 组件规范

- **组件封装**: 对于重复出现的代码，应尽可能封装成通用组件或 hook。
- **优先复用**: 优先使用框架或自带 `components` 目录下的组件。
- **文件结构**: 每个组件一个目录，入口为 `index.tsx`（如 `components/chat-input/index.tsx`）。
- **导出方式**: 使用命名导出（`export const ChatInput = ...`），不用默认导出。
- **Props 命名**: 接口命名为 `组件名Props`（如 `IChatInputProps`）。

---

## 3. React & 框架规范

### 3.1 App.tsx 组合根

App.tsx 作为组合根，将不同关注点的副作用拆分为独立 Hook，在组件顶层调用即生效，不接收返回值：

```tsx
function App() {
  useInitialization();              // 初始化 token / tenant
  useSyncTheme();                   // 主题同步（含系统主题监听）
  return < />;
}
```

### 3.2 路由规范

- **路由**: 使用 React Router 的 `createBrowserRouter`。
- **路径常量**: 路由路径定义为常量 `PATHS` 对象，放在 `constants/routes.ts`。

### 3.3 状态管理（Zustand）

- **持久化**: 使用 zustand + persist 中间件持久化。
- **Store 文件**: 放在 `stores/` 目录。
- **接口命名**: `I` 前缀（如 `IChatStore`、`ISettingsStore`）。
- **导出命名**: `useXxxStore`（如 `useChatStore`、`useSettingsStore`）。
- **选择多个字段**: 使用 `useShallow` 避免不必要的重渲染。
- **持久化字段控制**: 使用 `partialize` 控制哪些字段持久化。

### 3.4 Hooks 编写规范

- **文件命名**: `use-xxx.ts`（kebab-case），放在 `hooks/` 目录。
- **纯函数工具**: 纯函数工具逻辑放在 Hook 文件顶部（如 `deriveConversationId`），不放在 Hook 内部。
- **复杂 Hook 注释**: 复杂 Hook 需有 JSDoc 注释说明用途。

### 3.5 其他

- **性能优化**: 如果项目使用了 react-compiler，无需使用 `memo`、`useCallback` 包裹函数，编译器会自动处理。
- **代码结构**: React 组件代码必须遵循严格的顺序：state（状态定义） => function（函数定义） => useEffect（副作用处理）
- **Effect**:
  - 如果需要在 useEffect 用的函数请用 `useEffectEvent` 包裹，从而不用再添加非必要依赖到 useEffect。
  - 如果该函数不是仅在 useEffect 中使用，可以这样 `const funInEffect = useEffectEvent(fun)` 加一层后去使用。
- **Hook 设计原则**:
  - 避免设计返回多个不相关状态的「万能 hook」——不同组件消费不同状态会导致不必要的重新渲染。
  - 当用户提出这类需求时，应建议：优先使用 Context 拆分关注点，或按用途拆分为多个独立 hook。

---

## 4. 样式与 UI 还原

- **原子样式**: 项目如果配置了原子样式（tailwind、nativewind），优先使用原子样式实现。
- **Tailwind CSS**: 使用 Tailwind CSS + 自定义 design token（如有不同主题设计）。
- **类名合并**: 使用 `cn()` 工具函数（clsx + twMerge）合并类名，避免模板字符串拼接。
- **Ant Design 语义化样式覆盖**:
  - 当项目使用 Tailwind CSS，且需要对 antd 组件做语义化样式覆盖时，优先使用 `classNames`。
  - 只有在 `classNames` 无法满足需求时，才使用 `styles`。
- **Tailwind CSS Important 规则**:
  - 使用 Tailwind CSS 时，important 标记应放在类名尾部，如 `bg-red-500!`，而非头部。

---

## 5. 目录结构

```
src/
├── assets/              # 静态资源（SVG 图标等）
├── components/          # 组件，每个组件一个目录，目录下 index.tsx
│   └── chat-input/
│       └── index.tsx
├── constants/           # 常量定义
├── hooks/               # 自定义 Hook，一个文件一个 Hook
├── layouts/             # 布局组件（可选）
├── pages/               # 页面组件
├── router/              # 路由配置（createBrowserRouter）
├── services/            # 服务层
│   ├── api/
│   └── types/           # 服务层类型定义
├── stores/              # 状态管理
├── types/               # 应用层类型定义
└── utils/               # 通用工具函数
```

---

## 6. TypeScript 最佳实践

### 通用规则

- **No Any**: 尽量不使用 `any`。
- **类型复用**: 涉及 TS 类型和表单的，优先使用原有 TS 类型，不应自己创建类型。

### 详细规范

- **全面的强类型**: 在整个代码库中确保完善的强类型定义，以保证类型安全。
- **接口与类型别名**: 适当地使用 Interface（接口）和 Type Aliases（类型别名）。
- **清晰的定义**: 编写清晰且易读的类型定义。
- **常量对象替代枚举**: 使用带有 `as const` 的常量对象来替代 enum。

---

## 7. 数据处理

- **深拷贝**:
  - 当数据后续操作存在影响原对象的风险时，优先使用 `structuredClone` 进行深拷贝。
  - 不要使用 `JSON.parse(JSON.stringify(...))` 这类有信息丢失风险的方案。

---

## 8. 依赖安全

- **Minimum Release Age 检查**: 在项目初始化或添加新依赖时，应检查项目是否配置了 Minimum Release Age，防止使用刚发布不到 1 天的新版本包。
  - **检测方式**: 检查项目根目录是否存在对应的包管理器配置文件，以及其中是否包含 Minimum Release Age 相关配置。
  - **各包管理器建议配置**:
    - **npm**: 在 `.npmrc` 文件中添加 `minimum-release-age=1`。
    - **yarn**: 在 `.yarnrc.yml` 中添加 `npmMinimalAgeGate: 1440`。
    - **pnpm**: 要求 pnpm >= 11（默认启用 1 天的 Minimum Release Age，无需额外配置）。
