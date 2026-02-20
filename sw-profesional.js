// ==============================================
// SERVICE WORKER PROFESIONAL - Cache de pantallas
// ==============================================
const CACHE_NAME = 'legado-avicola-v1';
const CACHE_VERSION = '1.0.0';

// Archivos a cachear (TODAS tus pantallas)
const urlsToCache = [
  '/firebase-config/screens/rooster.js',
  '/firebase-config/screens/juez.js',
  '/firebase-config/screens/perfil.js',
  '/firebase-config/screens/configuraciones.js',
  '/firebase-config/screens/publicaciones.js',
  '/firebase-config/screens/pedigri.js',
  '/firebase-config/screens/admin.js'
];

// ==============================================
// INSTALACIÓN - Guardar archivos en cache
// ==============================================
self.addEventListener('install', event => {
  console.log('[SW-Profesional] Instalando versión', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW-Profesional] Cache abierto, guardando archivos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW-Profesional] ✅ Archivos cacheados correctamente');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch(error => {
        console.error('[SW-Profesional] ❌ Error instalando:', error);
      })
  );
});

// ==============================================
// ACTIVACIÓN - Limpiar caches viejos
// ==============================================
self.addEventListener('activate', event => {
  console.log('[SW-Profesional] Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eliminar caches de versiones anteriores
          if (cacheName !== CACHE_NAME) {
            console.log('[SW-Profesional] Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[SW-Profesional] ✅ Activado - Listo para interceptar peticiones');
      return self.clients.claim(); // Tomar control inmediato
    })
  );
});

// ==============================================
// INTERCEPTAR PETICIONES - Cache primero
// ==============================================
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Solo cachear archivos de nuestras pantallas
  if (url.includes('/firebase-config/screens/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // 1. DEVOLVER DE CACHE (instantáneo)
          if (cachedResponse) {
            console.log('[SW-Profesional] 📦 CACHE HIT:', url.split('/').pop());
            return cachedResponse;
          }
          
          // 2. NO ESTÁ EN CACHE - Buscar en red
          console.log('[SW-Profesional] 🌐 CACHE MISS:', url.split('/').pop());
          return fetch(event.request)
            .then(networkResponse => {
              // Verificar si es respuesta válida
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }
              
              // Clonar y guardar en cache para próximas veces
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                  console.log('[SW-Profesional] 💾 Guardado en cache:', url.split('/').pop());
                })
                .catch(err => console.log('[SW-Profesional] Error guardando:', err));
              
              return networkResponse;
            })
            .catch(error => {
              console.log('[SW-Profesional] Error de red:', error);
              // Podrías devolver una página de offline aquí
              return new Response('Sin conexión', { status: 503 });
            });
        })
    );
  } else {
    // Para otras peticiones, comportamiento normal
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('Error de red', { status: 503 });
    }));
  }
});

// ==============================================
// MANEJAR MENSAJES DESDE LA APP
// ==============================================
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getStatus') {
    event.ports[0].postMessage({
      status: 'active',
      cache: CACHE_NAME,
      version: CACHE_VERSION
    });
  }
});

console.log('[SW-Profesional] ✅ Service Worker cargado');
