#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path

SITE_BASE = "https://mobsp.qzz.io"
IGNORE_DIRS = {
    ".git",
    ".github",
    "node_modules",
    ".vscode",
    ".idea",
    "__pycache__",
    "file-list",
}
IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "icon", "avif", "tif", "tiff"}
AUDIO_EXTENSIONS = {"mp3", "wav", "m4a", "aac", "ogg", "flac", "opus"}
VIDEO_EXTENSIONS = {"mp4", "webm", "mov", "m4v", "avi", "mkv", "ogv"}


def slugify(value: str) -> str:
    text = value.strip().lower()
    text = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "item"


def get_extension(path: str) -> str:
    return Path(path).suffix.lower().lstrip(".")


def media_category(path: str) -> str:
    ext = get_extension(path)
    if ext in IMAGE_EXTENSIONS:
        return "image"
    if ext in AUDIO_EXTENSIONS:
        return "audio"
    if ext in VIDEO_EXTENSIONS:
        return "video"
    return "none"


def detect_type(path: str) -> str:
    suffix = Path(path).suffix.lower()
    name = Path(path).name.lower()

    if name.startswith("."):
        return "dotfile"
    if suffix == ".html":
        return "html-index" if name == "index.html" else "html"
    if suffix == ".js":
        return "javascript"
    if suffix == ".json":
        return "json"
    if suffix == ".css":
        return "css"
    if suffix == ".py":
        return "python"
    if suffix in {".yml", ".yaml"}:
        return "workflow" if ".github/workflows/" in path else "yaml"
    if suffix == ".xml":
        return "xml"
    if suffix == ".md":
        return "markdown"
    if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif", ".tif", ".tiff"}:
        return "image"
    if name in {"manifest.json", "sw.js"}:
        return "pwa"
    if name in {"robots.txt", "sitemap.xml"}:
        return "seo"
    return "config"


def is_public_page(path: str) -> bool:
    return path.endswith("/index.html") or path.endswith(".html")


def pretty_url(url: str, path: str) -> str:
    return url[:-10] if path.endswith("/index.html") else url


def first_folder(path: str) -> str:
    parts = path.split("/")
    return parts[0] if len(parts) > 1 else "root"


def default_name(path: str) -> str:
    p = Path(path)
    if p.name == "index.html" and len(p.parts) >= 2:
        return p.parts[-2]
    return p.stem or p.name


def default_summary(path: str, file_type: str) -> str:
    media = media_category(path)
    if media == "image":
        return "圖像素材或品牌資產"
    if media == "audio":
        return "音訊檔案"
    if media == "video":
        return "影片檔案"
    if file_type == "html-index":
        return "網站入口頁面"
    if file_type == "javascript":
        return "前端或工具邏輯程式"
    if file_type == "css":
        return "樣式定義檔"
    if file_type == "json":
        return "資料或設定 JSON"
    if file_type == "python":
        return "自動化或資料處理腳本"
    if file_type == "workflow":
        return "GitHub Actions 自動化流程"
    if file_type == "yaml":
        return "設定檔"
    return "檔案項目"

def default_improvements(path: str, file_type: str) -> str:
    if file_type in {"javascript", "python"}:
        return "建議補齊錯誤處理、模組拆分與說明文件"
    if file_type in {"html", "html-index"}:
        return "建議補強語意標記、可及性與手機版細節"
    if file_type == "css":
        return "建議整理變數、元件層與響應式規則"
    if file_type in {"workflow", "yaml"}:
        return "建議檢查權限、觸發條件與敏感設定"
    return "可視情況補充用途說明與維護註記"

def default_risks(path: str, file_type: str) -> str:
    media = media_category(path)
    if file_type in {"workflow", "yaml"}:
        return "設定錯誤可能影響部署、權限、快取或工作流程"
    if file_type in {"javascript", "python"}:
        return "程式錯誤可能影響互動、資料處理或站點功能"
    if media != "none":
        return "媒體檔案需注意容量、版權與公開存取"
    return "請確認公開路徑、內容與用途是否符合預期"

def risk_level(path: str, file_type: str) -> str:
    if file_type in {"workflow", "yaml"}:
        return "高"
    if file_type in {"javascript", "python"}:
        return "中"
    return "低"

def scan_repo(repo_root: Path) -> list[str]:
    paths: list[str] = []
    for root, dirs, files in os.walk(repo_root):
        rel_root = Path(root).relative_to(repo_root)
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        if rel_root.parts and rel_root.parts[0] in IGNORE_DIRS:
            continue

        for name in files:
            rel_path = (rel_root / name).as_posix() if rel_root.parts else name
            if rel_path.startswith("file-list/"):
                continue
            paths.append(rel_path)

    return sorted(paths)

def load_existing(output_path: Path) -> dict[str, dict[str, object]]:
    if not output_path.exists():
        return {}
    try:
        data = json.loads(output_path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    return {item["path"]: item for item in data.get("items", []) if "path" in item}

def build_item(path: str, existing: dict[str, object]) -> dict[str, object]:
    file_type = detect_type(path)
    url = f"{SITE_BASE}/{path}"
    name = str(existing.get("name") or default_name(path))
    summary = str(existing.get("summary") or default_summary(path, file_type))
    improvements = str(existing.get("improvements") or default_improvements(path, file_type))
    risks = str(existing.get("risks") or default_risks(path, file_type))
    notes = str(existing.get("notes") or "多半屬原始碼/設定檔，網址不一定適合一般訪客")

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
        "type": file_type,
        "publicPage": bool(existing.get("publicPage")) if "publicPage" in existing else is_public_page(path),
        "riskLevel": str(existing.get("riskLevel") or risk_level(path, file_type)),
    }

def main() -> int:
    parser = argparse.ArgumentParser(description="掃描 repo 並更新 file-list/data/files.json")
    parser.add_argument("--repo-root", default=".", help="repo 根目錄")
    parser.add_argument("--output", default="file-list/data/files.json", help="輸出 JSON 路徑")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output_path = Path(args.output).resolve()

    existing_by_path = load_existing(output_path)
    scanned_paths = scan_repo(repo_root)

    items = [build_item(path, existing_by_path.get(path, {})) for path in scanned_paths]

    data = {
        "generatedAt": dt.datetime.now().isoformat(timespec="seconds"),
        "siteBase": SITE_BASE,
        "sourceWorkbook": "repo-scan",
        "total": len(items),
        "items": items,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"updated {output_path}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())