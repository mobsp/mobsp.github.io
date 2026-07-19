
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
  const storageKey = 'sf_bookmarks_v1';

  function loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) { return []; }
  }

  function saveBookmarks(list) {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }

  function renderBookmarks() {
    const list = loadBookmarks();
    const ul = document.getElementById('bookmark-list');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach(b => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = b.title || b.url;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const viewport = document.getElementById('viewport');
        if (viewport) viewport.src = b.url;
        document.getElementById('bookmarks-modal').classList.add('hidden');
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function addBookmark(url, title) {
    const list = loadBookmarks();
    list.unshift({ url, title, created: Date.now() });
    saveBookmarks(list);
    renderBookmarks();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('bookmark');
    const modal = document.getElementById('bookmarks-modal');
    const close = document.getElementById('close-bookmarks');
    const urlBar = document.getElementById('url-bar');

    if (btn) btn.addEventListener('click', () => {
      const url = urlBar.value || document.getElementById('viewport').src;
      addBookmark(url, url);
      modal.classList.remove('hidden');
    });
    if (close) close.addEventListener('click', () => modal.classList.add('hidden'));
    renderBookmarks();
  });

  window.SFBookmarks = { addBookmark, loadBookmarks };
})();
