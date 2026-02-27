// sw.js - Service Worker para Blogger
const CACHE_NAME = 'legado-avicola-v4';
const BLOG_URL = 'https://cmbt-2211-94b-omega.blogspot.com';

// Archivos a cachear
const urlsToCache = [
  '/firebase-config/offline.html',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://fonts.gstatic.com'
];

// Instalación
self.addEventListener('install', function(event) {
  console.log('📦 Instalando SW v4...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('✅ Cacheando archivos...');
      return cache.addAll(urlsToCache).catch(function(error) {
        console.error('Error cacheando:', error);
      });
    })
  );
});

// Activación
self.addEventListener('activate', function(event) {
  console.log('🚀 Activando SW v4...');
  
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          console.log('🗑️ Eliminando caché antiguo:', key);
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  
  // Si es la página de Blogger
  if (url.href.indexOf('cmbt-2211-94b-omega.blogspot.com') !== -1 || url.pathname === '/') {
    
    event.respondWith(
      fetch(event.request).then(function(networkResponse) {
        console.log('🌐 Red - Guardando en caché');
        var responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(function() {
        console.log('📴 Offline - Buscando en caché');
        return caches.match(event.request).then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/firebase-config/offline.html');
        });
      })
    );
    return;
  }
  
  // Para otros recursos
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(function() {
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return new Response('Imagen no disponible offline', { status: 200 });
        }
        return new Response('Recurso no disponible offline', { status: 200 });
      });
    })
  );
});
