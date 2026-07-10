# Rumors Platform v4.0

Next-Generation Hybrid Web Application, designed with strict iOS & LINE App UI/UX principles.

## 🌟 核心理念 (Core Concept)

「無限逼近原生 iOS App 體驗的 Web Application」

本專案拒絕將就於傳統網頁的操作手感。透過精心調配的 CSS Backdrop-filter、PWA 系統、手勢引擎 (Gesture Engine) 與 iOS 動態字體排版 (Typography)，在瀏覽器中建構出等同原生 App 的滑順體驗。

**⚠️ 技術聲明：本專案完全由純代碼撰寫與架構建置，內部沒有使用任何 AI API、LLM 推論或依賴第三方機器學習服務。**

## 🏗 三模式架構 (Multi-Runtime Architecture)

為了適應不同的部署需求與安全級別，本系統內建 `ModeEngine` 進行動態切換：

1. **Mode A: GitHub Native Edition (預設)**
   - 僅依賴 GitHub Pages 與 GitHub Actions。
   - 使用靜態 JSON (`/data/*.json`) 作為 Database。
   - 完全無後端，透過 Service Worker 提供極致快取。

2. **Mode B: Backend Supported Edition**
   - 整合外部 GraphQL API 與授權驗證 (JWT/OAuth)。
   - 啟用真實的會員層級 (Membership Tiers) 與私人內容防護。
   - 提供完整的 CMS 與 Dashboard 功能。

3. **Mode C: Hybrid Fusion Edition**
   - 公開靜態內容走 Mode A 以節省 Server 資源。
   - 私密與即時操作 (如 Chat) 走 Mode B 的 API。

## 🚀 部署指南 (Deployment Guide)

### 準備作業
1. 將本專案存放於 `mobsp.github.io` 儲存庫。
2. 確保資料夾路徑位於 `/rumors/` 底下。

### GitHub Actions 自動部署
專案已內建 `.github/workflows/deploy.yml`。
當程式碼推送到 `main` 分支時：
- CI 會自動進行基礎安全掃描 (XSS Guard)。
- 將資料夾打包，透過 GitHub Pages 進行發布。
- 最終網址：`https://mobsp.github.io/rumors/`

### 模式切換
修改 `config/backend-mode.json` 中的 `active_mode` 即可瞬間切換系統運作架構。

## 🎨 UI/UX 設計系統 (Liquid Glass)

- **Tokens (`tokens.css`)**: 遵循 Apple Human Interface Guidelines 制定。包含 System Colors、Dynamic Typography、Safe AreaInsets。
- **Components**: 包含 Navigation Bar、Tab Bar、Modal Sheet 等，皆支援深色模式 (Dark Mode) 自動切換與無縫動畫回饋。


<div align="center">
<img src="./assets/brand/logo.svg" width="160" alt="Rumors Platform Logo">

Rumors Platform v4.0

Next-Generation Hybrid Web Application Platform

Build once. Deploy anywhere.
GitHub Native • Backend • Hybrid Runtime

<p>
</p>
</div>

⸻

📖 Introduction

Rumors Platform 是一套以 GitHub Pages 為核心打造的次世代 Hybrid Web Application Platform。

專案以 原生 Web 技術 為基礎，透過模組化架構、Design System、Runtime Engine 與 Progressive Web App（PWA），建構具有高度可維護性、可擴充性與接近原生 App 體驗的網站平台。

專案支援三種執行模式，可依部署需求於 GitHub Native、Backend Supported 與 Hybrid Fusion 之間切換，而無須重新設計整體架構。

技術聲明

本專案不使用任何 AI API、LLM 或第三方生成式 AI 技術。所有功能皆以 HTML、CSS、JavaScript、JSON、GitHub Actions 與標準 Web API 建構。

⸻

🎯 Project Vision

Rumors Platform 的目標並非建立一個普通網站，而是打造一套可長期演進的 Web Application Platform。

核心理念包括：

* 建立接近原生 App 的操作體驗。
* 建立可持續維護的大型前端架構。
* 建立可自由切換部署模式的 Runtime 平台。
* 建立一致且可重複使用的 Design System。
* 建立可從個人網站逐步演進至大型平台的基礎架構。

⸻

✨ Highlights

* Modular Architecture
* Multi-Runtime Platform
* Progressive Web App
* GitHub Native First
* Optional Backend Integration
* Liquid Glass Design System
* Mobile First UI
* Runtime Mode Switching
* CMS & Dashboard
* Membership & RBAC
* GitHub Actions CI/CD
* Theme Engine
* Security Engine
* Offline Ready

