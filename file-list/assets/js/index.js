document.addEventListener('DOMContentLoaded', async () => {
  installPwaPrompt();

  const data = await loadDataset();
  const items = data.items;

  qs('#total-count').textContent = String(items.length);
  qs('#public-count').textContent = String(items.filter(item => item.publicPage).length);
  qs('#folder-count').textContent = String(new Set(items.map(item => item.folder)).size);
  qs('#high-risk-count').textContent = String(items.filter(item => item.riskLevel === '高').length);

  const folders = [...new Set(items.map(item => item.folder))].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
  qs('#folder-chips').innerHTML = folders
    .map(folder => `<a class="btn" href="./all-links.html?folder=${encodeURIComponent(folder)}">${escapeHtml(folder)}</a>`)
    .join('');

  const publicShortcuts = items.filter(item => item.publicPage).slice(0, 6);
  qs('#public-shortcuts').innerHTML = publicShortcuts.map(makeQuickLink).join('');

  const featured = items.slice().sort((a, b) => a.path.localeCompare(b.path, 'en')).slice(0, 6);
  qs('#featured-grid').innerHTML = featured.map(cardTemplate).join('');
  wireSaveButtons(qs('#featured-grid'));
});