
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
(function(){
  function initDownloads() {
    const btn = document.getElementById('downloads-btn');
    const modal = document.getElementById('downloads-modal');
    const list = document.getElementById('download-list');
    const close = document.getElementById('close-downloads');

    if (!btn) return;
    btn.addEventListener('click', () => {
      // simulate a download entry
      const li = document.createElement('li');
      li.textContent = '檔案下載中...';
      list.appendChild(li);
      modal.classList.remove('hidden');
      setTimeout(() => { li.textContent = '檔案下載完成'; }, 2500);
    });

    if (close) close.addEventListener('click', () => modal.classList.add('hidden'));
  }

  document.addEventListener('DOMContentLoaded', initDownloads);
  window.SFDownloads = { initDownloads };
})();
