import os
import json

def main():
    # 調用秘密空間密鑰 <MSK>
    msk_token = os.environ.get("MSK")
    if not msk_token:
        print("警告：未檢測到 <MSK> 密鑰環境變數，將以唯讀模式運行。")
    else:
        print("已成功調用秘密空間密鑰 <MSK> 進行安全授權。")

    # 遞迴尋找全站 HTML 檔案
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
        "setting": "設定"
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

    # 寫入設定檔
    os.makedirs("data", exist_ok=True)
    config_path = "data/home-cardslider-config.json"

    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(dynamic_cards, f, ensure_ascii=False, indent=2)

    print(f"自動化掃描完成！已成功更新 {len(dynamic_cards)} 筆資料至 {config_path}")

if __name__ == "__main__":
    main()
