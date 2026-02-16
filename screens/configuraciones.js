// ==============================================
// PANTALLA CONFIGURACIONES - CON SU PROPIO FIREBASE
// ==============================================
window.renderConfiguracionesScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  // Inicializar Firebase específico de Configuraciones
  if (window.ConfigFirebase && !window._configFirebaseInitialized) {
    window.ConfigFirebase.initialize();
    window._configFirebaseInitialized = true;
  }
  
  return `
    <div class="configuraciones-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
              ⚙️
            </div>
            <div>
              <h2 style="color: #8B4513; margin: 0 0 5px 0;">Configuraciones</h2>
              <p style="color: #666; margin: 0;">Personaliza tu experiencia</p>
            </div>
          </div>
          
          <!-- Menú de configuraciones -->
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Perfil -->
            <div class="config-section" style="padding: 20px; border-bottom: 1px solid #eee;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Perfil</h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.openEditProfileModal()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">✏️</span>
                  <div>
                    <div style="font-weight: 600; color: #333;">Editar perfil</div>
                    <div style="font-size: 13px; color: #666;">Actualiza tu foto, nombre y más</div>
                  </div>
                </button>
                
                <button onclick="window.openPrivacySettings()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">🔒</span>
                  <div>
                    <div style="font-weight: 600; color: #333;">Privacidad</div>
                    <div style="font-size: 13px; color: #666;">Controla quién ve tu información</div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Notificaciones -->
            <div class="config-section" style="padding: 20px; border-bottom: 1px solid #eee;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🔔 Notificaciones</h3>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <span style="color: #333;">Notificaciones push</span>
                  <input type="checkbox" id="pushNotifications" ${userProfile.pushNotifications ? 'checked' : ''} onchange="window.togglePushNotification()" style="width: 20px; height: 20px;">
                </label>
                
                <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <span style="color: #333;">Sonidos</span>
                  <input type="checkbox" id="soundsEnabled" ${userProfile.soundsEnabled !== false ? 'checked' : ''} onchange="window.toggleSounds()" style="width: 20px; height: 20px;">
                </label>
              </div>
            </div>
            
            <!-- Cuenta -->
            <div class="config-section" style="padding: 20px; border-bottom: 1px solid #eee;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🔐 Cuenta</h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.changePassword()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">🔑</span>
                  <div>
                    <div style="font-weight: 600; color: #333;">Cambiar contraseña</div>
                    <div style="font-size: 13px; color: #666;">Actualiza tu contraseña regularmente</div>
                  </div>
                </button>
                
                <button onclick="window.manageDevices()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">📱</span>
                  <div>
                    <div style="font-weight: 600; color: #333;">Dispositivos conectados</div>
                    <div style="font-size: 13px; color: #666;">Administra tus sesiones activas</div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Zona de peligro (solo para usuarios avanzados) -->
            <div class="config-section" style="padding: 20px;">
              <h3 style="color: #d32f2f; margin: 0 0 15px 0; font-size: 18px;">⚠️ Zona de peligro</h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.exportMyData()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #fff5f5; border: 1px solid #ffcdd2; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">📥</span>
                  <div>
                    <div style="font-weight: 600; color: #d32f2f;">Exportar mis datos</div>
                    <div style="font-size: 13px; color: #666;">Descarga toda tu información</div>
                  </div>
                </button>
                
                <button onclick="window.deleteAccount()" class="config-btn" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #ffebee; border: 1px solid #ef9a9a; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
                  <span style="font-size: 20px;">🗑️</span>
                  <div>
                    <div style="font-weight: 600; color: #c62828;">Eliminar cuenta</div>
                    <div style="font-size: 13px; color: #666;">Esta acción es irreversible</div>
                  </div>
                </button>
              </div>
            </div>
            
          </div>
          
          <!-- Versión de la app -->
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            Legado Avícola v2.0.0
          </div>
        </div>
      </div>
    </div>
  `;
};

// ==============================================
// FIREBASE ESPECÍFICO PARA CONFIGURACIONES
// ==============================================
window.ConfigFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Configuraciones");
    
    // Configuración específica para configuraciones (puede ser la misma o diferente)
    const configFirebaseConfig = {
      apiKey: "TU_API_KEY_CONFIG", // ⚠️ CAMBIA ESTO
      authDomain: "tu-proyecto-config.firebaseapp.com",
      databaseURL: "https://tu-proyecto-config.firebaseio.com",
      projectId: "tu-proyecto-config",
      storageBucket: "tu-proyecto-config.appspot.com",
      messagingSenderId: "111222333"
    };
    
    if (!window.configFirebaseApp) {
      window.configFirebaseApp = firebase.initializeApp(configFirebaseConfig, "config");
      window.configDatabase = window.configFirebaseApp.database();
    }
    
    this.initialized = true;
  }
};

// ==============================================
// FUNCIONES ESPECÍFICAS DE CONFIGURACIONES
// ==============================================

