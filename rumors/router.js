export default class Router {
    constructor(rootElement) {
        this.root = rootElement;
        this.routes = {
            'home': './js/modules/home/view.js',
            'search': './js/modules/search/view.js',
            'chat': './js/modules/chat/message-list.js',
            'dashboard': './js/modules/dashboard/view.js'
        };
        this.currentView = null;
        this.viewCache = new Map();
        
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    async navigate(path) {
        if (!this.routes[path]) {
            console.error(`[Router] View not found: ${path}`);
            return;
        }

        / 更新 History API
        history.pushState({ path }, '', `#${path}`);
        await this.renderView(path);
    }

    async handlePopState(event) {
        const path = event.state ? event.state.path : 'home';
        await this.renderView(path);
    }

    async renderView(path) {
        const viewContainer = document.getElementById('main-view');
        
        / 淡出動畫
        viewContainer.style.opacity = '0.5';
        viewContainer.style.transition = 'opacity 0.2s ease-in-out';

        try {
            let ViewClass;
            
            / 動態載入 ES Module，實作 Code Splitting
            if (this.viewCache.has(path)) {
                ViewClass = this.viewCache.get(path);
            } else {
                const module = await import(this.routes[path]);
                ViewClass = module.default;
                this.viewCache.set(path, ViewClass);
            }

            / 銷毀舊視圖實例
            if (this.currentView && typeof this.currentView.destroy === 'function') {
                this.currentView.destroy();
            }

            / 建立並渲染新視圖
            this.currentView = new ViewClass();
            const content = await this.currentView.render();
            
            viewContainer.innerHTML = '';
            viewContainer.appendChild(content);

            if (typeof this.currentView.mount === 'function') {
                this.currentView.mount();
            }

            / 淡入動畫
            requestAnimationFrame(() => {
                viewContainer.style.opacity = '1';
            });

        } catch (error) {
            console.error('[Router] Error rendering view:', error);
            viewContainer.innerHTML = `<div class="text-headline" style="text-align:center; padding:20px; color:var(--color-danger)">模組載入失敗</div>`;
            viewContainer.style.opacity = '1';
        }
    }
}
