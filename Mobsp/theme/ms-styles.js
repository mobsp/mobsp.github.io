/**
 * 模組名稱：ms-style.js (核心樣式與系統邏輯)
 * 功能用途：定義全站設計變數、品牌基因、以及仿原生 iOS 交互邏輯。
 * 修改指南：此檔案為系統基礎，如需更換色彩模式或調整基礎間距，請在此統一修改。
 */

const style = document.createElement('style'); / 創建 style 標籤以注入全域 CSS
style.textContent = `
  :root {
    /* --- 1. 深度色彩系統 (Extended Color System) --- */
    --bg-primary: #F2F2F7;         /* 頁面底層背景 */
    --bg-secondary: #FFFFFF;       /* 卡片/容器背景 */
    --accent-base: #007AFF;        /* 核心操作強調色 */
    --text-primary: #000000;       /* 標題文字 */
    --text-secondary: #3C3C43;     /* 輔助/內文文字 */
    --glass-bg: rgba(255,255,255,0.7); /* 液態玻璃底色 */
    --border-color: rgba(0,0,0,0.1);    /* 細微邊線 */

    /* --- 2. 精確排版尺度 (Modular Scale 1.250) --- */
    /* 功能用途：確保字體大小具有數學層次感，修改尺規需同步調整行高 */
    --font-stack: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    --h1-size: 34px; --h1-lh: 41px;
    --h2-size: 28px; --h2-lh: 34px;
    --body-size: 17px; --body-lh: 24px;
    --note-size: 13px; --note-lh: 18px;

    /* --- 3. 物理屬性 (Geometry Tokens) --- */
    /* 功能用途：定義仿 iOS 的曲率與密度，修改此處影響全站元件形狀 */
    --r-sm: 8px;   --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
    --s-xs: 4px;   --s-sm: 8px;  --s-md: 16px; --s-lg: 24px; --s-xl: 32px;
    
    /* --- 4. 視覺特效與動畫曲線 --- */
    --blur-intensity: blur(20px) saturate(180%);
    --transition-ios: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  /* --- 5. 深色模式切換 (Dark Mode Logic) --- */
  [data-theme='dark'] {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --text-primary: #FFFFFF;
    --text-secondary: #98989D;
    --glass-bg: rgba(28,28,30,0.75);
    --border-color: rgba(255,255,255,0.1);
  }

  /* --- 6. 強制系統規範 (System Protection) --- */
  body {
    margin: 0;
    font-family: var(--font-stack);
    background-color: var(--bg-primary);
    -webkit-touch-callout: none;          /* 禁止 iOS 原生選單 */
    -webkit-tap-highlight-color: transparent; /* 移除點擊閃爍 */
    overscroll-behavior-y: contain;       /* 禁止頁面邊緣拉扯晃動 */
    touch-action: pan-y;                  /* 鎖定垂直滑動 */
    padding-top: env(safe-area-inset-top);    /* iOS 安全區適配 */
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* --- 7. 液態玻璃效果 (Liquid Glass Formula) --- */
  .glass-effect {
    background: var(--glass-bg);
    backdrop-filter: var(--blur-intensity);
    -webkit-backdrop-filter: var(--blur-intensity);
    border: 1px solid var(--border-color);
    border-radius: var(--r-lg);
  }

  /* --- 8. 狀態變體邏輯 (Interaction States) --- */
  .interactive:active {
    transform: scale(0.98);               /* 按壓縮放回饋 */
    opacity: 0.8;                         /* 按壓透明度變化 */
    transition: transform 0.1s var(--transition-ios);
  }
`;

document.head.appendChild(style); / 執行注入
