import os
import json
import base64
import requests

def sync_to_github_api(repo, file_path, token):
    """【疊加功能】調用秘密空間密鑰 <MSK> 自動建立或覆蓋寫入 GitHub 儲存庫數據檔"""
    url = f"https://api.github.com/repos/{repo}/contents/{file_path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    
    if not os.path.exists(file_path):
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content_str = f.read()

    encoded_content = base64.b64encode(content_str.encode("utf-8")).decode("utf-8")

    # 獲取檔案當前 SHA 雜湊值 (若檔案已存在)
    sha = None
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        sha = res.json().get("sha")

    payload = {
        "message": f"auto: MSK synchronized {file_path}",
        "content": encoded_content
    }
    if sha:
        payload["sha"] = sha

    put_res = requests.put(url, headers=headers, json=payload)
    if put_res.status_code in [200, 201]:
        print(f"✅ MSK 自動同步 GitHub 成功: {file_path}")
    else:
        print(f"❌ MSK 同步失敗 ({put_res.status_code}): {put_res.text}")

def main():
    # 調用秘密空間密鑰 <MSK> 與當前專屬儲存庫資訊
    msk_token = os.environ.get("MSK")
    repo = os.environ.get("GITHUB_REPOSITORY")

    if not msk_token:
        print("警告：未檢測到 <MSK> 密鑰環境變數，將以唯讀模式運行。")
    else:
        print("已成功調用秘密空間密鑰 <MSK> 進行安全授權。")

    # 遞迴尋找全站 HTML 檔案 (原有邏輯完全保留)
    html_files = []
    for root, dirs, files in os.walk("."):
        if ".git" in root or "node_modules" in root:
            continue
        for file in files:
            if file.endswith(".html") and file.lower() != "index.html":
                rel_path = os.path.join(root, file).replace("\\", "/")
                if rel_path.startswith("./"):
                    rel_path = rel_path[2:]
                html_files.append(rel_path)

    preset_meta = {
        "blog": "部落格",
        "tol": "工具庫",
        "music": "音樂頻道",
        "shorts": "Shorts",
        "wiki": "支援中心",
        "setting": "設定",
        "Expen-Trac": "LINE 記帳"
    }

    dynamic_cards = []
    for file_path in html_files:
        parts = file_path.split("/")
        if len(parts) > 1 and parts[-1] == "index.html":
            card_id = parts[-2]
            url = f"/{'/'.join(parts[:-1])}/"
        else:
            card_id = parts[-1].replace(".html", "")
            url = f"/{file_path}"

        dynamic_cards.append({
            "id": card_id,
            "title": preset_meta.get(card_id, card_id.upper()),
            "url": url,
            "image": f"/assets/brand/ms-{card_id}.JPEG"
        })

    # 寫入卡片設定檔 (原有邏輯)
    os.makedirs("data", exist_ok=True)
    config_path = "data/home-cardslider-config.json"
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(dynamic_cards, f, ensure_ascii=False, indent=2)
    print(f"自動化掃描完成！已成功更新 {len(dynamic_cards)} 筆資料至 {config_path}")

    # 【疊加邏輯】初始化或維持 data/expen-trac-data.json
    ledger_path = "data/expen-trac-data.json"
    if not os.path.exists(ledger_path):
        with open(ledger_path, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        print(f"自動化初始化完成！已建立預設記帳檔案 {ledger_path}")

    # 若含有 MSK 授權，將兩份檔案自動同步 Commit 至 GitHub 儲存庫
    if msk_token and repo:
        sync_to_github_api(repo, config_path, msk_token)
        sync_to_github_api(repo, ledger_path, msk_token)

if __name__ == "__main__":
    main()
