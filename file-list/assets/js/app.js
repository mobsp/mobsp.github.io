window.App = (() => {
  const DATA_URL = "./data/files.json";
  const STORAGE_KEY = "mobsp-file-list-saved";
  let datasetCache = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    return String(value ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadDataset() {
    if (datasetCache) return datasetCache;
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`無法載入資料: ${response.status}`);
    datasetCache = await response.json();
    if (!Array.isArray(datasetCache.items)) datasetCache.items = [];
    return datasetCache;
  }

  function getItems(dataset) {
    return Array.isArray(dataset?.items) ? dataset.items : [];
  }

  function normalizeText(value) {
    return String(value ?? "").trim();
  }

  function riskClass(level) {
    if (level === "高") return "badge badge-risk-high";
    if (level === "中") return "badge badge-risk-medium";
    return "badge badge-risk-low";
  }

  function safeName(item) {
    return normalizeText(item.name) || normalizeText(item.path) || "未命名";
  }

  function safeSummary(item) {
    return normalizeText(item.summary) || "目前沒有補充摘要。";
  }

  function typeLabel(type) {
    const map = {
      "html-index": "HTML 入口頁",
      html: "HTML 頁面",
      json: "JSON 資料",
      yaml: "YAML",
      yml: "YML",
      markdown: "Markdown",
      css: "CSS",
      javascript: "JavaScript",
      python: "Python",
      workflow: "Workflow",
      image: "圖片",
      text: "文字",
      other: "其它",
    };
    return map[type] || type || "未知";
  }

  function prettyUrl(item) {
    return item.prettyUrl || item.url || "#";
  }

  function byRiskValue(level) {
    if (level === "高") return 3;
    if (level === "中") return 2;
    return 1;
  }

  function filterItems(items, state) {
    return items.filter((item) => {
      const q = normalizeText(state.q).toLowerCase();
      if (q) {
        const haystack = [
          item.name,
          item.path,
          item.summary,
          item.improvements,
          item.risks,
          item.notes,
          item.folder,
          item.type,
        ].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (state.folder && item.folder !== state.folder) return false;
      if (state.type && item.type !== state.type) return false;
      if (state.risk && item.riskLevel !== state.risk) return false;
      if (state.publicOnly && !item.publicPage) return false;

      return true;
    });
  }

  function sortItems(items, sort) {
    const list = [...items];
    list.sort((a, b) => {
      if (sort === "name-desc") return safeName(b).localeCompare(safeName(a), "zh-Hant");
      if (sort === "path-asc") return (a.path || "").localeCompare(b.path || "", "zh-Hant");
      if (sort === "path-desc") return (b.path || "").localeCompare(a.path || "", "zh-Hant");
      if (sort === "risk-desc") return byRiskValue(b.riskLevel) - byRiskValue(a.riskLevel);
      if (sort === "risk-asc") return byRiskValue(a.riskLevel) - byRiskValue(b.riskLevel);
      return safeName(a).localeCompare(safeName(b), "zh-Hant");
    });
    return list;
  }

  function paginate(items, page, pageSize) {
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), pages);
    const start = (currentPage - 1) * pageSize;
    return {
      total,
      pages,
      currentPage,
      pageItems: items.slice(start, start + pageSize),
    };
  }

  function getSavedIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setSavedIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
    window.dispatchEvent(new CustomEvent("saved-changed"));
  }

  function isSaved(id) {
    return getSavedIds().includes(id);
  }

  function toggleSaved(id) {
    const ids = getSavedIds();
    if (ids.includes(id)) {
      setSavedIds(ids.filter((x) => x !== id));
      return false;
    }
    ids.push(id);
    setSavedIds(ids);
    return true;
  }

  function clearSaved() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("saved-changed"));
  }

  function renderBadges(item) {
    return `
      <div class="entry-card__meta">
        <span class="badge">${escapeHtml(item.folder || "root")}</span>
        <span class="badge">${escapeHtml(typeLabel(item.type))}</span>
        <span class="${riskClass(item.riskLevel)}">${escapeHtml(item.riskLevel || "低")}</span>
      </div>
    `;
  }

  function renderCard(item) {
    const fav = isSaved(item.id) ? "★" : "☆";
    return `
      <article class="entry-card" data-id="${escapeHtml(item.id)}">
        <div class="entry-card__top">
          <div>
            <h3 class="entry-card__title">${escapeHtml(safeName(item))}</h3>
            ${renderBadges(item)}
          </div>
          <button class="icon-btn js-save-btn" data-id="${escapeHtml(item.id)}" aria-label="收藏">${fav}</button>
        </div>
        <div class="entry-card__summary">${escapeHtml(safeSummary(item))}</div>
        <div class="entry-card__meta">
          <span>${escapeHtml(item.path || "")}</span>
        </div>
        <div class="entry-card__actions">
          <a class="btn btn-primary" href="./detail.html?id=${encodeURIComponent(item.id)}">查看詳情</a>
          <a class="btn btn-secondary" href="${escapeHtml(item.url || "#")}" target="_blank" rel="noopener">開啟連結</a>
        </div>
      </article>
    `;
  }

  function renderCompactRow(item) {
    const fav = isSaved(item.id) ? "★" : "☆";
    return `
      <article class="compact-row">
        <div class="compact-row__head">
          <div>
            <div class="compact-row__title">${escapeHtml(safeName(item))}</div>
            <div class="compact-row__meta">
              <span>${escapeHtml(item.path || "")}</span>
              <span>${escapeHtml(typeLabel(item.type))}</span>
              <span>${escapeHtml(item.riskLevel || "低")}</span>
            </div>
          </div>
          <button class="icon-btn js-save-btn" data-id="${escapeHtml(item.id)}">${fav}</button>
        </div>
        <div class="entry-card__actions">
          <a class="btn btn-primary" href="./detail.html?id=${encodeURIComponent(item.id)}">詳情</a>
          <a class="btn btn-secondary" href="${escapeHtml(item.url || "#")}" target="_blank" rel="noopener">開啟</a>
        </div>
      </article>
    `;
  }

  function renderTable(items) {
    return `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>名稱</th>
              <th>路徑</th>
              <th>類型</th>
              <th>風險</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => `
              <tr>
                <td>${escapeHtml(safeName(item))}</td>
                <td>${escapeHtml(item.path || "")}</td>
                <td>${escapeHtml(typeLabel(item.type))}</td>
                <td>${escapeHtml(item.riskLevel || "低")}</td>
                <td>
                  <a href="./detail.html?id=${encodeURIComponent(item.id)}">詳情</a> ·
                  <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noopener">開啟</a>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function mountSaveButtons(root = document) {
    root.querySelectorAll(".js-save-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const saved = toggleSaved(id);
        button.textContent = saved ? "★" : "☆";
      });
    });
  }

  function renderPagination(container, currentPage, pages, onChange) {
    if (!container) return;
    if (pages <= 1) {
      container.innerHTML = "";
      return;
    }

    const buttons = [];
    for (let page = 1; page <= pages; page += 1) {
      buttons.push(`
        <button class="page-btn ${page === currentPage ? "is-active" : ""}" data-page="${page}">
          ${page}
        </button>
      `);
    }

    container.innerHTML = buttons.join("");
    container.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => onChange(Number(button.dataset.page)));
    });
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("./sw.js");
      } catch {}
    }
  }

  registerServiceWorker();

  return {
    escapeHtml,
    slugify,
    loadDataset,
    getItems,
    safeName,
    safeSummary,
    typeLabel,
    prettyUrl,
    filterItems,
    sortItems,
    paginate,
    renderCard,
    renderCompactRow,
    renderTable,
    renderPagination,
    mountSaveButtons,
    getSavedIds,
    setSavedIds,
    isSaved,
    toggleSaved,
    clearSaved,
    qs,
  };
})();
