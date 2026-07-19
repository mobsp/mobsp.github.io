
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
// 2號：雲端跑馬燈系統封裝
export async function initNotice(supabaseUrl, supabaseKey) {
    const header = document.querySelector('header');
    const marquee = document.createElement('div');
    marquee.className = 'marquee-row';
    marquee.innerHTML = `<span id="v-tag" class="v-tag">SYNCING</span><div class="mq-box"><div id="mq-text" class="mq-text">載入中...</div></div>`;
    header.prepend(marquee);

    // 這裡放入你原本的 Supabase 連結邏輯...
    // renderNotice(...) 邏輯也包在這裡
}
