// ==============================================
// PANTALLA ROOSTER (TORNEOS) - CON PRUEBAS FUNCIONALES
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
  
  // HTML de la pantalla
  const html = `
    <div class="rooster-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      
      <!-- BARRA DE PRUEBAS SUPERIOR - con IDs únicos -->
      <div style="position: fixed; top: 70px; left: 0; right: 0; background: #333; color: white; padding: 8px 16px; display: flex; gap: 10px; z-index: 999; overflow-x: auto; white-space: nowrap; flex-wrap: wrap;">
        <button id="rooster-test-info" style="background: #2196F3; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">🔵 INFO</button>
        <button id="rooster-test-success" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">✅ ÉXITO</button>
        <button id="rooster-test-warning" style="background: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">⚠️ ADVERTENCIA</button>
        <button id="rooster-test-error" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">❌ ERROR</button>
        
        <input type="text" id="rooster-test-input" placeholder="Escribe algo..." style="padding: 8px; border-radius: 4px; border: none; width: 150px;">
        <button id="rooster-test-showtext" style="background: #9C27B0; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">📝 MOSTRAR</button>
        
        <button id="rooster-test-load" style="background: #FF5722; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">➕ CARGAR 50</button>
        <button id="rooster-test-clear" style="background: #607D8B; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">🧹 LIMPIAR</button>
        <button id="rooster-test-reset" style="background: #8B4513; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">🔄 RESET</button>
      </div>
      
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 130px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 800px; margin: 0 auto;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🏆</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">SECCIÓN TORNEOS - MODO PRUEBAS</h2>
          <p style="color: #666;">Bienvenido ${userProfile.displayName || 'Usuario'}</p>
          
          <!-- CONTADOR -->
          <div style="background: white; padding: 10px 20px; border-radius: 20px; margin: 15px 0; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            Elementos cargados: <span id="rooster-counter">20</span>
          </div>
          
          <!-- CONTENEDOR DE ELEMENTOS -->
          <div id="rooster-content" style="width: 100%;">
            ${Array(20).fill(0).map((_, i) => `
              <div class="rooster-item" data-id="${i+1}" style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="margin: 0; font-weight: bold;">Elemento de torneo #${i+1}</p>
                  <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: T-${Math.floor(Math.random()*1000)}</p>
                </div>
                <button class="rooster-delete-btn" data-id="${i+1}" style="background: #f44336; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px;">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Programar la inicialización de eventos después de que el DOM se actualice
  setTimeout(() => {
    initRoosterTestEvents();
  }, 100);
  
  return html;
};

