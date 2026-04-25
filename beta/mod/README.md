# 📱 Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ 專用：
服務入口模組使用手冊
> **檔案名稱：** grid-slider.js
> **功能描述：** 像 LINE 一樣的「服務矩陣」區塊，包含首頁快捷鍵與「顯示全部」的彈出式清單。
> 
## 🛠 第一步：如何掛載到網站上？
這是一個「隨插即用」的模組，您只需要做兩件事：
 1. **放檔案：** 把 grid-slider.js 丟進您的專案資料夾（例如 /js/ 資料夾）。
 2. **寫標籤：** 在您的 HTML 檔案中，像寫 <div> 一樣寫下這兩行：
   ```html
   <script src="./js/grid-slider.js" defer></script>
   
   <mobspace-service-grid></mobspace-service-grid>
   
   ```
## 🎨 第二步：視覺裝修（改顏色、改風格）
如果您覺得現在的顏色太暗或太亮，請打開 grid-slider.js 找到 **第 46 行** 附近的 getStyles()。
| 項目 | 變數名稱 | 說明 |
|---|---|---|
| **背景顏色** | --bg-color | 整個區塊的底色（目前是 iOS 深黑模式）。 |
| **圖標底圓** | --icon-bg | Icon 下面那顆圓圈的顏色。 |
| **文字顏色** | --text-color | 標題「服務」的顏色。 |
| **副文字色** | --sub-text | 圖標名稱與「顯示全部」的顏色（建議淺灰色）。 |
| **紅點顏色** | --badge-color | 有新訊息時那個紅點的顏色（預設正紅色）。 |
## 📝 第三步：管理服務清單（增刪圖標）
這是您最常動到的地方。請找到檔案中 **第 14 行** 的 this.services。
每個服務都長這樣，您可以自己複製貼上來增加新功能：
```javascript
{ 
  id: '1',           // [不可重複] 就像身分證字號
  name: '貼圖小舖',   // [顯示名稱] 圖標下方的文字
  icon: '🙂',        // [圖標內容] 可以是 Emoji，或換成 <img src="圖片網址">
  isPinned: true,    // [首頁顯示] true 會出現在外面；false 則要點「顯示全部」才看得到
  badge: true        // [紅點提醒] true 會出現紅點；false 則消失
}

```
## 🔗 第四步：點了要跳去哪？（設定連結）
目前點擊圖標只會「印出文字」。如果您要讓它點了會開網頁，請到 **第 151 行** 附近的 bindEvents()：
**修改範例：**
```javascript
// 找到這段程式碼，依照 ID 設定您的連結
items.forEach(item => {
  item.addEventListener('click', (e) => {
    const serviceId = e.currentTarget.dataset.id;
    
    if (serviceId === '1') {
      window.open('https://your-blog-url.com', '_blank'); // 跳到您的部落格
    }
    if (serviceId === '2') {
      window.location.href = './tools.html'; // 跳到站內的工具頁面
    }
  });
});

```
## 🚀 未來升級（那 25% 的想像空間）
這份模組設計師留了優化空間，可以隨時升級：
 1. **換成圖片：** 只要把 icon 裡的 🙂 換成 <img src="icon.svg">，它就變成專業的展示牆。
 2. **自動更新：** 以後您可以讓這支 JS 去讀取您的 GitHub API，只要您在 GitHub 更新一個檔案，網站的服務圖標就自動換掉，不用改這支程式碼。
**小提醒：**
 * 檔案最後一行的 mobspace-service-grid 就是在 HTML 用的「標籤名」。
 * 如果發現畫面沒出來，請先檢查瀏覽器按 F12 看看是不是 grid-slider.js 的**路徑**寫錯了。

