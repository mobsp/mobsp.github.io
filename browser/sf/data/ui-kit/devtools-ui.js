
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
  function initDevTools() {
    const devBtn = document.getElementById('devtools-btn');
    const devModal = document.getElementById('devtools-modal');
    const consoleOutput = document.getElementById('console-output');
    const close = document.getElementById('close-devtools');

    if (devBtn) devBtn.addEventListener('click', () => devModal.classList.remove('hidden'));
    if (close) close.addEventListener('click', () => devModal.classList.add('hidden'));

    // capture console.log
    const oldLog = console.log;
    console.log = function(...args) {
      oldLog.apply(console, args);
      if (consoleOutput) consoleOutput.textContent += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
    };
  }

  document.addEventListener('DOMContentLoaded', initDevTools);
  window.SFDevTools = { initDevTools };
})();
