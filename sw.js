const CACHE_NAME = 'mobsp-cache-v3';
const ASSETS = [
  './index.html',
  './manifest.json',
  './Mobsp-System/',
  './blog/',
  './music/',
  './shots/',
  './tol/',
  './wiki/',
  './setting/'
];

// 安裝並緩存核心檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 啟動時清理舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 攔截請求，優先從緩存讀取，若無則從網路抓取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
