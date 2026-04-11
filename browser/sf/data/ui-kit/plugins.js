(function(){
  const plugins = [];

  function register(plugin) {
    if (!plugin || !plugin.name || typeof plugin.run !== 'function') return;
    plugins.push(plugin);
    try { plugin.run(); } catch(e) { console.error('Plugin error', plugin.name, e); }
  }

  // built-in example plugins
  document.addEventListener('DOMContentLoaded', () => {
    register({ name: 'AdBlock', run: () => console.log('AdBlock plugin active') });
    register({ name: 'Translator', run: () => console.log('Translator plugin active') });
  });

  window.SFPlugins = { register, plugins };
})();
