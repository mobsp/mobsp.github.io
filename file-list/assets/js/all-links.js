(async () => {
  const {
    loadDataset,
    getItems,
    filterItems,
    sortItems,
    paginate,
    renderCard,
    renderCompactRow,
    renderTable,
    renderPagination,
    mountSaveButtons,
    qs,
  } = window.App;

  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const viewSelect = document.getElementById("view-select");
  const pageSizeSelect = document.getElementById("page-size-select");
  const folderFilter = document.getElementById("folder-filter");
  const typeFilter = document.getElementById("type-filter");
  const riskFilter = document.getElementById("risk-filter");
  const publicFilter = document.getElementById("public-filter");
  const resultArea = document.getElementById("result-area");
  const resultCount = document.getElementById("result-count");
  const pagination = document.getElementById("pagination");
  const toggleFilterPanel = document.getElementById("toggle-filter-panel");
  const filterPanel = document.getElementById("filter-panel");

  const state = {
    q: qs("q") || "",
    folder: qs("folder") || "",
    type: qs("type") || "",
    risk: qs("risk") || "",
    publicOnly: qs("public") === "1",
    sort: qs("sort") || "name-asc",
    view: qs("view") || "cards",
    pageSize: Number(qs("pageSize") || "24"),
    page: Number(qs("page") || "1"),
  };

  let items = [];

  function syncControls() {
    searchInput.value = state.q;
    sortSelect.value = state.sort;
    viewSelect.value = state.view;
    pageSizeSelect.value = String(state.pageSize);
    folderFilter.value = state.folder;
    typeFilter.value = state.type;
    riskFilter.value = state.risk;
    publicFilter.checked = state.publicOnly;
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.folder) params.set("folder", state.folder);
    if (state.type) params.set("type", state.type);
    if (state.risk) params.set("risk", state.risk);
    if (state.publicOnly) params.set("public", "1");
    if (state.sort !== "name-asc") params.set("sort", state.sort);
    if (state.view !== "cards") params.set("view", state.view);
    if (state.pageSize !== 24) params.set("pageSize", String(state.pageSize));
    if (state.page !== 1) params.set("page", String(state.page));
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }

  function populateFilters(list) {
    const folders = [...new Set(list.map((item) => item.folder || "root"))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
    const types = [...new Set(list.map((item) => item.type || "other"))].sort((a, b) => a.localeCompare(b, "zh-Hant"));

    folderFilter.innerHTML = `<option value="">全部</option>${folders.map((x) => `<option value="${x}">${x}</option>`).join("")}`;
    typeFilter.innerHTML = `<option value="">全部</option>${types.map((x) => `<option value="${x}">${x}</option>`).join("")}`;
  }

  function render() {
    const filtered = sortItems(filterItems(items, state), state.sort);
    const paging = paginate(filtered, state.page, state.pageSize);
    state.page = paging.currentPage;

    resultCount.textContent = `${paging.total} 筆`;
    resultArea.className = `result-area ${state.view}`;

    if (paging.total === 0) {
      resultArea.innerHTML = `<div class="empty-state">找不到符合條件的資料。</div>`;
      pagination.innerHTML = "";
      syncUrl();
      return;
    }

    if (state.view === "table") {
      resultArea.innerHTML = renderTable(paging.pageItems);
    } else if (state.view === "compact") {
      resultArea.innerHTML = paging.pageItems.map(renderCompactRow).join("");
    } else {
      resultArea.innerHTML = paging.pageItems.map(renderCard).join("");
    }

    mountSaveButtons(resultArea);
    renderPagination(pagination, paging.currentPage, paging.pages, (page) => {
      state.page = page;
      render();
    });
    syncUrl();
  }

  function bindInputEvents() {
    searchInput.addEventListener("input", () => {
      state.q = searchInput.value.trim();
      state.page = 1;
      render();
    });

    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });

    viewSelect.addEventListener("change", () => {
      state.view = viewSelect.value;
      render();
    });

    pageSizeSelect.addEventListener("change", () => {
      state.pageSize = Number(pageSizeSelect.value);
      state.page = 1;
      render();
    });

    folderFilter.addEventListener("change", () => {
      state.folder = folderFilter.value;
      state.page = 1;
      render();
    });

    typeFilter.addEventListener("change", () => {
      state.type = typeFilter.value;
      state.page = 1;
      render();
    });

    riskFilter.addEventListener("change", () => {
      state.risk = riskFilter.value;
      state.page = 1;
      render();
    });

    publicFilter.addEventListener("change", () => {
      state.publicOnly = publicFilter.checked;
      state.page = 1;
      render();
    });

    toggleFilterPanel.addEventListener("click", () => {
      filterPanel.classList.toggle("hidden");
    });
  }

  try {
    const dataset = await loadDataset();
    items = getItems(dataset);
    populateFilters(items);
    syncControls();
    bindInputEvents();
    render();
  } catch (error) {
    resultArea.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
})();
