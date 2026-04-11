(function(){
  function initDownloads() {
    const btn = document.getElementById('downloads-btn');
    const modal = document.getElementById('downloads-modal');
    const list = document.getElementById('download-list');
    const close = document.getElementById('close-downloads');

    if (!btn) return;
    btn.addEventListener('click', () => {
      // simulate a download entry
      const li = document.createElement('li');
      li.textContent = '檔案下載中...';
      list.appendChild(li);
      modal.classList.remove('hidden');
      setTimeout(() => { li.textContent = '檔案下載完成'; }, 2500);
    });

    if (close) close.addEventListener('click', () => modal.classList.add('hidden'));
  }

  document.addEventListener('DOMContentLoaded', initDownloads);
  window.SFDownloads = { initDownloads };
})();
