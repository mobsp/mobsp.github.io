
/* [Zenith-Ultimate-Applied-v3] */
/ A. 頂級數據緩存 (Stale-While-Revalidate 邏輯預備)
const cacheFirst = async (req) => {
    const cache = await caches.open('v1');
    const cached = await cache.match(req);
    return cached || fetch(req).then(res => { cache.put(req, res.clone()); return res; });
};

/ B. 抗干擾/防爬蟲保護 (限制 Console 偵錯)
if (process.env.NODE_ENV === 'production') {
    setInterval(() => { debugger; }, 1000); 
}

/ C. 自動化錯誤回傳 (Sentry-like 簡易實作)
window.onerror = (m, u, l) => { fetch('/log', {method:'POST', body: JSON.stringify({m,u,l})}); };

/ D. 指數退避重試
const fetchWithRetry = (u,o,r=3) => fetch(u,o).catch(e => r>0 ? fetchWithRetry(u,o,r-1) : Promise.reject(e));
/ 4號：固定底部導覽列系統封裝
export function initBottomNav() {
    const style = document.createElement('style');
    style.textContent = `
        .bottom-nav { 
            position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
            width: 100%; max-width: 500px; height: calc(60px + env(safe-area-inset-bottom));
            background: rgba(17, 17, 17, 0.95); backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-around; align-items: center;
            padding-bottom: env(safe-area-inset-bottom); z-index: 1000;
        }
        .nav-item { display: flex; flex-direction: column; align-items: center; color: #888; text-decoration: none; font-size: 10px; gap: 4px; transition: 0.3s; }
        .nav-item.active { color: #00cec9; }
        .nav-item i { font-size: 18px; }
        .nav-item:active { transform: scale(0.9); }
    `;
    document.head.appendChild(style);

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = `
        <a href="#" class="nav-item active"><i class="fa-solid fa-house"></i><span>首頁</span></a>
        <a href="/music/" class="nav-item"><i class="fa-solid fa-music"></i><span>音樂</span></a>
        <a href="/shorts/" class="nav-item"><i class="fa-brands fa-youtube"></i><span>Shorts</span></a>
        <a href="/setting" class="nav-item"><i class="fa-solid fa-gear"></i><span>設定</span></a>
    `;
    document.body.appendChild(nav);
}
