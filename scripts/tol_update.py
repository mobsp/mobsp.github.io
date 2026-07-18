import os
import re
import json

# 🔴 精準定位外層目錄
TOL_DIR = "../tol"
INDEX_FILE = "../index.html"

def parse_tool_folder(folder_name, folder_path):
    """
    工程級深度解析核心：
    優先權 1: config.json (包含精選狀態、專屬 Icon 與多語系)
    優先權 2: README.md (智慧正則解析大標題與段落)
    優先權 3: Fallback 結構還原
    """
    display_name = " ".join([w.capitalize() for w in folder_name.split("-")])
    tool_data = {
        "id": folder_name,
        "name": display_name,
        "desc": f"Online {display_name} System Center",
        "tags": [folder_name.split('-')[0], "utils"],
        "featured": False,
        "icon": "🔧"
    }

    config_path = os.path.join(folder_path, "config.json")
    readme_path = os.path.join(folder_path, "README.md")
    readme_path_lc = os.path.join(folder_path, "readme.md")

    # 1. 最高優先級：讀取標準 config.json
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                tool_data["name"] = cfg.get("name", tool_data["name"])
                tool_data["desc"] = cfg.get("desc", tool_data["desc"])
                tool_data["tags"] = cfg.get("tags", tool_data["tags"])
                tool_data["featured"] = cfg.get("featured", tool_data["featured"])
                tool_data["icon"] = cfg.get("icon", tool_data["icon"])
                print(f"📖 [JSON] 成功收割工具: {folder_name}")
                return tool_data
        except Exception:
            print(f"⚠️ [JSON 損毀] 下放至 README 備援: {folder_name}")

    # 2. 次要優先級：智慧解析 README.md (🔴 採用 Python 正規的字串處理)
    target_readme = readme_path if os.path.exists(readme_path) else (readme_path_lc if os.path.exists(readme_path_lc) else None)
    if target_readme:
        try:
            with open(target_readme, "r", encoding="utf-8") as f:
                lines = [l.strip() for l in f.readlines() if l.strip()]
                
                for line in lines:
                    if line.startswith("# "):
                        tool_data["name"] = line.replace("# ", "").strip()
                        break
                
                desc_candidates = [l for l in lines if not l.startswith("#") and not l.startswith("-") and not l.startswith("!")]
                if desc_candidates:
                    tool_data["desc"] = desc_candidates[0]
                    
            print(f"📝 [README] 成功收割工具: {folder_name}")
            return tool_data
        except Exception:
            pass

    print(f"⚙️ [Fallback] 預設還原工具: {folder_name}")
    return tool_data

def main():
    if not os.path.exists(TOL_DIR):
        print(f"❌ 錯誤: 找不到工具庫資料夾 {TOL_DIR}")
        return

    tools_matrix = []
    subdirs = [d for d in os.listdir(TOL_DIR) if os.path.isdir(os.path.join(TOL_DIR, d))]
    
    for folder in sorted(subdirs):
        if folder.startswith('.'):
            continue
        folder_path = os.path.join(TOL_DIR, folder)
        tools_matrix.append(parse_tool_folder(folder, folder_path))

    if not os.path.exists(INDEX_FILE):
        print(f"❌ 錯誤: 找不到主網頁模板 {INDEX_FILE}")
        return

    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        html_content = f.read()

    # 精準正則切入點：比對 const TOOLS = [...]; 區塊
    pattern = r"(const\s+TOOLS\s*=\s*\[)(.*?)(\];)"
    
    # 序列化格式化 JSON 字串，關閉轉碼，完美支援多語系與 Emoji
    serialized_json = json.dumps(tools_matrix, ensure_ascii=False, indent=6)
    json_inner = serialized_json.strip().lstrip("[").rstrip("]")
    
    updated_content = re.sub(pattern, rf"\1\n{json_inner}\n    \3", html_content, flags=re.DOTALL)

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(updated_content)
        
    print(f"🚀 [完全體同步完工] 共計 {len(tools_matrix)} 款工具之實體 Metadata 已安全寫入 index.html。")

if __name__ == "__main__":
    main()
