// ==============================================
// PANTALLA ROOSTER - CON DATOS SIMULADOS PARA PRUEBAS
// ==============================================
window.renderRoosterScreen = function() {
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
          
          <!-- ============================================== -->
          <!-- 2. TARJETAS DE TORNEOS                         -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🏆</span> TORNEOS ACTIVOS
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
              
              <!-- Torneo 1 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #8B4513;">🏆 Gallos del Norte</span>
                  <span style="background: #42b72a; color: white; padding: 4px 8px; border-radius: 20px; font-size: 12px;">En curso</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">24 participantes | 8 eliminatorias</p>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 12px;">🏁 Final: 25/02</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px;">💰 $5,000</span>
                </div>
              </div>
              
              <!-- Torneo 2 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #8B4513;">🏆 Copa de Oro</span>
                  <span style="background: #ff9800; color: white; padding: 4px 8px; border-radius: 20px; font-size: 12px;">Próximo</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">12 inscritos | 4 cupos</p>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📅 Inicio: 01/03</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px;">💰 $10,000</span>
                </div>
              </div>
              
              <!-- Torneo 3 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #8B4513;">🏆 Desafío Final</span>
                  <span style="background: #d93025; color: white; padding: 4px 8px; border-radius: 20px; font-size: 12px;">Finalizado</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">32 participantes | Ganador: Juan Pérez</p>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📊 Ver resultados</span>
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 3. ESTADÍSTICAS Y CUADROS                      -->
          <!-- ============================================== -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            
            <!-- Cuadro 1 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">🐓</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">12</div>
              <div style="color: #666; font-size: 14px;">Mis gallos</div>
            </div>
            
            <!-- Cuadro 2 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">🏆</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">5</div>
              <div style="color: #666; font-size: 14px;">Torneos ganados</div>
            </div>
            
            <!-- Cuadro 3 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">👥</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">48</div>
              <div style="color: #666; font-size: 14px;">Seguidores</div>
            </div>
            
            <!-- Cuadro 4 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">⭐</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">4.8</div>
              <div style="color: #666; font-size: 14px;">Calificación</div>
            </div>
            
          </div>
          
          <!-- ============================================== -->
          <!-- 4. LISTA DE PARTICIPANTES                      -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📋</span> PARTICIPANTES DESTACADOS
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e0e0e0;">
                  <th style="padding: 10px; text-align: left;">Participante</th>
                  <th style="padding: 10px; text-align: left;">Gallos</th>
                  <th style="padding: 10px; text-align: left;">Victorias</th>
                  <th style="padding: 10px; text-align: left;">Último torneo</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px;">🐓 Juan Pérez</td>
                  <td style="padding: 10px;">5</td>
                  <td style="padding: 10px;">12</td>
                  <td style="padding: 10px;">Copa de Oro</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px;">🐓 María García</td>
                  <td style="padding: 10px;">3</td>
                  <td style="padding: 10px;">8</td>
                  <td style="padding: 10px;">Gallos del Norte</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px;">🐓 Carlos López</td>
                  <td style="padding: 10px;">7</td>
                  <td style="padding: 10px;">15</td>
                  <td style="padding: 10px;">Desafío Final</td>
                </tr>
                <tr>
                  <td style="padding: 10px;">🐓 Ana Martínez</td>
                  <td style="padding: 10px;">4</td>
                  <td style="padding: 10px;">6</td>
                  <td style="padding: 10px;">Torneo Relámpago</td>
                </tr>
              </tbody>
            </table>
            
            <div style="margin-top: 20px; text-align: center;">
              <button style="background: transparent; border: 2px solid #8B4513; color: #8B4513; padding: 10px 30px; border-radius: 30px; font-weight: bold; cursor: pointer;">
                VER TODOS LOS PARTICIPANTES →
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};

console.log("✅ rooster.js cargado con datos simulados");
