import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from openpyxl import Workbook, load_workbook


SKILL_DIR = Path(__file__).resolve().parents[1]
SCRIPT = SKILL_DIR / "scripts" / "generate-quote-xlsx.py"
ROWS = {
    "rows": [
        {"feature": "FR-01", "type": "邏輯", "detail": "测试逻辑开发", "days": 0.5},
        {"feature": "FR-02", "type": "接口", "detail": "测试接口", "days": 0.5},
    ]
}


def run_generator(output: Path, template: Path | None = None) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as rows_file:
        json.dump(ROWS, rows_file, ensure_ascii=False)
        rows_file.flush()
        command = [sys.executable, str(SCRIPT), "-i", rows_file.name, "-o", str(output)]
        if template is not None:
            command.extend(["-t", str(template)])
        subprocess.run(command, check=True, capture_output=True, text=True)


class GenerateQuoteXlsxTest(unittest.TestCase):
    def test_generated_workbook_contains_formula_and_cached_total(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "quote.xlsx"
            run_generator(output)

            formula_wb = load_workbook(output, data_only=False)
            cached_wb = load_workbook(output, data_only=True)

            self.assertEqual(formula_wb.active["G2"].value, "=SUM(E:E)")
            self.assertEqual(cached_wb.active["G2"].value, 1)
            self.assertEqual(formula_wb.calculation.calcMode, "auto")
            self.assertTrue(formula_wb.calculation.fullCalcOnLoad)
            self.assertTrue(formula_wb.calculation.forceFullCalc)

    def test_template_workbook_contains_formula_and_cached_total(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            template = Path(tmp) / "template.xlsx"
            output = Path(tmp) / "quote.xlsx"
            workbook = Workbook()
            worksheet = workbook.active
            worksheet.title = "报价"
            worksheet["G2"] = "=SUM(E:E)"
            workbook.save(template)

            run_generator(output, template)

            formula_wb = load_workbook(output, data_only=False)
            cached_wb = load_workbook(output, data_only=True)
            self.assertEqual(formula_wb["报价"]["G2"].value, "=SUM(E:E)")
            self.assertEqual(cached_wb["报价"]["G2"].value, 1)


if __name__ == "__main__":
    unittest.main()
