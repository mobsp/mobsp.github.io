/* [Zenith-Ultimate-Applied-v3] - theme-engine.js */

// A. 數據層：緩存與重試
export const ZenithData = {
    cacheFirst: async (req) => {
        const cache = await caches.open('v1');
        const cached = await cache.match(req);
        return cached || fetch(req).then(res => { 
            cache.put(req, res.clone()); 
            return res; 
        });
    },
    fetchWithRetry: (u, o, r = 3) => 
        fetch(u, o).catch(e => r > 0 ? ZenithData.fetchWithRetry(u, o, r - 1) : Promise.reject(e))
};

// B. 安全層：抗干擾保護
export function initSecurity() {
    if (window.location.hostname !== 'localhost') {
        setInterval(() => { debugger; }, 2000); 
    }
    window.onerror = (m, u, l) => { 
        console.warn("Caught Kernel Error:", m);
    };
}

// C. 視覺層：MS-Theme 引擎
export function initTheme() {
    const style = document.createElement('style');
    style.textContent = `
        :root { --accent: #00cec9; }
        body.ms-theme-1 {
            background: linear-gradient(135deg, #000 20%, #1a0b2e 50%, #000 80%) !important;
            background-size: 400% 400% !important;
            animation: ms-rainbow-flow 10s ease infinite !important;
            color: white;
        }
        @keyframes ms-rainbow-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('ms-theme-1');
}
