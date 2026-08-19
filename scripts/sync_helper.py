#!/usr/bin/env python3
import subprocess
import requests
import sys

OWNER = "mobsp"
REPO = "mobsp.github.io"
BRANCH = "main"

def get_modified_files():
    """透過 Git 指令取得最近一次 commit 所修改的檔案列表"""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "HEAD^", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        files = result.stdout.splitlines()
        return [f.strip() for f in files if f.strip()]
    except Exception as e:
        print(f"取得變動檔案發生錯誤: {e}")
        return []

def purge_jsdelivr_cache(file_path):
    """向 jsDelivr 發送清除快取請求"""
    purge_url = f"https://purge.jsdelivr.net/gh/{OWNER}/{REPO}@{BRANCH}/{file_path}"
    print(f"正在清除 CDN 快取: {purge_url}")
    try:
        response = requests.get(purge_url, timeout=10)
        if response.status_code == 200:
            print(f"成功清除: {file_path} (回應: {response.json()})")
        else:
            print(f"清除失敗 {file_path}，狀態碼: {response.status_code}")
    except Exception as e:
        print(f"請求 Purge API 失敗: {e}")

if __name__ == "__main__":
    print("開始執行 CDN 自動同步與快取清除...")
    modified_files = get_modified_files()
    
    if not modified_files:
        print("沒有偵測到變動的檔案。")
        sys.exit(0)
        
    print(f"偵測到以下檔案被修改: {modified_files}")
    for file_path in modified_files:
        purge_jsdelivr_cache(file_path)
        
    print("所有更新同步作業完成！")
