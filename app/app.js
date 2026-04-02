const MobiSpace = {
    init() {
        console.log("Ⲙ𝔬ⲃⳝ𝔭 Nexus Sync: 即時啟動成功");
        this.renderAssetGrid();
        
        // 抓取最初讀取時的版本 (第 5 項需求)
        this.initialVersion = document.getElementById('main-editor').value;
    },

    renderAssetGrid() {
        const sections = [
            { id: 11, title: '頁面表格' }, { id: 14, title: '檔案表格' },
            { id: 17, title: 'SVG 清單' }, { id: 18, title: '圖片清單' },
            { id: 19, title: '影片清單' }, { id: 21, title: '音樂清單' },
            { id: 23, title: '文章列表' }
        ];

        const grid = document.getElementById('dynamic-asset-grid');
        grid.innerHTML = sections.map(s => `
            <div class="asset-card">
                <div class="card-head">
                    <span>${s.id}. ${s.title}</span>
                    <button class="mobi-btn" style="font-size:10px" onclick="MobiSpace.toast('載入清單...')">View All</button>
                </div>
                <div style="color:#555; font-size:12px">資料庫同步中...</div>
            </div>
        `).join('');
    },

    togglePreview() {
        const editor = document.getElementById('main-editor');
        const preview = document.getElementById('preview-area');
        const isEdit = preview.classList.contains('hidden');

        if (isEdit) {
            preview.innerHTML = `<div style="padding:10px">${editor.value || '無內容'}</div>`;
            editor.classList.add('hidden');
            preview.classList.remove('hidden');
        } else {
            editor.classList.remove('hidden');
            preview.classList.add('hidden');
        }
    },

    triggerBackup() {
        this.initialVersion = document.getElementById('main-editor').value;
        this.toast("📦 最初版本備份存檔成功！");
    },

    async performPublish() {
        this.toast("🚀 正在推送至 GitHub...");
        // 這裡可串接 GitHub API
    },

    toast(msg) { alert(msg); }
};

// 直接執行，不等待流光動畫
MobiSpace.init();
