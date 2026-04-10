import csv
import os
import datetime

# --- 配置區 ---
CSV_FILE = 'Ⲙ𝔬ⲃⳝ𝔭_Indexer_Report.csv'
OUTPUT_FILE = 'README.md'
REPO_BASE = "https://github.com/mobsp/mobsp.github.io/blob/main"

# 標題美化字典
PRETTY_MAP = {
    "app": "📢 品牌導覽與公告 (Portal & News)",
    "blog": "✍️ 核心內容頻道 (Primary Channels)",
    "music": "🎵 音樂頻道 (Music Channel)",
    "shorts": "📱 短影音頻道 (Shorts)",
    "sup": "🤝 支援與服務 (Support Center)",
    "his": "📜 品牌時光軸 (History Log)",
    "tol": "🔧 核心工具庫 (Core Tools)",
    "tol/lab": "🧪 實驗室與開發 (Lab)",
    "tol/publisher": "📑 內容發布中心 (Publisher)",
    "tol/tourl": "🔗 短網址轉換 (URL Tools)",
    "tol/ve": "🎬 影音編輯工具 (Video Editor)",
    "set": "⚙️ 系統設定中心 (Settings)",
    "ROOT": "🏠 品牌根目錄"
}

def run_indexer():
    if not os.path.exists(CSV_FILE):
        print(f"❌ 找不到檔案: {CSV_FILE}")
        return

    portal_data = {}  # 任意門
    full_index_data = {}  # 全檔案索引

    with open(CSV_FILE, mode='r', encoding='utf-8') as f:
        # 移除可能存在的 BOM 字元
        content = f.read().lstrip('\ufeff')
        reader = csv.DictReader(content.splitlines())
        
        for row in reader:
            # 1. 衝突檢查：確保只抓取 main 分支
            if row['Branch'].strip() != 'main':
                continue

            folder = row['Folder'].strip()
            path = row['Path'].strip()
            # 2. 連結來源：使用你 CSV 裡的 CustomLink (mobsp.qzz.io)
            custom_url = row['CustomLink'].strip()
            
            title = PRETTY_MAP.get(folder, f"📂 分區: {folder}")
            
            if title not in portal_data: portal_data[title] = []
            if title not in full_index_data: full_index_data[title] = []

            # --- 邏輯 A: 任意門 (Portal) ---
            if path.endswith('.html'):
                # 美化網址：將 /index.html 替換為 /
                pretty_url = custom_url.replace('index.html', '')
                portal_data[title].append(f"| **{os.path.basename(path)}** | [🚪 點擊傳送]({pretty_url}) |")

            # --- 邏輯 B: 全檔案索引 (Full Index) ---
            github_url = f"{REPO_BASE}/{path}"
            full_index_data[title].append(f"| `{path}` | [查看源碼]({github_url}) | [正式網址]({custom_url}) |")

    # 3. 輸出組合
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    md = [
        "# 🚪 Ⲙ𝔬ⲃⳝ𝔭 品牌總匯任意門",
        f"> 🕒 最後自動更新：`{now}` | 代理：TiTi v4.5",
        "\n---",
        "## 🧭 快速入口 (Anywhere Door)",
        "點擊圖示直接進入網頁版頁面。\n"
    ]

    # 生成門戶區塊
    for title, items in portal_data.items():
        if items:
            md.append(f"### {title}")
            md.append("| 頁面名稱 | 傳送入口 |\n| :--- | :--- |")
            md.extend(items)
            md.append("")

    md.append("\n---\n## 📂 儲存庫全檔案清單 (Full File Index)")
    
    # 生成詳細索引區塊
    for title, items in full_index_data.items():
        if items:
            md.append(f"#### {title}")
            md.append("| 相對路徑 | GitHub 源碼 | 網址連結 |\n| :--- | :--- | :--- |")
            md.extend(items)
            md.append("")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(md))
    
    print("✨ README.md 修正版生成成功！")

if __name__ == "__main__":
    run_indexer()
