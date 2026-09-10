// NIHOMI PWA SERVICE WORKER — ULTRA-FAST CACHE & OFFLINE ENGINE V4
// Designed for high reliability on 3G/4G mobile networks in Bangladesh
const CACHE_VERSION = 'v4';
const CURRENT_CACHE_NAME = `nihomi-pwa-cache-${CACHE_VERSION}`;

// Core Shell & Offline Assets
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

// Key Offline Curriculum API Routes to Pre-Cache
const OFFLINE_CURRICULUM_ROUTES = [
  '/api/learning/modules',
  '/api/learning/lessons/1',
  '/api/learning/lessons/2',
  '/api/learning/lessons/3',
  '/api/quizzes',
  '/api/work-japanese/modules'
];

// 1. Install Phase — Precache Static Shell & Core Curriculum Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CURRENT_CACHE_NAME).then(async (cache) => {
      // Precache Static Shell Assets
      await Promise.allSettled(
        OFFLINE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`SW: Non-fatal precache skip for ${asset}:`, err);
          })
        )
      );

      // Precache core curriculum JSON endpoints for offline study
      await Promise.allSettled(
        OFFLINE_CURRICULUM_ROUTES.map(async (route) => {
          try {
            const resp = await fetch(route, { headers: { Accept: 'application/json' } });
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
            console.log(`SW: Evicting deprecated cache [${cacheName}]`);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim().then(() => {
    // Notify all open window clients that Nihomi offline cache is armed
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'NIHOMI_CACHE_READY', version: CURRENT_CACHE_NAME });
      });
    });
  });
});

// 3. Push & Notification Click Handler
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

// 4. Fetch Phase:
// - Static assets (JS, CSS, fonts, images): Cache-First with Stale-While-Revalidate
// - API routes (/api/*): Network-First with Cache Fallback & offline JSON fallback
// - Dynamic / Auth / Payment / Referral: Network-Only (no caching)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-Only for dynamic user mutations, payment gateways, auth sessions, and referral claiming
  if (
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/api/billing') ||
    url.pathname.startsWith('/api/payments') ||
    url.pathname.startsWith('/api/referral/claim')
  ) {
    return;
  }

  // API Routes: Network-First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CURRENT_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;

          return new Response(
            JSON.stringify({
              offline: true,
              message: 'Offline-Only Mode: You are currently offline. Loaded from Nihomi offline cache.',
              timestamp: new Date().toISOString()
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Static Assets & Web App Shell: Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Revalidate in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CURRENT_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failure during background revalidation is ignored
        });

      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, wait for network
      return fetchPromise
        .then((response) => response)
        .catch(async () => {
          // Navigation fallback to /index.html for SPA routes
          if (
            event.request.mode === 'navigate' ||
            (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))
          ) {
            const indexCached = await caches.match('/index.html');
            if (indexCached) return indexCached;
          }

          // Return basic offline indicator
          return new Response('Nihomi Offline. Please reconnect to internet.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
    })
  );
});
