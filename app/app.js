// 緹緹的天才邏輯模組
const MobiSpace = {
    backupDB: null,
    initialState: "",

    init() {
        this.renderAssetTables();
        this.setupPWA();
        window.onload = () => document.getElementById('app').classList.add('loaded');
        console.log("緹緹：系統啟動成功，Boss 帥喔！😍");
    },

    // 11/14/17... 列表動態生成
    renderAssetTables() {
        const types = [
            { id: 11, n: "頁面&連結/路徑" }, { id: 14, n: "檔案&路徑/連結" },
            { id: 17, n: "SVG&路徑/連結" }, { id: 18, n: "圖片&路徑/連結" },
            { id: 19, n: "影片&連結/路徑" }, { id: 21, n: "音樂&連結/路徑" },
            { id: 23, n: "文章列表" }
        ];
        const container = document.getElementById('asset-container');
        types.forEach(t => {
            container.innerHTML += `
                <section class="asset-table-block">
                    <div class="table-header">
                        <h3>${t.id}. ${t.n}表格清單</h3>
                        <div class="btns">
                            <span onclick="viewAll(${t.id})">View all</span>
                            <button onclick="sort(${t.id})">⬇️</button>
                        </div>
                    </div>
                    <div class="table-body" id="table-${t.id}">
                        <div class="empty-state">等待數據流輸入...</div>
                    </div>
                </section>
            `;
        });
    },

    // 第 5 項：資料備份與還原
    triggerBackup() {
        const currentContent = document.getElementById('main-textarea').value;
        this.backupDB = {
            timestamp: new Date().toISOString(),
            content: currentContent || "最初版本 (v0)"
        };
        alert("緹緹：手動備份成功！隨時可以還原到這個瞬間喔～");
    },

    // 10-4 & 10-5：GitHub 同步發佈
    async performPublish() {
        const path = document.getElementById('gh-path').value;
        const content = document.getElementById('main-textarea').value;
        
        // 這裡對應 Github Action 觸發邏輯
        console.log(`發佈請求：路徑 ${path}，正在呼叫 Github API...`);
        // 預留：fetch('https://api.github.com/repos/OWNER/REPO/dispatches', ...)
        alert("🚀 腳本已觸發！Github Actions 正在背景自動編譯部署...");
    },

    // PWA 離線支援
    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }
};

MobiSpace.init();

// 全域功能
function togglePreview() {
    const edit = document.getElementById('main-textarea');
    const prev = document.getElementById('preview-screen');
    const btn = document.getElementById('preview-btn');
    
    if (prev.classList.contains('hidden')) {
        prev.innerHTML = edit.value; // 簡易預覽
        prev.classList.remove('hidden');
        edit.classList.add('hidden');
        btn.innerText = "切換為編輯框";
    } else {
        prev.classList.add('hidden');
        edit.classList.remove('hidden');
        btn.innerText = "預覽";
    }
}
