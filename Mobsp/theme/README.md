### 1. 按鈕變體與使用定義表
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
