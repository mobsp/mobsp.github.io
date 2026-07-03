const DATA_URL = './data/files.json';
const REPO_OWNER = 'mobsp';
const REPO_NAME = '';
const REPO_BRANCH = 'main';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'icon', 'avif', 'tif', 'tiff']);
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac', 'opus']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v', 'avi', 'mkv', 'ogv']);
const CODE_EXTENSIONS = new Set(['html', 'css', 'js', 'json', 'md', 'txt', 'xml', 'yml', 'yaml', 'py', 'svg']);

const state = {
  dataset: null,
  deferredPrompt: null
};

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getExtension(path = '') {
  const clean = String(path).split('?')[0].split('#')[0];
  const parts = clean.split('/');
  const fileName = parts[parts.length - 1] || '';
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '';
}

function getMediaCategory(path = '') {
  const ext = getExtension(path);
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  return 'none';
}

function isCodeFile(path = '') {
  const ext = getExtension(path);
  return CODE_EXTENSIONS.has(ext);
}

function getLanguage(path = '') {
  const ext = getExtension(path);
  const map = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    json: 'json',
    md: 'markdown',
    txt: 'text',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
    py: 'python',
    svg: 'svg'
  };
  return map[ext] || 'text';
}

function deriveGithubBlobUrl(path) {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${REPO_BRANCH}/${path}`;
}

function deriveGithubEditUrl(path) {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/${REPO_BRANCH}/${path}`;
}

