import os
import re

# 定義要掃描的根目錄（目前設定為腳本所在目錄）
ROOT_DIR = "."

def is_binary_file(file_path):
    """
    透過讀取檔案開頭來判斷是否為二進位檔案（圖片、影片等），
    以確保安全掃描所有副檔名而不毀損多媒體資源。
    """
    try:
        with open(file_path, 'tr', encoding='utf-8') as check_file:
            check_file.read(1024)
            return False
    except UnicodeDecodeError:
        return True

def fix_single_slash_comments(file_path):
    # 排除二進位檔案，保護非文字資源
    if is_binary_file(file_path):
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        # 遇到其他無法讀取的特殊系統檔案則跳過
        return False

    # 📌 核心正則表達式修正邏輯：
    # 尋找行首（可含空格）後方「剛好只有一個斜槓」的情境，並將其替換為雙斜槓
    # `(?<=^\s*)` 確保斜槓前面是行首與任意空格
    # `/(?!/)` 確保這是一個單斜槓，後面沒有緊跟著另一個斜槓（避免將 // 誤變成 ///）
    pattern = r'(?<=^\s*)/(?!/)'
    
    modified_content, count = re.subn(pattern, '//', content, flags=re.MULTILINE)

    if count > 0:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            print(f"⚡ 已修正 ({count} 處): {file_path}")
            return True
        except Exception as e:
            print(f"❌ 無法寫入檔案 {file_path}: {e}")
    return False

def scan_entire_repository():
    print("🔍 開始全盤巡檢儲存庫所有檔案與副檔名...")
    fixed_files_count = 0
    total_files_count = 0

    for root, dirs, files in os.walk(ROOT_DIR):
        # 排除 git 核心版本控制資料夾，避免破壞 Git 紀錄
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            file_path = os.path.join(root, file)
            
            # 排除腳本自身，避免自己進迴圈修自己
            if file == os.path.basename(__file__):
                continue
                
            total_files_count += 1
            if fix_single_slash_comments(file_path):
                fixed_files_count += 1

    print("\n" + "="*40)
    print(f"📊 巡檢完畢！共深度掃描了 {total_files_count} 個檔案（含所有副檔名）。")
    print(f"🛠️  成功修復並還原了 {fixed_files_count} 個檔案的 JS 註解語法！")

if __name__ == "__main__":
    scan_entire_repository()
