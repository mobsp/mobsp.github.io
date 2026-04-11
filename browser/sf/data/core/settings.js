(function(){
  const key = 'sf_settings_v1';
  const defaults = { privateMode: false, showSSL: true };

  function load() {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaults)); } catch(e) { return defaults; }
  }

  function save(obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const close = document.getElementById('close-settings');
    const privateMode = document.getElementById('private-mode');
    const sslLock = document.getElementById('ssl-lock');

    const s = load();
    if (privateMode) privateMode.checked = !!s.privateMode;
    if (sslLock) sslLock.checked = !!s.showSSL;

    if (settingsBtn) settingsBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (close) close.addEventListener('click', () => modal.classList.add('hidden'));

    if (privateMode) privateMode.addEventListener('change', e => {
      s.privateMode = e.target.checked;
      save(s);
    });
    if (sslLock) sslLock.addEventListener('change', e => {
      s.showSSL = e.target.checked;
      save(s);
    });
  });

  window.SFSettings = { load, save };
})();