function deriveGithubRawUrl(path) {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${path}`;
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
  return map[type] || type || '未知';
}

function badge(text, className = '') {
  return `<span class="badge ${className}">${escapeHtml(text)}</span>`;
}

function withDerivedFields(item) {
  const mediaCategory = getMediaCategory(item.path);
  const extension = getExtension(item.path);

  return {
    ...item,
    extension,
    mediaCategory,
    isImage: mediaCategory === 'image',
    isAudio: mediaCategory === 'audio',
    isVideo: mediaCategory === 'video',
    isCodeFile: isCodeFile(item.path),
    language: getLanguage(item.path),
    githubBlobUrl: deriveGithubBlobUrl(item.path),
    githubEditUrl: deriveGithubEditUrl(item.path),
    githubRawUrl: deriveGithubRawUrl(item.path)
  };
}

async function loadDataset() {
  if (state.dataset) return state.dataset;

  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('無法載入 files.json');
  }

  const raw = await res.json();
  state.dataset = {
    ...raw,
    items: (raw.items || []).map(withDerivedFields),
    total: (raw.items || []).length
  };
  return state.dataset;
}

function mediaBadge(item) {
  if (item.mediaCategory === 'image') return badge('圖檔', 'media-image');
  if (item.mediaCategory === 'audio') return badge('音訊', 'media-audio');
  if (item.mediaCategory === 'video') return badge('影片', 'media-video');
  return '';
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
        ${mediaBadge(item)}
      </div>

      <p>${escapeHtml(item.summary || '尚未提供說明')}</p>

      <div class="card-actions">
        <a class="btn primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟連結</a>
        <a class="btn" href="./detail.html?id=${encodeURIComponent(item.id)}">查看詳情</a>
        <button class="btn save-btn" data-id="${escapeHtml(item.id)}" type="button">${isSaved(item.id) ? '取消收藏' : '收藏'}</button>
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
          ${mediaBadge(item)}
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
            <th>媒體</th>
            <th>風險</th>
            <th>網站連結</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>
                <a href="./detail.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a>
                <div class="card-sub">${escapeHtml(item.summary || '')}</div>
              </td>
              <td class="mono">${escapeHtml(item.path)}</td>
              <td>${escapeHtml(item.folder)}</td>
              <td>${escapeHtml(fmtType(item.type))}</td>
              <td>${item.mediaCategory === 'none' ? '—' : escapeHtml(item.mediaCategory)}</td>
              <td>${badge(item.riskLevel, `risk-${item.riskLevel}`)}</td>
              <td><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem('file-list:saved') || '[]');
  } catch {
    return [];
  }
}

function setSavedIds(ids) {
  localStorage.setItem('file-list:saved', JSON.stringify([...new Set(ids)]));
  document.dispatchEvent(new CustomEvent('saved:changed'));
}

function isSaved(id) {
  return getSavedIds().includes(id);
}

function toggleSaved(id) {
  const ids = getSavedIds();
  if (ids.includes(id)) {
    setSavedIds(ids.filter(x => x !== id));
  } else {
    setSavedIds([...ids, id]);
  }
}

function wireSaveButtons(root = document) {
  qsa('.save-btn', root).forEach(btn => {
    btn.onclick = () => {
      const { id } = btn.dataset;
      toggleSaved(id);
      const savedNow = isSaved(id);
      btn.textContent = savedNow ? '取消收藏' : '收藏';
    };
  });
}

function riskRank(value) {
  if (value === '高') return 3;
  if (value === '中') return 2;
  return 1;
}

function sortItems(items, sort) {
  const sorted = items.slice();
  sorted.sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name, 'zh-Hant');
    if (sort === 'name-desc') return b.name.localeCompare(a.name, 'zh-Hant');
    if (sort === 'path-asc') return a.path.localeCompare(b.path, 'en');
    if (sort === 'path-desc') return b.path.localeCompare(a.path, 'en');
    if (sort === 'risk-desc') return riskRank(b.riskLevel) - riskRank(a.riskLevel) || a.name.localeCompare(b.name, 'zh-Hant');
    return 0;
  });
  return sorted;
}

function filterItems(items, filters) {
  return items.filter(item => {
    const q = String(filters.q || '').trim().toLowerCase();
    const media = item.mediaCategory;

    if (filters.folder && filters.folder !== 'all' && item.folder !== filters.folder) {
      return false;
    }

    if (filters.type && filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }

    if (filters.risk && filters.risk !== 'all' && item.riskLevel !== filters.risk) {
      return false;
    }

    if (media === 'image' && !filters.showImages) return false;
    if (media === 'audio' && !filters.showAudio) return false;
    if (media === 'video' && !filters.showVideo) return false;

    if (!q) return true;

    const pool = [
      item.name,
      item.path,
      item.summary,
      item.improvements,
      item.risks,
      item.notes,
      item.folder,
      item.type
    ].join(' ').toLowerCase();

    return pool.includes(q);
  });
}

function paginate(items, page = 1, perPage = 24) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const nextPage = Math.min(Math.max(1, page), totalPages);
  const start = (nextPage - 1) * perPage;
  return {
    page: nextPage,
    totalPages,
    items: items.slice(start, start + perPage)
  };
}

function renderPagination(root, currentPage, totalPages, onPageClick) {
  if (!root) return;
  if (totalPages <= 1) {
    root.innerHTML = '';
    return;
  }

  const parts = [];
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  for (let i = 1; i <= totalPages; i += 1) {
    if (pages.has(i)) parts.push(i);
  }

  const normalized = [];
  let previous = 0;
  for (const p of [...parts].sort((a, b) => a - b)) {
    if (previous && p - previous > 1) normalized.push('…');
    normalized.push(p);
    previous = p;
  }

  root.innerHTML = `
    <button class="btn" type="button" data-page="${Math.max(1, currentPage - 1)}">上一頁</button>
    ${normalized.map(v => v === '…'
      ? `<span class="btn ghost">…</span>`
      : `<button class="btn ${v === currentPage ? 'primary' : ''}" type="button" data-page="${v}">${v}</button>`).join('')}
    <button class="btn" type="button" data-page="${Math.min(totalPages, currentPage + 1)}">下一頁</button>
  `;

  qsa('button[data-page]', root).forEach(btn => {
    btn.onclick = () => onPageClick(Number(btn.dataset.page));
  });
}

function makeQuickLink(item) {
  const icon = item.publicPage
    ? '◎'
    : item.isCodeFile
      ? '</>'
      : item.mediaCategory === 'image'
        ? '圖'
        : item.mediaCategory === 'audio'
          ? '音'
          : item.mediaCategory === 'video'
            ? '影'
            : '•';

  return `
    <a class="quick-link" href="./detail.html?id=${encodeURIComponent(item.id)}">
      <div class="quick-link-icon">${escapeHtml(icon)}</div>
      <div class="quick-link-title">${escapeHtml(item.name)}</div>
      <div class="quick-link-sub">${escapeHtml(item.folder)}</div>
    </a>
  `;
}

function triggerDownload(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function installPwaPrompt() {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    state.deferredPrompt = event;
    const btn = qs('#install-btn');
    if (!btn) return;

    btn.classList.remove('hide');
    btn.onclick = async () => {
      if (!state.deferredPrompt) return;
      state.deferredPrompt.prompt();
      await state.deferredPrompt.userChoice;
      state.deferredPrompt = null;
      btn.classList.add('hide');
    };
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}