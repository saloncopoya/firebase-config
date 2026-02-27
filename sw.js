// sw.js - Service Worker para Legado Avícola
self.addEventListener('install', e => {
  console.log('✅ SW instalado');
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ SW activado');
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