⸻

🚀 Key Features

Platform

* Hybrid Web Application Platform
* GitHub Native Architecture
* Backend Supported Architecture
* Hybrid Fusion Runtime
* Runtime Mode Switching

User Experience

* Mobile First
* Responsive Layout
* Native App Like Experience
* Touch Friendly Interface
* Dark / Light / OLED Theme
* Smooth Animation
* Safe Area Support

Core Systems

* Runtime Engine
* Feature Engine
* Theme Engine
* Permission Engine
* Security Engine
* Deployment Engine

Application Features

* CMS
* Dashboard
* Search
* Notifications
* Settings
* Membership
* RBAC
* Offline Support

⸻

🏛 Architecture Overview

Rumors Platform 採用模組化分層架構。

User
 │
 ▼
App Shell
 │
 ▼
Runtime Engine
 │
 ├── Mode Engine
 ├── Theme Engine
 ├── Feature Engine
 ├── Permission Engine
 └── Security Engine
 │
 ▼
Service Layer
 │
 ▼
Provider Layer
 │
 ├── GitHub
 ├── Backend
 └── Hybrid
 │
 ▼
Data Source

UI、資料來源、部署方式彼此解耦，使整個平台更容易維護與擴充。

⸻

🔄 Runtime Modes

Rumors Platform 提供三種執行模式，可依不同需求切換。

Mode	說明	適用情境
Mode A	GitHub Native Edition	個人網站、Blog、Wiki、工具網站
Mode B	Backend Supported Edition	會員平台、CMS、商業系統
Mode C	Hybrid Fusion Edition	公開內容 + 私有服務並存

Mode A

完全以 GitHub Pages 為核心，搭配 GitHub Actions、JSON 與 Service Worker 建立低成本、高效率的部署架構。

Mode B

導入 Backend、REST API、GraphQL、Authentication 與 Database，提供完整會員與資料管理能力。

Mode C

推薦使用模式。

公開內容使用 GitHub Pages，會員與私有資料透過 Backend 提供，由 Runtime Engine 自動整合。

⸻

⚙ Technology Stack

Category	Technology
Frontend	HTML5、CSS3、JavaScript ES Modules
Data	JSON
Runtime	Browser
PWA	Manifest + Service Worker
CI/CD	GitHub Actions
Hosting	GitHub Pages
Optional API	REST API、GraphQL
Optional Backend	相容於 Runtime Provider 的後端服務

⸻

📌 Project Position

Rumors Platform 不只是：

* Blog
* Wiki
* CMS
* Landing Page

而是一套：

* Progressive Web Application Platform
* Modular Frontend Architecture
* Runtime Switch Platform
* GitHub Native Platform
* Design System Platform
* Hybrid Deployment Platform

它以單一程式碼基礎，支援不同規模與不同部署模式的應用情境。

⸻

📁 Project Structure

Rumors Platform 採用 Modular Architecture（模組化架構），所有功能皆以「低耦合、高內聚」為設計原則。

每個資料夾皆具有單一職責，可獨立維護、擴充與測試。

mobsp.github.io/
└── rumors/
    ├── config/
    ├── assets/
    ├── css/
    ├── js/
    ├── providers/
    ├── data/
    ├── api/
    ├── components/
    ├── cms/
    ├── dashboard/
    ├── scripts/
    ├── docs/
    └── .github/

Directory	Purpose
config/	系統設定、Runtime、功能開關、安全與主題設定
assets/	Logo、Icons、Images、Fonts、Media
css/	Design System、Layout、Components、Themes
js/	Core、Engines、Services、Security
providers/	GitHub、Backend、Hybrid Provider
data/	JSON 資料來源
api/	GraphQL Schema、Queries、Mutations（選配）
components/	可重複使用的 UI 元件
cms/	Content Management System
dashboard/	管理後台
scripts/	Build、Validate、Deploy 工具
docs/	完整技術文件
.github/	GitHub Actions Workflow

⸻

🎨 Design System

Rumors Platform 建立於統一的 Design System 之上，而非零散的 CSS 樣式。

整個系統由 Design Tokens、Semantic Colors、Typography、Spacing、Motion 與 Component Library 組成，確保所有頁面具有一致的視覺風格與互動體驗。

Design Principles

* Mobile First
* Component Driven
* Consistent Experience
* Reusable Components
* Accessibility Friendly
* Responsive Layout
* Theme Driven
* Semantic Design Tokens

