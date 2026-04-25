/**
 * 服務入口矩陣封裝模組 (Service Grid Module)
 * 整合 HTML, CSS, JS 於一身，支援跨網頁調用
 */
class MobSpaceServiceGrid extends HTMLElement {
  constructor() {
    super();
    // 使用 Shadow DOM 封裝，確保 CSS 不會與外部網頁衝突
    this.attachShadow({ mode: 'open' });

    // 模擬後端或設定檔傳來的服務資料 (可依需求擴充)
    this.services = [
      { id: '1', name: '貼圖小舖', icon: '🙂', isPinned: true, badge: false },
      { id: '2', name: '主題小舖', icon: '🎨', isPinned: true, badge: false },
      { id: '3', name: '叫車服務', icon: '🚕', isPinned: true, badge: true },
      { id: '4', name: 'Premium', icon: '💎', isPinned: true, badge: false },
      { id: '5', name: '來電鈴聲', icon: '🎵', isPinned: true, badge: false },
      { id: '6', name: '遊戲中心', icon: '🎮', isPinned: false, badge: true },
      { id: '7', name: '購物頻道', icon: '🛍️', isPinned: false, badge: false },
      { id: '8', name: '旅遊導航', icon: '✈️', isPinned: false, badge: false }
    ];
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  // 取得釘選在首頁的服務
  get pinnedServices() {
    return this.services.filter(s => s.isPinned);
  }

  // 生成 CSS 樣式 (融合 iOS 圓潤、簡約風格)
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
        }

        .icon-box {
          width: 48px;
          height: 48px;
          background-color: var(--icon-bg);
          border-radius: 50%; /* iOS 風格圓形圖標 */
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

        /* 展開全部的 Modal 樣式 */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.6);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modal-overlay.active {
          display: block;
          opacity: 1;
        }

        .modal-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--bg-color);
          border-radius: 20px 20px 0 0;
          padding: 24px 16px;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

  // 渲染 HTML 結構
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

  // 生成單一 Icon 的 HTML
  createServiceItemHtml(service) {
    return `
      <div class="service-item" data-id="${service.id}">
        <div class="icon-box">
          ${service.icon}
        </div>
        ${service.badge ? '<div class="badge"></div>' : ''}
        <div class="service-name">${service.name}</div>
      </div>
    `;
  }

  // 綁定互動事件
  bindEvents() {
    const showAllBtn = this.shadowRoot.getElementById('showAllBtn');
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const modalOverlay = this.shadowRoot.getElementById('modalOverlay');

    // 開啟全部服務 (底部彈窗展開)
    showAllBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });

    // 關閉全部服務
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    // 點擊背景遮罩也可關閉
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });

    // 替每個 Icon 綁定點擊事件 (預留日後擴充跳轉邏輯)
    const items = this.shadowRoot.querySelectorAll('.service-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        const serviceId = e.currentTarget.dataset.id;
        console.log(\`觸發服務跳轉，ID: \${serviceId}\`);
        // 日後可在此處加入 window.location.href 或呼叫其他 Router
      });
    });
  }
}

// 註冊自定義元素
customElements.define('mobspace-service-grid', MobSpaceServiceGrid);
