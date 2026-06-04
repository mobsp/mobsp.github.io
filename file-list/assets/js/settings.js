
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataset();
  qs('#dataset-info').innerHTML = `
    <div class="kv">
      <div class="kv-row"><div class="kv-key">來源</div><div>${escapeHtml(data.sourceWorkbook)}</div></div>
      <div class="kv-row"><div class="kv-key">總筆數</div><div>${data.total}</div></div>
      <div class="kv-row"><div class="kv-key">產生日期</div><div>${escapeHtml(data.generatedAt)}</div></div>
      <div class="kv-row"><div class="kv-key">站點基底</div><div>${escapeHtml(data.siteBase)}</div></div>
    </div>
  `;
  qs('#clear-saved').onclick = () => {
    setSavedIds([]);
    qs('#clear-saved').textContent = '已清除收藏';
    setTimeout(() => qs('#clear-saved').textContent = '清除收藏', 1200);
  };
  qs('#export-json').onclick = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'files.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
});
