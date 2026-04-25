# 📦 服務入口矩陣模組 (Grid Slider Module)
> **專案：** Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ (莫比空間)
> **位置：** beta/mod/grid-slider.js
> 
這是為 **Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ** 打造的專屬服務入口組件。採用原生 Web Component 技術，實現了 CSS 樣式隔離與 iOS 風格的互動體驗，適合用於展示數位資源導航。
## 🚀 快速掛載說明
只需兩步即可在任何網頁中使用：
 1. **引入模組：**
   在 HTML 的 <head> 或 <body> 結尾處加入：
   ```html
   <script src="./beta/mod/grid-slider.js" defer></script>
   
   ```
 2. **放置標籤：**
   在您想顯示矩陣的地方加入：
   ```html
   <mobspace-service-grid></mobspace-service-grid>
   
   ```
## 🛠️ 維護與配置指南
所有的核心設定都集中在 grid-slider.js 的前段，方便您「白話式」修改：
### 1. 管理服務清單 (Data Services)
修改 constructor() 內的 this.services 陣列。
 * **修改位置：** 約第 18 行。
 * **參數重點：**
   * id: 唯一識別碼，用於設定跳轉邏輯。
   * name: 圖標下方的顯示文字。
   * icon: 支援 Emoji 或 <img src="...">。
   * isPinned: true 會顯示在首頁；false 僅出現在「顯示全部」彈窗中。
   * badge: true 會顯示右上角通知紅點。
### 2. 視覺樣式自定義 (UI Styling)
修改 getStyles() 內的 CSS 變數。
 * **修改位置：** 約第 46 行。
 * **常用變數：**
   * --bg-color: 背景顏色（預設 iOS 深黑模式）。
   * --text-color: 主標題文字顏色。
   * --sub-text: 圖標名稱與副標題顏色。
   * --icon-bg: 圖標圓圈底色。
### 3. 設定跳轉連結 (Interaction)
修改 bindEvents() 內的點擊監聽器。
 * **修改位置：** 約第 190 行。
 * **範例：**
   ```javascript
   if (serviceId === '1') {
     window.open('https://your-link.com', '_blank');
   }
   
   ```
## ✨ 內建高級特性 (iOS Experience)
本模組已預先配置以下細節，確保具備 App 質感：
 * **滾動鎖定：** 彈窗開啟時，背景網頁會暫時鎖定，防止畫面亂動。
 * **按壓反饋：** 點擊圖標時會有微縮小的縮放效果。
 * **手機優化：** 移除了移動裝置常見的點擊藍框。
 * **組件隔離：** 使用 Shadow DOM 技術，確保本組件的樣式不會弄亂網站其他地方。
## 🏗️ 擴充可能性 (25% 成長空間)
 1. **動態讀取：** 未來可改為從外部 JSON 檔載入服務資料。
 2. **SVG 展示牆：** 可將 icon 欄位替換為 SVG 原始碼以提升視覺精細度。
 3. **雲端管理：** 配合 GitHub Actions，可實現全自動化的服務清單更新。
**部長小提醒：** 修改 grid-slider.js 後，請務必重新整理瀏覽器。如果標籤沒有正確顯示，請檢查 HTML 中的檔案路徑是否正確指向 beta/mod/ 資料夾。
