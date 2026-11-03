# Agent Note: 人天报价 xlsx 的 Total 缓存值

Status: implemented

## Problem

`man-day-quote` 使用 `openpyxl` 写入 `=SUM(E:E)` 公式，但不会计算公式结果，生成的 xlsx 中 G2 只有空缓存值。部分 Excel、预览器或自动取数工具在用户打开并保存文件前会显示空白或 0。相关估算与拆项口径见 [人天报价的固定估算与明细口径](2026-11-02-man-day-quote-conventions.md)。

## Decision

- 生成文件仍将 G2 保持为 `=SUM(E:E)`，不把总数改成静态值。
- 保存前将工作簿设置为自动重算、打开时重算并强制重算。
- 保存后重写当前工作表 XML，把输入人天合计写入 G2 的 `<v>` 缓存；公式 `<f>` 保持不变。
- 无模板和用户模板走同一套处理，工作表路径从 `workbook.xml` 关系解析，不依赖固定文件名。
- 模板文件的包内其他内容原样保留，临时文件写完后原子替换目标文件。

## Alternatives considered

### 直接写入静态总数

文件可立即显示正确值，但 Excel 中修改人天后总数不会更新，也违反 Total 必须保留公式的报价约定，因此不采用。

### 改用 xlsxwriter

`write_formula(..., value=...)` 可以写入缓存值，但需要新增依赖，并且当前模板保留、读取和样式处理仍依赖 `openpyxl`，为此重写生成链路收益不足。

### 调用 LibreOffice 无头重算

可以生成真实计算缓存，但要求运行环境额外安装 LibreOffice，不适合作为可分发 skill 的默认依赖。

## Verification

- 先运行新增测试，确认旧实现因 `data_only` 读取 G2 为 `None` 而失败。
- 实现后运行 `python3 -m unittest discover -s skills/man-day-quote/tests -v`，覆盖内建工作簿和用户模板，确认 G2 同时保留公式且缓存值为输入合计。
- 检查生成文件中的 G2 XML 同时存在 `<f>` 和 `<v>`，并确认工作簿启用了强制重算。

## Consequences

文件生成后无需人工打开保存即可显示 Total，同时保留 Excel 修改人天后的自动重算能力。代价是生成脚本需要对 xlsx 压缩包做一次受控重写，并维护相关工作表路径与 XML 解析逻辑。
