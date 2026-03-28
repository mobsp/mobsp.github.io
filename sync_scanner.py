"""
專家級掃描腳本：自動化資源鏡像同步
"""
import os
import urllib.parse

# 系統環境變數配置
BASE_URL = "https://mobsp.github.io"
TARGET_FILE = "tol/tourl/index.html" # 已修正為部長指定的深層路徑
START_MARKER = ""
END_MARKER = ""

def execute_mirror_sync():
    all_assets = []
    
    # 全域地毯式遞迴掃描
    for root, dirs, files in os.walk("."):
        # 排除 Git 內部資料夾與腳本自身
        if ".git" in root or ".github" in root:
            continue
            
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, ".")
            web_path = rel_path.replace(os.sep, "/")
            
            # 排除輸出目標檔案，防止內容自我嵌套
            if web_path == TARGET_FILE or file == "sync_scanner.py":
                continue
                
            all_assets.append(web_path)

    all_assets.sort()

    # 轉化為 HTML 數據行
    rows = ""
    for path in all_assets:
        encoded_path = urllib.parse.quote(path)
        full_url = f"{BASE_URL}/{encoded_path}"
        ext = os.path.splitext(path)[1].upper().replace('.', '') or "FILE"
        
        rows += f"""        <tr>
            <td class="type-tag">[{ext}]</td>
            <td>{os.path.basename(path)}</td>
            <td class="link-url"><a href="{full_url}" target="_blank">{full_url}</a></td>
            <td><code>/{path}</code></td>
        </tr>\n"""

    # 讀取並執行全量覆蓋
    if not os.path.exists(TARGET_FILE):
        print(f"Error: 找不到目標路徑 {TARGET_FILE}")
        return

    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    try:
        header = content.split(START_MARKER)[0]
        footer = content.split(END_MARKER)[1]
        new_content = f"{header}{START_MARKER}\n{rows}{END_MARKER}{footer}"
        
        with open(TARGET_FILE, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Success: {len(all_assets)} assets synchronized.")
    except IndexError:
        print("Error: 標記位丟失，請檢查 HTML 註解。")

if __name__ == "__main__":
    execute_mirror_sync()
