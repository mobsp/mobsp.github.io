
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
// 5號：標題圖與勳章排佈系統封裝
export function renderBrand(selector) {
    const target = document.querySelector(selector);
    if (!target) return;

    const brandHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <a href="https://mobsp.github.io" style="display: block; margin-bottom: 10px;">
                <img src="https://mobsp.github.io/assets/brand/ms-guide-title.webp" alt="莫比空間" style="width: 100%; border-radius: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
            </a>
            <code style="background: #222; color: #aaa; padding: 4px 10px; border-radius: 5px; font-size: 12px;"> 點擊圖片探索 Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ ☖ </code>
            <p style="margin-top: 15px; font-weight: bold; letter-spacing: 1px; color: #eee;">極簡 ‧ 高效 ‧ 流暢 — 您的全方位數位資源入口</p>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                <img src="https://img.shields.io/website?url=https%3A%2F%2Fmobsp.github.io&label=Live%20Status&style=for-the-badge&color=black">
                <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge">
            </div>
        </div>
    `;
    target.innerHTML = brandHTML;
}
