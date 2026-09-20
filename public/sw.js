// NIHOMI PWA SERVICE WORKER — ULTRA-FAST CACHE & OFFLINE ENGINE V3
// Designed for high reliability on 3G/4G mobile networks in Bangladesh
const CACHE_VERSION = 'v3';
const CURRENT_CACHE_NAME = `nihomi-${CACHE_VERSION}`;

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
          if (cacheName !== CURRENT_CACHE_NAME && (cacheName.startsWith('nihomi-') || cacheName.startsWith('nihomi-pwa-cache-'))) {
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
// - Telemetry & Analytics: Silent error suppression with graceful fallback
// - Static assets (JS, CSS, fonts, images): Cache-First with Stale-While-Revalidate & 500 fallback
// - API routes (/api/*): STRICT Network-Only (No caching whatsoever to prevent stale billing, auth, or learning states)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // SAFE TELEMETRY / ANALYTICS ERROR SUPPRESSION
  // Never allow unhandled telemetry failures to surface as 500s or uncaught errors in the client
  if (url.pathname.includes('/analytics/track') || url.pathname.includes('/content-studio/telemetry')) {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          if (!resp.ok) {
            return new Response(JSON.stringify({ success: true, suppressed: true, status: resp.status }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return resp;
        })
        .catch(() => {
          return new Response(JSON.stringify({ success: true, offline: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  // STRICT BYPASS: Never intercept Vite dev requests, TypeScript modules, or Vite internal scripts
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('/node_modules/') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts') ||
    url.searchParams.has('v') ||
    url.searchParams.has('import')
  ) {
    return;
  }

  // STRICT NETWORK-ONLY: Exclude all other /api/ endpoints from service worker caching.
  // Dynamic API requests must always fetch directly from the network to preserve security,
  // real-time authentication, idempotent payments, and fresh database states.
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Navigation requests (HTML shell): Network-First with Cache fallback
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CURRENT_CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match('/index.html'))
    );
    return;
  }

  // Static Assets & Web App Shell: Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Revalidate in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // If server throws 500 for a static asset, fallback to cache if available
          if (networkResponse.status >= 500 && cachedResponse) {
            return cachedResponse;
          }
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
          return cachedResponse;
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
