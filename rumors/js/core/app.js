import ModeEngine from '../engines/mode-engine.js';
// (後續整合 Router, State, EventBus)

class RumorsApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.modeEngine = new ModeEngine();
        this.init();
    }

    async init() {
        try {
            console.log('[App] Initializing Rumors Platform v4.0...');
            
            // 載入環境設定與啟動引擎
            await this.modeEngine.boot();
            
            // 綁定 UI 事件
            this.bindShellEvents();
            
            // 移除 Loading 狀態
            this.root.dataset.mode = 'ready';
            console.log('[App] Architecture Mode Active:', this.modeEngine.currentMode);

            // 註冊 Service Worker (PWA)
            this.registerServiceWorker();

        } catch (error) {
            console.error('[App] Initialization failed:', error);
            this.root.dataset.mode = 'error';
        }
    }

    bindShellEvents() {
        // Tab Bar 切換邏輯
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // 移除所有 active
                tabs.forEach(t => t.classList.remove('active'));
                // 設定當前 active
                const target = e.currentTarget;
                target.classList.add('active');
                
                // 觸發視圖切換 (待 Router 實作)
                const route = target.dataset.target;
                console.log(`[Router] Navigate to: ${route}`);
                // 觸發觸覺回饋 (Haptic Feedback) 若支援
                if (navigator.vibrate) navigator.vibrate(50);
            });
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
                    })
                    .catch(err => {
                        console.log('[PWA] ServiceWorker registration failed:', err);
                    });
            });
        }
    }
}

// Bootstrap Application
window.addEventListener('DOMContentLoaded', () => {
    window.Rumors = new RumorsApp();
});
