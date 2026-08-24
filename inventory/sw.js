const version = 'v9'; // INCREMENT THIS (v3, v4, etc.) whenever you update your code
const cacheName = `inventory-${version}`;
const assets = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Forces the waiting service worker to become the active one immediately
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // Return cached version if found, otherwise fetch from network
      return res || fetch(e.request);
    })
  );
});
