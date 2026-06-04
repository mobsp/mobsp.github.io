
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataset();
  const items = data.items;
  const folders = ['all', ...new Set(items.map(x => x.folder)).values()];
  const types = ['all', ...new Set(items.map(x => x.type)).values()];

  qs('#folder').innerHTML = folders.map(v => `<option value="${v}">${v === 'all' ? '全部資料夾' : v}</option>`).join('');
  qs('#type').innerHTML = types.map(v => `<option value="${v}">${v === 'all' ? '全部類型' : fmtType(v)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  if (params.get('folder')) qs('#folder').value = params.get('folder');

  const model = { page: 1 };

  const render = () => {
    const filters = {
      q: qs('#search').value,
      folder: qs('#folder').value,
      type: qs('#type').value,
      risk: qs('#risk').value
    };
    const sort = qs('#sort').value;
    const view = qs('#view').value;
    const perPage = Number(qs('#per-page').value);

    const filtered = sortItems(filterItems(items, filters), sort);
    const pager = paginate(filtered, model.page, perPage);
    model.page = pager.page;

    qs('#result-meta').textContent = `共 ${filtered.length} 筆，顯示第 ${pager.page} 頁`;
    const mount = qs('#results');

    if (!filtered.length) {
      mount.innerHTML = `<div class="empty-state"><h3>找不到符合條件的項目</h3><p>請調整搜尋字詞、資料夾、類型或風險條件。</p></div>`;
      qs('#pagination').innerHTML = '';
      return;
    }

    if (view === 'cards') {
      mount.innerHTML = `<div class="grid cards">${pager.items.map(cardTemplate).join('')}</div>`;
      wireSaveButtons(mount);
    } else if (view === 'compact') {
      mount.innerHTML = `<div class="compact-list">${pager.items.map(compactTemplate).join('')}</div>`;
    } else {
      mount.innerHTML = tableTemplate(pager.items);
    }

    renderPagination(qs('#pagination'), pager.page, pager.totalPages, nextPage => {
      model.page = nextPage;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  ['#search', '#folder', '#type', '#risk', '#sort', '#view', '#per-page'].forEach(sel => {
    const el = qs(sel);
    const eventName = sel === '#search' ? 'input' : 'change';
    el.addEventListener(eventName, () => {
      model.page = 1;
      render();
    });
  });

  qs('#reset-filters').addEventListener('click', () => {
    qs('#search').value = '';
    qs('#folder').value = 'all';
    qs('#type').value = 'all';
    qs('#risk').value = 'all';
    qs('#sort').value = 'name-asc';
    qs('#view').value = 'cards';
    qs('#per-page').value = '24';
    model.page = 1;
    render();
  });

  render();
});
