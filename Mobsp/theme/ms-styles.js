/**
 * 模組名稱：m-ui-base.js (核心樣式與系統邏輯)
 * 功能用途：定義全站設計變數、品牌基因、以及仿原生 iOS 交互邏輯。
 * 修改指南：此檔案為系統基礎，如需更換色彩模式或調整基礎間距，請在此統一修改。
 */

const style = document.createElement('style'); / 創建 style 標籤以注入全域 CSS
style.textContent = `
  :root {
    /* --- 1. 色彩系統 (Semantic Colors) --- */
    /* 修改指南：調整這裡的 HEX 值，即可改變全站品牌色調 */
    --bg-primary: #F2F2F7;         /* 全站主背景色 */
    --bg-secondary: #FFFFFF;       /* 卡片/元件背景色 */
    --accent-base: #007AFF;        /* 品牌強調色 (連結/按鈕) */
    --text-primary: #000000;       /* 標題與主要文字 */
    --text-secondary: #3C3C43;     /* 輔助性說明文字 */
    --glass-bg: rgba(255, 255, 255, 0.7); /* 液態玻璃底色 */
    --border-color: rgba(0, 0, 0, 0.1);   /* 細微元件分隔線 */

    /* --- 2. 幾何屬性 (Geometry Tokens) --- */
    /* 修改指南：調整圓角或間距數值以改變視覺密度 */
    --radius-md: 16px;             /* 標準卡片圓角 */
    --s-md: 16px;                  /* 標準 UI 內距 */
    
    /* --- 3. 視覺特效 (Effect Tokens) --- */
    /* 功能用途：定義 iOS 風格的 blur 強度與動畫曲線 */
    --blur-intensity: blur(20px) saturate(180%);
    --transition-ios: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  /* --- 4. 深色模式切換 (Dark Mode Logic) --- */
  /* 功能用途：當 body 擁有 data-theme="dark" 時觸發顏色翻轉 */
  [data-theme='dark'] {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --text-primary: #FFFFFF;
    --text-secondary: #98989D;
    --glass-bg: rgba(28, 28, 30, 0.75);
    --border-color: rgba(255, 255, 255, 0.1);
  }

  /* --- 5. 核心防護邏輯 (System Protection) --- */
  /* 功能用途：強制鎖定頁面行為，實現仿原生 APP 體驗 */
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    background-color: var(--bg-primary);
    -webkit-touch-callout: none;          /* 停用原生長按選單，防止誤操作 */
    -webkit-tap-highlight-color: transparent; /* 移除點擊瞬間的藍色遮罩 */
    overscroll-behavior-y: contain;       /* 防止下拉刷新導致頁面晃動 */
    touch-action: pan-y;                  /* 限制手勢僅能垂直滑動 */
  }

  /* --- 6. 玻璃特效類 (Utility Class) --- */
  /* 功能用途：套用此 class 即可獲得液態玻璃視覺效果 */
  .glass-effect {
    background: var(--glass-bg);
    backdrop-filter: var(--blur-intensity);
    -webkit-backdrop-filter: var(--blur-intensity);
    border: 1px solid var(--border-color);
  }

  /* --- 7. 元件互動狀態 (Interaction States) --- */
  /* 功能用途：模擬物理按壓回饋，增加 UI 互動感 */
  .interactive:active {
    transform: scale(0.98);               /* 輕微縮放模擬按下物理感 */
    opacity: 0.8;                         /* 按下時降低透明度 */
    transition: transform 0.1s var(--transition-ios);
  }
`;

/ 將定義好的樣式表掛載到頁面 <head> 中
document.head.appendChild(style);

/ 備註：此模組初始化後，後續元件可直接使用 CSS 變數（如 var(--accent-base)）進行設計
