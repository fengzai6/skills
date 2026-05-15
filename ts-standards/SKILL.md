---
name: ts-standards
description: TypeScript/React 前端项目编码规范。当检测到项目使用 TypeScript、React、Next.js、Vue + TS 等前端技术栈时（如存在 tsconfig.json、.tsx/.ts 文件、package.json 中含 react/next/vue 依赖），应自动调用此 skill 加载编码规范。
user-invocable: true
metadata:
  author: fengzai6
  version: 0.1.0
---

# TypeScript/React 前端编码规范

本规范适用于 TypeScript + React 技术栈的前端项目。

---

## 1. 命名规范

- **函数**: camelCase（特殊情况除外：如 API 函数采用 PascalCase）
- **变量**: camelCase
- **类型**: PascalCase
- **接口**: `I` + PascalCase (如 `IUser`)
- **组件文件**: PascalCase (如 `MyComponent.tsx`)
- **组件接口**: 必须以 `Props` 结尾 (如 `IButtonProps`, `IModalProps`)

---

## 2. 组件与文件结构

- **组件封装**: 对于重复出现的代码，应尽可能封装成通用组件或 hook。
- **优先复用**: 优先使用框架或自带 `components` 目录下的组件。
- **文件结构**: 组件新增使用文件夹加 `index` 的做法，如 `react-button/index.tsx`。

---

## 3. React & 框架规范

- **路由**: react-router 已将 react-router-dom 合并，使用 `react-router` 进行路由管理。
- **状态管理**: 当使用 zustand 中的多个状态时，使用 `useShallow` 进行状态浅比较获取，避免不必要的 re-render。
- **性能优化**: 如果项目使用了 react-compiler，无需使用 `memo`、`useCallback` 包裹函数，编译器会自动处理。
- **代码结构**: React 组件代码必须遵循严格的顺序：state（状态定义） => function（函数定义） => useEffect（副作用处理）
- **Effect**:
  - 如果需要在 useEffect 用的函数请用 `useEffectEvent` 包裹，从而不用再添加非必要依赖到 useEffect。
  - 如果该函数不是仅在 useEffect 中使用，可以这样 `const funInEffect = useEffectEvent(fun)` 加一层后去使用。

---

## 4. 样式与 UI 还原

- **原子样式**: 项目如果配置了原子样式（tailwind、nativewind），优先使用原子样式实现。
- **类名**: 若项目采用原子样式，组件需按逻辑动态拼接类名时，尽量避免使用模板字符串，统一使用 `cn` 工具函数处理，确保样式合并可预测且避免冲突。

---

## 5. TypeScript 最佳实践

### 通用规则

- **No Any**: 尽量不使用 `any`。
- **类型复用**: 涉及 TS 类型和表单的，优先使用原有 TS 类型，不应自己创建类型。

### 详细规范

- **全面的强类型**: 在整个代码库中确保完善的强类型定义，以保证类型安全。
- **接口与类型别名**: 适当地使用 Interface（接口）和 Type Aliases（类型别名）。
- **清晰的定义**: 编写清晰且易读的类型定义。
- **常量对象替代枚举**: 使用带有 `as const` 的常量对象来替代 enum。

---

## 6. 数据处理

- **深拷贝**:
  - 当数据后续操作存在影响原对象的风险时，优先使用 `structuredClone` 进行深拷贝。
  - 不要使用 `JSON.parse(JSON.stringify(...))` 这类有信息丢失风险的方案。

---

## 7. 依赖安全

- **Minimum Release Age 检查**: 在项目初始化或添加新依赖时，应检查项目是否配置了 Minimum Release Age，防止使用刚发布不到 1 天的新版本包。
  - **检测方式**: 检查项目根目录是否存在对应的包管理器配置文件，以及其中是否包含 Minimum Release Age 相关配置。
  - **各包管理器建议配置**:
    - **npm**: 在 `.npmrc` 文件中添加 `minimum-release-age=1`。
    - **yarn**: 在 `.yarnrc.yml` 中添加 `minimumReleaseAge: 1`。
    - **pnpm**: 要求 pnpm >= 11（默认启用 1 天的 Minimum Release Age，无需额外配置）。