⸻

🧊 Liquid Glass UI

介面設計以 Liquid Glass 為核心概念，透過半透明材質、模糊背景、柔和光影與圓角層次，建立具有深度與層級感的現代化介面。

主要特色：

* Backdrop Blur
* Glass Surface
* Soft Shadow
* Rounded Corners
* Layered Depth
* Dynamic Transparency
* Smooth Transition

所有元件皆遵循統一的視覺規範。

⸻

🧩 Component Library

內建完整的 UI 元件庫，所有元件皆以模組方式管理。

Navigation

* Navigation Bar
* Bottom Tab Bar
* Toolbar
* Sidebar（平板模式）

Content

* Card
* List
* Grid
* Article
* Media Block

Input

* Button
* Icon Button
* Text Field
* Text Area
* Toggle
* Slider
* Search Bar
* Dropdown

Feedback

* Toast
* Snackbar
* Dialog
* Modal
* Bottom Sheet
* Progress Indicator
* Skeleton Loader

所有元件皆可由 Theme Engine 統一控制外觀與狀態。

⸻

🌗 Theme System

Theme Engine 提供完整主題管理能力。

內建：

* Light Theme
* Dark Theme
* OLED Theme

未來可擴充：

* Brand Theme
* High Contrast Theme
* Custom Theme

所有色彩皆透過 Design Tokens 管理，不直接寫死於元件中。

⸻

✍ Typography

字體系統採用階層式排版。

包含：

* Display
* Headline
* Title
* Subtitle
* Body
* Caption
* Label
* Monospace

支援：

* Dynamic Font Scaling
* Responsive Typography
* 中英文混排最佳化
* 多語系排版

⸻

✨ Motion System

動畫設計遵循「提供回饋，而非干擾」的原則。

主要動畫：

* Page Transition
* Navigation Transition
* Modal Animation
* Bottom Sheet Animation
* Fade
* Scale
* Slide
* Blur Transition

所有動畫由 Motion System 統一管理，維持一致的節奏與操作感。

⸻

📱 Responsive Strategy

採用 Mobile First 設計。

支援：

Device	Support
iPhone	✅
Android Phone	✅
iPad	✅
Android Tablet	✅
Desktop	✅

系統將依裝置尺寸自動調整：

* Navigation Layout
* Grid System
* Typography
* Spacing
* Touch Target

⸻

🔐 Security Overview

Rumors Platform 採用多層安全設計。

主要包含：

* Input Validation
* Output Sanitization
* Permission Engine
* Role-Based Access Control（RBAC）
* Security Engine
* Content Security Policy（CSP）
* Audit Log（依部署模式）

注意： 在 Mode A（GitHub Native）中，真正涉及伺服器端驗證、資料保護與機密資訊的功能無法完全實現，建議透過 Mode B 或 Mode C 提供完整安全能力。

⸻

👥 Membership & Permission

平台採用角色（Role）與會員等級（Membership Tier）雙層管理。

Roles

* Owner
* Admin
* Editor
* User
* Guest

Membership

* Guest
* Free
* Basic
* Advanced
* Premium
* Ultimate

透過 Permission Engine 控制：

* 功能存取
* 內容可見性
* 編輯權限
* 管理能力
* 系統設定

⸻

📱 Progressive Web App

Rumors Platform 預設支援 PWA。

功能包含：

* Web App Manifest
* Service Worker
* Offline Cache
* Install Prompt
* Standalone Mode
* App Shell Architecture

提供接近原生 App 的安裝與離線體驗。

⸻

📝 CMS & Dashboard

內建可擴充的內容管理與管理後台。

CMS

* Draft
* Preview
* Publish
* Archive
* Version History
* Rollback

Dashboard

* Users
* Membership
* Permissions
* Articles
* Analytics
* Notifications
* Settings
* System Status

依 Runtime Mode 啟用不同功能深度，並由 Permission Engine 控制各角色可存取範圍。

⸻

🚀 Quick Start

歡迎使用 Rumors Platform v4.0。

本專案採用標準 Web 技術建構，可依需求部署為 GitHub Pages、Backend Supported 或 Hybrid Fusion 平台。

⸻

📋 Requirements

建議環境：

* Git
* GitHub Repository
* GitHub Pages
* 現代瀏覽器（Safari、Chrome、Edge、Firefox）

建議開發工具：

* Visual Studio Code
* GitHub Desktop（選用）
* Node.js（僅建置工具需要）
* GitHub Actions

⸻

