
const CACHE = 'file-list-v2';
const ASSETS = [
  './',
  './index.html',
  './all-links.html',
  './detail.html',
  './saved.html',
  './settings.html',
  './offline.html',
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
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return res;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      return cached || caches.match('./offline.html');
    })
  );
});
