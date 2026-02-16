// ==============================================
// PANTALLA PUBLICACIONES - CON SU PROPIO FIREBASE
// ==============================================
window.renderPublicacionesScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  // Inicializar Firebase específico de Publicaciones
  if (window.PublicacionesFirebase && !window._publicacionesFirebaseInitialized) {
    window.PublicacionesFirebase.initialize();
    window._publicacionesFirebaseInitialized = true;
  }
  
  return `
    <div class="publicaciones-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">📱</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">PUBLICACIONES</h2>
          <p style="color: #666;">Aquí irán las publicaciones de la comunidad</p>
          
          <!-- Contenido específico de publicaciones -->
          <div id="publicaciones-feed">
            <!-- Aquí cargar las publicaciones -->
          </div>
        </div>
      </div>
    </div>
  `;
};

// Firebase específico para Publicaciones
window.PublicacionesFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Publicaciones");
    
    const publicacionesConfig = {
      apiKey: "TU_API_KEY_PUBLICACIONES",
      authDomain: "tu-proyecto-publicaciones.firebaseapp.com",
      databaseURL: "https://tu-proyecto-publicaciones.firebaseio.com",
      projectId: "tu-proyecto-publicaciones",
      storageBucket: "tu-proyecto-publicaciones.appspot.com",
      messagingSenderId: "987654321"
    };
    
    if (!window.publicacionesFirebaseApp) {
      window.publicacionesFirebaseApp = firebase.initializeApp(publicacionesConfig, "publicaciones");
      window.publicacionesDatabase = window.publicacionesFirebaseApp.database();
    }
    
    this.initialized = true;
  }
};
