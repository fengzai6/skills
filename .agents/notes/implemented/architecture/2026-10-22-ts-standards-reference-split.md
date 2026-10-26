# Agent Note: ts-standards 规范改为技术栈无关的一级内容 + 按触发条件分册

Status: implemented

## Problem

`skills/ts-standards/SKILL.md` 增长到 214 行 / 3335 tokens，超过仓库 CLAUDE.md 审查清单规定的 100 行上限，且每次加载都会把 React 细节、性能优化、危险操作确认等低频内容一并读入，浪费上下文预算。

更关键的是，这份规范名为「TypeScript/React 前端编码规范」，一级内容却只有前端条目：目录结构写死 `src/components`、`src/hooks`、`src/stores`，命名规则要求「组件 PascalCase」「组件 Props 用 `组件名Props`」，description 限定 frontend。实际使用中它同样适用于 Node.js 后端、脚本与工具链的 TypeScript 代码，此时这些一级条目要么无关，要么误导。

## Decision

`skills/ts-standards/` 采用「SKILL.md 正文 + references 分册」结构。一级内容只放技术栈无关的通用 TypeScript 规则，前端内容全部下沉到 `references/react.md`；references 内部的拆分依据是**触发条件**而非技术框架：

- `SKILL.md` 保留任何 TS/TSX 编码都适用的内容：命名与导入、导出规范、目录结构原则、TypeScript 最佳实践、数据处理、依赖安全。文首以表格形式给出参考文件索引。
  - 命名规则不再区分「组件 PascalCase」与「函数 camelCase」，统一为「类型/接口/类 PascalCase、函数/变量 camelCase」。
  - 「组件 Props 命名」「SVG `?react` 导入」「组件命名导出」等前端条目移入 `references/react.md`。
  - 目录结构一节不再写死 `src/` 目录树，只保留原则：按目标项目已有约定执行，不擅自新增层级或重命名既有目录。
  - 新增「导出规范」：命名导出优先、禁止桶导出、单一职责文件。
- `references/react.md` 收录 React 与前端专属规则：组件规范（含 Props 命名、SVG 导入）、App.tsx 组合根、React Router 路由、Zustand 状态管理、Hook 编写、服务层请求 Hook、react-compiler 与 useEffect 依赖约束、Tailwind 与 antd 样式覆盖、前端目录结构。
- `references/performance.md` 收录大规模渲染优化：虚拟列表选型（antd Listy / `@rc-component/listy`）、高度不定的虚拟列表的估算-实测修正流程、滚动容器高度实时计算、拖拽场景的分级渲染。
- `references/interaction.md` 收录危险操作二次确认：必须确认与无需确认的操作边界、确认组件复用与文案要求。

每个 reference 首行声明自己的读取时机，SKILL.md 索引表格的「场景」列给出同等的触发描述，并明确要求命中场景时先读对应文件再写代码。

`description` 改为覆盖所有 TypeScript 场景（前端、Node.js 后端、脚本、工具链），并移除 `Vue + TS`：正文自始至终没有 Vue 规则，保留该词会让 Agent 在 Vue 项目中误判为已覆盖。

`rules/main.md` 的 skill 匹配标准同步调整：新增「涉及 Node.js 后端、脚本、工具链的 TypeScript 代码 → `/ts-standards`」，并把原「`package.json` 前端依赖」限定词去掉。

## Alternatives considered

- **按技术框架切分为 `react.md` / `vue.md`** — 框架维度看似直观，但「危险操作二次确认」与「大规模渲染优化」在任意框架下都应生效，放进框架分册就会在换框架时漏掉；触发条件才是 reference 的正确切分维度。
- **全部合并到单个 `references/frontend-details.md`** — 只需一个文件、加载成本更低，但把三类触发条件重新混在一起，失去按需加载的意义，等于回到拆分前的状态。
- **把大规模渲染优化并入 `react.md`** — 性能规则确实多与 React 生态相关（antd Listy），但渲染优化本身与框架无关，独立成册更贴合实际触发场景。
- **保持一级内容为前端条目，另立一个 Node.js 后端 skill** — 两个 skill 会在命名、导出、类型、依赖安全这些规则上大面积重复，而这些规则本身与运行时无关；把技术栈无关的部分留在一个 skill 里，前端差异用 reference 表达，比拆成多个 skill 更少重复也更少漂移。

## Consequences

- **收益**：SKILL.md 回到仓库 100 行审查线以内，且一级内容不再限定前端；Node.js 后端与脚本项目加载时不会读到无关的组件、路由、样式规则，React 细节按需再读 `references/react.md`。
- **代价与已知上限**：reference 未被读取时其规则不生效，依赖 SKILL.md 索引表格和 reference 首行的触发描述准确。索引表新增场景或 reference 改名时必须同步这两处，否则规则静默失效。
- **代价与已知上限**：`description` 移除 `Vue + TS` 后，Vue 项目不再触发本 skill。Vue 规范目前不存在，若后续需要应另立 skill 而非塞回本 skill。
- **代价与已知上限**：一级目录结构不再给出具体目录树，Agent 在没有项目约定可参考时缺少可直接套用的默认分层，需先读目标项目结构。

## Verification

- 以 `tiktoken` cl100k_base 统计各文件行数与 token 数。
- 逐行比对重组前后的正文条目，除 `description`、一级标题与目录结构一节的有意改写、以及两处 `=>` 空格排版差异外无内容丢失；被移入 `references/react.md` 的条目逐条核对存在。
