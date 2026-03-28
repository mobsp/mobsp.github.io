"""
MODULE: REPOSITORY_ASSET_MIRROR
VERSION: 2.1.0 (STABLE)
DESCRIPTION: 執行地毯式全量掃描，並透過安全錨點將索引注入目標 HTML。
"""

import os
import urllib.parse

# 系統核心配置
BASE_URL = "https://mobsp.github.io"
TARGET_FILE = "tol/tourl/index.html"
START_MARKER = ""
END_MARKER = ""

def execute_mirror_sync():
    all_assets = []
    
    # 1. 遞迴遍歷演算法
    for root, dirs, files in os.walk("."):
        if ".git" in root or ".github" in root:
            continue
            
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, ".")
            web_path = rel_path.replace(os.sep, "/")
            
            if web_path == TARGET_FILE or file == "sync_scanner.py":
                continue
                
            all_assets.append(web_path)

    all_assets.sort()

    # 2. 生成 HTML 數據行
    rows = ""
    for path in all_assets:
        encoded_path = urllib.parse.quote(path)
        full_url = f"{BASE_URL}/{encoded_path}"
        ext = os.path.splitext(path)[1].upper().replace('.', '') or "FILE"
        
        rows += f"""        <tr>
            <td class="type-tag">[{ext}]</td>
            <td class="file-name">{os.path.basename(path)}</td>
            <td class="link-url"><a href="{full_url}" target="_blank">{full_url}</a></td>
            <td class="repo-path"><code>/{path}</code></td>
        </tr>\n"""

    # 3. 原子化內容替換
    if not os.path.exists(TARGET_FILE):
        print(f"CRITICAL ERROR: Target container '{TARGET_FILE}' not found.")
        return

    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    if START_MARKER not in content or END_MARKER not in content:
        print(f"FATAL: Markers missing in {TARGET_FILE}. Update aborted.")
        return

    try:
        header = content.split(START_MARKER)[0]
        footer = content.split(END_MARKER)[1]
        updated_content = f"{header}{START_MARKER}\n{rows}{END_MARKER}{footer}"
        
        with open(TARGET_FILE, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"Status: Synchronized {len(all_assets)} assets to {TARGET_FILE}.")
    except Exception as e:
        print(f"Runtime Exception: {str(e)}")

if __name__ == "__main__":
    execute_mirror_sync()
