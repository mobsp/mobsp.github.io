# Safari Clone 專案

這是一個完整的 **Safari Clone 瀏覽器模擬器**，使用純前端技術（HTML / CSS / JavaScript）建構，並依照「八大抽屜分類規則」進行模組化拆檔。專案可直接部署在 **GitHub Pages**，提供接近 Safari 的瀏覽器體驗。

---

## 🚀 功能特色

### 基礎模組
- 分頁管理：新增 / 刪除 / 切換 / 拖曳排序
- 工具列：返回、前進、重新整理、URL/搜尋列
- 進度條：載入狀態顯示
- 書籤系統：新增 / 刪除 / 顯示

### 進階模組
- 瀏覽紀錄：自動記錄、搜尋、清除
- 隱私模式：不保存紀錄
- 深色 / 淺色模式切換
- 設定面板：偏好設定（外觀、安全、隱私）
- 下載模擬：下載清單、進度顯示

### 專業模組
- 分頁群組 / 分頁縮圖快照
- 搜尋引擎選擇（Google / Bing / DuckDuckGo）
- 智慧搜尋建議（自動完成）

### 豪華模組
- 開發者工具 (DevTools)：Console 模擬、DOM 檢查、Network 模擬
- 擴充套件 API：允許外部 JS 插件掛載
- 資料同步 (模擬)：書籤與瀏覽紀錄共享
- 安全模組：Cookie 管理、跨域警告、追蹤防護

---

## 📂 專案結構


browser/sf/ ├── index.html ├── README.md ├── .nojekyll └── data/ ├── main/              # 核心金鑰與初始化 ├── theme/             # 主題樣式與動畫 ├── ui-kit/            # DOM 渲染組件 ├── core/              # API 與資料流邏輯 ├── items/             # 純資料 (JSON/MD) ├── media/             # 多媒體資源 ├── sdbx/              # 測試與備份 └── sre/               # 自動化腳本


---

## 🛠 使用方式

1. **Clone 專案**
   ```bash
   git clone https://github.com/你的帳號/safari-clone.git


1. 部署到 GitHub Pages• 進入 Repo 設定
• 啟用 GitHub Pages，選擇 main branch 或指定資料夾
• 網站就會自動部署

2. 開啟瀏覽器• 輸入 GitHub Pages 網址即可使用 Safari Clone



---

🔧 擴充方式

• 新增模組：在 data/ 對應的抽屜目錄下建立新檔案，並在 index.html 引入
• 插件系統：在 data/ui-kit/plugins.js 中註冊新插件
• 主題管理：在 data/theme/theme-engine.js 中擴充顏色方案
• 安全模組：在 data/core/security.js 中加入更多防護邏輯


---

📜 注意事項

• 本專案為 瀏覽器模擬器，不是真正的 Safari。
• 部分網站可能因 CORS 限制無法在 iframe 中載入。
• 下載、同步、Cookie 管理等功能為 模擬，不具備真實瀏覽器能力。
• 請勿將敏感金鑰或 API Key 推送到公開 Repo，建議使用 GitHub Secrets。


---

👨‍💻 作者

• 設計與程式碼：Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ

---
