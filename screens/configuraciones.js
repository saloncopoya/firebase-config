// ==============================================
// PANTALLA CONFIGURACIONES - CON DATOS SIMULADOS PARA PRUEBAS
// ==============================================
window.renderConfiguracionesScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  // ===== SEGURIDAD: Usuario no logueado =====
  if (!currentUser) {
    return `<div style="min-height: 100vh; background: #f8f9fa;">
      🔒 Debes iniciar sesión para ver esta sección
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
    <div class="configuraciones-screen" style="min-height: 100vh; background: #f8f9fa;">
      <div style="padding-top: 0;">
        
        <!-- ============================================== -->
        <!-- CABECERA CON INFORMACIÓN DEL USUARIO           -->
        <!-- ============================================== -->
        <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
          <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
            <!-- Avatar -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              ⚙️
            </div>
            <!-- Info -->
            <div>
              <h2 style="margin: 0; color: #333;">⚙️ CONFIGURACIONES</h2>
              <p style="margin: 5px 0 0; color: #666;">
                <span style="color: green;">✅ Activado</span> | 
                <strong>${userProfile.displayName || 'Usuario'}</strong>
              </p>
            </div>
          </div>
        </div>
        
        <!-- ============================================== -->
        <!-- CONTENEDOR PRINCIPAL                           -->
        <!-- ============================================== -->
        <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
          
          <!-- ============================================== -->
          <!-- 1. PERFIL                                      -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>👤</span> MI PERFIL
            </h3>
            
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold;">
                ${(userProfile.displayName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style="margin: 0 0 5px; color: #333;">${userProfile.displayName || 'Usuario'}</h4>
                <p style="margin: 0 0 5px; color: #666; font-size: 14px;">${userProfile.realEmail || 'email@ejemplo.com'}</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${userProfile.phone || '+52 961 123 4567'}</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button onclick="AppState.addNotification('Editar perfil - Función simulada', 'info')" style="flex: 1; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ✏️ EDITAR PERFIL
              </button>
              <button onclick="AppState.addNotification('Cambiar foto - Función simulada', 'info')" style="flex: 1; background: #f0f2f5; color: #333; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                📷 CAMBIAR FOTO
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 2. PRIVACIDAD Y SEGURIDAD                      -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🔒</span> PRIVACIDAD Y SEGURIDAD
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
              
              <!-- Opción 1 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">Mostrar teléfono</div>
                  <div style="font-size: 13px; color: #666;">Quién puede ver mi número</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="showPhoneToggle" ${userProfile.showPhone ? 'checked' : ''} onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${userProfile.showPhone ? '#8B4513' : '#ccc'}; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: ${userProfile.showPhone ? '26px' : '4px'}; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
              <!-- Opción 2 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">WhatsApp</div>
                  <div style="font-size: 13px; color: #666;">Permitir mensajes por WhatsApp</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="whatsappToggle" ${userProfile.allowWhatsAppMessages ? 'checked' : ''} onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${userProfile.allowWhatsAppMessages ? '#8B4513' : '#ccc'}; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: ${userProfile.allowWhatsAppMessages ? '26px' : '4px'}; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
              <!-- Opción 3 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">Mostrar ubicación</div>
                  <div style="font-size: 13px; color: #666;">Compartir mi municipio</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="locationToggle" ${userProfile.showLocation !== false ? 'checked' : ''} onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${userProfile.showLocation !== false ? '#8B4513' : '#ccc'}; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: ${userProfile.showLocation !== false ? '26px' : '4px'}; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
              <!-- Botón contraseña -->
              <button onclick="AppState.addNotification('Cambiar contraseña - Función simulada', 'info')" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer; width: 100%;">
                <span style="font-size: 20px;">🔑</span>
                <div style="text-align: left;">
                  <div style="font-weight: 600; color: #333;">Cambiar contraseña</div>
                  <div style="font-size: 13px; color: #666;">Actualiza tu contraseña regularmente</div>
                </div>
              </button>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 3. NOTIFICACIONES                              -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🔔</span> NOTIFICACIONES
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">Notificaciones push</div>
                  <div style="font-size: 13px; color: #666;">Recibir alertas en el dispositivo</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="pushToggle" checked onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #8B4513; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: 26px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">Sonidos</div>
                  <div style="font-size: 13px; color: #666;">Reproducir sonidos al recibir notificaciones</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="soundsToggle" checked onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #8B4513; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: 26px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                  <div style="font-weight: 600; color: #333;">Email</div>
                  <div style="font-size: 13px; color: #666;">Recibir novedades por correo</div>
                </div>
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                  <input type="checkbox" id="emailToggle" onchange="AppState.addNotification('Configuración guardada (simulado)', 'success')" style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 20px; width: 20px; left: 4px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                  </span>
                </label>
              </div>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 4. CUENTA Y DISPOSITIVOS                       -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📱</span> CUENTA Y DISPOSITIVOS
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 24px;">💻</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: #333;">Chrome - Windows</div>
                  <div style="font-size: 12px; color: #666;">IP: 192.168.1.100 · Activo ahora</div>
                </div>
                <span style="color: #4CAF50; font-size: 12px; padding: 4px 8px; background: #e8f5e8; border-radius: 12px;">ACTUAL</span>
              </div>
              
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 24px;">📱</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: #333;">iPhone 13 - Safari</div>
                  <div style="font-size: 12px; color: #666;">Último acceso: hace 2 días</div>
                </div>
                <button onclick="AppState.addNotification('Dispositivo cerrado (simulado)', 'warning')" style="background: #ff9800; color: white; border: none; padding: 4px 12px; border-radius: 12px; cursor: pointer; font-size: 12px;">
                  Cerrar
                </button>
              </div>
              
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 24px;">📱</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: #333;">Samsung S23 - Android</div>
                  <div style="font-size: 12px; color: #666;">Último acceso: hace 5 días</div>
                </div>
                <button onclick="AppState.addNotification('Dispositivo cerrado (simulado)', 'warning')" style="background: #ff9800; color: white; border: none; padding: 4px 12px; border-radius: 12px; cursor: pointer; font-size: 12px;">
                  Cerrar
                </button>
              </div>
              
            </div>
            
            <button onclick="AppState.addNotification('Cerrar todas las sesiones (simulado)', 'warning')" style="width: 100%; background: #ff9800; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-top: 15px; font-weight: bold;">
              CERRAR TODAS LAS SESIONES
            </button>
          </div>
          
          <!-- ============================================== -->
          <!-- 5. ZONA DE PELIGRO                             -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid #d32f2f;">
            <h3 style="margin-top: 0; color: #d32f2f; display: flex; align-items: center; gap: 10px;">
              <span>⚠️</span> ZONA DE PELIGRO
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              
              <button onclick="AppState.addNotification('Exportar datos - Función simulada', 'info')" style="display: flex; align-items: center; gap: 10px; padding: 15px; background: #fff5f5; border: 1px solid #ffcdd2; border-radius: 8px; cursor: pointer; width: 100%;">
                <span style="font-size: 20px;">📥</span>
                <div style="text-align: left; flex: 1;">
                  <div style="font-weight: 600; color: #d32f2f;">Exportar mis datos</div>
                  <div style="font-size: 13px; color: #666;">Descarga toda tu información en un archivo</div>
                </div>
                <span style="color: #d32f2f;">→</span>
              </button>
              
              <button onclick="if(confirm('¿Estás SEGURO? Esta acción NO se puede deshacer.')) AppState.addNotification('Cuenta eliminada (simulado)', 'error')" style="display: flex; align-items: center; gap: 10px; padding: 15px; background: #ffebee; border: 1px solid #ef9a9a; border-radius: 8px; cursor: pointer; width: 100%;">
                <span style="font-size: 20px;">🗑️</span>
                <div style="text-align: left; flex: 1;">
                  <div style="font-weight: 600; color: #c62828;">Eliminar cuenta</div>
                  <div style="font-size: 13px; color: #666;">Esta acción es permanente e irreversible</div>
                </div>
                <span style="color: #c62828;">→</span>
              </button>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 6. INFORMACIÓN DE LA APP                       -->
          <!-- ============================================== -->
          <div style="text-align: center; margin-bottom: 40px; color: #999; font-size: 13px;">
            <p>Legado Avícola v2.0.0</p>
            <p style="margin: 5px 0;">© 2024 - Todos los derechos reservados</p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
              <a href="#" onclick="AppState.addNotification('Términos de servicio', 'info')" style="color: #8B4513; text-decoration: none;">Términos</a>
              <a href="#" onclick="AppState.addNotification('Política de privacidad', 'info')" style="color: #8B4513; text-decoration: none;">Privacidad</a>
              <a href="#" onclick="AppState.addNotification('Ayuda', 'info')" style="color: #8B4513; text-decoration: none;">Ayuda</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};

console.log("✅ configuraciones.js cargado con datos simulados");
