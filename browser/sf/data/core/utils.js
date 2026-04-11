(function(){
  function safeJSONParse(s, fallback = null) {
    try { return JSON.parse(s); } catch(e) { return fallback; }
  }

  function fetchJSON(url, opts = {}) {
    return fetch(url, opts).then(r => r.ok ? r.json() : Promise.reject(new Error('Fetch error')));
  }

  window.SFUtils = { safeJSONParse, fetchJSON };
})();
