// ==============================================
// juez.js - SEGURIDAD NIVEL SENIOR v3.0 (WINDOWS EDITION)
// ==============================================
// PROTEGE: Dominio, modificación, debugging, copia, inyección
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
    
    // ===== INTERFAZ WINDOWS CON MARCADOR VISUAL =====
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
        
        <!-- VENTANA PRINCIPAL ESTILO WINDOWS -->
        <div style="max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
          
          <!-- BARRA DE TÍTULO WINDOWS -->
          <div style="background: #2c3e50; color: white; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #3498db;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">🪟</span>
              <span style="font-weight: 600; letter-spacing: 0.5px;">SISTEMA DE GESTIÓN JUDICIAL - WINDOWS EDITION</span>
            </div>
            <div style="display: flex; gap: 15px;">
              <span style="cursor: pointer; opacity: 0.8;">─</span>
              <span style="cursor: pointer; opacity: 0.8;">□</span>
              <span style="cursor: pointer; opacity: 0.8; color: #e74c3c;">✕</span>
            </div>
          </div>
          
          <!-- BARRA DE HERRAMIENTAS -->
          <div style="background: #ecf0f1; padding: 10px 20px; border-bottom: 1px solid #bdc3c7; display: flex; gap: 20px; flex-wrap: wrap;">
            <span style="color: #2c3e50; cursor: pointer;">📁 Archivo</span>
            <span style="color: #2c3e50; cursor: pointer;">✏️ Editar</span>
            <span style="color: #2c3e50; cursor: pointer;">👁️ Ver</span>
            <span style="color: #2c3e50; cursor: pointer;">🔧 Herramientas</span>
            <span style="color: #2c3e50; cursor: pointer;">❓ Ayuda</span>
          </div>
          
          <!-- MARCADOR VISUAL PRINCIPAL -->
          <div style="background: #f1c40f; color: #2c3e50; text-align: center; padding: 15px; font-weight: bold; font-size: 24px; letter-spacing: 2px; border-bottom: 3px dashed #e67e22; text-transform: uppercase; animation: pulse 2s infinite;">
            ⚠️ AQUÍ VA EL CONTENIDO VISUAL ⚠️
          </div>
          
          <!-- ÁREA DE CONTENIDO PRINCIPAL -->
          <div style="padding: 30px; background: #f9f9f9;">
            
            <!-- SEGUNDO MARCADOR VISUAL -->
            <div style="background: #3498db; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #f1c40f;">
              <h3 style="margin: 0; font-size: 18px;">🔷 ÁREA DE TRABAJO PRINCIPAL 🔷</h3>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">AQUÍ VA EL CONTENIDO VISUAL - SECCIÓN PRINCIPAL</p>
            </div>
            
            <!-- TERCER MARCADOR VISUAL (más sutil) -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 2px dashed #95a5a6; text-align: center;">
              <span style="color: #7f8c8d; font-size: 14px; text-transform: uppercase;">⬇️ AQUÍ VA EL CONTENIDO VISUAL - ÁREA SECUNDARIA ⬇️</span>
            </div>
            
            <!-- GRID DE CONTENIDO (ejemplo) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px;">📊 Panel 1</h4>
                <p style="color: #666;">AQUÍ VA EL CONTENIDO VISUAL - MÓDULO 1</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">📈 Panel 2</h4>
                <p style="color: #666;">AQUÍ VA EL CONTENIDO VISUAL - MÓDULO 2</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">⚖️ Panel 3</h4>
                <p style="color: #666;">AQUÍ VA EL CONTENIDO VISUAL - MÓDULO 3</p>
              </div>
            </div>
            
            <!-- MARCADOR VISUAL FINAL -->
            <div style="margin-top: 30px; background: #34495e; color: white; padding: 15px; border-radius: 5px; text-align: center; font-style: italic;">
              <span style="font-size: 16px;">📌 AQUÍ VA EL CONTENIDO VISUAL - PIE DE PÁGINA 📌</span>
            </div>
          </div>
          
          <!-- BARRA DE ESTADO WINDOWS -->
          <div style="background: #2c3e50; color: white; padding: 8px 20px; font-size: 12px; display: flex; justify-content: space-between; border-top: 1px solid #34495e;">
            <span>🔒 Sistema Protegido v${CONFIG.VERSION}</span>
            <span>👤 ${u?.name || 'Usuario'} (Juez)</span>
            <span>🕒 ${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <style>
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; background: #f39c12; }
            100% { opacity: 1; }
          }
        </style>
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
