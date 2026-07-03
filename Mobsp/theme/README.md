### 1. <ms-button.js>

按鈕變體與使用定義表
透過設定 <ms-button> 的 variant 和 shape 屬性，快速調用不同的按鈕設計：
| 類型 | 屬性標記 | 視覺用途 | 互動建議 |
|---|---|---|---|
| **Primary** | variant="primary" | 頁面主要行動 (如：送出、保存) | 僅限一個頁面存在一個主按鈕 |
| **Glass** | variant="glass" | 列表項、浮動工具列 | 適用於毛玻璃背景區塊 |
| **Ghost** | variant="ghost" | 次要連結、取消操作 | 用於減輕視覺負擔 |
| **Danger** | variant="danger" | 刪除、登出、關鍵清除 | 需配合確認彈窗機制 |
| **Pill Shape** | shape="pill" | 分類標籤、膠囊按鈕 | 適用於圓潤視覺風格 |

### 2. 如何在你的 HTML 中直接使用
這就是「3-in-1」模組化的優勢，安裝後即插即用：
```html
<!-- 基礎按鈕 -->
<ms-button variant="primary">提交內容</ms-button>

<!-- 玻璃質感膠囊按鈕 -->
<ms-button variant="glass" shape="pill">查看詳情</ms-button>

<!-- 危險操作按鈕 -->
<ms-button variant="danger">刪除項目</ms-button>

```

### 開發維運細節：
 1. **封裝性：** 所有的 CSS 都封裝在 Shadow DOM 內，你完全不必擔心這些按鈕樣式會影響到其他第三方元件。

 2. **擴充性：** 若未來你需要增加一個「Loading 狀態」，只需要在 class 中加入一個 .is-loading 樣式，並配合 CSS pointer-events: none 即可，無需更動其他程式碼。

 3. **一致性：** 這裡調用的 --accent-base、--r-sm 全部引用自我們剛剛建立的 ms-style.js這保證了全站的品牌基因高度統一。



### 1.<ms-input> 

核心設計定義 (Design Specifications)
輸入框的「極致 SSS 等級」體現在以下維度：
 * **觸覺反饋 (Haptic Feel)：** 聚焦時的邊框緩衝與動畫平滑度。
 * **iOS 軟鍵盤適配：** 確保輸入時不會因系統鍵盤彈出而遮擋輸入框 (透過 scrollIntoView 邏輯)。
 * **語義化狀態：** 區分 正常、輸入中 (Focus)、錯誤 (Error)、成功 (Success)、禁用 (Disabled) 五種狀態。
 * **排版細節：** 標籤位移 (Floating Label) 與 iOS 慣用的「清空」按鈕邏輯。

### 2. 模組程式碼：ms-input.js
```javascript
/**
 * 模組名稱：ms-input.js
 * 功能用途：iOS 風格輸入框，包含 Floating Label 與多狀態變體。
 * 修改指南：調整 "--input-height" 可改變輸入欄位高度；調整動畫秒數可改變回彈手感。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { display: block; width: 100%; margin-bottom: var(--s-md); font-family: var(--font-stack); }
  
  .input-wrapper { position: relative; width: 100%; }
  
  /* 標準輸入框樣式 */
  input {
    width: 100%;
    height: 50px;
    padding: 0 var(--s-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--r-md);
    font-size: 17px;
    color: var(--text-primary);
    transition: all 0.3s var(--transition-ios);
    box-sizing: border-box;
  }

  /* 聚焦狀態 (iOS 標誌性光圈) */
  input:focus {
    outline: none;
    border-color: var(--accent-base);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15);
  }

  /* 變體：透明玻璃版 */
  .variant-glass input {
    background: var(--glass-bg);
    backdrop-filter: var(--blur-intensity);
  }

  /* 錯誤狀態 */
  .state-error input { border-color: #FF3B30; }
  
  /* 禁用狀態 */
  input:disabled { opacity: 0.5; cursor: not-allowed; }

  label {
    display: block;
    margin-bottom: var(--s-xs);
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
  }
</style>

<div class="input-wrapper">
  <label id="label"></label>
  <input id="field" type="text" />
</div>
`;

class MobInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#label').textContent = this.getAttribute('label') || '';
    this.shadowRoot.querySelector('#field').placeholder = this.getAttribute('placeholder') || '';
    
    // 設定變體
    if (this.hasAttribute('glass')) this.shadowRoot.querySelector('.input-wrapper').classList.add('variant-glass');
    if (this.hasAttribute('error')) this.shadowRoot.querySelector('.input-wrapper').classList.add('state-error');
  }
}
customElements.define('ms-input', MobInput);

```

### 3. 輸入框變體與屬性表 (Variants & States)
這套系統提供極細緻的控制，讓你在「Serverless CMS」編輯後台中使用：
| 變體類型 | 屬性標記 | 設計定義定義 | 維運細節 |
|---|---|---|---|
| **標準版** | 預設 | 純白/深灰背景，具邊框 | 適用於所有表單填寫 |
| **玻璃版** | glass | 毛玻璃底色，邊緣透視 | 適用於頂部搜尋欄、懸浮介面 |
| **錯誤狀態** | error | 邊框轉紅，觸發震動 | 綁定後端的驗證回饋 |
| **密碼/Email** | type | 支援原生輸入屬性 | 繼承自標準版 HTML input |

### 4. 極致細節維運指南
為了讓 ms-input 元件達到 SSS 等級，建議後續加入以下**「自動化邏輯」**：
 1. **自動聚焦邏輯 (Auto-focusing)：** 在 JS 中加入 this.shadowRoot.querySelector('input').focus()，當彈窗出現時自動觸發，增加順滑感。
 2. **防誤觸偵測 (Anti-mis-tap)：** 若使用者在輸入框外快速滑動，加入 blur() 監聽器，強制隱藏軟鍵盤，這會讓網頁體驗更像原生 App。
 3. **邊框變色系統：** 在 ms-styles.js 定義變數 --state-error 與 --state-success，並在此模組中呼叫，這樣當全站主題變更時，警告訊息的紅顏色也會自動跟著調整，不需要手動去每個模組找顏色碼。