/**
 * Service Worker for Nail Art Booking Website
 * Handles offline support, caching, and performance optimization
 */

const CACHE_NAME = 'nail-art-v1';
const RUNTIME_CACHE = 'nail-art-runtime';
const IMAGE_CACHE = 'nail-art-images';
const API_CACHE = 'nail-art-api';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/styles/globals.css',
  '/styles/globals.css.map',
];

const CACHE_FIRST_ASSETS = [
  '/favicon.ico',
  '/images/',
  '/public/',
];

const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/admin/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service Worker: Could not cache all static assets', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== RUNTIME_CACHE &&
            cacheName !== IMAGE_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http(s)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network first for API routes
  if (NETWORK_FIRST_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const cache = caches.open(API_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Return offline page if available
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Cache first for images
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Stale while revalidate for HTML pages
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        });

        return response || fetchPromise.catch(() => caches.match('/offline.html'));
      })
    );
    return;
  }

  // Network first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});
