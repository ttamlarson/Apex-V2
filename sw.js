/* OVERLOAD service worker — v5.9.0. */
const CACHE_NAME = "overload-shell-5.9.0";
const CACHE_PREFIX = "overload-shell-";
const CORE = ["./","./index.html","./coach-engine.js","./muscle-map.js?v=5.9.0","./personal-records.js?v=5.9.0","./programme-templates.js?v=5.9.0","./update.js","./version.json","./manifest.webmanifest","./icon.svg","./overload-mark.svg","./apple-touch-icon.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
});
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => (key.startsWith(CACHE_PREFIX) || key.startsWith("corv-shell-") || key.startsWith("apex-protocol-v2-shell-")) && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});