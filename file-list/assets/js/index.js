(async () => {
  const { loadDataset, getItems, renderCard, mountSaveButtons } = window.App;
  const statsEl = document.getElementById("home-stats");
  const folderEl = document.getElementById("folder-chips");
  const featuredEl = document.getElementById("featured-list");

  try {
    const dataset = await loadDataset();
    const items = getItems(dataset);
    const publicCount = items.filter((item) => item.publicPage).length;
    const folders = [...new Set(items.map((item) => item.folder || "root"))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
    const highRisk = items.filter((item) => item.riskLevel === "高").length;

    statsEl.innerHTML = [
      ["總筆數", items.length],
      ["公開頁面", publicCount],
      ["資料夾數", folders.length],
      ["高風險", highRisk],
    ].map(([label, value]) => `
      <article class="stat-card">
        <div class="eyebrow">${label}</div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
      </article>
    `).join("");

    folderEl.innerHTML = folders.slice(0, 12).map((folder) => `
      <a class="chip" href="./all-links.html?folder=${encodeURIComponent(folder)}">${folder}</a>
    `).join("");

    const featured = items
      .slice()
      .sort((a, b) => {
        const scoreA = (a.publicPage ? 2 : 0) + (a.type === "html-index" ? 2 : 0) + (a.riskLevel === "高" ? -1 : 0);
        const scoreB = (b.publicPage ? 2 : 0) + (b.type === "html-index" ? 2 : 0) + (b.riskLevel === "高" ? -1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 6);

    featuredEl.innerHTML = featured.map(renderCard).join("");
    mountSaveButtons(featuredEl);
  } catch (error) {
    statsEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
})();
