// ==============================================
// PANEL DE ADMINISTRACIÓN - SOLO PARA GALLO = TRUE
// ==============================================
window.renderAdminPanel = async function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;

  // Seguridad: verificar permisos de admin
  if (!currentUser || !userProfile || userProfile.gallo !== true) {
    console.warn("🚫 Intento de acceso a admin sin permisos");
    return `
      <div style="padding: 40px; text-align: center; min-height: 100vh; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; margin: 50px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="font-size: 60px; margin-bottom: 20px; color: #d32f2f;">⛔</div>
          <h2 style="color: #d32f2f; margin-bottom: 10px;">Acceso Denegado</h2>
          <p style="color: #666; margin-bottom: 20px;">No tienes permisos para ver esta sección.</p>
          <button onclick="navigateTo('rooster')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Volver a Torneos</button>
        </div>
      </div>
    `;
  }

  // Inicializar Firebase específico de Admin
  if (window.AdminFirebase && !window._adminFirebaseInitialized) {
    window.AdminFirebase.initialize();
    window._adminFirebaseInitialized = true;
  }

  // PANTALLA EN BLANCO (solo header y fondo vacío)
  return `
    <div class="admin-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Header del admin (solo decorativo) -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
                👑
              </div>
              <div>
                <h2 style="color: #8B4513; margin: 0 0 5px 0;">Panel de Administración</h2>
                <p style="color: #666; margin: 0;">Bienvenido, <strong>${userProfile.displayName || 'Administrador'}</strong></p>
              </div>
            </div>
            <div style="background: #f0f8ff; padding: 10px 20px; border-radius: 20px; color: #8B4513;">
              <span style="font-weight: 700;">🔧 EN CONSTRUCCIÓN</span>
            </div>
          </div>

          <!-- CONTENIDO VACÍO -->
          <div style="background: white; border-radius: 12px; padding: 60px 20px; text-align: center;">
            <div style="font-size: 80px; margin-bottom: 20px; color: #8B4513;">⚙️</div>
            <h3 style="color: #8B4513; margin-bottom: 10px;">Panel en construcción</h3>
            <p style="color: #666;">Próximamente: Gestión de usuarios, contenido y estadísticas</p>
          </div>

        </div>
      </div>
    </div>
  `;
};

// ==============================================
// FIREBASE + CLOUDINARY PARA ADMIN
// ==============================================
window.AdminFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase + Cloudinary de Admin");
    
    const adminFirebaseConfig = {
      apiKey: "TU_API_KEY_ADMIN", // ⚠️ CAMBIA ESTO
      authDomain: "tu-proyecto-admin.firebaseapp.com",
      databaseURL: "https://tu-proyecto-admin.firebaseio.com",
      projectId: "tu-proyecto-admin",
      storageBucket: "tu-proyecto-admin.appspot.com", // Para Cloudinary
      messagingSenderId: "444555666"
    };
    
    if (!window.adminFirebaseApp) {
      window.adminFirebaseApp = firebase.initializeApp(adminFirebaseConfig, "admin");
      window.adminDatabase = window.adminFirebaseApp.database();
      window.adminStorage = window.adminFirebaseApp.storage(); // Para Cloudinary
    }
    
    // Configuración de Cloudinary
    window.adminCloudinaryConfig = {
      cloudName: 'tu-cloud-name',
      uploadPreset: 'tu-upload-preset'
    };
    
    this.initialized = true;
  }
};

// ==============================================
// EXPORTAR FUNCIÓN PRINCIPAL
// ==============================================
window.renderAdminPanel = renderAdminPanel;
window.renderAdminScreen = renderAdminPanel;
console.log("✅ admin.js cargado - Modo EN BLANCO con Firebase+Cloudinary");
