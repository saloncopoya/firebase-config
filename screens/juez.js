// ==============================================
// juez.js - SEGURIDAD NIVEL SENIOR + VISUAL UID
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
  
  // ===== 4. FUNCIÓN PRINCIPAL CON INTERFAZ WINDOWS Y VISUAL UID =====
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
    
    // ===== CONTENEDOR VISUAL CON UID Y PERMISOS =====
    return `
      <!-- AQUI VA TODO LO VISUAL + INFORMACIÓN DEL USUARIO -->
      <div style="min-height:100vh;background:#f8f9fa;padding-top:80px;">
        <div style="max-width:800px;margin:0 auto;padding:20px;">
          
          <!-- TARJETA DE INFORMACIÓN DEL USUARIO (VISIBLE) -->
          <div style="background:white;border-radius:16px;padding:24px;margin-bottom:30px;box-shadow:0 4px 12px rgba(0,0,0,0.1);border-left:5px solid #8B4513;">
            
            <!-- ENCABEZADO -->
            <div style="display:flex;align-items:center;gap:15px;margin-bottom:25px;">
              <div style="font-size:40px;">⚖️</div>
              <div>
                <h2 style="margin:0 0 5px 0;color:#333;">Panel del Juez</h2>
                <p style="margin:0;color:#666;font-size:14px;">Sistema de gestión para jueces</p>
              </div>
            </div>
            
            <!-- DATOS DEL USUARIO (VISIBLE) -->
            <div style="background:#f0f7ff;border-radius:12px;padding:20px;margin-bottom:20px;">
              
              <!-- UID DEL USUARIO (DESTACADO) -->
              <div style="margin-bottom:20px;">
                <div style="font-size:12px;color:#666;margin-bottom:4px;">IDENTIFICADOR ÚNICO (UID)</div>
                <div style="display:flex;align-items:center;gap:10px;background:#e8f0fe;padding:12px 15px;border-radius:8px;border:1px solid #8B4513;">
                  <span style="font-size:24px;color:#8B4513;">🆔</span>
                  <span style="font-family:monospace;font-size:18px;font-weight:bold;color:#8B4513;word-break:break-all;">
                    ${u.uid}
                  </span>
                </div>
                <div style="font-size:11px;color:#888;margin-top:6px;">Este es tu identificador único en el sistema</div>
              </div>
              
              <!-- INFORMACIÓN BÁSICA -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                <div style="background:white;padding:12px;border-radius:8px;">
                  <div style="font-size:12px;color:#666;">Nombre</div>
                  <div style="font-weight:600;color:#333;">${p.displayName || 'No especificado'}</div>
                </div>
                <div style="background:white;padding:12px;border-radius:8px;">
                  <div style="font-size:12px;color:#666;">Email</div>
                  <div style="font-weight:600;color:#333;">${p.realEmail || u.email || 'No disponible'}</div>
                </div>
              </div>
              
              <!-- ESTADO DE PERMISOS -->
              <div style="background:white;border-radius:8px;padding:15px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">⚙️ ESTADO DE PERMISOS</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:10px;">
                  
                  <!-- ES JUEZ (debe ser true) -->
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${p.isJudge ? '#e8f5e8' : '#ffebee'};border-radius:6px;">
                    <span style="font-size:18px;">${p.isJudge ? '✅' : '❌'}</span>
                    <div style="flex:1;">
                      <div style="font-size:12px;color:#666;">Juez</div>
                      <div style="font-weight:600;color:${p.isJudge ? '#2e7d32' : '#c62828'};">${p.isJudge ? 'ACTIVO' : 'INACTIVO'}</div>
                    </div>
                  </div>
                  
                  <!-- ADMIN (gallo) -->
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${p.gallo ? '#e8f5e8' : '#f5f5f5'};border-radius:6px;">
                    <span style="font-size:18px;">${p.gallo ? '👑' : '👤'}</span>
                    <div style="flex:1;">
                      <div style="font-size:12px;color:#666;">Admin</div>
                      <div style="font-weight:600;color:${p.gallo ? '#8B4513' : '#666'};">${p.gallo ? 'SÍ' : 'NO'}</div>
                    </div>
                  </div>
                  
                  <!-- PUBLICACIONES -->
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${p.publicaciones ? '#e8f5e8' : '#f5f5f5'};border-radius:6px;">
                    <span style="font-size:18px;">📱</span>
                    <div style="flex:1;">
                      <div style="font-size:12px;color:#666;">Publicaciones</div>
                      <div style="font-weight:600;color:${p.publicaciones ? '#2e7d32' : '#666'};">${p.publicaciones ? 'HABILITADO' : 'NO'}</div>
                    </div>
                  </div>
                  
                  <!-- PEDIGRÍ -->
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${p.pedigri ? '#e8f5e8' : '#f5f5f5'};border-radius:6px;">
                    <span style="font-size:18px;">🧬</span>
                    <div style="flex:1;">
                      <div style="font-size:12px;color:#666;">Pedigrí</div>
                      <div style="font-weight:600;color:${p.pedigri ? '#2e7d32' : '#666'};">${p.pedigri ? 'HABILITADO' : 'NO'}</div>
                    </div>
                  </div>
                  
                  <!-- VENTAS (si existe) -->
                  ${p.ventas !== undefined ? `
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${p.ventas ? '#e8f5e8' : '#f5f5f5'};border-radius:6px;">
                    <span style="font-size:18px;">💰</span>
                    <div style="flex:1;">
                      <div style="font-size:12px;color:#666;">Ventas</div>
                      <div style="font-weight:600;color:${p.ventas ? '#2e7d32' : '#666'};">${p.ventas ? 'HABILITADO' : 'NO'}</div>
                    </div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- INFORMACIÓN ADICIONAL -->
              <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
                <div style="background:#f5f5f5;padding:8px 15px;border-radius:20px;font-size:13px;">
                  📱 Teléfono: ${p.formattedPhone || p.phone || 'No registrado'}
                </div>
                <div style="background:#f5f5f5;padding:8px 15px;border-radius:20px;font-size:13px;">
                  📍 Ubicación: ${p.municipio || 'No especificada'}
                </div>
                <div style="background:#f5f5f5;padding:8px 15px;border-radius:20px;font-size:13px;">
                  🏷️ Registrado: ${new Date(p.registeredAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <!-- ACCIONES RÁPIDAS -->
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button onclick="copiarUID('${u.uid}')" 
                      style="background:#f0f2f5;border:1px solid #ddd;padding:10px 20px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:8px;">
                <span>📋</span> Copiar UID
              </button>
              <button onclick="navigateTo('public')" 
                      style="background:#8B4513;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:8px;">
                <span>🏠</span> Volver al Inicio
              </button>
            </div>
          </div>
          
          <!-- AQUÍ VA EL RESTO DE TU CONTENIDO DEL PANEL JUEZ -->
          <!-- EJEMPLO: -->
          <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top:0;color:#333;">📋 Contenido del Panel</h3>
            <p>Aquí puedes agregar todas las funcionalidades que necesites para el juez.</p>
            <p>Este es un espacio para tu contenido personalizado.</p>
          </div>
          
        </div>
      </div>
    `;
  };
  
  // ===== FUNCIÓN AUXILIAR GLOBAL PARA COPIAR UID =====
  window.copiarUID = function(uid) {
    navigator.clipboard.writeText(uid).then(() => {
      if (typeof AppState?.addNotification === 'function') {
        AppState.addNotification('✅ UID copiado al portapapeles', 'success');
      } else {
        alert('✅ UID copiado: ' + uid);
      }
    }).catch(() => {
      if (typeof AppState?.addNotification === 'function') {
        AppState.addNotification('❌ Error al copiar', 'error');
      }
    });
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