// Editar perfil
window.openEditProfileModal = function() {
  const modal = document.createElement('div');
  modal.id = 'editProfileModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px;">
      <h3 style="color: #8B4513; margin-bottom: 20px;">Editar perfil</h3>
      
      <div style="margin-bottom: 20px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
          ${window.getInitials ? window.getInitials(AppState.user.profile?.displayName) : 'U'}
        </div>
        <button onclick="window.uploadProfilePhoto()" style="background: #8B4513; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
          Cambiar foto
        </button>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Nombre completo</label>
        <input type="text" id="editName" value="${AppState.user.profile?.displayName || ''}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Biografía</label>
        <textarea id="editBio" rows="3" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">${AppState.user.profile?.bio || ''}</textarea>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button onclick="window.saveProfileChanges()" style="flex: 1; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
          Guardar
        </button>
        <button onclick="document.getElementById('editProfileModal').remove()" style="flex: 1; background: #f0f2f5; color: #333; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
};

window.saveProfileChanges = async function() {
  const newName = document.getElementById('editName')?.value;
  const newBio = document.getElementById('editBio')?.value;
  const currentUser = AppState.user.current;
  const database = AppState.firebase.database;
  
  if (!currentUser || !database) return;
  
  try {
    await database.ref(`users/${currentUser.uid}`).update({
      displayName: newName,
      bio: newBio,
      lastUpdated: Date.now()
    });
    
    await currentUser.updateProfile({ displayName: newName });
    
    AppState.addNotification('✅ Perfil actualizado', 'success');
    document.getElementById('editProfileModal')?.remove();
    
    // Recargar perfil
    await window.loadUserProfile(currentUser.uid);
    AppState.notify();
  } catch (error) {
    AppState.addNotification('Error al actualizar perfil', 'error');
  }
};

// Configuración de privacidad
window.openPrivacySettings = function() {
  const userProfile = AppState.user.profile;
  
  const modal = document.createElement('div');
  modal.id = 'privacyModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px;">
      <h3 style="color: #8B4513; margin-bottom: 20px;">Configuración de privacidad</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
          <span style="color: #333;">Mostrar teléfono</span>
          <input type="checkbox" id="showPhone" ${userProfile.showPhone ? 'checked' : ''} style="width: 20px; height: 20px;">
        </label>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
          <span style="color: #333;">Permir mensajes por WhatsApp</span>
          <input type="checkbox" id="allowWhatsApp" ${userProfile.allowWhatsAppMessages ? 'checked' : ''} style="width: 20px; height: 20px;">
        </label>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
          <span style="color: #333;">Mostrar ubicación</span>
          <input type="checkbox" id="showLocation" ${userProfile.showLocation !== false ? 'checked' : ''} style="width: 20px; height: 20px;">
        </label>
      </div>
      
      <button onclick="window.savePrivacySettings()" style="width: 100%; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-top: 10px;">
        Guardar cambios
      </button>
      <button onclick="document.getElementById('privacyModal').remove()" style="width: 100%; background: #f0f2f5; color: #333; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-top: 10px;">
        Cancelar
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
};

window.savePrivacySettings = async function() {
  const currentUser = AppState.user.current;
  const database = AppState.firebase.database;
  
  if (!currentUser || !database) return;
  
  try {
    await database.ref(`users/${currentUser.uid}`).update({
      showPhone: document.getElementById('showPhone')?.checked || false,
      allowWhatsAppMessages: document.getElementById('allowWhatsApp')?.checked || false,
      showLocation: document.getElementById('showLocation')?.checked !== false
    });
    
    AppState.addNotification('✅ Configuración guardada', 'success');
    document.getElementById('privacyModal')?.remove();
    
    await window.loadUserProfile(currentUser.uid);
  } catch (error) {
    AppState.addNotification('Error al guardar', 'error');
  }
};

// Otras funciones
window.togglePushNotification = async function() {
  const enabled = document.getElementById('pushNotifications')?.checked;
  const currentUser = AppState.user.current;
  
  if (currentUser && AppState.firebase.database) {
    await AppState.firebase.database.ref(`users/${currentUser.uid}/pushNotifications`).set(enabled);
    AppState.addNotification(enabled ? '🔔 Notificaciones activadas' : '🔕 Notificaciones desactivadas', 'info');
  }
};

window.toggleSounds = async function() {
  const enabled = document.getElementById('soundsEnabled')?.checked;
  const currentUser = AppState.user.current;
  
  if (currentUser && AppState.firebase.database) {
    await AppState.firebase.database.ref(`users/${currentUser.uid}/soundsEnabled`).set(enabled);
    localStorage.setItem('soundsEnabled', enabled);
  }
};

window.changePassword = function() {
  AppState.addNotification('Función disponible próximamente', 'info');
};

window.manageDevices = function() {
  AppState.addNotification('Gestión de dispositivos próximamente', 'info');
};

window.exportMyData = function() {
  AppState.addNotification('Preparando exportación...', 'info');
};

window.deleteAccount = function() {
  if (confirm('¿Estás SEGURO? Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción es IRREVERSIBLE.')) {
    if (confirm('Para confirmar, escribe "ELIMINAR" en el siguiente cuadro')) {
      const confirmation = prompt('Escribe "ELIMINAR" para continuar:');
      if (confirmation === 'ELIMINAR') {
        AppState.addNotification('Procesando solicitud...', 'info');
        // Aquí iría la lógica real de eliminación
      }
    }
  }
};

window.uploadProfilePhoto = function() {
  AppState.addNotification('Subida de fotos próximamente', 'info');
};
