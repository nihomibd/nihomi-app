// NIHOMI PWA SERVICE WORKER — CACHE ENGINE V2
const CACHE_VERSION = 'v2';
const CURRENT_CACHE_NAME = `nihomi-pwa-cache-${CACHE_VERSION}`;

// Critical Static & Offline UI Assets
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/icon-quiz.png',
  '/assets/icon-lesson.png',
  '/assets/icon-ai.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Serif+JP:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap'
];

// 1. Install Phase — Precache Offline Shell & Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CURRENT_CACHE_NAME).then(async (cache) => {
      // Use individual caching to prevent a single missing remote font or asset from failing entire SW install
      await Promise.allSettled(
        OFFLINE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`SW: Non-fatal precache skip for ${asset}:`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// 2. Activate Phase — Immediate Claim & Stale Cache Eviction Routine
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CURRENT_CACHE_NAME && cacheName.startsWith('nihomi-pwa-cache-')) {
            console.log(`SW: Evicting deprecated stale cache [${cacheName}]`);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Phase — Cache-First with Network Fallback & Runtime Caching
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip caching for backend API mutation endpoints, auth callbacks, or webhooks
  if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/api/payments')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache-First: Return immediate match from cache if available
      if (cachedResponse) {
        // Fetch in background to update cache for next time (Stale-While-Revalidate pattern for internal assets)
        if (url.origin === self.location.origin) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                const responseClone = networkResponse.clone();
                caches.open(CURRENT_CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
            })
            .catch(() => {
              // Ignore background fetch network errors
            });
        }
        return cachedResponse;
      }

      // Network Fallback: Fetch from network and cache valid static/GET responses
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache same-origin assets or font stylesheets
          if (
            networkResponse.type === 'basic' ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CURRENT_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // If offline and navigating to a page, serve the cached SPA index.html shell
          if (
            event.request.mode === 'navigate' ||
            (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))
          ) {
            return caches.match('/index.html');
          }
        });
    })
  );
});
