// sw.js - Service Worker para Blogger
const CACHE_NAME = 'legado-avicola-v3';
const BLOG_URL = 'https://cmbt-2211-94b-omega.blogspot.com';

// Archivos a cachear
const urlsToCache = [
  BLOG_URL, // La página principal de tu blog
  BLOG_URL + '/', // Con slash
  '/firebase-config/offline.html',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://fonts.gstatic.com'
];

// Instalación
self.addEventListener('install', event => {
  console.log('📦 Instalando SW...');
  self.skipWaiting(); // Activar inmediatamente
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cacheando URLs...');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Error cacheando:', err);
          // Continuar aunque falle alguna URL
        });
      })
  );
});

// Activación
self.addEventListener('activate', event => {
  console.log('🚀 Activando SW...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Tomar control inmediato
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Si es la página de Blogger, usar estrategia especial
  if (url.href.includes('cmbt-2211-94b-omega.blogspot.com') || 
      url.pathname === '/' || 
      url.pathname === '') {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('✅ Sirviendo blog desde cache');
            return response;
          }
          
          // Si no está en cache, ir a la red
          return fetch(event.request)
            .then(networkResponse => {
              // Cachear para futuras visitas offline
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
              return networkResponse;
            })
            .catch(error => {
              console.log('📴 Offline - mostrando página offline');
              return caches.match('/firebase-config/offline.html');
            });
        })
    );
    return;
  }
  
  // Para otros recursos (imágenes, CSS, JS)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        
        return fetch(event.request)
          .then(networkResponse => {
            // Solo cachear recursos exitosos
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Si falla y es una imagen, devolver imagen por defecto
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return new Response('Imagen no disponible offline', { status: 200 });
            }
            return new Response('Recurso no disponible offline', { status: 200 });
          });
      })
  );
});
