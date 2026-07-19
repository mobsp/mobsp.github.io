export default class SearchView {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'module-search view-fade-in';
    }

    async render() {
        this.container.innerHTML = `
            <div style="padding: var(--space-md);">
                <div class="search-bar" style="display: flex; align-items: center; background: rgba(142,142,147,0.12); border-radius: 10px; padding: 8px 12px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="search-input" placeholder="搜尋文章、作者或標籤" style="flex: 1; margin-left: 8px; background: transparent; border: none; font-size: 17px; color: var(--color-text-primary); outline: none;">
                    <button id="clear-btn" style="display: none; width: 16px; height: 16px; background: var(--color-text-tertiary); color: var(--color-bg-surface); border-radius: 50%; font-size: 10px; align-items: center; justify-content: center;">✕</button>
                </div>
                
                <div class="search-suggestions" style="margin-top: var(--space-lg);">
                    <h3 class="text-title-3" style="margin-bottom: var(--space-sm);">熱門搜尋</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <span style="background: rgba(142,142,147,0.12); padding: 6px 16px; border-radius: 16px; font-size: 15px; color: var(--color-primary);">iOS 18</span>
                        <span style="background: rgba(142,142,147,0.12); padding: 6px 16px; border-radius: 16px; font-size: 15px; color: var(--color-primary);">PWA 架構</span>
                        <span style="background: rgba(142,142,147,0.12); padding: 6px 16px; border-radius: 16px; font-size: 15px; color: var(--color-primary);">Design System</span>
                    </div>
                </div>

                <div id="search-results" style="margin-top: var(--space-lg); display: none;">
                    <h3 class="text-title-3" style="margin-bottom: var(--space-sm);">搜尋結果</h3>
                    <ul id="results-list"></ul>
                </div>
            </div>
        `;
        return this.container;
    }

    mount() {
        const input = this.container.querySelector('#search-input');
        const clearBtn = this.container.querySelector('#clear-btn');
        const resultsArea = this.container.querySelector('#search-results');
        const suggestionsArea = this.container.querySelector('.search-suggestions');

        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length > 0) {
                clearBtn.style.display = 'flex';
                suggestionsArea.style.display = 'none';
                resultsArea.style.display = 'block';
                // 模擬搜尋結果
                this.renderMockResults(val);
            } else {
                clearBtn.style.display = 'none';
                suggestionsArea.style.display = 'block';
                resultsArea.style.display = 'none';
            }
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            input.focus();
            input.dispatchEvent(new Event('input'));
        });
    }

    renderMockResults(query) {
        const list = this.container.querySelector('#results-list');
        list.innerHTML = `
            <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div class="text-body">關於「${query}」的最佳實踐</div>
                    <div class="text-caption-1" style="color: var(--color-text-secondary);">System Admin • 2 天前</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </li>
        `;
    }

    destroy() {
        console.log('[SearchView] Destroyed');
    }
}
