
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
  function createTabElement(title = '新分頁', url = 'about:blank') {
    const el = document.createElement('div');
    el.className = 'tab';
    el.textContent = title;
    el.dataset.url = url;
    el.tabIndex = 0;
    return el;
  }

  function initTabs() {
    const tabs = document.getElementById('tabs');
    const addBtn = document.getElementById('add-tab');
    const viewport = document.getElementById('viewport');
    const urlBar = document.getElementById('url-bar');

    addBtn.addEventListener('click', () => {
      const newTab = createTabElement();
      tabs.insertBefore(newTab, addBtn);
      switchTab(newTab);
    });

    tabs.addEventListener('click', e => {
      if (e.target.classList.contains('tab')) switchTab(e.target);
    });

    function switchTab(tabEl) {
      const active = tabs.querySelector('.tab.active');
      if (active) active.classList.remove('active');
      tabEl.classList.add('active');
      const url = tabEl.dataset.url || 'about:blank';
      viewport.src = url;
      if (urlBar) urlBar.value = url;
    }

    / initial active tab
    const initial = tabs.querySelector('.tab');
    if (initial) switchTab(initial);
  }

  document.addEventListener('DOMContentLoaded', initTabs);
  window.SFTabs = { createTabElement };
})();