📥 Installation

Clone Repository：

git clone https://github.com/mobsp/mobsp.github.io.git

進入專案：

cd mobsp.github.io

Rumors 專案位置：

mobsp.github.io/
└── rumors/

⸻

⚙ Configuration

所有核心設定皆集中於：

rumors/config/

主要設定檔：

File	Description
runtime.json	Runtime 基本設定
backend-mode.json	Mode A / B / C 切換
features.json	功能開關
membership.json	會員等級設定
permissions.json	權限設定
security.json	安全策略
theme.json	主題設定
deployment.json	部署設定
experimental.json	實驗性功能

Runtime Engine 會依設定自動載入對應功能與 Provider。

⸻

🚀 Deployment

Rumors Platform 支援三種部署模式。

🅰 Mode A：GitHub Native Edition

使用：

* GitHub Pages
* GitHub Actions
* JSON Data
* Service Worker

適合：

* 個人網站
* Wiki
* Blog
* Documentation
* 工具網站

特色：

* 免費
* 部署快速
* 維護簡單
* 全球 CDN

⸻

🅱 Mode B：Backend Supported Edition

整合：

* Authentication
* Database
* REST API
* GraphQL
* Dashboard
* CMS

適合：

* 商業平台
* 會員網站
* 內容管理系統
* 私有服務

⸻

🅲 Mode C：Hybrid Fusion Edition

推薦正式營運使用。

公開內容由 GitHub Pages 提供。

會員、私有資料、即時功能由 Backend 提供。

Runtime Engine 自動整合兩者。

⸻

🔄 GitHub Actions

專案內建 CI/CD Workflow。

主要流程：

Developer
     │
     ▼
Git Push
     │
     ▼
GitHub Actions
     │
 ┌───┼──────────────┐
 ▼   ▼              ▼
Build Validate Security
     │
     ▼
Deploy
     │
     ▼
GitHub Pages

預設 Workflow：

* build.yml
* deploy.yml
* security.yml
* backup.yml
* release.yml

可依需求擴充自動測試、版本發布與通知流程。

⸻

📚 Documentation

README 作為專案入口。

完整技術文件建議置於：

docs/
architecture.md
runtime.md
folder-structure.md
design-system.md
ui-components.md
providers.md
engines.md
security.md
membership.md
cms.md
dashboard.md
deployment.md
github-actions.md
api.md
graphql.md
roadmap.md
faq.md

將詳細架構、設計規範與 API 文件集中管理，提升可讀性與維護性。

⸻

🛣 Roadmap

v4.x

* 完整 Runtime Engine
* Design System
* CMS
* Dashboard
* Membership
* RBAC
* GitHub Native Platform

v5.x

* Plugin Architecture
* Extension System
* Internationalization（i18n）
* 更多 Runtime Provider
* Enterprise Features

Roadmap 將依專案需求持續調整。

⸻

🤝 Contributing

歡迎任何形式的貢獻。

建議流程：

1. Fork Repository
2. 建立 Feature Branch
3. 完成功能開發或修正
4. 提交 Pull Request
5. Code Review
6. Merge

請遵循：

* 統一程式風格
* 模組化設計
* 更新相關文件
* 不破壞既有相容性

⸻

📜 License

本專案之授權方式將於正式發布時公告。

若未另行說明，請勿將本專案內容直接用於商業用途。

建議搭配：

* LICENSE
* SECURITY.md
* CONTRIBUTING.md
* CODE_OF_CONDUCT.md

共同建立完整的開源專案文件。

⸻

💡 Project Principles

Rumors Platform 的核心設計理念：

* Modular Architecture
* Layered Architecture
* Runtime Independence
* Design System Driven
* Mobile First
* Progressive Web App
* GitHub Native First
* Optional Backend
* Long-term Maintainability
* Scalable Platform

專案所有功能皆圍繞上述原則設計，以確保架構一致性與長期可維護性。

⸻

🙏 Acknowledgements

感謝所有參與本專案規劃、設計、開發與測試的人員。

Rumors Platform 將持續以 穩定、可擴充、易維護、接近原生 App 體驗 為目標，不斷演進。

⸻

<div align="center">

Rumors Platform v4.0

Next-Generation Hybrid Web Application Platform

GitHub Native • Backend Supported • Hybrid Fusion

Built with:

HTML5 • CSS3 • JavaScript • JSON • GitHub Actions • Progressive Web App

⭐ 如果這個專案對你有幫助，歡迎給予 Star 支持。

</div>
