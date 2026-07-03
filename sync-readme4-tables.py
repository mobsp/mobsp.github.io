#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤖 同步 README4.md 表格 - GitHub Actions 觸發腳本

功能：
- 🔔 監聽 GitHub 事件
- 📝 偵測表格相關檔案變更
- 🔄 自動同步更新 README4.md
- 📊 更新統計數據
- 🔐 記錄變更日誌

触发条件:
- ✅ 檔案新增
- ✏️ 檔案修改
- 🗑️ 檔案刪除
- 🔀 Push 事件

Author: Mobsp
Updated: 2026-07-03
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import subprocess
import re

class GitHubSyncManager:
    """GitHub 事件同步管理器"""
    
    # 需要監控的表格關鍵詞
    TABLE_PATTERNS = [
        r'<\|.*\|>',  # Markdown 表格
        '| 🎯 |',      # 標記行
        '| 🟦 |',      # 色點
        '| 🟩 |',
        '| 🟨 |',
        '| 🟧 |',
    ]
    
    # 需要監控的檔案
    TRACKED_FILES = {
        'blog/': 'blog/',
        'tol/': 'tol/',
        'app/': 'app/',
        'wiki/': 'wiki/',
        'shorts/': 'shorts/',
        'svg-editor/': 'svg-editor/',
        'assets/': 'assets/',
    }
    
    def __init__(self):
        self.repo_root = Path(os.getenv('GITHUB_WORKSPACE', '.'))
        self.event_name = os.getenv('GITHUB_EVENT_NAME', 'unknown')
        self.event_path = os.getenv('GITHUB_EVENT_PATH', '')
        self.readme_path = self.repo_root / 'README4.md'
        self.log_file = self.repo_root / 'SYNC_LOG.json'
        
    def load_event(self) -> dict:
        """載入 GitHub 事件數據"""
        if not self.event_path or not Path(self.event_path).exists():
            return {}
        
        try:
            with open(self.event_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  無法載入事件: {e}")
            return {}
    
    def get_modified_files(self, event: dict) -> list:
        """獲取修改的檔案列表"""
        files = []
        
        # Push 事件
        if self.event_name == 'push':
            for commit in event.get('commits', []):
                files.extend(commit.get('added', []))
                files.extend(commit.get('modified', []))
                files.extend(commit.get('removed', []))
        
        # Pull Request 事件
        elif self.event_name == 'pull_request':
            pr = event.get('pull_request', {})
            files = [f['filename'] for f in pr.get('changed_files', [])]
        
        return list(set(files))
    
    def should_update_readme(self, files: list) -> bool:
        """判斷是否需要更新 README4.md"""
        for file in files:
            # 檢查是否涉及追蹤的目錄
            for tracked_dir in self.TRACKED_FILES:
                if file.startswith(tracked_dir):
                    print(f"🔔 偵測到變更: {file}")
                    return True
            
            # 檢查是否是檔案本身
            if 'README4.md' in file:
                return False
            
            # 檢查是否涉及配置檔案
            if file in ['manifest.json', 'auto-index.py', '_config.yml']:
                print(f"⚙️ 偵測到配置變更: {file}")
                return True
        
        return False
    
    def analyze_changes(self, files: list) -> dict:
        """分析變更內容"""
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'files_changed': len(files),
            'added': [],
            'modified': [],
            'deleted': [],
            'stats': {
                'blogs': 0,
                'tools': 0,
                'resources': 0,
            }
        }
        
        for file in files:
            # 分類檔案
            if 'blog' in file:
                analysis['stats']['blogs'] += 1
            elif 'tol' in file:
                analysis['stats']['tools'] += 1
            else:
                analysis['stats']['resources'] += 1
            
            # 判斷狀態（需要從 git 獲取詳細信息）
            try:
                result = subprocess.run(
                    ['git', 'log', '--oneline', '-1', file],
                    cwd=self.repo_root,
                    capture_output=True,
                    text=True
                )
                if result.returncode == 0:
                    analysis['modified'].append(file)
            except:
                analysis['added'].append(file)
        
        return analysis
    
    def update_table_entries(self) -> bool:
        """更新表格條目"""
        try:
            # 執行 Python 掃描腳本
            print("📊 執行檔案掃描...")
            result = subprocess.run(
                ['python3', 'auto-update-readme4.py'],
                cwd=self.repo_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("✅ 掃描成功")
                print(result.stdout)
                return True
            else:
                print(f"❌ 掃描失敗: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ 執行腳本失敗: {e}")
            return False
    
    def log_sync(self, analysis: dict, success: bool):
        """記錄同步日誌"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'event': self.event_name,
            'success': success,
            'analysis': analysis,
        }
        
        logs = []
        if self.log_file.exists():
            with open(self.log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        
        logs.append(log_entry)
        
        # 只保留最近 100 條
        logs = logs[-100:]
        
        with open(self.log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
        
        print(f"📝 已記錄同步日誌")
    
    def generate_summary(self, analysis: dict):
        """生成變更摘要"""
        print("\n" + "="*60)
        print("📊 變更摘要")
        print("="*60)
        print(f"⏰ 時間: {analysis['timestamp']}")
        print(f"📁 檔案變更: {analysis['files_changed']} 個")
        print(f"📝 新增: {len(analysis['added'])}")
        print(f"✏️ 修改: {len(analysis['modified'])}")
        print(f"🗑️ 刪除: {len(analysis['deleted'])}")
        print(f"\n📊 統計:")
        print(f"  📖 部落格: {analysis['stats']['blogs']}")
        print(f"  🛠️ 工具: {analysis['stats']['tools']}")
        print(f"  📦 資源: {analysis['stats']['resources']}")
        print("="*60 + "\n")
    
    def run(self):
        """執行同步程序"""
        print("\n🚀 GitHub Actions 同步啟動...\n")
        print(f"📌 事件類型: {self.event_name}")
        print(f"📂 工作目錄: {self.repo_root}")
        
        # 載入事件
        event = self.load_event()
        if not event:
            print("⚠️  無法獲取事件數據，跳過處理")
            return
        
        # 獲取修改的檔案
        modified_files = self.get_modified_files(event)
        if not modified_files:
            print("ℹ️ 沒有檔案被修改")
            return
        
        print(f"\n📁 修改的檔案數: {len(modified_files)}")
        
        # 判斷是否需要更新
        if not self.should_update_readme(modified_files):
            print("✅ 無需更新 README4.md")
            return
        
        # 分析變更
        analysis = self.analyze_changes(modified_files)
        
        # 生成摘要
        self.generate_summary(analysis)
        
        # 執行更新
        print("🔄 開始更新 README4.md...\n")
        success = self.update_table_entries()
        
        # 記錄日誌
        self.log_sync(analysis, success)
        
        if success:
            print("\n✅ 同步完成！")
            print("📝 README4.md 已自動更新")
        else:
            print("\n❌ 同步失敗")
            sys.exit(1)


if __name__ == "__main__":
    manager = GitHubSyncManager()
    manager.run()
