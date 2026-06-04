
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataset();
  const render = () => {
    const ids = getSavedIds();
    const items = data.items.filter(x => ids.includes(x.id));
    const mount = qs('#saved-root');
    qs('#saved-count').textContent = items.length;
    if (!items.length) {
      mount.innerHTML = `<div class="empty-state"><h2>目前沒有收藏</h2><p>去所有連結清單把常用項目先存起來。</p><a class="btn primary" href="./all-links.html">前往所有連結清單</a></div>`;
      return;
    }
    mount.innerHTML = `<div class="grid cards">${items.map(cardTemplate).join('')}</div>`;
    wireSaveButtons(mount);
  };
  document.addEventListener('saved:changed', render);
  render();
});
