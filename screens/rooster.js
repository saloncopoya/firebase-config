// ==============================================
// PANTALLA ROOSTER (TORNEOS) - CON SU PROPIO FIREBASE
// ==============================================
window.renderRoosterScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  // Inicializar Firebase específico de Rooster si existe
  if (window.RoosterFirebase && !window._roosterFirebaseInitialized) {
    window.RoosterFirebase.initialize();
    window._roosterFirebaseInitialized = true;
  }
  
  return `
    <div class="rooster-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🏆</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">SECCIÓN TORNEOS</h2>
          <p style="color: #666;">Bienvenido ${userProfile.displayName || 'Usuario'}</p>
          
          <!-- Aquí va TODO el contenido específico de Rooster -->
          <div id="rooster-content">
            <!-- Contenido de torneos -->
            ${Array(20).fill(0).map((_, i) => `
              <div style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p>Elemento de torneo #${i+1}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

// Firebase específico para Rooster (Cloudinary, etc)
window.RoosterFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Rooster");
    
    // Configuración específica para torneos
    const roosterConfig = {
      // Aquí va tu configuración específica para torneos
      apiKey: "TU_API_KEY_ROOSTER",
      authDomain: "tu-proyecto.firebaseapp.com",
      databaseURL: "https://tu-proyecto.firebaseio.com",
      projectId: "tu-proyecto",
      storageBucket: "tu-proyecto.appspot.com",
      messagingSenderId: "123456789"
    };
    
    // Inicializar solo si no existe ya
    if (!window.roosterFirebaseApp) {
      window.roosterFirebaseApp = firebase.initializeApp(roosterConfig, "rooster");
      window.roosterDatabase = window.roosterFirebaseApp.database();
    }
    
    this.initialized = true;
  }
};

// ==============================================
// EXPORTAR FUNCIÓN PRINCIPAL - AGREGAR AL FINAL
// ==============================================
window.renderRoosterScreen = renderRoosterScreen;
console.log("✅ rooster.js cargado, función global asignada");
