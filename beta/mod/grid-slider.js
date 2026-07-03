/* * ============================================================
 * Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ (莫比空間) - 服務入口矩陣模組 (Grid Slider)
 * 檔案位置：beta/mod/grid-slider.js
 * ============================================================
 * * 【 快速維護指南 】
 * * 1. 欲修改「服務清單、名稱、圖標、紅點」，請至下方 constructor() 內的 this.services 陣列。
 * 2. 欲調整「顏色、間距、iOS 風格樣式」，請至 getStyles() 方法。
 * 3. 欲設定「點擊後的跳轉連結」，請至 bindEvents() 方法。
 * * ⚠️ 詳細配置方法、參數說明及擴充教學，請務必參閱同路徑下的：
 * 👉 beta/mod/README.md 👈
 * * ============================================================
 */

class MobSpaceServiceGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.services = [
      { id: '1', name: '貼圖小舖', icon: '🙂', isPinned: true, badge: false },
      { id: '2', name: '主題小舖', icon: '🎨', isPinned: true, badge: false },
      { id: '3', name: 'LINE GO', icon: '🚕', isPinned: true, badge: true },
      { id: '4', name: 'Premium', icon: '💎', isPinned: true, badge: false },
      { id: '5', name: '來電鈴聲', icon: '🎵', isPinned: true, badge: false },
      { id: '6', name: 'LINE GAME', icon: '🎮', isPinned: false, badge: true },
      { id: '7', name: '購物清單', icon: '🛍️', isPinned: false, badge: false },
      { id: '8', name: '旅遊導覽', icon: '✈️', isPinned: false, badge: false }
    ];
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  get pinnedServices() {
    return this.services.filter(s => s.isPinned);
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --bg-color: #1c1c1e;
          --text-color: #ffffff;
          --sub-text: #8e8e93;
          --icon-bg: #2c2c2e;
          --badge-color: #ff3b30;
        }
        
        .service-container {
          background-color: var(--bg-color);
          padding: 16px;
          border-radius: 12px;
          color: var(--text-color);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .header-title {
          font-size: 16px;
          font-weight: 600;
        }

        .show-all-btn {
          font-size: 14px;
          color: var(--sub-text);
          background: none;
          border: none;
          cursor: pointer;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .service-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          position: relative;
          transition: transform 0.1s ease;
          -webkit-tap-highlight-color: transparent; /* 手機點擊無藍框 */
        }

        /* 增加按壓反饋 */
        .service-item:active {
          transform: scale(0.9);
        }

        .icon-box {
          width: 48px;
          height: 48px;
          background-color: var(--icon-bg);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          margin-bottom: 8px;
        }

        .service-name {
          font-size: 11px;
          color: var(--sub-text);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .badge {
          position: absolute;
          top: 0;
          right: 4px;
          width: 8px;
          height: 8px;
          background-color: var(--badge-color);
          border-radius: 50%;
        }

        .modal-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.6);
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modal-overlay.active {
          display: block;
          opacity: 1;
        }

        .modal-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background-color: var(--bg-color);
          border-radius: 20px 20px 0 0;
          padding: 24px 16px;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-overlay.active .modal-content {
          transform: translateY(0);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid #38383a;
          position: sticky; /* 固定標題與關閉按鈕 */
          top: 0;
          background: var(--bg-color);
          z-index: 10;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 24px;
          cursor: pointer;
        }
      </style>
    `;
  }

  render() {
    const pinnedHtml = this.pinnedServices.map(s => this.createServiceItemHtml(s)).join('');
    const allHtml = this.services.map(s => this.createServiceItemHtml(s)).join('');

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="service-container">
        <div class="header">
          <div class="header-title">服務</div>
          <button class="show-all-btn" id="showAllBtn">顯示全部 ></button>
        </div>
        <div class="grid-layout">
          ${pinnedHtml}
        </div>
      </div>

      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
          <div class="modal-header">
            <div class="header-title">所有服務</div>
            <button class="close-btn" id="closeBtn">×</button>
          </div>
          <div class="grid-layout">
            ${allHtml}
          </div>
        </div>
      </div>
    `;
  }

  createServiceItemHtml(service) {
    return `
      <div class="service-item" data-id="${service.id}">
        <div class="icon-box">${service.icon}</div>
        ${service.badge ? '<div class="badge"></div>' : ''}
        <div class="service-name">${service.name}</div>
      </div>
    `;
  }

  bindEvents() {
    const showAllBtn = this.shadowRoot.getElementById('showAllBtn');
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const modalOverlay = this.shadowRoot.getElementById('modalOverlay');

    const setModal = (isOpen) => {
      if (isOpen) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; / 防止背景捲動
      } else {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; / 恢復捲動
      }
    };

    showAllBtn.addEventListener('click', () => setModal(true));
    closeBtn.addEventListener('click', () => setModal(false));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) setModal(false);
    });

    const items = this.shadowRoot.querySelectorAll('.service-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        const serviceId = e.currentTarget.dataset.id;
        console.log(`Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ 導航觸發 - ID: ${serviceId}`);
      });
    });
  }
}

customElements.define('mobspace-service-grid', MobSpaceServiceGrid);
