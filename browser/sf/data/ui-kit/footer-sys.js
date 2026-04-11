document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('app-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:8px 12px;color:var(--muted);font-size:13px;">
      <div>© ${new Date().getFullYear()} Safari Clone</div>
      <div>Built with modular UI kit</div>
    </div>
  `;
});
