// sw.js
self.addEventListener('install', e => {
  console.log('✅ SW INSTALADO');
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('✅ SW ACTIVADO');
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
