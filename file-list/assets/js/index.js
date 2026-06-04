
document.addEventListener('DOMContentLoaded', async () => {
  installPwaPrompt();
  const data = await loadDataset();
  qs('#total-count').textContent = data.total;
  qs('#public-count').textContent = data.items.filter(x => x.publicPage).length;
  qs('#folder-count').textContent = new Set(data.items.map(x => x.folder)).size;
  qs('#high-risk-count').textContent = data.items.filter(x => x.riskLevel === '高').length;

  const latest = data.items.slice().sort((a, b) => a.path.localeCompare(b.path, 'en')).slice(0, 6);
  qs('#featured-grid').innerHTML = latest.map(cardTemplate).join('');
  wireSaveButtons(qs('#featured-grid'));

  const folders = [...new Set(data.items.map(x => x.folder))].sort((a, b) => a.localeCompare(b, 'en'));
  qs('#folder-chips').innerHTML = folders.map(folder =>
    `<a class="btn" href="./all-links.html?folder=${encodeURIComponent(folder)}">${folder}</a>`
  ).join('');

  const pages = data.items.filter(x => x.publicPage).slice(0, 8);
  qs('#public-grid').innerHTML = pages.map(cardTemplate).join('');
  wireSaveButtons(qs('#public-grid'));
});
