(async () => {
  const { loadDataset, clearSaved } = window.App;
  const metaEl = document.getElementById("dataset-meta");
  const exportBtn = document.getElementById("export-json");
  const clearBtn = document.getElementById("clear-storage");

  try {
    const dataset = await loadDataset();
    const meta = [
      ["來源活頁簿", dataset.sourceWorkbook || "未知"],
      ["總筆數", dataset.total || dataset.items?.length || 0],
      ["產生時間", dataset.generatedAt || "未知"],
      ["站點基底", dataset.siteBase || "未知"],
    ];

    metaEl.innerHTML = meta.map(([label, value]) => `
      <div class="meta-item">
        <div class="meta-item__label">${label}</div>
        <div class="meta-item__value">${value}</div>
      </div>
    `).join("");

    exportBtn.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "files.json";
      a.click();
      URL.revokeObjectURL(url);
    });

    clearBtn.addEventListener("click", () => {
      if (!confirm("確定要清除收藏嗎？")) return;
      clearSaved();
      alert("已清除收藏。");
    });
  } catch (error) {
    metaEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
})();
