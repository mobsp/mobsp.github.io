/**
 * 模組名稱：ms-card.js
 * 功能用途：iOS 原生風格內容容器，具備多樣化視覺變體與響應式邏輯。
 * 修改指南：調整 "--card-padding" 可改變全站內容密度。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { 
    display: block; 
    --card-padding: var(--s-md); 
  }

  .card {
    background: var(--bg-secondary);
    border-radius: var(--r-lg);
    border: 1px solid var(--border-color);
    padding: var(--card-padding);
    transition: transform 0.3s var(--transition-ios), box-shadow 0.3s ease;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* 1. 變體：液態玻璃 */
  .card.glass { 
    background: var(--glass-bg); 
    backdrop-filter: var(--blur-intensity); 
  }

  /* 2. 變體：懸浮陰影 */
  .card.elevated { box-shadow: var(--shadow-depth); }

  /* 3. 變體：行動呼籲 (CTA) */
  .card.interactive:hover { 
    transform: translateY(-4px); 
    box-shadow: var(--shadow-depth);
    cursor: pointer;
  }

  /* 響應式邏輯：根據容器寬度調整 */
  @media (max-width: 480px) {
    .card { border-radius: var(--r-md); }
  }
</style>

<div class="card" id="card">
  <slot name="header"></slot>
  <div class="body"><slot></slot></div>
  <slot name="footer"></slot>
</div>
`;

class MobCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const card = this.shadowRoot.querySelector('#card');
    if (this.hasAttribute('glass')) card.classList.add('glass');
    if (this.hasAttribute('elevated')) card.classList.add('elevated');
    if (this.hasAttribute('interactive')) card.classList.add('interactive');
  }
}
customElements.define('ms-card', MobCard);
