(function(){
  const root = document.documentElement;
  const body = document.body;
  const darkToggle = () => {
    const saved = localStorage.getItem('sf_theme_dark') === '1';
    body.classList.toggle('dark', saved);
    const checkbox = document.getElementById('dark-mode');
    if (checkbox) checkbox.checked = saved;
  };

  function setDark(enabled) {
    localStorage.setItem('sf_theme_dark', enabled ? '1' : '0');
    document.body.classList.toggle('dark', enabled);
  }

  document.addEventListener('DOMContentLoaded', () => {
    darkToggle();
    const checkbox = document.getElementById('dark-mode');
    if (checkbox) {
      checkbox.addEventListener('change', e => setDark(e.target.checked));
    }
  });

  window.SFTheme = { setDark };
})();
