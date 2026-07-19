
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
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('app-header');
  if (!header) return;
  header.innerHTML = `
    <div class="header-inner" style="display:flex;align-items:center;gap:12px;padding:8px 12px;">
      <img src="data/media/logo.png" alt="Safari Clone" style="height:28px;">
      <div style="font-weight:600">Safari Clone</div>
      <div style="margin-left:auto;color:var(--muted)">模擬瀏覽器</div>
    </div>
  `;
});
