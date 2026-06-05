# file-list

Mobsp repo 的行動版檔案入口站。

## 特色

- 深色 App 式首頁
- 手機優先
- 所有連結清單
- 即時搜尋
- 排序
- 卡片 / 緊湊 / 表格切換
- 資料夾 / 類型 / 風險篩選
- 圖檔 / 音訊 / 影片勾選控制
- 詳情頁
- 原始碼檢視
- 本地臨時編輯
- 下載編輯結果
- GitHub 檢視 / GitHub 編輯跳轉
- 收藏
- PWA / 離線頁

## 結構

```text
file-list/
├─ index.html
├─ all-links.html
├─ detail.html
├─ saved.html
├─ settings.html
├─ offline.html
├─ manifest.json
├─ sw.js
├─ assets/
│  ├─ css/
│  │  ├─ base.css
│  │  └─ theme-mobsp-blog.css
│  └─ js/
│     ├─ app.js
│     ├─ index.js
│     ├─ all-links.js
│     ├─ detail.js
│     ├─ saved.js
│     └─ settings.js
├─ data/
│  └─ files.json
└─ scripts/
   ├─ generate_files_json.py
   └─ sync_from_repo.py