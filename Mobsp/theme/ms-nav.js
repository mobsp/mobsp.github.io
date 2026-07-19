/**
 * 模組名稱：ms-nav.js
 * 功能用途：iOS 風格結構化導覽列，含 RWD 自動切換機制。
 * 修改指南：若要更改導覽列高度，請修改 --nav-height 變數。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { 
    --nav-height: 60px;
    display: block;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 999;
  }

  .navbar {
    height: var(--nav-height);
    padding: 0 var(--s-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--glass-bg);
    backdrop-filter: var(--blur-intensity);
    border-bottom: 1px solid var(--border-color);
    transition: transform 0.3s var(--transition-ios);
  }

  /* 隱藏狀態 */
  .navbar.is-hidden { transform: translateY(-100%); }

  /* 標題與選單 */
  .brand { font-weight: 700; font-size: 20px; }
  .menu { display: flex; gap: var(--s-md); }

  /* 響應式邏輯 */
  @media (max-width: 768px) {
    .menu { display: none; } /* 手機版隱藏選單，改用底部 TabBar */
    .hamburger { display: block; }
  }
</style>

<nav class="navbar" id="navbar">
  <div class="brand"><slot name="brand">Mobispace</slot></div>
  <div class="menu"><slot name="links"></slot></div>
  <div class="hamburger">☰</div>
</nav>
`;

class MobNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initScrollLogic();
  }

  // 智能滾動邏輯：下滾隱藏，上滾顯示
  initScrollLogic() {
    let lastScroll = 0;
    const nav = this.shadowRoot.querySelector('#navbar');
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastScroll = currentScroll;
    });
  }
}
customElements.define('ms-nav', MobNavbar);
