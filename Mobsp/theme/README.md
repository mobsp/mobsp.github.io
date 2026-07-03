### <ms-button.js>

按鈕變體與使用定義表
透過設定 <ms-button> 的 variant 和 shape 屬性，快速調用不同的按鈕設計：
| 類型 | 屬性標記 | 視覺用途 | 互動建議 |
|---|---|---|---|
| **Primary** | variant="primary" | 頁面主要行動 (如：送出、保存) | 僅限一個頁面存在一個主按鈕 |
| **Glass** | variant="glass" | 列表項、浮動工具列 | 適用於毛玻璃背景區塊 |
| **Ghost** | variant="ghost" | 次要連結、取消操作 | 用於減輕視覺負擔 |
| **Danger** | variant="danger" | 刪除、登出、關鍵清除 | 需配合確認彈窗機制 |
| **Pill Shape** | shape="pill" | 分類標籤、膠囊按鈕 | 適用於圓潤視覺風格 |

### 如何在HTML 中直接使用
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



## <ms-input> 

核心設計定義 (Design Specifications)
輸入框的「極致 SSS 等級」體現在以下維度：
 * **觸覺反饋 (Haptic Feel)：** 聚焦時的邊框緩衝與動畫平滑度。
 * **iOS 軟鍵盤適配：** 確保輸入時不會因系統鍵盤彈出而遮擋輸入框 (透過 scrollIntoView 邏輯)。
 * **語義化狀態：** 區分 正常、輸入中 (Focus)、錯誤 (Error)、成功 (Success)、禁用 (Disabled) 五種狀態。
 * **排版細節：** 標籤位移 (Floating Label) 與 iOS 慣用的「清空」按鈕邏輯。



### 輸入框變體與屬性表 (Variants & States)
這套系統提供極細緻的控制，讓你在「Serverless CMS」編輯後台中使用：
| 變體類型 | 屬性標記 | 設計定義定義 | 維運細節 |
|---|---|---|---|
| **標準版** | 預設 | 純白/深灰背景，具邊框 | 適用於所有表單填寫 |
| **玻璃版** | glass | 毛玻璃底色，邊緣透視 | 適用於頂部搜尋欄、懸浮介面 |
| **錯誤狀態** | error | 邊框轉紅，觸發震動 | 綁定後端的驗證回饋 |
| **密碼/Email** | type | 支援原生輸入屬性 | 繼承自標準版 HTML input |

### 極致細節維運指南
為了讓 ms-input 元件達到 SSS 等級，建議後續加入以下**「自動化邏輯」**：
 1. **自動聚焦邏輯 (Auto-focusing)：** 在 JS 中加入 this.shadowRoot.querySelector('input').focus()，當彈窗出現時自動觸發，增加順滑感。
 2. **防誤觸偵測 (Anti-mis-tap)：** 若使用者在輸入框外快速滑動，加入 blur() 監聽器，強制隱藏軟鍵盤，這會讓網頁體驗更像原生 App。
 3. **邊框變色系統：** 在 ms-styles.js 定義變數 --state-error 與 --state-success，並在此模組中呼叫，這樣當全站主題變更時，警告訊息的紅顏色也會自動跟著調整，不需要手動去每個模組找顏色碼。


<ms-badge.js>

標籤（Badge）在 iOS 系統中不僅是資訊的「載體」，更是視覺導引的核心。為了達到 SSS 等級，我們將標籤系統設計為一個**動態語義系統**。

### 設計定義與邏輯 (Design Specification)
我們將標籤分為兩大陣營：**「狀態型標籤 (Status Badge)」** 與 **「分類型標籤 (Category Tag)」**。
 * **物理行為：** 標籤應具備輕微的 transition，在選取時應有細微的縮放 (scale) 回饋。
 * **字體與排版：** 使用嚴格的 SF Pro 粗體 (Semibold)，配合極小的字間距 (letter-spacing: 0.02em) 以維持高階感。
 * **語義變體：** 必須包含：預設、成功、警告、錯誤、強調、透明。

### 標籤類型詳細定義表 (Badge Variants)
| 類型 | 屬性標記 | 視覺定義 | 應用場景 |
|---|---|---|---|
| **Neutral** | variant="neutral" | 淺灰背景，暗灰文字 | 顯示資訊次要類別 |
| **Accent** | variant="accent" | 品牌色底，白字 | 頁面主要標籤、新功能標示 |
| **Glass** | variant="glass" | 半透明毛玻璃底，高階質感 | 懸浮於圖片上的標籤 |
| **Success** | variant="success" | 系統綠色底 | 完成狀態、已發布、已完成 |
| **Warning** | variant="warning" | 系統橘色底 | 審核中、待處理、過期提醒 |
| **Error** | variant="error" | 系統紅色底 | 錯誤通知、失敗狀態、禁權 |

### 進階維運邏輯與細節說明
 * **自動化語義 (Semantic Automation)：** 建議在你的 CMS 後端對應時，將 API 返回的狀態欄位 (如 status: 'published') 自動轉換為對應的標籤屬性 (variant="success")。
 * **防誤觸 (Tap Target)：** 若標籤作為濾鏡使用（可點擊），應在 m-badge.js 的 connectedCallback 中偵測 onclick 事件，並自動增加 cursor: pointer 與 .interactive 樣式。
 * **動態縮放處理：** 標籤內的文字若過長，我們設定了 white-space: nowrap，建議在 m-ui-base.js 定義一個 @media 查詢，當螢幕極小時，將標籤內距自動縮減 (padding: 2px 6px)，以防止內容溢出。
