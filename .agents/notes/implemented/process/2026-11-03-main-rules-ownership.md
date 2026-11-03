# Agent Note: 通用入口与专项规范的归属边界

Status: implemented

## Problem

本轮修改前的 `rules/main.md` 仍包含 `.d.ts` 声明文件、桶导出、固定 `lib` / `utils` 目录、笔记校验命令和 Git CLI 沙箱细节。前三项把专项约束或目录假设带入所有项目，后两项与按需加载的 skill 重复维护。

## Decision

- `main` 保留不编造 API、类型和业务规则的通用底线；`.d.ts` 声明约束迁入本仓库的 `ts-standards`，防止凭空补声明，不禁止基于已确认契约的合法维护。
- 从 `main` 移除桶导出禁令，由 `ts-standards` 已有条目承接，不改变该 skill 的导出规范。
- 将工具函数查找并入通用复用要求，按目标项目实际结构查找已有同类能力，不限定 `lib` / `utils` 目录。
- `main` 保留笔记提交前校验通过、缺少入口或依赖先确认、不擅自增加工具链的门槛；具体校验入口按已加载的笔记 skill 执行。
- 从 `main` 移除 Git CLI 沙箱细节，由 `git-workflow` 已有规定承接；通用 Git 授权边界和 skill 触发条件保持不变。

既有笔记中，[第一轮保守去重](2026-11-03-main-rules-deduplication.md) 与本主题部分重叠，本次补充已核实承接关系的规则迁移，不取代其去重决定；两篇互链。[按技术栈命名](2026-11-03-stack-aware-naming.md) 和 [TypeScript 规范分册](../architecture/2026-10-22-ts-standards-reference-split.md) 继续适用。[查证确认与文件拆分边界](2026-11-03-main-rules-execution-boundaries.md) 不受本次归属调整影响。检索未发现本主题的其他活跃提案。

## Alternatives considered

- **全部保留在通用入口（未采用）**：无需依赖专项 skill 承接，但会持续把语言和目录假设施加到其他项目，并造成同一执行细节多处维护。
- **通用底线常驻，专项约束按需加载（采用）**：保留查证、复用、校验和 Git 授权要求，只迁移或删除已有明确归属的细节；代价是需要核对专项 skill 的可用性与内容。

## Verification

- 五项一次性入口检查在修改前均失败，修改后均通过；另行比对测试、安全和 skill 路由章节与 `HEAD` 一致，并检查既有混合技术栈命名保留。
- 核对 TS skill 的声明文件真实性条目与既有桶导出禁令，以及 Git skill 的既有沙箱规定；仅修改本仓库文件。
- 使用 `node scripts/count-tokens.mjs` 更新 README；`main` 从本轮开始时的 5,252 tokens 变为 5,087 tokens，TS skill 为 1,233 tokens，编码口径均为 `cl100k_base`。
- 运行 `git diff --check`；从仓库根目录使用现有 Node.js 24 运行已加载笔记 skill 的目录、格式、归档校验脚本，不新增项目依赖或工具链。

## Consequences

- 通用入口不再施加这两项 TypeScript 专项约束或固定工具目录；不编造、优先复用、笔记校验和 Git 授权的通用底线保留。
- 专项约束依赖正确加载对应 skill。笔记 skill 不在本仓库内，具体命令仍依赖目标环境已安装版本；没有可用入口时必须确认，不通过新增工具链补齐。
- 结构检查不能证明代理在所有任务中均正确执行，应结合具体声明文件和项目目录场景复核措辞。
