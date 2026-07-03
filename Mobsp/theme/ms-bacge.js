/**
 * 模組名稱：ms-badge.js
 * 功能用途：iOS 風格狀態標籤，具備動態語義色彩與玻璃質感。
 * 修改指南：若要調整標籤內距或字體，請修改 .badge 類別；若要調整語義色，請在 :root 中擴充 --tag-* 變數。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { display: inline-flex; }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    font-family: var(--font-stack);
    font-size: 12px;
    font-weight: 600;
    border-radius: 999px; /* 膠囊狀 */
    text-transform: uppercase;
    transition: all 0.2s var(--transition-ios);
    white-space: nowrap;
  }

  /* 變體：標準 (Neutral) */
  .variant-neutral { background: var(--border-color); color: var(--text-secondary); }

  /* 變體：強調 (Accent) */
  .variant-accent { background: var(--accent-base); color: #fff; }

  /* 變體：玻璃 (Glass) */
  .variant-glass { 
    background: var(--glass-bg); 
    backdrop-filter: var(--blur-intensity); 
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }

  /* 語義狀態變體 */
  .variant-success { background: #34C759; color: #fff; } /* iOS Green */
  .variant-warning { background: #FF9500; color: #fff; } /* iOS Orange */
  .variant-error   { background: #FF3B30; color: #fff; } /* iOS Red */

  /* 互動狀態：懸停加深 */
  .badge:hover { filter: brightness(1.1); transform: translateY(-1px); }
</style>

<span class="badge" id="badge"><slot></slot></span>
`;

class MobBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const badge = this.shadowRoot.querySelector('#badge');
    const variant = this.getAttribute('variant') || 'neutral';
    badge.classList.add(`variant-${variant}`);
  }
}
customElements.define('ms-badge', MobBadge);
