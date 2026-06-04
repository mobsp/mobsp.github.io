
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataset();
  const id = new URLSearchParams(location.search).get('id');
  const item = data.items.find(x => x.id === id);

  if (!item) {
    qs('#detail-root').innerHTML = `<div class="empty-state"><h2>找不到這筆資料</h2><p>請從清單頁重新進入。</p><a class="btn primary" href="./all-links.html">回到所有連結清單</a></div>`;
    return;
  }

  document.title = `${item.name} | file-list`;
  qs('#detail-root').innerHTML = `
    <div class="detail-layout">
      <section class="detail-section reading-prose">
        <div class="meta">
          ${badge(item.folder, 'folder')}
          ${badge(fmtType(item.type))}
          ${badge(`風險 ${item.riskLevel}`, `risk-${item.riskLevel}`)}
        </div>
        <h1>${escapeHtml(item.name)}</h1>
        <p>${escapeHtml(item.summary || '尚未提供說明')}</p>
        <div class="card-actions">
          <a class="btn primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟原始連結</a>
          <button class="btn save-btn" data-id="${escapeHtml(item.id)}">收藏</button>
          <button class="btn" id="copy-link">複製網址</button>
        </div>

        <div class="detail-section surface-soft" style="margin-top:16px">
          <h2>進階/優化建議</h2>
          <p>${escapeHtml(item.improvements || '目前沒有補充建議')}</p>
        </div>

        <div class="detail-section surface-soft" style="margin-top:16px">
          <h2>風險/安全/隱私/注意事項</h2>
          <p>${escapeHtml(item.risks || '目前沒有補充風險說明')}</p>
        </div>

        <div class="detail-section surface-soft" style="margin-top:16px">
          <h2>其它</h2>
          <p>${escapeHtml(item.notes || '—')}</p>
        </div>
      </section>

      <aside class="detail-section">
        <h2>檔案資訊</h2>
        <div class="kv">
          <div class="kv-row"><div class="kv-key">檔案路徑</div><div class="mono">${escapeHtml(item.path)}</div></div>
          <div class="kv-row"><div class="kv-key">網站連結</div><div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.url)}</a></div></div>
          <div class="kv-row"><div class="kv-key">Pretty URL</div><div><a href="${escapeHtml(item.prettyUrl)}" target="_blank" rel="noopener">${escapeHtml(item.prettyUrl)}</a></div></div>
          <div class="kv-row"><div class="kv-key">資料夾</div><div>${escapeHtml(item.folder)}</div></div>
          <div class="kv-row"><div class="kv-key">類型</div><div>${escapeHtml(fmtType(item.type))}</div></div>
          <div class="kv-row"><div class="kv-key">公開頁面</div><div>${item.publicPage ? '是' : '否'}</div></div>
        </div>
      </aside>
    </div>
  `;

  wireSaveButtons(qs('#detail-root'));
  qs('#copy-link').onclick = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      qs('#copy-link').textContent = '已複製';
      setTimeout(() => qs('#copy-link').textContent = '複製網址', 1200);
    } catch {}
  };
});
