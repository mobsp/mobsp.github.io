#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

SITE_BASE = "https://mobsp.qzz.io"


def slugify(value: str) -> str:
    text = value.strip().lower()
    text = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "item"


def risk_from_text(text: str) -> str:
    content = text.lower()
    if any(keyword in content for keyword in ["高", "secret", "token", "workflow", "設定錯誤", "權限", "暴露"]):
      return "高"
    if any(keyword in content for keyword in ["中", "注意", "快取", "外部", "依賴"]):
      return "中"
    return "低"


def detect_type(path: str) -> str:
    suffix = Path(path).suffix.lower()
    name = Path(path).name.lower()

    if name.startswith("."):
        return "dotfile"
    if suffix in {".html"}:
        return "html-index" if name == "index.html" else "html"
    if suffix in {".js"}:
        return "javascript"
    if suffix in {".json"}:
        return "json"
    if suffix in {".css"}:
        return "css"
    if suffix in {".py"}:
        return "python"
    if suffix in {".yml", ".yaml"}:
        return "workflow" if ".github/workflows/" in path else "yaml"
    if suffix in {".xml"}:
        return "xml"
    if suffix in {".md"}:
        return "markdown"
    if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif", ".tif", ".tiff"}:
        return "image"
    if name == "manifest.json" or name == "sw.js":
        return "pwa"
    if name in {"robots.txt", "sitemap.xml"}:
        return "seo"
    if suffix in {".txt"}:
        return "text"
    return "config"


def pretty_url(url: str, path: str) -> str:
    if path.endswith("/index.html"):
        return url[:-10]
    return url


def public_page(path: str) -> bool:
    if path.endswith("/index.html"):
        return True
    if Path(path).suffix.lower() in {".html"} and ".github/" not in path:
        return True
    return False


def first_folder(path: str) -> str:
    parts = path.split("/")
    return parts[0] if len(parts) > 1 else "root"


def extract_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []

    namespace = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    values: list[str] = []
    for item in root.findall("a:si", namespace):
        text_parts = [node.text or "" for node in item.findall(".//a:t", namespace)]
        values.append("".join(text_parts))
    return values


def cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    value_node = cell.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
    if value_node is None or value_node.text is None:
        return ""

    value = value_node.text
    if cell.get("t") == "s":
        return shared_strings[int(value)]
    return value


def parse_sheet_rows(xlsx_path: Path) -> list[list[str]]:
    with zipfile.ZipFile(xlsx_path) as zf:
        shared_strings = extract_shared_strings(zf)
        sheet_xml = zf.read("xl/worksheets/sheet1.xml")
        root = ET.fromstring(sheet_xml)

    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    rows: list[list[str]] = []

    for row in root.findall(".//a:sheetData/a:row", ns):
        row_values: list[str] = []
        for cell in row.findall("a:c", ns):
            row_values.append(cell_value(cell, shared_strings))
        rows.append(row_values)

    return rows


def normalize_record(headers: list[str], row: list[str]) -> dict[str, str]:
    values = row + [""] * (len(headers) - len(row))
    return {headers[i]: values[i].strip() for i in range(len(headers))}


def build_item(record: dict[str, str]) -> dict[str, object]:
    path = record.get("檔案路徑", "").strip()
    if not path:
        return {}

    url = record.get("網站連結", "").strip() or f"{SITE_BASE}/{path}"
    summary = record.get("簡易網站功能作用說明", "").strip()
    improvements = record.get("進階/優化建議", "").strip()
    risks = record.get("風險/安全/隱私/注意事項", "").strip()
    notes = record.get("其它", "").strip()
    name = record.get("名稱", "").strip() or Path(path).stem or path

    return {
        "id": slugify(path),
        "path": path,
        "url": url,
        "prettyUrl": pretty_url(url, path),
        "name": name,
        "summary": summary,
        "improvements": improvements,
        "risks": risks,
        "notes": notes,
        "folder": first_folder(path),
        "type": detect_type(path),
        "publicPage": public_page(path),
        "riskLevel": risk_from_text(" ".join([summary, improvements, risks, notes, path, name])),
    }


def generate_dataset(xlsx_path: Path) -> dict[str, object]:
    rows = parse_sheet_rows(xlsx_path)
    if not rows:
        raise ValueError("xlsx 內容為空")

    headers = rows[0]
    items: list[dict[str, object]] = []

    for row in rows[1:]:
        record = normalize_record(headers, row)
        item = build_item(record)
        if item:
            items.append(item)

    return {
        "generatedAt": dt.datetime.now().isoformat(timespec="seconds"),
        "siteBase": SITE_BASE,
        "sourceWorkbook": xlsx_path.name,
        "total": len(items),
        "items": items,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="從 xlsx 產生 file-list/data/files.json")
    parser.add_argument("xlsx", help="xlsx 檔案路徑")
    parser.add_argument("-o", "--output", default="data/files.json", help="輸出 JSON 路徑")
    args = parser.parse_args()

    xlsx_path = Path(args.xlsx)
    if not xlsx_path.exists():
        print(f"找不到 xlsx: {xlsx_path}", file=sys.stderr)
        return 1

    data = generate_dataset(xlsx_path)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"已產生 {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())