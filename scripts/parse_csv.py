import csv
import os
import datetime

# --- 配置區 ---
DOMAIN = "mobsp.qzz.io"
CSV_FILE = 'Ⲙ𝔬ⲃⳝ𝔭_Indexer_Report.csv'
OUTPUT_FILE = 'README.md'

# 美化標題對照表
PRETTY_MAP = {
    "app": "📢 站長廣播站 (Portal & News)",
    "blog": "✍️ 核心內容頻道 (Primary Channels)",
    "music": "🎵 音樂頻道 (Music Channel)",
    "shorts": "📱 短影音頻道 (Shorts)",
    "sup": "🤝 支援與服務 (Support)",
    "his": "📜 品牌時光軸 (History)",
    "tol": "🔧 核心工具庫 (Core Tools)",
    "tol/lab": "🧪 實驗室與開發 (Lab)",
    "tol/ve": "🎬 影音編輯工具 (Video Editor)",
    "set": "⚙️ 系統設定中心 (Settings)",
    "ROOT": "🏠 根目錄"
}

# --- 邏輯解析 ---
categorized = {}

with open(CSV_FILE, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['Branch'] == 'main' and row['Path'].endswith('.html'):
            folder = row['Folder']
            path = row['Path']
            
            # 判斷美化標題
            title = PRETTY_MAP.get(folder, folder)
            if title not in categorized: categorized[title] = []
            
            web_link = f"https://{DOMAIN}/{path.replace('index.html', '')}"
            categorized[title].append(f"| `{path}` | [🚪 點擊進入]({web_link}) |")

# --- 輸出渲染 ---
content = ["# 🚪 Ⲙ𝔬ⲃⳝ𝔭 品牌任意門\n"]
for title, rows in categorized.items():
    content.append(f"## {title}")
    content.append("| 頁面路徑 | 傳送入口 |\n| :--- | :--- |")
    content.extend(rows)
    content.append("\n")

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write("\n".join(content))
