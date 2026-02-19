<p align="center">
  <a href="https://mobsp.github.io">
    <img src="assets/brand/mobsp-logo.png" alt="Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ | 莫比空間" width="100%">
  </a>
  <br>
  <kbd> 點擊∆圖片探索 Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ ☖ </kbd>
</p>


<p align="center">
  <strong>極簡 ‧ 高效 ‧ 流暢 — 您的全方位數位資源入口</strong>
</p>

<p align="center">
  <a href="https://mobsp.github.io"><img src="https://img.shields.io/website?url=https%3A%2F%2Fmobsp.github.io&label=Live%20Status&style=for-the-badge&color=black" alt="Website Status"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

---

## 🌐 核心服務入口 (Core Services)

<details open>
<summary>點擊查看完整清單</summary>

<div align="left" style="overflow: auto;">
  <table>
    <thead>
      <tr>
        <th nowrap>ℹ️ 服務項目</th>
        <th nowrap>📝 描述</th>
        <th nowrap>📁 目錄檔案</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td nowrap><a href="https://mobsp.github.io"><b>前往首頁 🏠</b></a></td>
        <td nowrap>最新公告與品牌動態</td>
        <td nowrap><a href="./index.html"><code>./index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/blog/"><b>閱讀文章 📝</b></a></td>
        <td nowrap>技術筆記與數位生活紀錄</td>
        <td nowrap><a href="./blog/index.html"><code>./blog/index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/wiki/"><b>查看指南 📚</b></a></td>
        <td nowrap>專案說明與使用者指南</td>
        <td nowrap><a href="./wiki/index.html"><code>./wiki/index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/tol/"><b>使用工具 🛠️</b></a></td>
        <td nowrap>動態驅動的實用開發工具</td>
        <td nowrap><a href="./tol/index.html"><code>./tol/index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/shorts/"><b>短影音頻道 🎵</b></a></td>
        <td nowrap>沈浸式多媒體內容體驗</td>
        <td nowrap><a href="./shorts/index.html"><code>./shorts/index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/data/notice.md"><b>記錄靈感 📒</b></a></td>
        <td nowrap>輕量化系統動態公告</td>
        <td nowrap><a href="./data/notice.md"><code>./data/notice.md</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/assets/icon/viewer/"><b>開始編碼 💻</b></a></td>
        <td nowrap>圖示與組件開發預覽</td>
        <td nowrap><a href="./assets/icon/viewer/index.html"><code>./assets/icon/viewer/index.html</code></a></td>
      </tr>
    </tbody>
  </table>
</div>

</details>

> 💡若屏幕限制🚫,請滑動表格檢視!


---

## 📂 系統資產矩陣 (Asset Matrix)

<details>
<summary>🔍 點擊展開詳細資產清單 (內部開發專用)</summary>

<div align="left" style="overflow: auto;">
  <table>
    <thead>
      <tr>
        <th nowrap>ℹ️ 類型</th>
        <th nowrap>📁 檔案路徑</th>
        <th nowrap>📝 功能說明</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td nowrap><b>Brand Assets</b></td>
        <td nowrap><code>./assets/brand/</code></td>
        <td nowrap><b>莫比空間核心視覺識別系統</b></td>
      </tr>
      <tr>
        <td nowrap><b>Entry (HTML)</b></td>
        <td nowrap><code>./index.html</code>, <code>./blog/</code>, <code>./tol/</code>, <code>./wiki/</code>, <code>./shorts/</code></td>
        <td nowrap>系統各大功能模組的主要入口</td>
      </tr>
      <tr>
        <td nowrap><b>Documentation</b></td>
        <td nowrap><code>./README.md</code>, <code>./data/notice.md</code>, <code>./data/qa.md</code></td>
        <td nowrap>專案說明、系統公告與常見問題</td>
      </tr>
      <tr>
        <td nowrap><b>Logic (JS)</b></td>
        <td nowrap><code>./assets/js/</code></td>
        <td nowrap>驅動 PWA 運行與前端交互邏輯核心</td>
      </tr>
      <tr>
        <td nowrap><b>Data (JSON)</b></td>
        <td nowrap><code>./tol/data.json</code>, <code>./manifest.json</code></td>
        <td nowrap>工具庫數據配置與 Web App 元數據</td>
      </tr>
    </tbody>
  </table>
</div>

</details>

---

## 🏗️ 技術架構 (Architecture)

本專案採用 **Vue.js** 單頁面應用架構，並針對 GitHub Pages 進行靜態優化：

* **🚀 PWA 支持**：提供離線訪問與原生 App 級別的安裝體驗。
* **📊 數據驅動**：工具庫與子頁面高度依賴 JSON 配置，實現「無痛更新」。
* **📱 響應式佈局**：完美兼容手機、平板與桌機顯示。


---

## 📈 搜尋引擎優化 (SEO)
`莫比空間` `Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ` `Mobispace` `資源整合入口` `數位工具庫` `PWA 網頁應用` `資源導航` `莫比部落格`

---

<p align="center">
  © 2024–2026 <strong>Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ (莫比空間)</strong>. All rights reserved.
</p>
