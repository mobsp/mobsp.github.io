(function(){
  const key = 'sf_history_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; }
  }

  function save(list) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  function addHistoryEntry(url) {
    if (!url) return;
    const list = load();
    list.unshift({ url, ts: Date.now() });
    if (list.length > 200) list.length = 200;
    save(list);
    render();
  }

  function render() {
    const list = load();
    const ul = document.getElementById('history-list');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach(h => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = h.url;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('viewport').src = h.url;
        document.getElementById('history-modal').classList.add('hidden');
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.addHistoryEntry = addHistoryEntry;
    const historyBtn = document.getElementById('history-btn');
    const close = document.getElementById('close-history');
    if (historyBtn) historyBtn.addEventListener('click', () => { render(); document.getElementById('history-modal').classList.remove('hidden'); });
    if (close) close.addEventListener('click', () => document.getElementById('history-modal').classList.add('hidden'));
    render();
  });

  window.SFHistory = { addHistoryEntry, load };
})();