// ==============================================
// FUNCIÓN PARA INICIALIZAR TODOS LOS EVENTOS DE PRUEBA
// ==============================================
function initRoosterTestEvents() {
  console.log("🐓 Inicializando eventos de prueba en Rooster");
  
  // ===== 1. NOTIFICACIONES =====
  const infoBtn = document.getElementById('rooster-test-info');
  if (infoBtn) {
    infoBtn.onclick = function() { 
      AppState.addNotification('🔵 Notificación INFO desde Rooster', 'info');
    };
  }
  
  const successBtn = document.getElementById('rooster-test-success');
  if (successBtn) {
    successBtn.onclick = function() { 
      AppState.addNotification('✅ Notificación ÉXITO desde Rooster', 'success');
    };
  }
  
  const warningBtn = document.getElementById('rooster-test-warning');
  if (warningBtn) {
    warningBtn.onclick = function() { 
      AppState.addNotification('⚠️ Notificación ADVERTENCIA desde Rooster', 'warning');
    };
  }
  
  const errorBtn = document.getElementById('rooster-test-error');
  if (errorBtn) {
    errorBtn.onclick = function() { 
      AppState.addNotification('❌ Notificación ERROR desde Rooster', 'error');
    };
  }
  
  // ===== 2. MOSTRAR TEXTO DEL INPUT =====
  const showTextBtn = document.getElementById('rooster-test-showtext');
  const textInput = document.getElementById('rooster-test-input');
  
  if (showTextBtn && textInput) {
    showTextBtn.onclick = function() {
      const text = textInput.value.trim();
      if (text) {
        AppState.addNotification(`📝 Texto ingresado: "${text}"`, 'info');
      } else {
        AppState.addNotification('⚠️ El campo de texto está vacío', 'warning');
      }
    };
  }
  
  // ===== 3. CARGAR 50 ELEMENTOS MÁS =====
  const loadBtn = document.getElementById('rooster-test-load');
  const contentDiv = document.getElementById('rooster-content');
  const counterSpan = document.getElementById('rooster-counter');
  
  if (loadBtn && contentDiv && counterSpan) {
    loadBtn.onclick = function() {
      const currentItems = document.querySelectorAll('.rooster-item').length;
      AppState.addNotification('🔄 Cargando 50 elementos...', 'warning');
      
      setTimeout(() => {
        let newHtml = '';
        for (let i = currentItems + 1; i <= currentItems + 50; i++) {
          newHtml += `
            <div class="rooster-item" data-id="${i}" style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); animation: fadeIn 0.3s; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-weight: bold;">Elemento de torneo #${i}</p>
                <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: T-${Math.floor(Math.random()*1000)}</p>
              </div>
              <button class="rooster-delete-btn" data-id="${i}" style="background: #f44336; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px;">✕</button>
            </div>
          `;
        }
        contentDiv.insertAdjacentHTML('beforeend', newHtml);
        counterSpan.textContent = document.querySelectorAll('.rooster-item').length;
        AppState.addNotification('✅ 50 elementos cargados', 'success');
        
        // Reconfigurar botones de eliminar
        setupDeleteButtons();
      }, 500);
    };
  }
  
  // ===== 4. LIMPIAR ELEMENTOS ADICIONALES =====
  const clearBtn = document.getElementById('rooster-test-clear');
  
  if (clearBtn && contentDiv && counterSpan) {
    clearBtn.onclick = function() {
      const items = document.querySelectorAll('.rooster-item');
      const currentCount = items.length;
      
      if (currentCount > 20) {
        // Eliminar desde el índice 20 hasta el final
        for (let i = 20; i < items.length; i++) {
          items[i].remove();
        }
        counterSpan.textContent = '20';
        AppState.addNotification('🧹 Elementos adicionales eliminados (quedan 20)', 'info');
      } else {
        AppState.addNotification('⚠️ No hay elementos adicionales para limpiar', 'warning');
      }
    };
  }
  
  // ===== 5. RESET (VOLVER A 20 ELEMENTOS) =====
  const resetBtn = document.getElementById('rooster-test-reset');
  
  if (resetBtn && contentDiv && counterSpan) {
    resetBtn.onclick = function() {
      AppState.addNotification('🔄 Restableciendo a 20 elementos...', 'warning');
      
      // Crear los 20 elementos originales
      let newHtml = '';
      for (let i = 1; i <= 20; i++) {
        newHtml += `
          <div class="rooster-item" data-id="${i}" style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold;">Elemento de torneo #${i}</p>
              <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: T-${Math.floor(Math.random()*1000)}</p>
            </div>
            <button class="rooster-delete-btn" data-id="${i}" style="background: #f44336; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 16px;">✕</button>
          </div>
        `;
      }
      contentDiv.innerHTML = newHtml;
      counterSpan.textContent = '20';
      AppState.addNotification('✅ Restablecido a 20 elementos', 'success');
      
      // Reconfigurar botones de eliminar
      setupDeleteButtons();
    };
  }
  
  // ===== 6. CONFIGURAR BOTONES DE ELIMINAR =====
  function setupDeleteButtons() {
    document.querySelectorAll('.rooster-delete-btn').forEach(btn => {
      // Eliminar onclick anterior
      btn.onclick = null;
      // Asignar nuevo onclick
      btn.onclick = function(e) {
        e.stopPropagation();
        const item = this.closest('.rooster-item');
        const id = this.dataset.id;
        
        if (item) {
          item.style.animation = 'fadeOut 0.3s';
          setTimeout(() => {
            item.remove();
            if (counterSpan) {
              counterSpan.textContent = document.querySelectorAll('.rooster-item').length;
            }
            AppState.addNotification(`🗑️ Elemento #${id} eliminado`, 'info');
          }, 200);
        }
      };
    });
  }
  
  // ===== 7. AÑADIR ANIMACIONES CSS =====
  if (!document.getElementById('rooster-test-styles')) {
    const style = document.createElement('style');
    style.id = 'rooster-test-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Configurar botones de eliminar iniciales
  setupDeleteButtons();
}

// Firebase específico para Rooster
window.RoosterFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Rooster");
    
    // Configuración específica para torneos
    const roosterConfig = {
      apiKey: "TU_API_KEY_ROOSTER",
      authDomain: "tu-proyecto.firebaseapp.com",
      databaseURL: "https://tu-proyecto.firebaseio.com",
      projectId: "tu-proyecto",
      storageBucket: "tu-proyecto.appspot.com",
      messagingSenderId: "123456789"
    };
    
    // Inicializar solo si no existe ya
    if (!window.roosterFirebaseApp) {
      try {
        window.roosterFirebaseApp = firebase.initializeApp(roosterConfig, "rooster");
        window.roosterDatabase = window.roosterFirebaseApp.database();
        console.log("✅ Firebase Rooster inicializado");
      } catch(e) {
        console.error("Error inicializando Firebase Rooster:", e);
      }
    }
    
    this.initialized = true;
  }
};

// ==============================================
// EXPORTAR FUNCIÓN PRINCIPAL
// ==============================================
console.log("✅ rooster.js cargado con PRUEBAS FUNCIONALES");
