/**
 * OliTrack Service Worker
 * Enables offline functionality and PWA installation
 * Strategy: Cache-first for static assets, network-first for external resources
 */

const CACHE_NAME    = 'olitrack-v1.0.0';
const OFFLINE_URL   = 'index.html';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// External CDN resources to cache on first use
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ─────────────────────────────────────────────
// INSTALL: Pre-cache critical assets
// ─────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[OliTrack SW] Installing v1.0.0...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[OliTrack SW] Pre-caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// ─────────────────────────────────────────────
// ACTIVATE: Clean up old caches
// ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[OliTrack SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[OliTrack SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// ─────────────────────────────────────────────
// FETCH: Smart caching strategy
// ─────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;

  // ── Strategy 1: Cache-first for same-origin assets ──
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ── Strategy 2: Stale-while-revalidate for CDN fonts/CSS ──
  if (CDN_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// ─────────────────────────────────────────────
// STRATEGY: Cache First (offline-capable)
// ─────────────────────────────────────────────
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Offline fallback
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response('Offline – buka dulu saat ada internet', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ─────────────────────────────────────────────
// STRATEGY: Stale-While-Revalidate (fast + fresh)
// ─────────────────────────────────────────────
async function staleWhileRevalidate(request) {
  const cache          = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  return cachedResponse || fetchPromise;
}

// ─────────────────────────────────────────────
// PUSH NOTIFICATIONS (future-ready)
// ─────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;

  const data    = event.data.json();
  const options = {
    body:    data.body || 'Saatnya ganti oli kendaraanmu!',
    icon:    '/icon-192.svg',
    badge:   '/icon-192.svg',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
    actions: [
      { action: 'open',    title: 'Buka App' },
      { action: 'dismiss', title: 'Nanti' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'OliTrack Reminder', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
