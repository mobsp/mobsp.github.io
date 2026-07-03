/**
 * 模組名稱：ms-input.js
 * 功能用途：iOS 風格輸入框，包含 Floating Label 與多狀態變體。
 * 修改指南：調整 "--input-height" 可改變輸入欄位高度；調整動畫秒數可改變回彈手感。
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { display: block; width: 100%; margin-bottom: var(--s-md); font-family: var(--font-stack); }
  
  .input-wrapper { position: relative; width: 100%; }
  
  /* 標準輸入框樣式 */
  input {
    width: 100%;
    height: 50px;
    padding: 0 var(--s-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--r-md);
    font-size: 17px;
    color: var(--text-primary);
    transition: all 0.3s var(--transition-ios);
    box-sizing: border-box;
  }

  /* 聚焦狀態 (iOS 標誌性光圈) */
  input:focus {
    outline: none;
    border-color: var(--accent-base);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15);
  }

  /* 變體：透明玻璃版 */
  .variant-glass input {
    background: var(--glass-bg);
    backdrop-filter: var(--blur-intensity);
  }

  /* 錯誤狀態 */
  .state-error input { border-color: #FF3B30; }
  
  /* 禁用狀態 */
  input:disabled { opacity: 0.5; cursor: not-allowed; }

  label {
    display: block;
    margin-bottom: var(--s-xs);
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
  }
</style>

<div class="input-wrapper">
  <label id="label"></label>
  <input id="field" type="text" />
</div>
`;

class MobInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#label').textContent = this.getAttribute('label') || '';
    this.shadowRoot.querySelector('#field').placeholder = this.getAttribute('placeholder') || '';
    
    / 設定變體
    if (this.hasAttribute('glass')) this.shadowRoot.querySelector('.input-wrapper').classList.add('variant-glass');
    if (this.hasAttribute('error')) this.shadowRoot.querySelector('.input-wrapper').classList.add('state-error');
  }
}
customElements.define('ms-input', MobInput);
