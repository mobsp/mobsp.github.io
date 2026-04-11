(function(){
  function createTabElement(title = '新分頁', url = 'about:blank') {
    const el = document.createElement('div');
    el.className = 'tab';
    el.textContent = title;
    el.dataset.url = url;
    el.tabIndex = 0;
    return el;
  }

  function initTabs() {
    const tabs = document.getElementById('tabs');
    const addBtn = document.getElementById('add-tab');
    const viewport = document.getElementById('viewport');
    const urlBar = document.getElementById('url-bar');

    addBtn.addEventListener('click', () => {
      const newTab = createTabElement();
      tabs.insertBefore(newTab, addBtn);
      switchTab(newTab);
    });

    tabs.addEventListener('click', e => {
      if (e.target.classList.contains('tab')) switchTab(e.target);
    });

    function switchTab(tabEl) {
      const active = tabs.querySelector('.tab.active');
      if (active) active.classList.remove('active');
      tabEl.classList.add('active');
      const url = tabEl.dataset.url || 'about:blank';
      viewport.src = url;
      if (urlBar) urlBar.value = url;
    }

    // initial active tab
    const initial = tabs.querySelector('.tab');
    if (initial) switchTab(initial);
  }

  document.addEventListener('DOMContentLoaded', initTabs);
  window.SFTabs = { createTabElement };
})();
