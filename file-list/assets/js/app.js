
const DATA_URL = './data/files.json';
const state = { dataset: null };

async function loadDataset() {
  if (state.dataset) return state.dataset;
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('無法載入 files.json');
  state.dataset = await res.json();
  return state.dataset;
}

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fmtType(type) {
  const map = {
    'html-index': 'HTML 頁面',
    html: 'HTML 檔',
    javascript: 'JavaScript',
    json: 'JSON',
    css: 'CSS',
    python: 'Python',
    workflow: 'Workflow',
    image: '圖片',
    pwa: 'PWA',
    seo: 'SEO',
    config: '設定',
    yaml: 'YAML',
    xml: 'XML',
    markdown: 'Markdown',
    dotfile: '隱藏檔'
  };
  return map[type] || type;
}

function prettyPath(item) {
  return item.path.endsWith('/index.html') ? item.path.slice(0, -10) + '/' : item.path;
}

function badge(text, className = '') {
  return `<span class="badge ${className}">${escapeHtml(text)}</span>`;
}

function cardTemplate(item) {
  return `
    <article class="card">
      <div class="card-top">
        <div>
          <h3 class="card-title">${escapeHtml(item.name)}</h3>
          <div class="card-sub mono">${escapeHtml(item.path)}</div>
        </div>
      </div>
      <div class="meta">
        ${badge(item.folder, 'folder')}
        ${badge(fmtType(item.type))}
        ${badge(`風險 ${item.riskLevel}`, `risk-${item.riskLevel}`)}
      </div>
      <p>${escapeHtml(item.summary || '尚未提供說明')}</p>
      <div class="card-actions">
        <a class="btn primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟連結</a>
        <a class="btn" href="./detail.html?id=${encodeURIComponent(item.id)}">查看詳情</a>
        <button class="btn save-btn" data-id="${escapeHtml(item.id)}">收藏</button>
      </div>
    </article>
  `;
}

function compactTemplate(item) {
  return `
    <div class="compact-item">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <div class="card-sub mono">${escapeHtml(item.path)}</div>
        <div class="meta">
          ${badge(item.folder, 'folder')}
          ${badge(fmtType(item.type))}
          ${badge(`風險 ${item.riskLevel}`, `risk-${item.riskLevel}`)}
        </div>
      </div>
      <div class="card-actions">
        <a class="btn primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟</a>
        <a class="btn" href="./detail.html?id=${encodeURIComponent(item.id)}">詳情</a>
      </div>
    </div>
  `;
}

function tableTemplate(items) {
  return `
    <div class="list-table-wrap">
      <table class="list-table">
        <thead>
          <tr>
            <th>名稱</th>
            <th>路徑</th>
            <th>資料夾</th>
            <th>類型</th>
            <th>風險</th>
            <th>網站連結</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td><a href="./detail.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a><div class="card-sub">${escapeHtml(item.summary || '')}</div></td>
              <td class="mono">${escapeHtml(item.path)}</td>
              <td>${escapeHtml(item.folder)}</td>
              <td>${escapeHtml(fmtType(item.type))}</td>
              <td>${badge(item.riskLevel, `risk-${item.riskLevel}`)}</td>
              <td><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟</a></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getSavedIds() {
  try { return JSON.parse(localStorage.getItem('file-list:saved') || '[]'); }
  catch { return []; }
}

function setSavedIds(ids) {
  localStorage.setItem('file-list:saved', JSON.stringify([...new Set(ids)]));
}

function toggleSaved(id) {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
  setSavedIds(next);
  document.dispatchEvent(new CustomEvent('saved:changed', { detail: next }));
  return next.includes(id);
}

function wireSaveButtons(root = document) {
  qsa('.save-btn', root).forEach(btn => {
    const id = btn.dataset.id;
    const sync = () => { btn.textContent = getSavedIds().includes(id) ? '已收藏' : '收藏'; };
    btn.onclick = () => { toggleSaved(id); sync(); };
    sync();
  });
}

function sortItems(items, mode) {
  const list = [...items];
  const byName = (a, b) => a.name.localeCompare(b.name, 'zh-Hant');
  const byPath = (a, b) => a.path.localeCompare(b.path, 'en');
  if (mode === 'name-asc') return list.sort(byName);
  if (mode === 'name-desc') return list.sort((a, b) => byName(b, a));
  if (mode === 'path-asc') return list.sort(byPath);
  if (mode === 'path-desc') return list.sort((a, b) => byPath(b, a));
  if (mode === 'risk-desc') {
    const weight = { 高: 3, 中: 2, 低: 1 };
    return list.sort((a, b) => (weight[b.riskLevel] - weight[a.riskLevel]) || byName(a, b));
  }
  return list;
}

function filterItems(items, filters) {
  const q = (filters.q || '').trim().toLowerCase();
  return items.filter(item => {
    const bucket = [item.name, item.path, item.summary, item.improvements, item.risks, item.notes].join(' ').toLowerCase();
    if (q && !bucket.includes(q)) return false;
    if (filters.folder && filters.folder !== 'all' && item.folder !== filters.folder) return false;
    if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.risk && filters.risk !== 'all' && item.riskLevel !== filters.risk) return false;
    return true;
  });
}

function paginate(items, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(totalPages, Math.max(1, page));
  const start = (safePage - 1) * perPage;
  return { page: safePage, totalPages, items: items.slice(start, start + perPage) };
}

function renderPagination(root, page, totalPages, onPage) {
  if (!root) return;
  root.innerHTML = '';
  const makeBtn = (label, target, disabled = false) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = label;
    btn.disabled = disabled;
    btn.onclick = () => onPage(target);
    return btn;
  };
  root.append(makeBtn('上一頁', page - 1, page <= 1));
  const info = document.createElement('span');
  info.textContent = `第 ${page} / ${totalPages} 頁`;
  root.append(info);
  root.append(makeBtn('下一頁', page + 1, page >= totalPages));
}

function installPwaPrompt(buttonSelector = '#install-btn') {
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    const btn = qs(buttonSelector);
    if (btn) btn.classList.remove('hide');
  });
  const btn = qs(buttonSelector);
  if (btn) {
    btn.addEventListener('click', async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice;
      deferred = null;
      btn.classList.add('hide');
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
