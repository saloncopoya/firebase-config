// sw.js - Service Worker con soporte offline completo
const CACHE_NAME = 'legado-avicola-v1';
const urlsToCache = [
  '/firebase-config/',
  '/firebase-config/index.html',
  'https://cmbt-2211-94b-omega.blogspot.com/',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://fonts.gstatic.com'
];

// Instalación: cachear recursos estáticos
self.addEventListener('install', event => {
  console.log('📦 Instalando Service Worker y cacheando recursos');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ Error en instalación:', error);
      })
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación: limpiar caches antiguos
self.addEventListener('activate', event => {
  console.log('🚀 Activando Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediato de todas las páginas
  self.clients.claim();
});

// Estrategia: Stale-While-Revalidate (primero cache, luego red)
self.addEventListener('fetch', event => {
  console.log('🌐 Interceptando petición:', event.request.url);
  
  // Ignorar peticiones que no sean GET o de otros dominios si quieres
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('✅ Sirviendo desde cache:', event.request.url);
          // Actualizar cache en segundo plano
          fetch(event.request)
            .then(newResponse => {
              if (newResponse && newResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, newResponse));
              }
            })
            .catch(() => console.log('📴 Offline - usando cache'));
          
          return response;
        }
        
        // Si no está en cache, ir a la red
        console.log('🌍 Buscando en red:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Guardar en cache para futuras visitas
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(error => {
            console.log('❌ Error en fetch:', error);
            // Aquí puedes devolver una página offline personalizada
            if (event.request.mode === 'navigate') {
              return caches.match('/firebase-config/offline.html');
            }
            return new Response('Estás offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
