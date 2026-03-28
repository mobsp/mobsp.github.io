import os

DOMAIN = 'https://mobsp.qzz.io'
REPO_URL = 'https://github.com/mobsp/mobsp.github.io/tree/d442faa1a3ed2ca9b09cd26683e0a16f5d775f97'
rows = []
idx = 1

for root, dirs, files in os.walk('.'):
    for file in files:
        rel = os.path.join(root, file)
        rel = rel.replace('./','') if rel.startswith('./') else rel
        abs = '/' + rel
        url = f'{DOMAIN}/{rel}'
        name = file
        rows.append(f'<tr><td>{idx}</td><td>{name}</td><td>{abs}</td><td>{rel}</td><td><a href="{url}" target="_blank">{url}</a></td></tr>')
        idx += 1

html = f"""
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>mobsp 儲存庫自動索引頁</title>
  <style>
    body {{ font-family: sans-serif; background: #f6f6f8;}}
    table {{border-collapse: collapse; width: 100%; margin-top: 20px;}}
    th, td {{border: 1px solid #bbb; padding: 8px; text-align: left;}}
    th {{background: #e0e0e0;}}
    a {{color: #1565c0;}}
    .info {{padding:5px 0;}}
  </style>
</head>
<body>
  <h1>mobsp 儲存庫自動索引頁</h1>
  <div class="info">
    <strong>儲存庫：</strong>
    <a href="{REPO_URL}">mobsp</a>
    <br>
    <strong>主域名：</strong> <a href="{DOMAIN}/">{DOMAIN}</a>
    <br>
    <strong>本頁用途：</strong> 自動同步所有檔案/路徑/連結，含絕對與相對路徑
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>檔名</th>
        <th>絕對路徑</th>
        <th>相對路徑</th>
        <th>頁面連結</th>
      </tr>
    </thead>
    <tbody>
{''.join(rows)}
    </tbody>
  </table>
  <p>如需詳細資料請參閱 <a href="{REPO_URL}" target="_blank">GitHub</a> 。</p>
</body>
</html>
"""
with open('index-nav.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('索引頁生成完成：index-nav.html')