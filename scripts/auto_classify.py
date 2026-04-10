import csv
import os
import datetime

# --- 基礎配置 ---
DOMAIN = "mobsp.qzz.io"
REPO_URL = "https://github.com/mobsp/mobsp.github.io/blob/main"
CSV_FILE = 'Ⲙ𝔬ⲃⳝ𝔭_Indexer_Report.csv'
OUTPUT_FILE = 'README.md'

# --- 品牌感性美化地圖 ---
# 腳本會優先匹配長路徑（二層資料夾），若無則匹配一層資料夾
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
    "set": "⚙️ 系統設定中心 (Settings Terminal)",
    "ROOT": "🏠 品牌根目錄"
}

def generate_portal():
    categorized = {}
    
    if not os.path.exists(CSV_FILE):
        print(f"❌ 找不到數據源 {CSV_FILE}")
        return

    # 1. 讀取並分類
    with open(CSV_FILE, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 規則：只抓 main 分支，且必須是可訪問的 HTML 頁面
            if row['Branch'] == 'main' and row['Path'].endswith('.html'):
                folder = row['Folder']
                path = row['Path']
                
                # 取得美化標題
                title = PRETTY_MAP.get(folder, f"📂 資源分區: {folder}")
                if title not in categorized:
                    categorized[title] = []
                
                # 優化網址：移除 index.html 讓連結更美觀 (SEO 友善)
                clean_url = f"https://{DOMAIN}/{path.replace('index.html', '')}"
                categorized[title].append(f"| `{path}` | [🚪 點擊進入]({clean_url}) |")

    # 2. 構建 Markdown 內容
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    content = [
        f"# 🚪 Ⲙ𝔬ⲃⳝ𝔭 品牌任意門",
        f"> **全站自動化導航系統**",
        f"> 🕒 最後同步：`{now}` (UTC+8)",
        "\n---",
        "## 🧭 網站快速索引",
        "這是一個根據儲存庫結構自動生成的「任意門」，您可以透過下方分類快速跳轉至各項功能頁面。\n"
    ]

    # 按預定義的字典順序或字母順序排序輸出
    sorted_titles = sorted(categorized.keys(), key=lambda x: list(PRETTY_MAP.values()).index(x) if x in PRETTY_MAP.values() else 99)

    for title in sorted_titles:
        rows = categorized[title]
        content.append(f"### {title}")
        content.append("| 資源路徑 | 傳送門入口 |")
        content.append("| :--- | :--- |")
        content.extend(rows)
        content.append("\n")

    content.append("---")
    content.append("### 🛠️ 系統資訊")
    content.append(f"- **專案分支**: `main`")
    content.append(f"- **自定義域名**: [{DOMAIN}](https://{DOMAIN})")
    content.append(f"- **維護代理**: TiTi Auto-Indexer v4.0")

    # 3. 寫入 README.md
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(content))
    
    print(f"✅ 任意門更新成功！已生成至 {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_portal()
