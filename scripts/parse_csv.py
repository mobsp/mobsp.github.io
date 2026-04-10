import csv
import os

# 1. 初始化連結字典
# 這裡定義你 template.md 裡面會用到的變數名稱
links = {
    'GUIDE': '',
    'BLOG': '',
    'TOOLS': '',
    'MUSIC': '',
    'SHORTS': '',
    'SUPPORT': '',
    'HISTORY': ''
}

# 2. 讀取 CSV 檔案
csv_file = 'Ⲙ𝔬ⲃⳝ𝔭_Indexer_Report.csv'

if os.path.exists(csv_file):
    with open(csv_file, mode='r', encoding='utf-8') as file:
        # 使用 DictReader 自動抓取第一列作為標題
        reader = csv.DictReader(file)
        
        for row in reader:
            # 【關鍵修改】只處理分支名稱為 main 的列
            # 這裡會過濾掉所有不是 main 的資料
            if row.get('Branch') == 'main' or row.get('分支') == 'main':
                category = row.get('Category') or row.get('類別')
                url = row.get('URL') or row.get('網址')
                
                # 根據類別填入字典
                if '導覽' in category: links['GUIDE'] = url
                elif '部落格' in category: links['BLOG'] = url
                elif '工具' in category: links['TOOLS'] = url
                elif '音樂' in category: links['MUSIC'] = url
                elif 'Shorts' in category: links['SHORTS'] = url
                elif '支援' in category: links['SUPPORT'] = url
                elif '歷史' in category: links['HISTORY'] = url

# 3. 讀取 Markdown 模板並取代變數
if os.path.exists('template.md'):
    with open('template.md', mode='r', encoding='utf-8') as f:
        content = f.read()

    # 開始替換模板中的佔位符
    content = content.replace('{{GUIDE_URL}}', links['GUIDE'])
    content = content.replace('{{BLOG_URL}}', links['BLOG'])
    content = content.replace('{{TOOLS_URL}}', links['TOOLS'])
    content = content.replace('{{MUSIC_URL}}', links['MUSIC'])
    content = content.replace('{{SHORTS_URL}}', links['SHORTS'])
    content = content.replace('{{SUPPORT_URL}}', links['SUPPORT'])
    content = content.replace('{{HISTORY_URL}}', links['HISTORY'])

    # 4. 寫入最終的 README.md 或 index.html
    with open('README.md', mode='w', encoding='utf-8') as f:
        f.write(content)
    
    print("✨ 已成功完成 [main] 分支數據擷取與部署！")
else:
    print("❌ 找不到 template.md，請確認檔案是否存在。")
