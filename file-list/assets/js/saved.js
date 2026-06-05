document.addEventListener('DOMContentLoaded', async () => {
  const root = qs('#saved-root');
  const count = qs('#saved-count');

  async function render() {
    const data = await loadDataset();
    const savedIds = getSavedIds();
    const items = data.items.filter(item => savedIds.includes(item.id));

    count.textContent = String(items.length);

    if (!items.length) {
      root.innerHTML = `
        <div class="empty-state panel">
          <h3>目前沒有收藏</h3>
          <p>你可以在清單頁或詳情頁按下收藏，之後會集中顯示在這裡。</p>
          <div class="card-actions" style="justify-content:center;margin-top:14px">
            <a class="btn primary" href="./all-links.html">前往所有連結</a>
          </div>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="grid cards">
        ${items.map(cardTemplate).join('')}
      </div>
    `;

    wireSaveButtons(root);
  }

  document.addEventListener('saved:changed', render);
  await render();
});