export default class HomeView {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'module-home view-fade-in';
    }

    async render() {
        this.container.innerHTML = `
            <div class="home-header" style="padding: var(--space-md);">
                <h2 class="text-title-1">Today</h2>
                <p class="text-subhead" style="color: var(--color-text-secondary);" id="current-date"></p>
            </div>
            <div class="feed-container" id="article-list" style="padding: 0 var(--space-md);">
                <!-- Articles injected here -->
                <div class="spinner" style="text-align: center; padding: 20px;">載入中...</div>
            </div>
        `;

        this.setupDate();
        await this.loadArticles();

        return this.container;
    }

    setupDate() {
        const dateEl = this.container.querySelector('#current-date');
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('zh-TW', options).toUpperCase();
    }

    async loadArticles() {
        const listEl = this.container.querySelector('#article-list');
        try {
            // 讀取靜態 JSON庫 (模擬 Mode A)
            const res = await fetch('./data/articles.json');
            const data = await res.json();
            
            listEl.innerHTML = ''; // 清除 Spinner
            
            data.articles.forEach(article => {
                const card = document.createElement('article');
                card.className = 'liquid-glass-panel';
                card.style.marginBottom = 'var(--space-md)';
                card.style.overflow = 'hidden';
                
                const premiumBadge = article.is_premium 
                    ? `<span style="background: var(--color-warning); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-bottom: 8px; display: inline-block;">PREMIUM</span>` 
                    : '';

                card.innerHTML = `
                    <div style="height: 180px; background-image: url('${article.cover_image}'); background-size: cover; background-position: center;"></div>
                    <div style="padding: var(--space-md);">
                        ${premiumBadge}
                        <h3 class="text-headline" style="margin-bottom: var(--space-sm);">${article.title}</h3>
                        <p class="text-subhead" style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">${article.excerpt}</p>
                        <div style="display: flex; align-items: center;">
                            <img src="${article.author.avatar}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
                            <span class="text-caption-1" style="color: var(--color-text-tertiary);">${article.author.name}</span>
                        </div>
                    </div>
                `;
                
                // 綁定點擊事件 (iOS Button Highlight Effect)
                card.addEventListener('touchstart', () => card.style.opacity = '0.7', { passive: true });
                card.addEventListener('touchend', () => card.style.opacity = '1');
                card.addEventListener('click', () => {
                    console.log('Navigate to article:', article.id);
                    // 實作彈出全螢幕 Modal 閱讀文章
                });

                listEl.appendChild(card);
            });

        } catch (err) {
            console.error('[HomeView] Failed to load articles', err);
            listEl.innerHTML = `<p class="text-body" style="color: var(--color-danger); text-align: center;">無法載入內容，請檢查連線。</p>`;
        }
    }

    mount() {
        // DOM 掛載後執行的邏輯 (例如啟動 Observer 實現 Lazy Load)
        console.log('[HomeView] Mounted to DOM');
    }

    destroy() {
        // 解除綁定，避免 Memory Leak
        console.log('[HomeView] Destroyed');
    }
}
