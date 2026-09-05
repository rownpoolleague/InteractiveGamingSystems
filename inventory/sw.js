const version = 'v1.6'; // INCREMENT THIS
const cacheName = `inventory-${version}`;
const assets = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    }).then(() => {
      return clients.claim(); // Immediately take control of open pages
    })
  );
});

// ✅ FIXED FETCH STRATEGY: Network first for HTML/main requests, fallback to cache
self.addEventListener('fetch', e => {
  // For navigation or HTML files, try the network first so updates show instantly
  if (e.request.mode === 'navigate' || e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          // Update cache with the fresh version
          return caches.open(cacheName).then(cache => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(e.request);
        })
    );
  } else {
    // Standard cache-first for other static assets (images, icons, etc.)
    e.respondWith(
      caches.match(e.request).then(res => {
        return res || fetch(e.request);
      })
    );
  }
});
