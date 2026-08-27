// NIHOMI PWA SERVICE WORKER — CACHE & OFFLINE ENGINE V3
const CACHE_VERSION = 'v3';
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

// Key Offline Curriculum API Routes to Pre-Cache & Support Unstable Networks
const OFFLINE_CURRICULUM_ROUTES = [
  '/api/learning/modules',
  '/api/learning/lessons/1',
  '/api/learning/lessons/2',
  '/api/learning/lessons/3',
  '/api/quizzes',
  '/api/work-japanese/modules'
];

// 1. Install Phase — Precache Offline Shell & Core Curriculum Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CURRENT_CACHE_NAME).then(async (cache) => {
      // 1.1 Cache Static Shell Assets
      await Promise.allSettled(
        OFFLINE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`SW: Non-fatal precache skip for static ${asset}:`, err);
          })
        )
      );

      // 1.2 Attempt background pre-fetch for core curriculum JSON endpoints
      await Promise.allSettled(
        OFFLINE_CURRICULUM_ROUTES.map(async (route) => {
          try {
            const resp = await fetch(route, { headers: { 'Accept': 'application/json' } });
            if (resp && resp.ok) {
              await cache.put(route, resp);
            }
          } catch (e) {
            console.warn(`SW: Non-fatal precache skip for curriculum route ${route}:`, e);
          }
        })
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

// 3. Notification Click Handler for Browser-Based Push Alerts
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});

// 4. Fetch Phase — Cache-First with Stale-While-Revalidate & Seamless Offline Fallback
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip caching for sensitive auth callbacks or payment gateways
  if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/api/billing/webhook') || url.pathname.startsWith('/api/payments')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If we have a cached version, return it immediately while fetching fresh data in the background
      if (cachedResponse) {
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
              // Ignore background sync errors when offline
            });
        }
        return cachedResponse;
      }

      // Network Fallback: Fetch from network and cache curriculum/static data
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache same-origin assets, curriculum APIs, or font stylesheets
          if (
            networkResponse.type === 'basic' ||
            url.pathname.startsWith('/api/learning') ||
            url.pathname.startsWith('/api/quizzes') ||
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
          // If offline and navigating to an app route, serve cached SPA index.html
          if (
            event.request.mode === 'navigate' ||
            (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))
          ) {
            return caches.match('/index.html');
          }

          // If requesting an API while offline and not in cache, return an offline JSON fallback
          if (url.pathname.startsWith('/api/')) {
            return new Response(
              JSON.stringify({
                offline: true,
                message: 'Offline-Only Mode active. Loaded from Nihomi offline cache.',
                timestamp: new Date().toISOString()
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
        });
    })
  );
});
