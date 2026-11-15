'use strict';
// v3 — tutto il codice è in index.html; nessun file JS remoto.
const CACHE = 'tonalita-v3.0.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names.filter(n => n.startsWith('tonalita-') && n !== CACHE).map(n => caches.delete(n))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Network first: GitHub Pages mostra le nuove versioni senza ricorrere a vecchi script.
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch {
      return (await cache.match(request)) ||
        (request.mode === 'navigate' ? await cache.match('./index.html') : null) ||
        Response.error();
    }
  })());
});
