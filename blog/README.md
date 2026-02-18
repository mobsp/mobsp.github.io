<p align="center">
  <img src="https://files.catbox.moe/7dymq1.PNG" alt="Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ Logo" width="220">
</p>

<h1 align="center">莫比空間 Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ</h1>

<p align="center">
  <strong>極簡 ‧ 高效 ‧ 流暢 — 您的全方位數位資源入口</strong>
</p>

<p align="center">
  <a href="https://mobsp.github.io"><img src="https://img.shields.io/website?url=https%3A%2F%2Fmobsp.github.io&label=Live%20Status&style=for-the-badge&color=black" alt="Website Status"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

---


> 🚀 任意門 ： [ Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ 官方服務總網](https://mobsp.github.io)

---

## 🌐 核心服務入口 (Core Services)

<details>
<summary>🔽點擊查看完整清單</summary>

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
        <td nowrap><a href="https://mobsp.github.io/p/#wiki"><b>查看指南 📚</b></a></td>
        <td nowrap>專案說明與使用者指南</td>
        <td nowrap><a href="./p/#wiki"><code>./p/#wiki</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/tol/"><b>使用工具 🛠️</b></a></td>
        <td nowrap>動態驅動的實用開發工具</td>
        <td nowrap><a href="./tol/index.html"><code>./tol/index.html</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/p/#Music"><b>開啟頻道 🎵</b></a></td>
        <td nowrap>沈浸式線上音樂體驗</td>
        <td nowrap><a href="./p/#Music"><code>./p/#Music</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/p/#Keep"><b>記錄靈感 📒</b></a></td>
        <td nowrap>輕量化雲端靈感記錄</td>
        <td nowrap><a href="./p/#Keep"><code>./p/#Keep</code></a></td>
      </tr>
      <tr>
        <td nowrap><a href="https://mobsp.github.io/p/#Editor"><b>開始編碼 💻</b></a></td>
        <td nowrap>即時預覽代碼與內容</td>
        <td nowrap><a href="./p/#Editor"><code>./p/#Editor</code></a></td>
      </tr>
    </tbody>
  </table>
</div>

</details>

> 💡 **小提示**：如畫面太窄，請左右滑動表格查看完整資訊。


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
        <td nowrap><code>./assets/logo.png</code></td>
        <td nowrap><b>莫比空間官方 Logo (核心識別)</b></td>
      </tr>
      <tr>
        <td nowrap><b>Entry (HTML)</b></td>
        <td nowrap><code>./index.html</code>, <code>./blog/index.html</code>, <code>./tol/index.html</code>, <code>./p/index.html</code></td>
        <td nowrap>各大模組的主要入口頁面</td>
      </tr>
      <tr>
        <td nowrap><b>Documentation</b></td>
        <td nowrap><code>./README.md</code>, <code>./data/notice.md</code></td>
        <td nowrap>專案說明與系統動態公告</td>
      </tr>
      <tr>
        <td nowrap><b>Logic (JS)</b></td>
        <td nowrap><code>/assets/js/</code></td>
        <td nowrap>驅動 SPA 切換與 PWA 運行的邏輯</td>
      </tr>
      <tr>
        <td nowrap><b>Data (JSON)</b></td>
        <td nowrap><code>./tol/data.json</code>, <code>./p/sub.json</code></td>
        <td nowrap>工具庫與子頁面配置的數據核心</td>
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
