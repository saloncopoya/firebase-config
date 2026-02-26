// ==============================================
// rooster.js - SEGURIDAD NIVEL SENIOR
// ==============================================

(function() {
  'use strict';
  
  // ===== CONFIGURACIÓN =====
  const CONFIG = {
    DOMINIO_AUTORIZADO: 'https://cmbt-2211-94b-omega.blogspot.com',
    VERSION: '3.0.0',
    HASH_INTEGRIDAD: 'a7c3b1f9e8d4a2f5c6b7e8d9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    TOKEN_EXPIRACION: 3600000,
    DEBUG_DETECTION: true,
    SEGUNDA_CAPA: '<?php echo "SEGURIDAD_EXTREMA"; ?>' // Segunda capa de seguridad
  };
  
  // ===== 1. VERIFICACIÓN DE DOMINIO Y PROTOCOLO =====
  const domainActual = window.location.origin;
  const esLocal = domainActual.includes('localhost') || domainActual.includes('127.0.0.1');
  
  if (domainActual !== CONFIG.DOMINIO_AUTORIZADO && !esLocal) {
    console.error('⛔ BLOQUEADO: Dominio no autorizado');
    
    const funcionesAEliminar = [
      'renderRoosterScreen', 'renderRooster', 'initRooster', 
      'roosterFunctions', 'panelRooster'
    ];
    
    funcionesAEliminar.forEach(func => {
      try { delete window[func]; } catch(e) {}
    });
    
    Object.defineProperty(window, 'renderRoosterScreen', {
      get: function() { return function() { return '<div></div>'; }; },
      set: function() { return false; },
      configurable: false
    });
    
    return;
  }
  
  // ===== 2. VERIFICACIÓN DE INTEGRIDAD =====
  const scriptActual = document.currentScript;
  if (scriptActual && scriptActual.src) {
    const integridad = scriptActual.getAttribute('integrity');
    if (integridad && !integridad.includes(CONFIG.HASH_INTEGRIDAD)) {
      console.error('⛔ BLOQUEADO: Archivo modificado');
      return;
    }
  }
  
  // ===== 3. TOKEN DE SESIÓN =====
  const generarToken = () => {
    const datos = [
      Date.now(),
      Math.random().toString(36),
      navigator.userAgent,
      screen.width,
      screen.height,
      CONFIG.SEGUNDA_CAPA
    ].join('|');
    
    return btoa(datos).substring(0, 32);
  };
  
  const tokenSesion = sessionStorage.getItem('_rooster_token') || generarToken();
  sessionStorage.setItem('_rooster_token', tokenSesion);
  
  // ===== 4. FUNCIÓN PRINCIPAL CON INTERFAZ ROOSTER =====
  window.renderRoosterScreen = function() {
    // Verificar token de sesión
    if (sessionStorage.getItem('_rooster_token') !== tokenSesion) {
      return '<div style="padding:40px;text-align:center;">⛔ Sesión inválida</div>';
    }
    
    const currentUser = AppState?.user?.current;
    const userProfile = AppState?.user?.profile;
    
    // ===== SEGURIDAD: Usuario no logueado =====
    if (!currentUser) {
      return `<div style="min-height: 100vh; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          🔒 Debes iniciar sesión para ver esta sección
        </div>
      </div>`;
    }
    
    // ===== SEGURIDAD: Perfil no cargado =====
    if (!userProfile) {
      return `<div style="padding: 40px; text-align: center; color: #666;">
        ⏳ Cargando tu perfil...
      </div>`;
    }
    
    // ===== SEGURIDAD: Usuario no activado =====
    if (userProfile.activated !== true) {
      return `<div style="padding: 40px; text-align: center; color: #666;">
        ⏳ Tu cuenta está pendiente de activación
      </div>`;
    }
    
    // ===== SOLO PARA USUARIOS ACTIVADOS =====
    return `
      <div class="rooster-screen" style="min-height: 100vh; background: #f8f9fa;">
        <div style="padding-top: 0;">
          
          <!-- ============================================== -->
          <!-- CABECERA CON INFORMACIÓN DEL USUARIO           -->
          <!-- ============================================== -->
          <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
              <!-- Avatar -->
              <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
                ${(userProfile.displayName || 'U').charAt(0).toUpperCase()}
              </div>
              <!-- Info -->
              <div>
                <h2 style="margin: 0; color: #333;">🐓 ROOSTER - Torneos</h2>
                <p style="margin: 5px 0 0; color: #666;">
                  <span style="color: green;">✅ Activado</span> | 
                  <strong>${userProfile.displayName || 'Usuario'}</strong> | 
                  <span style="color: #8B4513;">${userProfile.municipio || 'Sin ubicación'}</span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- CONTENEDOR PRINCIPAL                           -->
          <!-- ============================================== -->
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            
            <!-- ============================================== -->
            <!-- 1. BOTONES DE NOTIFICACIÓN                     -->
            <!-- ============================================== -->
            <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
                <span>🔔</span> NOTIFICACIONES SIMULADAS
              </h3>
              
              <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                <button onclick="AppState.addNotification('✅ Torneo actualizado', 'success')" 
                  style="background: #42b72a; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                  ✅ Éxito
                </button>
                <button onclick="AppState.addNotification('❌ Error al cargar datos', 'error')" 
                  style="background: #d93025; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                  ❌ Error
                </button>
                <button onclick="AppState.addNotification('⚠️ Conexión lenta detectada', 'warning')" 
                  style="background: #ff9800; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                  ⚠️ Advertencia
                </button>
                <button onclick="AppState.addNotification('ℹ️ Nuevo torneo disponible', 'info')" 
                  style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                  ℹ️ Información
                </button>
              </div>
              
              <!-- Notificaciones recientes simuladas -->
              <div style="background: #f5f5f5; border-radius: 12px; padding: 15px;">
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">📋 ÚLTIMAS NOTIFICACIONES:</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="background: white; padding: 10px; border-radius: 8px; border-left: 4px solid #42b72a;">
                    <span style="font-weight: bold;">✅</span> Torneo "Gallos del Norte" actualizado
                    <span style="color: #999; font-size: 12px; margin-left: 10px;">hace 5 min</span>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 8px; border-left: 4px solid #ff9800;">
                    <span style="font-weight: bold;">⚠️</span> Tu inscripción está pendiente
                    <span style="color: #999; font-size: 12px; margin-left: 10px;">hace 15 min</span>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 8px; border-left: 4px solid #8B4513;">
                    <span style="font-weight: bold;">ℹ️</span> Nuevo torneo: "Copa de Oro"
                    <span style="color: #999; font-size: 12px; margin-left: 10px;">hace 1 hora</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- MARCADOR VISUAL PRINCIPAL -->
            <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite; margin-bottom: 20px;">
              ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE ROOSTER ⚠️
            </div>
            
          </div>
        </div>
      </div>
    `;
  };
  
  // ===== 5. PROTECCIÓN CONTRA MODIFICACIONES =====
  let funcionReal = window.renderRoosterScreen;
  
  Object.defineProperty(window, 'renderRoosterScreen', {
    get: function() { return funcionReal; },
    set: function(v) { 
      console.warn('⛔ No puedes modificar renderRoosterScreen');
      return false;
    },
    configurable: false,
    enumerable: true
  });
  
  // ===== 6. DETECCIÓN DE CONSOLA/DEBUGGING =====
  if (CONFIG.DEBUG_DETECTION) {
    const detectarDebugger = () => {
      const inicio = Date.now();
      debugger;
      const fin = Date.now();
      
      if (fin - inicio > 100) {
        console.warn('⚠️ Consola de desarrollo detectada');
        document.body.innerHTML = '<div style="background:red;color:white;padding:20px;">⛔ ACCESO DENEGADO</div>';
      }
    };
    
    detectarDebugger();
    
    window.addEventListener('keydown', function(e) {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')) {
        
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }
  
  // ===== 7. VERIFICACIÓN PERIÓDICA =====
  setInterval(() => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'renderRoosterScreen');
    if (descriptor && descriptor.configurable === true) {
      Object.defineProperty(window, 'renderRoosterScreen', {
        get: function() { return funcionReal; },
        set: function() { return false; },
        configurable: false,
        enumerable: true
      });
    }
  }, 5000);
  
  // ===== 8. LOG DE CARGA =====
  console.log(`✅ rooster.js v${CONFIG.VERSION} - Modo Rooster - Protegido [${tokenSesion.substring(0, 8)}]`);
  
})();
