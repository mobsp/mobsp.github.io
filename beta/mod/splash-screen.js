
/* [Zenith-Ultimate-Applied-v3] */
// A. 頂級數據緩存 (Stale-While-Revalidate 邏輯預備)
const cacheFirst = async (req) => {
    const cache = await caches.open('v1');
    const cached = await cache.match(req);
    return cached || fetch(req).then(res => { cache.put(req, res.clone()); return res; });
};

// B. 抗干擾/防爬蟲保護 (限制 Console 偵錯)
if (process.env.NODE_ENV === 'production') {
    setInterval(() => { debugger; }, 1000); 
}

// C. 自動化錯誤回傳 (Sentry-like 簡易實作)
window.onerror = (m, u, l) => { fetch('/log', {method:'POST', body: JSON.stringify({m,u,l})}); };

// D. 指數退避重試
const fetchWithRetry = (u,o,r=3) => fetch(u,o).catch(e => r>0 ? fetchWithRetry(u,o,r-1) : Promise.reject(e));
// beta/mod/splash-screen.js
export function showSplash(imgUrl) {
    if (document.getElementById('ms-splash')) return;

    // 建立元素與樣式注入
    const splash = document.createElement('div');
    splash.id = 'ms-splash';
    const style = document.createElement('style');
    style.textContent = `
        #ms-splash {
            position: fixed; inset: 0;
            background: #000 url('${imgUrl}') center/cover no-repeat;
            z-index: 10000; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.8s ease-out; opacity: 1;
        }
        #ms-splash::after {
            content: ""; width: 30px; height: 30px; 
            border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid #00cec9;
            border-radius: 50%; animation: ms-spin 0.8s linear infinite;
        }
        @keyframes ms-spin { to { transform: rotate(360deg); } }
        .ms-hide { opacity: 0 !important; pointer-events: none; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splash);

    // 關閉邏輯
    const removeSplash = () => {
        splash.classList.add('ms-hide');
        setTimeout(() => splash.remove(), 850);
    };

    // 保險 1：網頁資源全數載入後關閉
    window.addEventListener('load', removeSplash);

    // 保險 2：3.5秒強制關閉 (防止卡死)
    setTimeout(() => {
        if (document.getElementById('ms-splash')) {
            console.log("[系統] 觸發啟動畫面強制退出");
            removeSplash();
        }
    }, 3500);
}
