const CACHE_NAME = 'rumors-v4-cache-main';
const OFFLINE_URL = '/rumors/offline.html';

const ASSETS_TO_CACHE = [
    '/rumors/',
    '/rumors/index.html',
    '/rumors/offline.html',
    '/rumors/manifest.json',
    '/rumors/css/core/reset.css',
    '/rumors/css/design-system/tokens.css',
    '/rumors/css/design-system/liquid-glass.css',
    '/rumors/css/layouts/app-shell.css',
    '/rumors/js/core/app.js',
    '/rumors/config/backend-mode.json',
    '/rumors/data/articles.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    / API 請求不走本地快取，使用 Network First
    if (event.request.url.includes('/api/') || event.request.url.includes('graphql')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    / 靜態資源使用 Cache First, Network Fallback
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});
