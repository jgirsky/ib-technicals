// Offline support: the whole app (including all cards) is cached on first visit.
// Bump VERSION whenever you deploy changes so phones pick up the new cards.
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const FONTS = "fonts-v1";
const ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    // network first so new deploys show up, cached copy when underground
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(SHELL).then(c => c.put("/index.html", copy)); return r; })
      .catch(() => caches.match("/index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
