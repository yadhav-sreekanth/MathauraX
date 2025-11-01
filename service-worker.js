const CACHE_NAME = "mathaurax-cache-v2";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/scripts/main.js",
  "/assets/logo.svg"
];

self.addEventListener("install", event => {
  // Activate new service worker immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener("activate", event => {
  // Clean up old caches and take control of clients
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const request = event.request;
  const acceptHeader = request.headers.get("accept") || "";
  const isNavigation = request.mode === "navigate" || acceptHeader.includes("text/html");

  if (isNavigation) {
    // Network-first for navigation requests (pages) with cache fallback
    event.respondWith(
      fetch(request)
        .then(response => {
          // Put a copy in the cache for future offline use
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          return caches.match("/index.html");
        })
    );
    return;
  }

  // For other resources: try cache first, then network, then fallback
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then(networkResponse => {
          // Don't cache opaque or failed responses
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          return networkResponse;
        })
        .catch(() => {
          // Image fallback if available
          if (request.destination === "image") {
            return caches.match("/assets/logo.svg");
          }
          // No fallback for other types
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});
