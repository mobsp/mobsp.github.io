(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // simulate cookie management (note: do not store secrets)
    try { document.cookie = "sf_demo=1; path=/"; } catch(e) {}

    const viewport = document.getElementById('viewport');
    if (viewport) {
      viewport.addEventListener('error', () => {
        console.warn('iframe load error (possible CORS or blocked content)');
      });
    }

    console.log('Security module initialized (simulation)');
  });

  window.SFSecurity = {};
})();
