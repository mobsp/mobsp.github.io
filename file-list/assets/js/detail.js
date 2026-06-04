(async () => {
  const {
    loadDataset,
    getItems,
    safeName,
    safeSummary,
    prettyUrl,
    typeLabel,
    toggleSaved,
    isSaved,
    renderCard,
    mountSaveButtons,
    qs,
    escapeHtml,
  } = window.App;

  const wrap = document.getElementById("detail-wrap");
  const related = document.getElementById("related-list");
  const favBtn = document.getElementById("detail-fav-btn");
  const id = qs("id");

  try {
    const dataset = await loadDataset();
    const items = getItems(dataset);
    const item = items.find((entry) => entry.id === id);

    if (!item) {
      wrap.innerHTML = `<div class="empty-state">找不到這筆資料。</div>`;
      return;
    }

    document.title = `${safeName(item)} - 詳情`;

    function renderFav() {
      favBtn.textContent = isSaved(item.id) ? "★" : "☆";
    }

    renderFav();
    favBtn.addEventListener("click", () => {
      toggleSaved(item.id);
      renderFav();
    });

    wrap.innerHTML = `
      <article class="detail-card">
        <div class="detail-header">
          <div class="eyebrow">${escapeHtml(item.folder || "root")}</div>
          <h1 class="detail-title">${escapeHtml(safeName(item))}</h1>
          <div class="detail-meta">
            <span class="badge">${escapeHtml(typeLabel(item.type))}</span>
            <span class="badge">${escapeHtml(item.folder || "root")}</span>
            <span class="${item.riskLevel === "高" ? "badge badge-risk-high" : item.riskLevel === "中" ? "badge badge-risk-medium" : "badge badge-risk-low"}">${escapeHtml(item.riskLevel || "低")}</span>
          </div>
          <div class="detail-links">
            <a class="btn btn-primary" href="${escapeHtml(item.url || "#")}" target="_blank" rel="noopener">開啟原始連結</a>
            <a class="btn btn-secondary" href="${escapeHtml(prettyUrl(item))}" target="_blank" rel="noopener">開啟 Pretty URL</a>
          </div>
        </div>

        <section class="detail-section">
          <h3>檔案路徑</h3>
          <p>${escapeHtml(item.path || "")}</p>
        </section>

        <section class="detail-section">
          <h3>功能摘要</h3>
          <p>${escapeHtml(safeSummary(item))}</p>
        </section>

        <section class="detail-section">
          <h3>進階 / 優化建議</h3>
          <p>${escapeHtml(item.improvements || "目前沒有補充建議。")}</p>
        </section>

        <section class="detail-section">
          <h3>風險 / 安全 / 隱私 / 注意事項</h3>
          <p>${escapeHtml(item.risks || "目前沒有補充風險說明。")}</p>
        </section>

        <section class="detail-section">
          <h3>其它</h3>
          <p>${escapeHtml(item.notes || "目前沒有其它補充。")}</p>
        </section>
      </article>
    `;

    const relatedItems = items
      .filter((entry) => entry.id !== item.id && entry.folder === item.folder)
      .slice(0, 4);

    related.innerHTML = relatedItems.length
      ? relatedItems.map(renderCard).join("")
      : `<div class="empty-state">目前沒有更多同資料夾項目。</div>`;

    mountSaveButtons(related);
  } catch (error) {
    wrap.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
})();
