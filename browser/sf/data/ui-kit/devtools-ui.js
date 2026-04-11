(function(){
  function initDevTools() {
    const devBtn = document.getElementById('devtools-btn');
    const devModal = document.getElementById('devtools-modal');
    const consoleOutput = document.getElementById('console-output');
    const close = document.getElementById('close-devtools');

    if (devBtn) devBtn.addEventListener('click', () => devModal.classList.remove('hidden'));
    if (close) close.addEventListener('click', () => devModal.classList.add('hidden'));

    // capture console.log
    const oldLog = console.log;
    console.log = function(...args) {
      oldLog.apply(console, args);
      if (consoleOutput) consoleOutput.textContent += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
    };
  }

  document.addEventListener('DOMContentLoaded', initDevTools);
  window.SFDevTools = { initDevTools };
})();
