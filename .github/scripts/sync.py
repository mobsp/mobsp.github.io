import os
import re

# 配置區
DOMAIN = "https://mobsp.qzz.io"
EXCLUDE_DIRS = {'.git', '.github', 'assets', 'node_modules', 'data'} # 排除資源資料夾，只抓入口網頁

# 描述字典：根據路徑關鍵字自動對應描述
DESC_KNOWLEDGE = {
    "index.html": "最新公告與品牌動態",
    "blog/": "技術筆記與數位生活紀錄",
    "viewer/": "圖示庫預覽與跳轉編輯",
    "svg-editor/": "進階圖示加工與代碼生成器",
    "music/": "沉浸式工作背景音律體驗",
    "shorts/": "沈浸式多媒體內容體驗",
    "tol/index.html": "動態驅動的實用開發工具",
    "tol/lab/": "250+ 核心組件開發預覽",
    "wiki/": "專案說明與使用者指南"
}

def get_smart_desc(path):
    for key, desc in DESC_KNOWLEDGE.items():
        if key in path:
            return desc
    return "自動偵測到的數位資產"

def generate_table_rows():
    rows = []
    # 掃描儲存庫中所有的 html 檔案
    for root, dirs, files in os.walk("."):
        # 過濾掉排除目錄
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file.endswith(".html"):
                # 取得相對路徑
                full_path = os.path.join(root, file).replace("./", "").replace("\\", "/")
                clean_path = full_path.lstrip("./")
                
                # 跳過重複的 index 邏輯（可選）
                display_name = clean_path.replace("/index.html", "").upper() or "HOME"
                
                # 生成三個欄位的內容
                service_url = f"{DOMAIN}/{clean_path}"
                description = get_smart_desc(clean_path)
                directory_link = f"./{clean_path}"
                
                # 組合 HTML 行
                row = f"""      <tr>
        <td nowrap><a href="{service_url}"><b>{display_name} 🔗</b></a></td>
        <td nowrap>{description}</td>
        <td nowrap><a href="{directory_link}"><code>{directory_link}</code></a></td>
      </tr>"""
                rows.append(row)
    
    return "\n".join(rows)

def sync_to_readme(new_rows):
    with open("README.md", "r", encoding="utf-8") as f:
        content = f.read()

    # 使用 Regex 尋找標記區間
    pattern = r".*?"
    replacement = f"\n{new_rows}\n      "
    
    updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    with open("README.md", "w", encoding="utf-8") as f:
        f.write(updated_content)

if __name__ == "__main__":
    rows = generate_table_rows()
    sync_to_readme(rows)
    print("Ⲙ𝔬ⲃⳝ𝔭 README Matrix 同步成功！")
