(async () => {
  const { loadDataset, getItems, getSavedIds, clearSaved, renderCard, mountSaveButtons } = window.App;
  const listEl = document.getElementById("saved-list");
  const countEl = document.getElementById("saved-count");
  const clearBtn = document.getElementById("clear-saved");

  function render(items) {
    const ids = getSavedIds();
    const saved = items.filter((item) => ids.includes(item.id));
    countEl.textContent = `${saved.length} 筆`;

    listEl.innerHTML = saved.length
      ? saved.map(renderCard).join("")
      : `<div class="empty-state">你目前還沒有收藏任何項目。</div>`;

    mountSaveButtons(listEl);
  }

  try {
    const dataset = await loadDataset();
    const items = getItems(dataset);
    render(items);

    clearBtn.addEventListener("click", () => {
      if (!confirm("確定要清空收藏嗎？")) return;
      clearSaved();
      render(items);
    });

    window.addEventListener("saved-changed", () => render(items));
  } catch (error) {
    listEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
})();
