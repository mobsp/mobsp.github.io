import csv
import os
import datetime

# --- 設定區 ---
DOMAIN = "mobsp.qzz.io"
REPO_BASE_URL = "https://github.com/mobsp/mobsp.github.io/blob/main"
CSV_FILE = 'Ⲙ𝔬ⲃⳝ𝔭_Indexer_Report.csv'
TEMPLATE_FILE = 'template.md'
OUTPUT_FILE = 'README.md'

links = {'GUIDE': '', 'BLOG': '', 'TOOLS': '', 'MUSIC': '', 'SHORTS': '', 'SUPPORT': '', 'HISTORY': ''}
table_rows = []

# --- 1. 讀取並處理 CSV ---
if os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # 只處理 main 分支
            if row.get('Branch') == 'main' or row.get('分支') == 'main':
                # 取得路徑資料 (假設 CSV 欄位名稱為 Path, Category, URL)
                rel_path = row.get('Path') or row.get('相對路徑', '')
                category = row.get('Category') or row.get('類別', '')
                
                # A. 處理核心導覽連結 (對應模板上半部)
                if '導覽' in category: links['GUIDE'] = row.get('URL')
                elif '部落格' in category: links['BLOG'] = row.get('URL')
                elif '工具' in category: links['TOOLS'] = row.get('URL')
                elif '音樂' in category: links['MUSIC'] = row.get('URL')
                elif 'Shorts' in category: links['SHORTS'] = row.get('URL')
                elif '支援' in category: links['SUPPORT'] = row.get('URL')
                elif '歷史' in category: links['HISTORY'] = row.get('URL')

                # B. 生成表格行
                # 絕對路徑: GitHub URL
                abs_path = f"{REPO_BASE_URL}/{rel_path}".replace('//', '/')
                # 網站連結: Domain + 路徑 (移除 .html 結尾讓網址更美)
                web_link = f"https://{DOMAIN}/{rel_path.replace('index.html', '')}"
                
                row_str = f"| `{rel_path}` | [查看源碼]({abs_path}) | [開啟網頁]({web_link}) |"
                table_rows.append(row_str)

# --- 2. 組合表格字串 ---
file_index_table = "\n".join(table_rows)

# --- 3. 讀取模板並替換變數 ---
if os.path.exists(TEMPLATE_FILE):
    with open(TEMPLATE_FILE, mode='r', encoding='utf-8') as f:
        content = f.read()

    # 替換核心導覽
    for key, val in links.items():
        content = content.replace(f'{{{{{key}_URL}}}}', val if val else '#')

    # 替換檔案清單表格
    content = content.replace('{{FILE_INDEX_TABLE}}', file_index_table)
    
    # 替換時間
    content = content.replace('{{UPDATE_TIME}}', datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    # --- 4. 輸出最終檔案 ---
    with open(OUTPUT_FILE, mode='w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已成功建立包含所有路徑的 README.md！")
else:
    print("❌ 找不到 template.md")
