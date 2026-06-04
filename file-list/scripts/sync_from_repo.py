#!/usr/bin/env python3
from __future__ import annotations
import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

SITE_BASE = "https://mobsp.qzz.io"

IGNORE_DIRS = {
    ".git", ".github", "node_modules", ".vscode", ".idea", "__pycache__",
}
IGNORE_FILES = {
    ".DS_Store",
}
TEXT_PRIORITIES = (
    "summary",
    "improvements",
    "risks",
    "notes",
    "name",
)

DEFAULT_TYPE_LABELS = {
    "html-index": "頁面",
    "html": "HTML 檔案",
    "javascript": "JavaScript",
    "json": "JSON 資料",
    "css": "樣式表",
    "python": "Python 腳本",
    "workflow": "GitHub Actions",
    "image": "圖片素材",
    "pwa": "PWA 檔案",
    "seo": "SEO 檔案",
    "config": "設定檔",
    "yaml": "YAML 設定",
    "xml": "XML 檔案",
    "markdown": "Markdown",
    "dotfile": "隱藏檔案",
    "other": "其它檔案",
}

def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "item"

def classify_type(path: str) -> str:
    p = path.lower()
    name = Path(p).name
    if p.startswith(".github/workflows/"):
        return "workflow"
    if name == "manifest.json" or name == "sw.js":
        return "pwa"
    if name in {"robots.txt", "sitemap.xml"}:
        return "seo"
    if name.startswith(".") and "." not in name[1:]:
        return "dotfile"
    if name == "index.html":
        return "html-index"
    ext = Path(name).suffix
    mapping = {
        ".html": "html",
        ".js": "javascript",
        ".json": "json",
        ".css": "css",
        ".py": "python",
        ".yml": "workflow",
        ".yaml": "yaml",
        ".xml": "xml",
        ".md": "markdown",
        ".jpeg": "image",
        ".jpg": "image",
        ".png": "image",
        ".svg": "image",
        ".webp": "image",
        ".txt": "config",
        ".htaccess": "config",
    }
    return mapping.get(ext, "other")

def is_public_page(path: str) -> bool:
    lower = path.lower()
    if lower.endswith("/index.html"):
        return True
    if lower.endswith(".html") and not lower.startswith(".github/"):
        return True
    return False

def infer_name(path: str, item_type: str) -> str:
    p = Path(path)
    if p.name == "index.html":
        folder = p.parent.name
        return folder if folder not in {"", "."} else "首頁"
    if p.name.startswith(".") and p.suffix:
        return p.name
    if p.suffix:
        return p.stem
    return p.name or path

def infer_summary(path: str, item_type: str) -> str:
    p = Path(path)
    if item_type == "html-index":
        return f"{p.parent.as_posix() or 'root'} 的入口頁面"
    if item_type == "workflow":
        return "GitHub Actions 工作流程設定"
    if item_type == "python":
        return "Python 腳本或資料處理工具"
    if item_type == "javascript":
        return "JavaScript 程式或前端邏輯"
    if item_type == "json":
        return "JSON 設定或資料檔"
    if item_type == "css":
        return "網站樣式表"
    if item_type == "image":
        return "圖片素材或品牌資源"
    if item_type == "markdown":
        return "Markdown 文字內容"
    if item_type in {"yaml", "config"}:
        return "站點或部署設定檔"
    return f"{DEFAULT_TYPE_LABELS.get(item_type, '檔案')}"

def infer_improvements(path: str, item_type: str) -> str:
    if item_type in {"workflow", "yaml", "config"}:
        return "補充用途註解，確認敏感設定未外露，並檢查錯誤回滾流程。"
    if item_type in {"python", "javascript"}:
        return "補上錯誤處理、輸入驗證與使用說明，必要時拆模組與加測試。"
    if item_type in {"html-index", "html"}:
        return "補 SEO、metadata、可及性標記與 loading/快取優化。"
    if item_type == "json":
        return "建立欄位說明與 schema，避免資料格式漂移。"
    if item_type == "image":
        return "壓縮圖片尺寸並提供替代文字或 WebP 版本。"
    return "補充說明與維護註記，讓後續查找與修改更容易。"

def infer_risks(path: str, item_type: str) -> tuple[str, str]:
    lower = path.lower()
    if item_type in {"workflow", "yaml", "config"} or "security" in lower or lower.startswith(".github/"):
        return "高", "涉及部署、權限、快取或自動化設定，變更前應先檢查副作用與敏感資訊。"
    if item_type in {"python", "javascript", "json"}:
        return "中", "程式或資料變更可能影響站點功能、資料格式或前端相容性。"
    if item_type in {"html-index", "html", "css", "image"}:
        return "低", "主要影響頁面呈現、導覽或使用者體驗。"
    return "低", "修改前仍建議確認引用位置與用途。"

def path_to_url(path: str) -> tuple[str, str]:
    path = path.replace("\\", "/")
    url = f"{SITE_BASE}/{path}"
    if path.endswith("/index.html"):
        pretty = f"{SITE_BASE}/{path[:-10]}/"
    else:
        pretty = url
    return url, pretty

def load_existing(output_path: Path) -> dict[str, dict]:
    if not output_path.exists():
        return {}
    try:
        payload = json.loads(output_path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    items = payload.get("items", [])
    return {item.get("path"): item for item in items if item.get("path")}

def should_skip(rel: Path) -> bool:
    parts = rel.parts
    if any(part in IGNORE_DIRS for part in parts):
        return True
    if parts and parts[0] == "file-list":
        return True
    if rel.name in IGNORE_FILES:
        return True
    return False

def scan_repo(repo_root: Path) -> list[str]:
    results: list[str] = []
    for path in repo_root.rglob("*"):
        if path.is_dir():
            continue
        rel = path.relative_to(repo_root)
        if should_skip(rel):
            continue
        results.append(rel.as_posix())
    return sorted(results)

def build_item(path: str, existing: dict[str, dict]) -> dict:
    prior = existing.get(path, {})
    item_type = classify_type(path)
    url, pretty_url = path_to_url(path)
    level, default_risk = infer_risks(path, item_type)
    folder = Path(path).parent.as_posix() if Path(path).parent.as_posix() not in {"", "."} else "root"
    item = {
        "id": prior.get("id") or slugify(path),
        "path": path,
        "url": url,
        "prettyUrl": pretty_url,
        "name": prior.get("name") or infer_name(path, item_type),
        "summary": prior.get("summary") or infer_summary(path, item_type),
        "improvements": prior.get("improvements") or infer_improvements(path, item_type),
        "risks": prior.get("risks") or default_risk,
        "notes": prior.get("notes") or "網址可由此索引頁快速開啟；非 HTML 檔不一定適合一般訪客直接瀏覽。",
        "folder": prior.get("folder") or folder,
        "type": item_type,
        "publicPage": is_public_page(path),
        "riskLevel": prior.get("riskLevel") or level,
    }
    return item

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--output", default="file-list/data/files.json")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output_path = (repo_root / args.output).resolve()

    existing = load_existing(output_path)
    paths = scan_repo(repo_root)
    items = [build_item(path, existing) for path in paths]
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "siteBase": SITE_BASE,
        "sourceWorkbook": "Github儲存庫_mobsp.xlsx",
        "total": len(items),
        "items": items,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"updated {output_path} with {len(items)} items")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
