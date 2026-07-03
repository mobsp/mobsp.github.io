/**
 * 模組名稱：ms-sidebar.js
 * 功能用途：iOS 風格結構化側邊欄，支援響應式抽屜行為。
 * 修改指南：若要調整摺疊寬度，修改 --sidebar-width 變數。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    --sidebar-width: 280px;
    --collapsed-width: 70px;
  }

  /* 遮罩層 (用於行動裝置抽屜) */
  .backdrop {
    display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3); backdrop-filter: blur(2px); z-index: 998;
  }

  /* 側邊欄本體 */
  .sidebar {
    width: var(--sidebar-width); height: 100vh;
    background: var(--glass-bg); backdrop-filter: var(--blur-intensity);
    border-right: 1px solid var(--border-color);
    position: fixed; top: 0; left: 0; z-index: 999;
    display: flex; flex-direction: column;
    transition: transform 0.4s var(--transition-ios);
  }

  /* 響應式行為：手機版 */
  @media (max-width: 1024px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .sidebar.open + .backdrop { display: block; }
  }

  .content { padding: var(--s-lg); flex-grow: 1; overflow-y: auto; }
</style>

<aside class="sidebar" id="sidebar">
  <div class="content"><slot></slot></div>
</aside>
<div class="backdrop" id="backdrop"></div>
`;

class MobSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // 開啟/關閉邏輯
  toggle() {
    this.shadowRoot.querySelector('#sidebar').classList.toggle('open');
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#backdrop').onclick = () => this.toggle();
  }
}
customElements.define('ms-sidebar', MobSidebar);
