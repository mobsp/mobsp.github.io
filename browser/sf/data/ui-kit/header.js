document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('app-header');
  if (!header) return;
  header.innerHTML = `
    <div class="header-inner" style="display:flex;align-items:center;gap:12px;padding:8px 12px;">
      <img src="data/media/logo.png" alt="Safari Clone" style="height:28px;">
      <div style="font-weight:600">Safari Clone</div>
      <div style="margin-left:auto;color:var(--muted)">模擬瀏覽器</div>
    </div>
  `;
});
