(function(){
  // lightweight simulation of sync (no external network)
  const key = 'sf_sync_v1';
  function save(payload) { localStorage.setItem(key, JSON.stringify(payload)); }
  function load() { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { return {}; } }

  document.addEventListener('DOMContentLoaded', () => {
    console.log('Sync module ready (local simulation)');
  });

  window.SFSync = { save, load };
})();
