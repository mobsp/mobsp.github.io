
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
(function(){
  const key = 'sf_settings_v1';
  const defaults = { privateMode: false, showSSL: true };

  function load() {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaults)); } catch(e) { return defaults; }
  }

  function save(obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const close = document.getElementById('close-settings');
    const privateMode = document.getElementById('private-mode');
    const sslLock = document.getElementById('ssl-lock');

    const s = load();
    if (privateMode) privateMode.checked = !!s.privateMode;
    if (sslLock) sslLock.checked = !!s.showSSL;

    if (settingsBtn) settingsBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (close) close.addEventListener('click', () => modal.classList.add('hidden'));

    if (privateMode) privateMode.addEventListener('change', e => {
      s.privateMode = e.target.checked;
      save(s);
    });
    if (sslLock) sslLock.addEventListener('change', e => {
      s.showSSL = e.target.checked;
      save(s);
    });
  });

  window.SFSettings = { load, save };
})();
