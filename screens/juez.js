// ==============================================
// PANTALLA DEL JUEZ - CON DATOS SIMULADOS PARA PRUEBAS
// ==============================================
window.renderJuezScreen = function() {
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
  
  // ===== SEGURIDAD: Verificar que sea JUEZ =====
  if (userProfile.isJudge !== true) {
    return `
      <div style="min-height: 100vh; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="font-size: 60px; margin-bottom: 20px; color: #d32f2f;">⚖️</div>
          <h2 style="color: #d32f2f; margin-bottom: 10px;">Acceso Restringido</h2>
          <p style="color: #666; margin-bottom: 20px;">Esta sección es exclusiva para jueces.</p>
          <button onclick="navigateTo('public')" style="background: #8B4513; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer;">
            Volver al inicio
          </button>
        </div>
      </div>
    `;
  }
  
  const displayName = userProfile.displayName || currentUser.displayName || 'Juez';
  const photoURL = userProfile.photoURL || currentUser.photoURL || '';
  const initials = window.getInitials ? window.getInitials(displayName) : displayName.charAt(0).toUpperCase();
  
  // ===== SOLO PARA JUECES ACTIVADOS =====
  return `
    <div class="juez-screen" style="min-height: 100vh; background: #f8f9fa;">
      <div style="padding-top: 0;">
        
        <!-- ============================================== -->
        <!-- CABECERA CON INFORMACIÓN DEL JUEZ               -->
        <!-- ============================================== -->
        <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
            <!-- Avatar con estilo de juez -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; border: 3px solid #FFD700;">
              ${photoURL ? 
                `<img src="${photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='${initials}';">` 
                : initials
              }
            </div>
            <!-- Info -->
            <div>
              <h2 style="margin: 0; color: #333;">⚖️ PANEL DEL JUEZ</h2>
              <p style="margin: 5px 0 0; color: #666;">
                <span style="color: #FFD700; background: #8B4513; padding: 2px 8px; border-radius: 12px; font-size: 12px;">⚖️ JUEZ</span> | 
                <strong>${displayName}</strong> | 
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
          <!-- 1. ESTADÍSTICAS RÁPIDAS                        -->
          <!-- ============================================== -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">⚔️</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">24</div>
              <div style="color: #666; font-size: 14px;">Peleas calificadas</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">🏆</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">8</div>
              <div style="color: #666; font-size: 14px;">Torneos como juez</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">📅</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">6</div>
              <div style="color: #666; font-size: 14px;">Próximas peleas</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 36px; margin-bottom: 10px;">⭐</div>
              <div style="font-size: 24px; font-weight: bold; color: #8B4513;">4.9</div>
              <div style="color: #666; font-size: 14px;">Calificación promedio</div>
            </div>
            
          </div>
          
          <!-- ============================================== -->
          <!-- 2. PRÓXIMAS PELEAS PARA CALIFICAR              -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>⚔️</span> PRÓXIMAS PELEAS PARA CALIFICAR
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
              
              <!-- Pelea 1 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #8B4513;">
                <div>
                  <div style="font-weight: bold; color: #333;">🏆 Torneo Gallos del Norte</div>
                  <div style="display: flex; align-items: center; gap: 20px; margin-top: 8px;">
                    <div><span style="color: #8B4513;">🐓</span> El Campeón vs <span style="color: #8B4513;">🐓</span> Relámpago</div>
                    <div style="font-size: 12px; color: #666;">⚖️ Peso: 2.5kg vs 2.4kg</div>
                  </div>
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">📅 Hoy 18:00 hrs | Ring 1</div>
                </div>
                <button onclick="AppState.addNotification('Calificar pelea - Función simulada', 'info')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-weight: bold;">
                  CALIFICAR
                </button>
              </div>
              
              <!-- Pelea 2 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #ff9800;">
                <div>
                  <div style="font-weight: bold; color: #333;">🏆 Copa de Oro</div>
                  <div style="display: flex; align-items: center; gap: 20px; margin-top: 8px;">
                    <div><span style="color: #8B4513;">🐓</span> Fuego vs <span style="color: #8B4513;">🐓</span> Sombra</div>
                    <div style="font-size: 12px; color: #666;">⚖️ Peso: 2.6kg vs 2.5kg</div>
                  </div>
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">📅 Mañana 16:00 hrs | Ring 2</div>
                </div>
                <button onclick="AppState.addNotification('Calificar pelea - Función simulada', 'info')" style="background: #ff9800; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-weight: bold;">
                  CALIFICAR
                </button>
              </div>
              
              <!-- Pelea 3 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #2196f3;">
                <div>
                  <div style="font-weight: bold; color: #333;">🏆 Desafío Final</div>
                  <div style="display: flex; align-items: center; gap: 20px; margin-top: 8px;">
                    <div><span style="color: #8B4513;">🐓</span> Trueno vs <span style="color: #8B4513;">🐓</span> Rayo</div>
                    <div style="font-size: 12px; color: #666;">⚖️ Peso: 2.3kg vs 2.4kg</div>
                  </div>
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">📅 25 Feb 15:00 hrs | Ring Central</div>
                </div>
                <button onclick="AppState.addNotification('Calificar pelea - Función simulada', 'info')" style="background: #2196f3; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-weight: bold;">
                  CALIFICAR
                </button>
              </div>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 3. FUNCIONES DEL JUEZ                          -->
          <!-- ============================================== -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-bottom: 20px;">
            
            <!-- Tarjeta 1 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 40px; margin-bottom: 15px; color: #8B4513;">⚔️</div>
              <h3 style="margin: 0 0 8px; color: #333;">Calificar Peleas</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Registra resultados y puntuaciones de las peleas en tiempo real.</p>
              <div style="display: flex; gap: 8px;">
                <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 11px;">⏱️ Tiempo real</span>
                <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">📊 Puntuación</span>
              </div>
              <button onclick="AppState.addNotification('Acceder a calificación - Función simulada', 'info')" style="width: 100%; margin-top: 15px; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
                ACCEDER
              </button>
            </div>
            
            <!-- Tarjeta 2 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 40px; margin-bottom: 15px; color: #8B4513;">✅</div>
              <h3 style="margin: 0 0 8px; color: #333;">Validar Resultados</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Confirma y certifica los resultados de las competencias.</p>
              <div style="display: flex; gap: 8px;">
                <span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">✅ Pendientes: 4</span>
                <span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; font-size: 11px;">📋 Historial</span>
              </div>
              <button onclick="AppState.addNotification('Validar resultados - Función simulada', 'info')" style="width: 100%; margin-top: 15px; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
                VALIDAR
              </button>
            </div>
            
            <!-- Tarjeta 3 -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 40px; margin-bottom: 15px; color: #8B4513;">📋</div>
              <h3 style="margin: 0 0 8px; color: #333;">Historial</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Revisa peleas pasadas y resultados certificados.</p>
              <div style="display: flex; gap: 8px;">
                <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">📊 24 peleas</span>
                <span style="background: #e1f5fe; padding: 4px 8px; border-radius: 4px; font-size: 11px;">📅 2024</span>
              </div>
              <button onclick="AppState.addNotification('Ver historial - Función simulada', 'info')" style="width: 100%; margin-top: 15px; background: #8B4513; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
                VER HISTORIAL
              </button>
            </div>
            
          </div>
          
          <!-- ============================================== -->
          <!-- 4. PELEAS RECIENTES                            -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📊</span> PELEAS RECIENTES CALIFICADAS
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e0e0e0;">
                  <th style="padding: 10px; text-align: left;">Fecha</th>
                  <th style="padding: 10px; text-align: left;">Torneo</th>
                  <th style="padding: 10px; text-align: left;">Gallo 1</th>
                  <th style="padding: 10px; text-align: left;">Gallo 2</th>
                  <th style="padding: 10px; text-align: left;">Ganador</th>
                  <th style="padding: 10px; text-align: left;">Puntuación</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px;">20/02/2026</td>
                  <td style="padding: 10px;">Gallos del Norte</td>
                  <td style="padding: 10px;">El Campeón</td>
                  <td style="padding: 10px;">Relámpago</td>
                  <td style="padding: 10px; color: #4CAF50; font-weight: bold;">El Campeón</td>
                  <td style="padding: 10px;">48 - 45</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px;">18/02/2026</td>
                  <td style="padding: 10px;">Copa de Oro</td>
                  <td style="padding: 10px;">Fuego</td>
                  <td style="padding: 10px;">Sombra</td>
                  <td style="padding: 10px; color: #4CAF50; font-weight: bold;">Fuego</td>
                  <td style="padding: 10px;">50 - 44</td>
                </tr>
                <tr>
                  <td style="padding: 10px;">15/02/2026</td>
                  <td style="padding: 10px;">Desafío Final</td>
                  <td style="padding: 10px;">Trueno</td>
                  <td style="padding: 10px;">Rayo</td>
                  <td style="padding: 10px; color: #4CAF50; font-weight: bold;">Empate</td>
                  <td style="padding: 10px;">47 - 47</td>
                </tr>
              </tbody>
            </table>
            
            <div style="margin-top: 20px; text-align: center;">
              <button onclick="AppState.addNotification('Ver historial completo - Función simulada', 'info')" style="background: transparent; border: 2px solid #8B4513; color: #8B4513; padding: 10px 30px; border-radius: 30px; font-weight: bold; cursor: pointer;">
                VER HISTORIAL COMPLETO →
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 5. NOTAS Y OBSERVACIONES                       -->
          <!-- ============================================== -->
          <div style="background: #fff8e1; border-radius: 16px; padding: 20px; margin-bottom: 40px; border-left: 4px solid #FFD700;">
            <h3 style="margin-top: 0; color: #8B4513; display: flex; align-items: center; gap: 10px;">
              <span>📝</span> NOTAS DEL JUEZ
            </h3>
            
            <div style="background: white; border-radius: 12px; padding: 15px;">
              <textarea id="judgeNotes" placeholder="Escribe aquí tus observaciones sobre las peleas..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; min-height: 100px; font-family: inherit;">Torneo Gallos del Norte: Excelente nivel competitivo. El Campeón demostró superioridad técnica. Relámpago necesita mejorar su resistencia.</textarea>
              <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                <button onclick="AppState.addNotification('Notas guardadas (simulado)', 'success')" style="background: #8B4513; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer;">
                  Guardar notas
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};

console.log("✅ juez.js cargado con datos simulados");
