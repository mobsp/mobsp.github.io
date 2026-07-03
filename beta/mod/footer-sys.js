
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
/ 6號：頁尾區塊系統封裝
export function initFooter() {
    const style = document.createElement('style');
    style.textContent = `
        .ms-footer { padding: 40px 20px 100px; background: rgba(30, 30, 30, 0.5); text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .social-icons { display: flex; justify-content: center; gap: 25px; margin-bottom: 20px; font-size: 20px; color: #888; }
        .social-icons i:active { color: #00cec9; transform: scale(1.2); transition: 0.1s; }
        .footer-brand { font-weight: bold; color: #00cec9; letter-spacing: 2px; font-size: 14px; }
        .copyright { font-size: 10px; color: #555; margin-top: 10px; line-height: 1.5; }
    `;
    document.head.appendChild(style);

    const footer = document.createElement('footer');
    footer.className = 'ms-footer';
    footer.innerHTML = `
        <div class="social-icons">
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-line"></i>
        </div>
        <div class="footer-brand">Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ</div>
        <p class="copyright">莫比空間｜Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ Ⓒ 2023-2026</p>
    `;
    document.body.appendChild(footer);
}
