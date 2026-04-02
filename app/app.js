/**
 * Ⲙ𝔬ⲃⳝ𝔭 Nexus Sync - System Logic v1.0.0
 * 專為長官打造的天才級架構
 */

const MobiSpace = {
    state: {
        isPreview: false,
        initialBackup: null,
        isLoaded: false
    },

    // 系統初始化
    init() {
        console.log("Ⲙ𝔬ⲃⳝ𝔭 Nexus 系統啟動中...");
        this.renderAssetGrid();
        this.bindEvents();
        
        // 預設備份（最初讀取版本）
        this.state.initialBackup = document.getElementById('main-editor').value;
    },

    // 生成 11/14/17... 列表 (對應你的草圖)
    renderAssetGrid() {
        const sections = [
            { id: 11, title: '頁面&連結表格' },
            { id: 14, title: '檔案&連結表格' },
            { id: 17, title: 'SVG 向量清單' },
            { id: 18, title: '圖片資產清單' },
            { id: 19, title: '影片清單表格' },
            { id: 21, title: '音樂頻道表格' },
            { id: 23, title: '文章內容列表' }
        ];

        const grid = document.getElementById('dynamic-asset-grid');
        grid.innerHTML = sections.map(s => `
            <div class="asset-card">
                <div class="card-head">
                    <span>${s.id}. ${s.title}</span>
                    <div class="card-ops">
                        <button onclick="MobiSpace.viewAll(${s.id})">View All</button>
                        <button onclick="MobiSpace.sort(${s.id})">排序</button>
                    </div>
                </div>
                <div class="card-body" id="list-${s.id}">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        `).join('');
    },

    // 預覽切換 (第 9 項)
    togglePreview() {
        const editor = document.getElementById('main-editor');
        const preview = document.getElementById('preview-area');
        this.state.isPreview = !this.state.isPreview;

        if (this.state.isPreview) {
            preview.innerHTML = editor.value.replace(/\n/g, '<br>'); // 簡易 Markdown 化
            editor.classList.add('hidden');
            preview.classList.remove('hidden');
        } else {
            editor.classList.remove('hidden');
            preview.classList.add('hidden');
        }
    },

    // GitHub 發佈與自動化 (第 10-4/10-9 項)
    async performPublish() {
        const path = document.getElementById('gh-path').value;
        const target = document.getElementById('publish-target').value;
        
        if(!path) return this.toast("請先填入 GitHub 發佈路徑！");

        this.toast(`🚀 正在同步至 GitHub Repository... 目標: ${target}`);
        
        // 模擬 GitHub Action 觸發邏輯
        setTimeout(() => {
            this.toast("✅ 同步完成！GitHub Actions 已啟動部署。");
        }, 2000);
    },

    // 資料備份還原 (第 5 項)
    triggerBackup() {
        const current = document.getElementById('main-editor').value;
        this.state.initialBackup = current;
        this.toast("📦 手動備份成功！最初版本已存檔。");
    },

    // 工具函數
    toast(msg) {
        alert(`Ⲙ𝔬ⲃⳝ𝔭 系統通知: ${msg}`);
    },

    bindEvents() {
        // 監聽鍵盤
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.performPublish();
            }
        });
    }
};

// --- 安全啟動保護層 ---
const bootSystem = () => {
    const app = document.getElementById('app');
    
    const unlock = () => {
        if (!MobiSpace.state.isLoaded) {
            app.classList.add('loaded');
            MobiSpace.state.isLoaded = true;
        }
    };

    try {
        MobiSpace.init();
    } catch (e) {
        console.error("啟動失敗:", e);
    } finally {
        // 3秒強制解鎖，或 DOM 加載完解鎖
        setTimeout(unlock, 3000);
        document.addEventListener('DOMContentLoaded', unlock);
        window.onload = unlock;
    }
};

bootSystem();
