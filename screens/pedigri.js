// ==============================================
// PANTALLA PEDIGRÍ - CON SU PROPIO FIREBASE
// ==============================================
window.renderPedigriScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  // Inicializar Firebase específico de Pedigrí
  if (window.PedigriFirebase && !window._pedigriFirebaseInitialized) {
    window.PedigriFirebase.initialize();
    window._pedigriFirebaseInitialized = true;
  }
  
  return `
    <div class="pedigri-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🧬</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">PEDIGRÍ</h2>
          <p style="color: #666;">Consulta de árboles genealógicos</p>
          
          <!-- Contenido específico de pedigrí -->
          <div id="pedigri-container">
            <!-- Aquí va el árbol genealógico -->
          </div>
        </div>
      </div>
    </div>
  `;
};

// Firebase específico para Pedigrí
window.PedigriFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Pedigrí");
    
    const pedigriConfig = {
      apiKey: "TU_API_KEY_PEDIGRI",
      authDomain: "tu-proyecto-pedigri.firebaseapp.com",
      databaseURL: "https://tu-proyecto-pedigri.firebaseio.com",
      projectId: "tu-proyecto-pedigri",
      storageBucket: "tu-proyecto-pedigri.appspot.com",
      messagingSenderId: "555555555"
    };
    
    if (!window.pedigriFirebaseApp) {
      window.pedigriFirebaseApp = firebase.initializeApp(pedigriConfig, "pedigri");
      window.pedigriDatabase = window.pedigriFirebaseApp.database();
    }
    
    this.initialized = true;
  }
};
