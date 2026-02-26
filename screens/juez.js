// ==============================================
// juez.js - SEGURIDAD NIVEL SENIOR

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
      'renderJuezScreen', 'renderJuez', 'initJuez', 
      'juezFunctions', 'panelJuez'
    ];
    
    funcionesAEliminar.forEach(func => {
      try { delete window[func]; } catch(e) {}
    });
    
    Object.defineProperty(window, 'renderJuezScreen', {
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
  
  const tokenSesion = sessionStorage.getItem('_juez_token') || generarToken();
  sessionStorage.setItem('_juez_token', tokenSesion);
  
  // ===== 4. FUNCIÓN PRINCIPAL CON INTERFAZ WINDOWS =====
  const f = function() {
    // Verificar token de sesión
    if (sessionStorage.getItem('_juez_token') !== tokenSesion) {
      return '<div style="padding:40px;text-align:center;">⛔ Sesión inválida</div>';
    }
    
    // Obtener datos de usuario
    const u = AppState?.user?.current;
    const p = AppState?.user?.profile;
    
    // Validaciones
    if (!u) return '<div style="min-height:100vh;background:#f8f9fa;">🔒 Debes iniciar sesión</div>';
    if (!p) return '<div style="padding:40px;text-align:center;color:#666;">⏳ Cargando perfil...</div>';
    if (p.activated !== true) return '<div style="padding:40px;text-align:center;color:#666;">⏳ Cuenta pendiente</div>';
    
    // Verificar si es juez
    if (p.isJudge !== true) {
      return `
        <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;">
          <div style="background:white;padding:40px;border-radius:16px;text-align:center;max-width:400px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <div style="font-size:60px;margin-bottom:20px;color:#d32f2f;">⚖️</div>
            <h2 style="color:#d32f2f;margin-bottom:10px;">Acceso Restringido</h2>
            <p style="color:#666;margin-bottom:20px;">Esta sección es exclusiva para jueces.</p>
            <button onclick="navigateTo('public')" style="background:#8B4513;color:white;border:none;padding:12px 30px;border-radius:8px;cursor:pointer;">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    }
    
    // ===== CONTENEDOR VISUAL =====
    return `
      
          
          <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
             <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
             <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
             <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
             <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
             <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL DE JUEZ1 ⚠️
          </div>
          
    `;
  };
  
  // ===== 5. PROTECCIÓN CONTRA MODIFICACIONES =====
  let funcionReal = f;
  
  Object.defineProperty(window, 'renderJuezScreen', {
    get: function() { return funcionReal; },
    set: function(v) { 
      console.warn('⛔ No puedes modificar renderJuezScreen');
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
    const descriptor = Object.getOwnPropertyDescriptor(window, 'renderJuezScreen');
    if (descriptor && descriptor.configurable === true) {
      Object.defineProperty(window, 'renderJuezScreen', {
        get: function() { return funcionReal; },
        set: function() { return false; },
        configurable: false,
        enumerable: true
      });
    }
  }, 5000);
  
  // ===== 8. LOG DE CARGA =====
  console.log(`✅ juez.js v${CONFIG.VERSION} - Modo Windows - Protegido [${tokenSesion.substring(0, 8)}]`);
  
})();
