/**
 * 模組名稱：m-button.js
 * 功能用途：iOS 原生風格按鈕系統，支援變體與狀態管理。
 * 修改指南：若要調整按鈕全域圓角或點擊動畫，請修改內部 style。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { display: inline-block; }
  
  /* 按鈕通用基底 */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--s-sm) var(--s-md);
    font-family: var(--font-stack);
    font-size: 16px;
    font-weight: 500;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition: all 0.2s var(--transition-ios);
    border: none;
    outline: none;
  }

  /* 1. 標準版 (Primary) */
  .btn-primary { background: var(--accent-base); color: #fff; }
  
  /* 2. 次要版 (Secondary - 玻璃感) */
  .btn-glass { background: var(--glass-bg); backdrop-filter: var(--blur-intensity); border: 1px solid var(--border-color); color: var(--text-primary); }

  /* 3. 幽靈版 (Ghost - 無背景) */
  .btn-ghost { background: transparent; color: var(--accent-base); }

  /* 4. 危險版 (Destruct - 系統紅) */
  .btn-danger { background: #FF3B30; color: #fff; }

  /* 5. 變體：膠囊狀 (Pill) */
  .pill { border-radius: 999px; }

  /* 互動狀態 */
  .btn:active { transform: scale(0.95); opacity: 0.8; }
  .btn:disabled { opacity: 0.4; pointer-events: none; }
</style>
<button class="btn"><slot></slot></button>
`;

class MobButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  / 元件掛載後，根據屬性賦予樣式
  connectedCallback() {
    const btn = this.shadowRoot.querySelector('.btn');
    const variant = this.getAttribute('variant') || 'primary'; / 預設 primary
    const shape = this.getAttribute('shape') || 'default';     / 預設直角
    
    btn.classList.add(`btn-${variant}`);
    if (shape === 'pill') btn.classList.add('pill');
  }
}

customElements.define('m-button', MobButton);
