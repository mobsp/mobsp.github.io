#!/usr/bin/env python3
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

def col_to_idx(col: str) -> int:
    n = 0
    for ch in col:
        n = n * 26 + ord(ch) - 64
    return n - 1

def load_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    values = []
    for si in root.findall("a:si", NS):
        parts = []
        for node in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"):
            parts.append(node.text or "")
        values.append("".join(parts))
    return values

def parse_first_sheet(xlsx_path: Path) -> list[dict]:
    with zipfile.ZipFile(xlsx_path) as zf:
        sst = load_shared_strings(zf)
        root = ET.fromstring(zf.read("xl/worksheets/sheet1.xml"))
        rows = []
        for row in root.findall(".//a:sheetData/a:row", NS):
            vals = {}
            for cell in row.findall("a:c", NS):
                ref = cell.attrib["r"]
                idx = col_to_idx(re.match(r"([A-Z]+)", ref).group(1))
                t = cell.attrib.get("t")
                v = cell.find("a:v", NS)
                if v is None:
                    value = ""
                elif t == "s":
                    value = sst[int(v.text)]
                else:
                    value = v.text or ""
                vals[idx] = value
            max_idx = max(vals) if vals else -1
            rows.append([vals.get(i, "") for i in range(max_idx + 1)])
    headers = rows[0]
    return [{headers[i]: row[i] if i < len(row) else "" for i in range(len(headers))} for row in rows[1:]]

def classify_type(path: str) -> str:
    name = Path(path).name.lower()
    if name == "index.html":
        return "html-index"
    ext = Path(name).suffix.lower()
    if path.startswith(".github/workflows/"):
        return "workflow"
    mapping = {
        ".html": "html", ".js": "javascript", ".json": "json", ".css": "css",
        ".py": "python", ".yml": "workflow", ".yaml": "yaml", ".xml": "xml",
        ".md": "markdown", ".jpeg": "image", ".jpg": "image", ".png": "image",
        ".svg": "image", ".webp": "image",
    }
    return mapping.get(ext, "other")

def risk_level(text: str) -> str:
    if any(k in text for k in ["敏感", "金鑰", "暴露", "權限", "安全", "隱私", "secrets"]):
        return "高"
    if any(k in text for k in ["錯誤可能影響", "設定錯誤", "公開", "注意", "快取", "路由"]):
        return "中"
    return "低"

def build_dataset(rows: list[dict]) -> dict:
    items = []
    for row in rows:
        path = row["檔案路徑"]
        item_type = classify_type(path)
        items.append({
            "id": re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-") or "item",
            "path": path,
            "url": row["網站連結"],
            "prettyUrl": row["網站連結"][:-10] if path.endswith("/index.html") else row["網站連結"],
            "name": row["名稱"] or Path(path).name,
            "summary": row["簡易網站功能作用說明"],
            "improvements": row["進階/優化建議"],
            "risks": row["風險/安全/隱私/注意事項"],
            "notes": row["其它"],
            "folder": path.split("/")[0] if "/" in path else "root",
            "type": item_type,
            "publicPage": item_type in {"html", "html-index"} and not path.startswith(".github/"),
            "riskLevel": risk_level(row["風險/安全/隱私/注意事項"] or ""),
        })
    return {
        "generatedAt": "manual",
        "sourceWorkbook": xlsx_path.name,
        "siteBase": "https://mobsp.qzz.io",
        "total": len(items),
        "items": items,
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("usage: python scripts/generate_files_json.py input.xlsx output.json")
    xlsx_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    rows = parse_first_sheet(xlsx_path)
    output_path.write_text(json.dumps(build_dataset(rows), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {output_path}")
