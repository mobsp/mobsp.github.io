(function(){
  const defaultHeaders = { 'Content-Type': 'application/json' };

  async function getJSON(url) {
    const res = await fetch(url, { headers: defaultHeaders });
    if (!res.ok) throw new Error('Network error');
    return res.json();
  }

  window.SFApi = { getJSON };
})();
