// puente.js - Este archivo se carga DESDE GitHub Pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // ¡Importante! La URL debe ser la absoluta de tu sw.js en GitHub Pages
    const swUrl = 'https://saloncopoya.github.io/firebase-config/screens/sw.js';

    navigator.serviceWorker.register(swUrl, { scope: './' })
      .then(function(registration) {
        console.log('✅ Service Worker REAL registrado desde GitHub Pages:', registration.scope);
      })
      .catch(function(error) {
        console.log('❌ Fallo al registrar el SW desde GitHub Pages:', error);
      });
  });
}
