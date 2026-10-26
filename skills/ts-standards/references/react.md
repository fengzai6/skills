# React 编码规范

命中以下场景时读取本文件：写或改 React 组件、Hook、路由、状态管理、样式、Effect 依赖、前端组件目录结构。

## 1. 组件规范

- **组件封装**: 对于重复出现的代码，应尽可能封装成通用组件或 hook。
- **优先复用**: 优先使用框架或自带 `components` 目录下的组件。
- **文件结构**: 每个组件一个目录，入口为 `index.tsx`（如 `components/chat-input/index.tsx`）。
- **导出方式**: 使用命名导出（`export const ChatInput = ...`），不用默认导出。
- **Props 命名**: 接口命名为 `组件名Props`（如 `IChatInputProps`）。
- **SVG 导入**: `?react` 后缀导入为组件（如 `import LogoIcon from "@/assets/icons/logo.svg?react"`）。

## 2. App.tsx 组合根

App.tsx 作为组合根，将不同关注点的副作用拆分为独立 Hook，在组件顶层调用即生效，不接收返回值：

```tsx
function App() {
  useInitialization();              // 初始化 token / tenant
  useSyncTheme();                   // 主题同步（含系统主题监听）
  return < />;
}
```

## 3. 路由规范

- **路由**: 使用 React Router 的 `createBrowserRouter`。
- **路径常量**: 路由路径定义为常量 `PATHS` 对象，放在 `constants/routes.ts`。

## 4. 状态管理（Zustand）

- **持久化**: 使用 zustand + persist 中间件持久化。
- **Store 文件**: 放在 `stores/` 目录。
- **接口命名**: `I` 前缀（如 `IChatStore`、`ISettingsStore`）。
- **导出命名**: `useXxxStore`（如 `useChatStore`、`useSettingsStore`）。
- **选择多个字段**: 使用 `useShallow` 避免不必要的重渲染。
- **持久化字段控制**: 使用 `partialize` 控制哪些字段持久化。

## 5. Hooks 编写规范

- **文件命名**: `use-xxx.ts`（kebab-case），放在 `hooks/` 目录。
- **纯函数工具**: 纯函数工具逻辑放在 Hook 文件顶部，不放在 Hook 内部。
- **复杂 Hook 注释**: 复杂 Hook 需有 JSDoc 注释说明用途。

## 6. 服务层请求 Hook 规范

当接口需要**缓存和多组件共用**时，在 `services/hooks/` 目录下新增 `use-xxx-request.ts`，根据项目实际使用的请求库选择实现方式：

- **ahooks**: 使用 `useRequest` 封装（需项目已安装 `ahooks`）
- **TanStack Query**: 使用 `useQuery` / `useMutation` 封装（需项目已安装 `@tanstack/react-query`）

判定标准：单组件内一次性请求、无需缓存的接口，直接在组件内调用即可，不需要抽 Hook。

## 7. 其他

- **性能优化**: 如果项目使用了 react-compiler，无需使用 `memo`、`useCallback` 包裹函数，编译器会自动处理。
- **代码结构**: React 组件代码必须遵循严格的顺序：state（状态定义）=> function（函数定义）=> useEffect（副作用处理）
- **Effect**:
  - `useEffect` 的依赖数组只添加必要的数据依赖，禁止将函数添加到依赖数组中。例如依赖 `roomId` 时使用 `[roomId]`，不要写成 `[roomId, save]`。
  - `useEffect` 里要调、且不应进依赖数组的函数，用 `useEffectEvent` 包一层。
  - 包装结果**只允许**在 `useEffect` 里调用，禁止用作 JSX / `onClick` / 传给子组件。
  - 只给 effect 用：直接 `const fun = useEffectEvent(...)`。
  - effect 内外都要用：原函数留给外面，effect 内必须另包 `const funInEffect = useEffectEvent(fun)`：

```tsx
const save = () => { /* 读最新值 */ };
const saveInEffect = useEffectEvent(save);

useEffect(() => {
  saveInEffect();
}, [roomId]);

return <button onClick={save}>保存</button>;
```

```tsx
// ❌ 双用途却直接 const save = useEffectEvent(...)
// ❌ saveInEffect 出现在 onClick / JSX / 子组件 props
```
- **Hook 设计原则**:
  - 避免设计返回多个不相关状态的「万能 hook」——不同组件消费不同状态会导致不必要的重新渲染。
  - 当用户提出这类需求时，应建议：优先使用 Context 拆分关注点，或按用途拆分为多个独立 hook。

## 8. 样式与 UI 还原

- **原子样式**: 项目如果配置了原子样式（tailwind、nativewind），优先使用原子样式实现。
- **Tailwind CSS**: 使用 Tailwind CSS + 自定义 design token（如有不同主题设计）。
- **类名合并**: 使用 `cn()` 工具函数（clsx + twMerge）合并类名，避免模板字符串拼接。
- **Ant Design 语义化样式覆盖**:
  - 当项目使用 Tailwind CSS，且需要对 antd 组件做语义化样式覆盖时，优先使用 `classNames`。
  - 只有在 `classNames` 无法满足需求时，才使用 `styles`。
- **Tailwind CSS Important 规则**:
  - 使用 Tailwind CSS 时，important 标记应放在类名尾部，如 `bg-red-500!`，而非头部。

## 9. 前端目录结构

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
│   ├── hooks/           # 请求 Hook（use-xxx-request），缓存和共用接口封装
│   └── types/           # 服务层类型定义
├── stores/              # 状态管理
├── types/               # 应用层类型定义
└── utils/               # 通用工具函数
```
