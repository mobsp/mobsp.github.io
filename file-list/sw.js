const CACHE_NAME = 'mobsp-file-list-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './all-links.html',
  './detail.html',
  './saved.html',
  './settings.html',
  './offline.html',
  './manifest.json',
  './assets/css/base.css',
  './assets/css/theme-mobsp-blog.css',
  './assets/js/app.js',
  './assets/js/index.js',
  './assets/js/all-links.js',
  './assets/js/detail.js',
  './assets/js/saved.js',
  './assets/js/settings.js',
  './data/files.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then(response => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        if (request.mode === 'navigate') {
          const offline = await caches.match('./offline.html');
          if (offline) return offline;
        }

        return new Response('Offline', {
          status: 503,
          statusText: 'Offline'
        });
      })
  );
});