const version = 'v1.9';
const CACHE_NAME = 'workdispatch-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
  './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event (Network first, falling back to cache)
self.addEventListener('fetch', e => {
  // For navigation or HTML files, try the network first so updates show instantly
  if (e.request.mode === 'navigate' || e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          // Update cache with the fresh version
          return caches.open(CACHE_NAME).then(cache => {
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
