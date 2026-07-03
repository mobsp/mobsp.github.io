
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
document.addEventListener('DOMContentLoaded', () => {
  const urlBar = document.getElementById('url-bar');
  const viewport = document.getElementById('viewport');
  const progressBar = document.getElementById('progress-bar');

  / initialize modules (they self-init on DOMContentLoaded)
  / wire up URL bar
  if (urlBar) {
    urlBar.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        const url = loadPage(urlBar.value);
        addHistory(url);
      }
    });
  }

  / basic navigation buttons
  const back = document.getElementById('back');
  const forward = document.getElementById('forward');
  const reload = document.getElementById('reload');

  if (back) back.addEventListener('click', () => { try { viewport.contentWindow.history.back(); } catch(e) {} });
  if (forward) forward.addEventListener('click', () => { try { viewport.contentWindow.history.forward(); } catch(e) {} });
  if (reload) reload.addEventListener('click', () => { viewport.src = viewport.src; });

  / progress simulation
  viewport.addEventListener('load', () => {
    if (progressBar) { progressBar.style.width = '100%'; setTimeout(()=>progressBar.style.width='0%', 400); }
  });

  / helper functions exposed globally
  window.loadPage = function(raw, frame = viewport) {
    let url = String(raw || '').trim();
    if (!url) return '';
    if (!/^https?:\/\/i.test(url) && url !== 'about:blank') url = 'https://' + url;
    if (frame) frame.src = url;
    if (progressBar) progressBar.style.width = '30%';
    return url;
  };

  window.addHistory = function(url) {
    if (!url) return;
    if (typeof addHistory === 'function') {
      try { window.addHistoryEntry && window.addHistoryEntry(url); } catch(e) {}
    }
  };
});
