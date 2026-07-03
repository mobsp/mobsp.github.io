#!/usr/bin/env python3
"""
莫比儲存庫自動索引生成器
功能: 遍歷儲存庫所有檔案，生成自動化索引HTML頁面
輸出: index-nav.html (完整檔案清單)
用途: 快速訪問所有檔案和網址

GitHub Pages 友好版本
"""

import os
import sys
import time
from datetime import datetime
from pathlib import Path

# ============ 配置 ============
DOMAIN = 'https://mobsp.qzz.io'
REPO_URL = 'https://github.com/mobsp/mobsp.github.io'
OUTPUT_FILE = 'index-nav.html'

# 排除的檔案/目錄模式
EXCLUDE_PATTERNS = {
    '.git',
    '.github',
    'node_modules',
    '.DS_Store',
    'Thumbs.db',
    '*.pyc',
    '__pycache__',
    '.backup',
}

# 排除的副檔名
EXCLUDE_EXTENSIONS = {
    '.pyc', '.pyo', '.pyd',
    '.o', '.obj', '.so',
    '.exe', '.dll', '.dylib',
}

# ============ 主邏輯 ============
def should_exclude(path_str):
    """判斷路徑是否應被排除"""
    path_obj = Path(path_str)
    
    # 檢查檔案名
    if path_obj.name in EXCLUDE_PATTERNS:
        return True
    
    # 檢查路徑片段
    for part in path_obj.parts:
        if part in EXCLUDE_PATTERNS:
            return True
    
    # 檢查副檔名
    if path_obj.suffix in EXCLUDE_EXTENSIONS:
        return True
    
    # 隱藏檔案
    if path_obj.name.startswith('.'):
        return True
    
    return False


def generate_index():
    """生成儲存庫索引頁"""
    start_time = time.time()
    
    try:
        print("📊 開始掃描儲存庫...")
        
        rows = []
        file_count = 0
        skip_count = 0
        total_size = 0
        
        # 遍歷所有檔案
        for root, dirs, files in os.walk('.'):
            # 過濾目錄
            dirs[:] = [d for d in dirs if not should_exclude(os.path.join(root, d))]
            
            # 處理檔案
            for file in files:
                rel_path = os.path.normpath(os.path.join(root, file))
                
                # 排除檢查
                if should_exclude(rel_path):
                    skip_count += 1
                    continue
                
                # 轉換路徑格式
                rel_path = rel_path.replace('./', '').replace(os.sep, '/')
                abs_path = '/' + rel_path
                url = f'{DOMAIN}/{rel_path}'
                file_name = file
                
                # 獲取檔案大小
                try:
                    file_size = os.path.getsize(os.path.join(root, file))
                    total_size += file_size
                    size_str = format_size(file_size)
                except:
                    size_str = "N/A"
                
                # 生成表格行
                row = f'''    <tr>
      <td>{file_count + 1}</td>
      <td><strong>{file_name}</strong></td>
      <td><code>{abs_path}</code></td>
      <td><span style="font-size:0.9em; color:#666;">{size_str}</span></td>
      <td><a href="{url}" target="_blank" style="color:#0084ff;">🔗 訪問</a></td>
    </tr>
'''
                rows.append(row)
                file_count += 1
        
        # 生成HTML
        html_content = generate_html(rows, file_count, total_size)
        
        # 寫入檔案
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # 計算執行時間
        elapsed_time = time.time() - start_time
        
        # 輸出統計
        print(f"\n{'='*50}")
        print(f"✅ 索引生成完成!")
        print(f"{'='*50}")
        print(f"📁 掃描檔案數: {file_count}")
        print(f"⏭️  跳過檔案: {skip_count}")
        print(f"💾 總大小: {format_size(total_size)}")
        print(f"⏱️  耗時: {elapsed_time:.2f}秒")
        print(f"📝 輸出: {OUTPUT_FILE}")
        print(f"🌐 域名: {DOMAIN}")
        print(f"{'='*50}\n")
        
        return True
        
    except Exception as e:
        print(f"❌ 錯誤: {str(e)}", file=sys.stderr)
        return False


def format_size(size_bytes):
    """格式化檔案大小"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


def generate_html(rows, file_count, total_size):
    """生成HTML內容"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>莫比儲存庫 - 自動索引頁</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang TC', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }}
    .header {{
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }}
    .header h1 {{
      font-size: 2.5em;
      margin-bottom: 10px;
    }}
    .header p {{
      font-size: 1.1em;
      opacity: 0.9;
    }}
    .info {{
      background: #f8f9fa;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }}
    .info-item {{
      display: flex;
      flex-direction: column;
    }}
    .info-label {{
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }}
    .info-value {{
      color: #333;
      word-break: break-all;
    }}
    .info-value a {{
      color: #0084ff;
      text-decoration: none;
    }}
    .info-value a:hover {{
      text-decoration: underline;
    }}
    .table-wrapper {{
      overflow-x: auto;
      padding: 20px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95em;
    }}
    thead {{
      background: #f8f9fa;
      position: sticky;
      top: 0;
    }}
    th {{
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #dee2e6;
    }}
    td {{
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }}
    tr:hover {{
      background: #f9f9f9;
    }}
    code {{
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      color: #d63384;
    }}
    .footer {{
      background: #f8f9fa;
      padding: 15px 20px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      border-top: 1px solid #e9ecef;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌌 莫比儲存庫</h1>
      <p>自動化索引與快速訪問系統</p>
    </div>
    
    <div class="info">
      <div class="info-item">
        <span class="info-label">📁 儲存庫</span>
        <span class="info-value"><a href="{REPO_URL}" target="_blank">{REPO_URL}</a></span>
      </div>
      <div class="info-item">
        <span class="info-label">🌐 主域名</span>
        <span class="info-value"><a href="{DOMAIN}/" target="_blank">{DOMAIN}</a></span>
      </div>
      <div class="info-item">
        <span class="info-label">📊 檔案統計</span>
        <span class="info-value">{file_count} 個檔案 | {format_size(total_size)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">⏰ 生成時間</span>
        <span class="info-value">{timestamp}</span>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>檔名</th>
            <th>絕對路徑</th>
            <th style="width: 80px;">大小</th>
            <th style="width: 60px;">訪問</th>
          </tr>
        </thead>
        <tbody>
{''.join(rows)}
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <p>💡 提示: 本頁面由 auto-index.py 自動生成，定期同步儲存庫最新狀態</p>
    </div>
  </div>
</body>
</html>
"""


if __name__ == '__main__':
    success = generate_index()
    sys.exit(0 if success else 1)
