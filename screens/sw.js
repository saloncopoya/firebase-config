// Nombre del caché, cámbialo cuando actualices el worker
const CACHE_NAME = 'legado-avicola-v1'; 
// Archivos a cachear durante la instalación (son los que viven en GitHub Pages)
const urlsToCache = [
  'https://saloncopoya.github.io/firebase-config/screens/offline.html',
  'https://saloncopoya.github.io/firebase-config/screens/manifest.json'
  // Puedes añadir aquí un CSS o JS global si lo tuvieras en GitHub Pages
];

// Instalación: abre el caché y guarda los archivos estáticos
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activar inmediatamente
  );
});

// Activación: limpia cachés viejos
self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim()) // Tomar control de las páginas abiertas
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  // Estrategia: Stale-while-revalidate (mostrar caché, actualizar en segundo plano)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Devuelve el recurso de caché si existe, mientras se busca una versión nueva
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Si la respuesta de red es buena, actualizamos el caché
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('[SW] Falló la red, sirviendo offline.html para navegaciones:', error);
            // Si falla la red y la petición es para un documento HTML, servimos la página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Para otros recursos (imágenes, etc.), podríamos devolver un placeholder o nada.
            return new Response('Recurso no disponible offline', { status: 404, statusText: 'Not Found' });
          });

        return cachedResponse || fetchPromise;
      })
  );
});
