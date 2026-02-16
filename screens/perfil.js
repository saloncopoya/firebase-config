// ==============================================
// PANTALLA PERFIL - CON SU PROPIO FIREBASE
// ==============================================
window.renderPerfilScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  // Inicializar Firebase específico de Perfil (fotos, etc)
  if (window.PerfilFirebase && !window._perfilFirebaseInitialized) {
    window.PerfilFirebase.initialize();
    window._perfilFirebaseInitialized = true;
  }
  
  return `
    <div class="perfil-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; margin-bottom: 20px;">
            ${window.getInitials ? window.getInitials(userProfile.displayName || 'U') : 'U'}
          </div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">${userProfile.displayName || 'Usuario'}</h2>
          <p style="color: #666;">Perfil en construcción</p>
          
          <!-- Formulario de edición de perfil -->
          <div id="perfil-editor" style="width: 100%; max-width: 500px; margin-top: 30px;">
            <!-- Aquí va el formulario -->
          </div>
        </div>
      </div>
    </div>
  `;
};

// Firebase + Cloudinary para Perfil
window.PerfilFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase + Cloudinary de Perfil");
    
    const perfilConfig = {
      apiKey: "TU_API_KEY_PERFIL",
      authDomain: "tu-proyecto-perfil.firebaseapp.com",
      databaseURL: "https://tu-proyecto-perfil.firebaseio.com",
      storageBucket: "tu-proyecto-perfil.appspot.com",
      projectId: "tu-proyecto-perfil"
    };
    
    if (!window.perfilFirebaseApp) {
      window.perfilFirebaseApp = firebase.initializeApp(perfilConfig, "perfil");
      window.perfilStorage = window.perfilFirebaseApp.storage(); // Para Cloudinary
    }
    
    // Configuración de Cloudinary
    window.cloudinaryConfig = {
      cloudName: 'tu-cloud-name',
      uploadPreset: 'tu-upload-preset'
    };
    
    this.initialized = true;
  }
};
