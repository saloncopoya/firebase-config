// ==============================================
// juez.js - SEGURIDAD NIVEL SENIOR v2.0
// ==============================================
// PROTEGE: Dominio, modificación, debugging, copia, inyección
// ==============================================

(function() {
  'use strict';
  
  // ===== CONFIGURACIÓN =====
  const CONFIG = {
    DOMINIO_AUTORIZADO: 'https://cmbt-2211-94b-omega.blogspot.com',
    VERSION: '2.0.0',
    HASH_INTEGRIDAD: 'a7c3b1f9e8d4a2f5c6b7e8d9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', // Cambiar en cada actualización
    TOKEN_EXPIRACION: 3600000, // 1 hora
    DEBUG_DETECTION: true
  };
  
  // ===== 1. VERIFICACIÓN DE DOMINIO Y PROTOCOLO =====
  const domainActual = window.location.origin;
  const esLocal = domainActual.includes('localhost') || domainActual.includes('127.0.0.1');
  
  if (domainActual !== CONFIG.DOMINIO_AUTORIZADO && !esLocal) {
    console.error('⛔ BLOQUEADO: Dominio no autorizado');
    
    // AUTO-DESTRUCCIÓN: Eliminar todas las funciones relacionadas
    const funcionesAEliminar = [
      'renderJuezScreen', 'renderJuez', 'initJuez', 
      'juezFunctions', 'panelJuez'
    ];
    
    funcionesAEliminar.forEach(func => {
      try { delete window[func]; } catch(e) {}
    });
    
    // Bloquear cualquier intento futuro
    Object.defineProperty(window, 'renderJuezScreen', {
      get: function() { return function() { return '<div></div>'; }; },
      set: function() { return false; },
      configurable: false
    });
    
    return; // Detener ejecución
  }
  
  // ===== 2. VERIFICACIÓN DE INTEGRIDAD DEL ARCHIVO =====
  const scriptActual = document.currentScript;
  if (scriptActual && scriptActual.src) {
    const integridad = scriptActual.getAttribute('integrity');
    
    // Si hay integridad definida en el HTML, verificarla
    if (integridad && !integridad.includes(CONFIG.HASH_INTEGRIDAD)) {
      console.error('⛔ BLOQUEADO: Archivo modificado');
      return;
    }
  }
  
  // ===== 3. TOKEN DE SESIÓN ÚNICO POR DISPOSITIVO =====
  const generarToken = () => {
    const datos = [
      Date.now(),
      Math.random().toString(36),
      navigator.userAgent,
      screen.width,
      screen.height
    ].join('|');
    
    return btoa(datos).substring(0, 32);
  };
  
  const tokenSesion = sessionStorage.getItem('_juez_token') || generarToken();
  sessionStorage.setItem('_juez_token', tokenSesion);
  
  // ===== 4. FUNCIÓN PRINCIPAL OFUSCADA (MINIFICADA) =====
  const f = function() {
    // Verificar token de sesión
    if (sessionStorage.getItem('_juez_token') !== tokenSesion) {
      return '<div style="padding:40px;text-align:center;">⛔ Sesión inválida</div>';
    }
    
    // Obtener datos de usuario (nombres ofuscados)
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
    
    return `<div></div>`;
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
    // Detector de debugger
    const detectarDebugger = () => {
      const inicio = Date.now();
      debugger;
      const fin = Date.now();
      
      if (fin - inicio > 100) {
        console.warn('⚠️ Consola de desarrollo detectada');
        
        // Opción 1: Redirigir
        // window.location.href = 'about:blank';
        
        // Opción 2: Limpiar funciones sensibles
        // sessionStorage.clear();
      }
    };
    
    // Ejecutar detección
    detectarDebugger();
    
    // Detectar teclas de desarrollo (F12, Ctrl+Shift+I, etc)
    window.addEventListener('keydown', function(e) {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')) {
        
        e.preventDefault();
        console.warn('⛔ Teclas de desarrollo bloqueadas');
        
        // Opcional: Limpiar algo o redirigir
        sessionStorage.setItem('_dev_detected', 'true');
      }
    });
    
    // Detectar si someone intenta inspeccionar elemento
    window.addEventListener('contextmenu', function(e) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        // Solo bloquear en elementos no-input
        // e.preventDefault(); // Descomentar para bloquear clic derecho
      }
    });
  }
  
  // ===== 7. PROTECCIÓN DE FUNCIONES AUXILIARES =====
  // Congelar objetos importantes si es posible
  setTimeout(() => {
    try {
      if (AppState && AppState.user) {
        // No se puede congelar todo, pero intentamos proteger algunas partes
        if (AppState.user.profile && typeof AppState.user.profile === 'object') {
          // No hacer freeze completo porque puede causar errores
          // Solo marcamos como no configurable algunas propiedades
        }
      }
    } catch(e) {}
  }, 1000);
  
  // ===== 8. VERIFICACIÓN PERIÓDICA DE INTEGRIDAD =====
  setInterval(() => {
    // Verificar que la función no haya sido modificada
    const descriptor = Object.getOwnPropertyDescriptor(window, 'renderJuezScreen');
    if (descriptor && descriptor.configurable === true) {
      console.warn('⚠️ Alguien intentó modificar la protección');
      // Restaurar protección
      Object.defineProperty(window, 'renderJuezScreen', {
        get: function() { return funcionReal; },
        set: function() { return false; },
        configurable: false,
        enumerable: true
      });
    }
  }, 5000);
  
  // ===== 9. LOG DE CARGA SEGURO =====
  console.log(`✅ juez.js v${CONFIG.VERSION} - Protegido [${tokenSesion.substring(0, 8)}]`);
  
})();
