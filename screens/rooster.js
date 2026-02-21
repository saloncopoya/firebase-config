// ==============================================
// PANTALLA ROOSTER (TORNEOS) - CON PRUEBAS
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
      
      <!-- BARRA DE PRUEBAS SUPERIOR -->
      <div style="position: fixed; top: 70px; left: 0; right: 0; background: #333; color: white; padding: 8px 16px; display: flex; gap: 10px; z-index: 999; overflow-x: auto; white-space: nowrap;">
        <button class="test-btn-rooster" data-type="info" style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🔵 Info</button>
        <button class="test-btn-rooster" data-type="success" style="background: #4CAF50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">✅ Success</button>
        <button class="test-btn-rooster" data-type="warning" style="background: #FF9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">⚠️ Warning</button>
        <button class="test-btn-rooster" data-type="error" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">❌ Error</button>
        <input type="text" id="test-input-rooster" placeholder="Texto de prueba" style="padding: 5px; border-radius: 4px; border: none; width: 150px;">
        <button id="test-show-text-rooster" style="background: #9C27B0; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Mostrar Texto</button>
        <button id="test-load-more-rooster" style="background: #FF5722; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">➕ Cargar 50 Más</button>
        <button id="test-clear-rooster" style="background: #607D8B; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🧹 Limpiar</button>
      </div>
      
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 130px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🏆</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">SECCIÓN TORNEOS - MODO PRUEBAS</h2>
          <p style="color: #666;">Bienvenido ${userProfile.displayName || 'Usuario'}</p>
          
          <!-- Contador de elementos -->
          <div style="margin: 10px 0; font-weight: bold; color: #333;">
            Elementos cargados: <span id="rooster-counter">20</span>
          </div>
          
          <!-- Aquí va TODO el contenido específico de Rooster -->
          <div id="rooster-content" style="width: 100%; max-width: 600px;">
            ${Array(20).fill(0).map((_, i) => `
              <div class="rooster-item" style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <p style="margin: 0; font-weight: bold;">Elemento de torneo #${i+1}</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: T-${Math.floor(Math.random()*1000)}</p>
                  </div>
                  <button class="delete-item-rooster" data-id="${i+1}" style="background: #f44336; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Script de pruebas -->
    <script>
      (function() {
        // Esperar a que el DOM esté listo
        setTimeout(function() {
          
          // ===== 1. BOTONES DE NOTIFICACIÓN =====
          document.querySelectorAll('.test-btn-rooster').forEach(btn => {
            btn.addEventListener('click', function(e) {
              const type = this.dataset.type;
              const messages = {
                info: '🔵 Notificación de prueba INFO desde Rooster',
                success: '✅ Notificación de prueba ÉXITO desde Rooster',
                warning: '⚠️ Notificación de prueba ADVERTENCIA desde Rooster',
                error: '❌ Notificación de prueba ERROR desde Rooster'
              };
              AppState.addNotification(messages[type], type);
            });
          });
          
          // ===== 2. MOSTRAR TEXTO DEL INPUT =====
          const showTextBtn = document.getElementById('test-show-text-rooster');
          const testInput = document.getElementById('test-input-rooster');
          
          if (showTextBtn && testInput) {
            showTextBtn.addEventListener('click', function() {
              const text = testInput.value.trim();
              if (text) {
                AppState.addNotification('📝 Texto ingresado: "' + text + '"', 'info');
              } else {
                AppState.addNotification('⚠️ El campo de texto está vacío', 'warning');
              }
            });
          }
          
          // ===== 3. CARGAR MÁS ELEMENTOS (PRUEBA DE FLUIDEZ) =====
          const loadMoreBtn = document.getElementById('test-load-more-rooster');
          const roosterContent = document.getElementById('rooster-content');
          const counterSpan = document.getElementById('rooster-counter');
          
          if (loadMoreBtn && roosterContent && counterSpan) {
            loadMoreBtn.addEventListener('click', function() {
              const currentItems = document.querySelectorAll('.rooster-item').length;
              AppState.addNotification('🔄 Cargando 50 elementos más...', 'warning');
              
              // Usar setTimeout para simular carga asíncrona
              setTimeout(function() {
                let newHtml = '';
                for (let i = currentItems + 1; i <= currentItems + 50; i++) {
                  newHtml += \`
                    <div class="rooster-item" style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); animation: fadeIn 0.3s;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                          <p style="margin: 0; font-weight: bold;">Elemento de torneo #\${i}</p>
                          <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: T-\${Math.floor(Math.random()*1000)}</p>
                        </div>
                        <button class="delete-item-rooster" data-id="\${i}" style="background: #f44336; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">✕</button>
                      </div>
                    </div>
                  \`;
                }
                roosterContent.insertAdjacentHTML('beforeend', newHtml);
                counterSpan.textContent = document.querySelectorAll('.rooster-item').length;
                AppState.addNotification('✅ 50 elementos cargados correctamente', 'success');
                
                // ===== 4. RECONFIGURAR BOTONES DE ELIMINAR =====
                setupDeleteButtons();
              }, 500);
            });
          }
          
          // ===== 5. LIMPIAR ELEMENTOS ADICIONALES =====
          const clearBtn = document.getElementById('test-clear-rooster');
          if (clearBtn && roosterContent) {
            clearBtn.addEventListener('click', function() {
              // Mantener solo los primeros 20 elementos originales
              const items = document.querySelectorAll('.rooster-item');
              if (items.length > 20) {
                for (let i = 20; i < items.length; i++) {
                  items[i].remove();
                }
                counterSpan.textContent = '20';
                AppState.addNotification('🧹 Elementos adicionales eliminados', 'info');
              } else {
                AppState.addNotification('⚠️ No hay elementos adicionales para limpiar', 'warning');
              }
            });
          }
          
          // ===== 6. FUNCIÓN PARA BOTONES DE ELIMINAR =====
          function setupDeleteButtons() {
            document.querySelectorAll('.delete-item-rooster').forEach(btn => {
              // Eliminar event listeners anteriores para evitar duplicados
              btn.replaceWith(btn.cloneNode(true));
            });
            
            // Volver a agregar event listeners
            document.querySelectorAll('.delete-item-rooster').forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.rooster-item');
                if (item) {
                  const id = this.dataset.id;
                  item.style.animation = 'fadeOut 0.3s';
                  setTimeout(function() {
                    item.remove();
                    const counter = document.getElementById('rooster-counter');
                    if (counter) {
                      counter.textContent = document.querySelectorAll('.rooster-item').length;
                    }
                    AppState.addNotification('🗑️ Elemento #' + id + ' eliminado', 'info');
                  }, 200);
                }
              });
            });
          }
          
          // Configurar botones iniciales
          setupDeleteButtons();
          
          // Añadir animaciones CSS
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
              from { opacity: 1; transform: scale(1); }
              to { opacity: 0; transform: scale(0.9); }
            }
          \`;
          document.head.appendChild(style);
          
        }, 100);
      })();
    <\/script>
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
console.log("✅ rooster.js cargado con PRUEBAS, función global asignada");
