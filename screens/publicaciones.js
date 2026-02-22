// ==============================================
// PANTALLA PUBLICACIONES - VERSIÓN SIMULADA PARA PRUEBAS
// ==============================================
window.renderPublicacionesScreen = function() {
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
    <div class="publicaciones-screen" style="min-height: 100vh; background: #f8f9fa;">
      <div style="padding-top: 0;">
        
        <!-- ============================================== -->
        <!-- CABECERA CON INFORMACIÓN DEL USUARIO           -->
        <!-- ============================================== -->
        <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
          <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
            <!-- Avatar -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              ${(userProfile.displayName || 'U').charAt(0).toUpperCase()}
            </div>
            <!-- Info -->
            <div>
              <h2 style="margin: 0; color: #333;">📱 PUBLICACIONES</h2>
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
        <div style="max-width: 600px; margin: 0 auto; padding: 0 20px;">
          
          <!-- ============================================== -->
          <!-- HEADER - HISTORIAS                             -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 15px; overflow-x: auto; padding: 5px 0;">
              <div style="text-align: center; min-width: 70px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                  +
                </div>
                <div style="font-size: 12px; margin-top: 5px;">Tu historia</div>
              </div>
              ${[1,2,3,4,5].map(i => `
                <div style="text-align: center; min-width: 70px;">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #4CAF50, #2196F3); padding: 2px;">
                    <div style="width: 100%; height: 100%; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                      <img src="https://i.pravatar.cc/60?img=${i}" style="width: 56px; height: 56px; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.innerHTML='U${i}'">
                    </div>
                  </div>
                  <div style="font-size: 11px; margin-top: 5px;">Usuario ${i}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- CAJA PARA CREAR PUBLICACIÓN                     -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 10px; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <input type="text" placeholder="¿Qué estás pensando, ${userProfile.displayName || 'usuario'}?" 
                     style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
            </div>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
            <div style="display: flex; justify-content: space-around;">
              <button onclick="AppState.addNotification('Video en vivo - Función simulada', 'info')" style="background: none; border: none; color: #f44336; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                🎥 Video en vivo
              </button>
              <button onclick="AppState.addNotification('Subir foto - Función simulada', 'info')" style="background: none; border: none; color: #4CAF50; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                🖼️ Foto
              </button>
              <button onclick="AppState.addNotification('Compartir ubicación - Función simulada', 'info')" style="background: none; border: none; color: #FF9800; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                📍 Ubicación
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- FILTROS RÁPIDOS                                 -->
          <!-- ============================================== -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding: 5px 0;">
            <span onclick="AppState.addNotification('Filtro: Recientes', 'info')" style="background: #8B4513; color: white; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">✨ Recientes</span>
            <span onclick="AppState.addNotification('Filtro: Tendencias', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🔥 Tendencias</span>
            <span onclick="AppState.addNotification('Filtro: Torneos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🏆 Torneos</span>
            <span onclick="AppState.addNotification('Filtro: Gallos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🐓 Gallos</span>
            <span onclick="AppState.addNotification('Filtro: Seguidos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">👥 Seguidos</span>
          </div>
          
          <!-- ============================================== -->
          <!-- FEED DE PUBLICACIONES                           -->
          <!-- ============================================== -->
          <div id="publicaciones-feed">
            
            <!-- PUBLICACIÓN 1 - CON IMAGEN -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=1" style="width: 40px; height: 40px; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\'width:40px;height:40px;border-radius:50%;background:#8B4513;color:white;display:flex;align-items:center;justify-content:center;\'>J</div>'">
                <div style="flex: 1;">
                  <strong>Juan Pérez</strong>
                  <div style="font-size: 12px; color: #666;">hace 2 horas · 📍 Tuxtla Gutiérrez</div>
                </div>
                <button onclick="AppState.addNotification('Menú de opciones', 'info')" style="background: none; border: none; font-size: 20px; cursor: pointer;">⋯</button>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>¡Gran día en el torneo! Mi gallo "El Campeón" ganó su primera pelea. 🏆🐓</p>
              </div>
              
              <div style="background: #f0f2f5; height: 250px; display: flex; align-items: center; justify-content: center; color: #666; border-radius: 0;">
                🖼️ [IMAGEN DEL TORNEO - GALLOS DEL NORTE]
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    ❤️ 24
                  </button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    💬 8
                  </button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    🔄 3
                  </button>
                </div>
                
                <!-- COMENTARIOS -->
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <img src="https://i.pravatar.cc/30?img=2" style="width: 30px; height: 30px; border-radius: 50%;" onerror="this.style.display='none';">
                  <input type="text" placeholder="Escribe un comentario..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 2 - SOLO TEXTO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=3" style="width: 40px; height: 40px; border-radius: 50%;" onerror="this.style.display='none';">
                <div style="flex: 1;">
                  <strong>María García</strong>
                  <div style="font-size: 12px; color: #666;">hace 5 horas · 📍 Tapachula</div>
                </div>
                <button onclick="AppState.addNotification('Menú de opciones', 'info')" style="background: none; border: none; font-size: 20px; cursor: pointer;">⋯</button>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>Alguien tiene información sobre el próximo torneo en Comitán? Estoy interesada en inscribir 3 gallos. 🐓🐓🐓</p>
                <div style="background: #f0f2f5; padding: 10px; border-radius: 8px; margin-top: 10px;">
                  <span style="color: #8B4513;">#Consulta #Torneos #Chiapas</span>
                </div>
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">❤️ 12</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">💬 5</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">🔄 1</button>
                </div>
                
                <!-- COMENTARIOS EXISTENTES -->
                <div style="margin-top: 15px;">
                  <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <img src="https://i.pravatar.cc/30?img=4" style="width: 30px; height: 30px; border-radius: 50%;">
                    <div style="background: #f0f2f5; padding: 8px 12px; border-radius: 18px; flex: 1;">
                      <strong>Carlos López</strong> Yo voy a participar con 2 gallos, ¿de qué parte eres?
                    </div>
                  </div>
                  <div style="display: flex; gap: 10px; margin-left: 40px;">
                    <span style="font-size: 12px; color: #666;">hace 3 horas</span>
                    <span style="font-size: 12px; color: #8B4513; cursor: pointer;" onclick="AppState.addNotification('Like a comentario', 'success')">❤️ 2</span>
                    <span style="font-size: 12px; color: #8B4513; cursor: pointer;" onclick="AppState.addNotification('Responder comentario', 'info')">Responder</span>
                  </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                  <img src="https://i.pravatar.cc/30?img=5" style="width: 30px; height: 30px; border-radius: 50%;">
                  <input type="text" placeholder="Escribe un comentario..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 3 - COMPARTIR TORNEO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white;">
                  A
                </div>
                <div style="flex: 1;">
                  <strong>Admin Torneos</strong>
                  <div style="font-size: 12px; color: #666;">hace 1 día · 🌐 Público</div>
                </div>
              </div>
              
              <div style="padding: 0 15px;">
                <p>📢 NUEVO TORNEO ANUNCIADO:</p>
              </div>
              
              <div style="background: linear-gradient(145deg, #8B4513, #D2691E); color: white; padding: 20px; margin: 10px 15px; border-radius: 12px;">
                <div style="font-size: 18px; font-weight: bold;">🏆 COPA DE ORO 2024</div>
                <div style="margin: 10px 0;">📍 Tuxtla Gutiérrez, Chiapas</div>
                <div>📅 15 - 20 Marzo 2024</div>
                <div style="margin-top: 15px;">💰 Premio: $50,000 MXN</div>
                <button onclick="AppState.addNotification('Ver detalles del torneo', 'info')" style="background: white; color: #8B4513; border: none; padding: 10px; border-radius: 30px; width: 100%; margin-top: 15px; font-weight: bold; cursor: pointer;">
                  Ver detalles
                </button>
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">❤️ 45</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">💬 12</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">🔄 8</button>
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 4 - VIDEO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=7" style="width: 40px; height: 40px; border-radius: 50%;">
                <div style="flex: 1;">
                  <strong>Roberto Sánchez</strong>
                  <div style="font-size: 12px; color: #666;">hace 6 horas · 📍 Chiapa de Corzo</div>
                </div>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>Así fue la pelea de hoy, mi gallo "Relámpago" demostrando su poder! 🐓⚡</p>
              </div>
              
              <div style="background: #000; height: 300px; display: flex; align-items: center; justify-content: center; color: white;">
                🎥 [VIDEO DE LA PELEA - REPRODUCIENDO...]
              </div>
              
              <div style="padding: 15px;">
                <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none;">❤️ 89</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none;">💬 23</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none;">🔄 15</button>
                </div>
                <div style="font-size: 13px; color: #666;">
                  Ver 12 comentarios más...
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 5 - ENCUESTA -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px;">
                <strong>Laura Torres</strong>
                <span style="color: #666; font-size: 13px; margin-left: 10px;">hace 8 horas</span>
                
                <p style="margin: 10px 0;">¿Qué raza de gallo prefieres para peleas?</p>
                
                <div style="margin: 15px 0;">
                  <div onclick="AppState.addNotification('Votaste por American Game', 'success')" style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 American Game</span>
                    <span style="float: right;">45% (23 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Roundhead', 'success')" style="background: #e8f5e8; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 Roundhead</span>
                    <span style="float: right;">30% (15 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Kelso', 'success')" style="background: #fff3e0; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 Kelso</span>
                    <span style="float: right;">15% (8 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Hatch', 'success')" style="background: #f3e5f5; padding: 12px; border-radius: 8px; cursor: pointer;">
                    <span>🐓 Hatch</span>
                    <span style="float: right;">10% (5 votos)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- BOTÓN CARGAR MÁS -->
            <div style="text-align: center; margin: 30px 0;">
              <button onclick="AppState.addNotification('Cargar más publicaciones - Función simulada', 'info')" style="background: white; border: 2px solid #8B4513; color: #8B4513; padding: 12px 30px; border-radius: 30px; font-weight: bold; cursor: pointer;">
                Cargar más publicaciones
              </button>
            </div>
            
          </div>
          
          <!-- ============================================== -->
          <!-- ESTADÍSTICAS RÁPIDAS                            -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 40px; text-align: center;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div>
                <div style="font-size: 24px; color: #8B4513;">124</div>
                <div style="font-size: 12px; color: #666;">Posts hoy</div>
              </div>
              <div>
                <div style="font-size: 24px; color: #8B4513;">45</div>
                <div style="font-size: 12px; color: #666;">Comentarios</div>
              </div>
              <div>
                <div style="font-size: 24px; color: #8B4513;">12</div>
                <div style="font-size: 12px; color: #666;">Torneos activos</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};

console.log("✅ publicaciones.js cargado - VERSIÓN CORREGIDA sin padding extra");// ==============================================
// PANTALLA PUBLICACIONES - VERSIÓN SIMULADA PARA PRUEBAS
// ==============================================
window.renderPublicacionesScreen = function() {
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
    <div class="publicaciones-screen" style="min-height: 100vh; background: #f8f9fa;">
      <div style="padding-top: 0;">
        
        <!-- ============================================== -->
        <!-- CABECERA CON INFORMACIÓN DEL USUARIO           -->
        <!-- ============================================== -->
        <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
          <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
            <!-- Avatar -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              ${(userProfile.displayName || 'U').charAt(0).toUpperCase()}
            </div>
            <!-- Info -->
            <div>
              <h2 style="margin: 0; color: #333;">📱 PUBLICACIONES</h2>
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
        <div style="max-width: 600px; margin: 0 auto; padding: 0 20px;">
          
          <!-- ============================================== -->
          <!-- HEADER - HISTORIAS                             -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 15px; overflow-x: auto; padding: 5px 0;">
              <div style="text-align: center; min-width: 70px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                  +
                </div>
                <div style="font-size: 12px; margin-top: 5px;">Tu historia</div>
              </div>
              ${[1,2,3,4,5].map(i => `
                <div style="text-align: center; min-width: 70px;">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #4CAF50, #2196F3); padding: 2px;">
                    <div style="width: 100%; height: 100%; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                      <img src="https://i.pravatar.cc/60?img=${i}" style="width: 56px; height: 56px; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.innerHTML='U${i}'">
                    </div>
                  </div>
                  <div style="font-size: 11px; margin-top: 5px;">Usuario ${i}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- CAJA PARA CREAR PUBLICACIÓN                     -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 10px; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <input type="text" placeholder="¿Qué estás pensando, ${userProfile.displayName || 'usuario'}?" 
                     style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
            </div>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
            <div style="display: flex; justify-content: space-around;">
              <button onclick="AppState.addNotification('Video en vivo - Función simulada', 'info')" style="background: none; border: none; color: #f44336; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                🎥 Video en vivo
              </button>
              <button onclick="AppState.addNotification('Subir foto - Función simulada', 'info')" style="background: none; border: none; color: #4CAF50; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                🖼️ Foto
              </button>
              <button onclick="AppState.addNotification('Compartir ubicación - Función simulada', 'info')" style="background: none; border: none; color: #FF9800; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                📍 Ubicación
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- FILTROS RÁPIDOS                                 -->
          <!-- ============================================== -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding: 5px 0;">
            <span onclick="AppState.addNotification('Filtro: Recientes', 'info')" style="background: #8B4513; color: white; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">✨ Recientes</span>
            <span onclick="AppState.addNotification('Filtro: Tendencias', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🔥 Tendencias</span>
            <span onclick="AppState.addNotification('Filtro: Torneos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🏆 Torneos</span>
            <span onclick="AppState.addNotification('Filtro: Gallos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">🐓 Gallos</span>
            <span onclick="AppState.addNotification('Filtro: Seguidos', 'info')" style="background: #f0f2f5; color: #333; padding: 8px 16px; border-radius: 30px; font-size: 14px; white-space: nowrap; cursor: pointer;">👥 Seguidos</span>
          </div>
          
          <!-- ============================================== -->
          <!-- FEED DE PUBLICACIONES                           -->
          <!-- ============================================== -->
          <div id="publicaciones-feed">
            
            <!-- PUBLICACIÓN 1 - CON IMAGEN -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=1" style="width: 40px; height: 40px; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\'width:40px;height:40px;border-radius:50%;background:#8B4513;color:white;display:flex;align-items:center;justify-content:center;\'>J</div>'">
                <div style="flex: 1;">
                  <strong>Juan Pérez</strong>
                  <div style="font-size: 12px; color: #666;">hace 2 horas · 📍 Tuxtla Gutiérrez</div>
                </div>
                <button onclick="AppState.addNotification('Menú de opciones', 'info')" style="background: none; border: none; font-size: 20px; cursor: pointer;">⋯</button>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>¡Gran día en el torneo! Mi gallo "El Campeón" ganó su primera pelea. 🏆🐓</p>
              </div>
              
              <div style="background: #f0f2f5; height: 250px; display: flex; align-items: center; justify-content: center; color: #666; border-radius: 0;">
                🖼️ [IMAGEN DEL TORNEO - GALLOS DEL NORTE]
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    ❤️ 24
                  </button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    💬 8
                  </button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    🔄 3
                  </button>
                </div>
                
                <!-- COMENTARIOS -->
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <img src="https://i.pravatar.cc/30?img=2" style="width: 30px; height: 30px; border-radius: 50%;" onerror="this.style.display='none';">
                  <input type="text" placeholder="Escribe un comentario..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 2 - SOLO TEXTO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=3" style="width: 40px; height: 40px; border-radius: 50%;" onerror="this.style.display='none';">
                <div style="flex: 1;">
                  <strong>María García</strong>
                  <div style="font-size: 12px; color: #666;">hace 5 horas · 📍 Tapachula</div>
                </div>
                <button onclick="AppState.addNotification('Menú de opciones', 'info')" style="background: none; border: none; font-size: 20px; cursor: pointer;">⋯</button>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>Alguien tiene información sobre el próximo torneo en Comitán? Estoy interesada en inscribir 3 gallos. 🐓🐓🐓</p>
                <div style="background: #f0f2f5; padding: 10px; border-radius: 8px; margin-top: 10px;">
                  <span style="color: #8B4513;">#Consulta #Torneos #Chiapas</span>
                </div>
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">❤️ 12</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">💬 5</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">🔄 1</button>
                </div>
                
                <!-- COMENTARIOS EXISTENTES -->
                <div style="margin-top: 15px;">
                  <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <img src="https://i.pravatar.cc/30?img=4" style="width: 30px; height: 30px; border-radius: 50%;">
                    <div style="background: #f0f2f5; padding: 8px 12px; border-radius: 18px; flex: 1;">
                      <strong>Carlos López</strong> Yo voy a participar con 2 gallos, ¿de qué parte eres?
                    </div>
                  </div>
                  <div style="display: flex; gap: 10px; margin-left: 40px;">
                    <span style="font-size: 12px; color: #666;">hace 3 horas</span>
                    <span style="font-size: 12px; color: #8B4513; cursor: pointer;" onclick="AppState.addNotification('Like a comentario', 'success')">❤️ 2</span>
                    <span style="font-size: 12px; color: #8B4513; cursor: pointer;" onclick="AppState.addNotification('Responder comentario', 'info')">Responder</span>
                  </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                  <img src="https://i.pravatar.cc/30?img=5" style="width: 30px; height: 30px; border-radius: 50%;">
                  <input type="text" placeholder="Escribe un comentario..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 30px; background: #f0f2f5;">
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 3 - COMPARTIR TORNEO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white;">
                  A
                </div>
                <div style="flex: 1;">
                  <strong>Admin Torneos</strong>
                  <div style="font-size: 12px; color: #666;">hace 1 día · 🌐 Público</div>
                </div>
              </div>
              
              <div style="padding: 0 15px;">
                <p>📢 NUEVO TORNEO ANUNCIADO:</p>
              </div>
              
              <div style="background: linear-gradient(145deg, #8B4513, #D2691E); color: white; padding: 20px; margin: 10px 15px; border-radius: 12px;">
                <div style="font-size: 18px; font-weight: bold;">🏆 COPA DE ORO 2024</div>
                <div style="margin: 10px 0;">📍 Tuxtla Gutiérrez, Chiapas</div>
                <div>📅 15 - 20 Marzo 2024</div>
                <div style="margin-top: 15px;">💰 Premio: $50,000 MXN</div>
                <button onclick="AppState.addNotification('Ver detalles del torneo', 'info')" style="background: white; color: #8B4513; border: none; padding: 10px; border-radius: 30px; width: 100%; margin-top: 15px; font-weight: bold; cursor: pointer;">
                  Ver detalles
                </button>
              </div>
              
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 20px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">❤️ 45</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">💬 12</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none; display: flex; align-items: center; gap: 5px;">🔄 8</button>
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 4 - VIDEO -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/50?img=7" style="width: 40px; height: 40px; border-radius: 50%;">
                <div style="flex: 1;">
                  <strong>Roberto Sánchez</strong>
                  <div style="font-size: 12px; color: #666;">hace 6 horas · 📍 Chiapa de Corzo</div>
                </div>
              </div>
              
              <div style="padding: 0 15px 15px;">
                <p>Así fue la pelea de hoy, mi gallo "Relámpago" demostrando su poder! 🐓⚡</p>
              </div>
              
              <div style="background: #000; height: 300px; display: flex; align-items: center; justify-content: center; color: white;">
                🎥 [VIDEO DE LA PELEA - REPRODUCIENDO...]
              </div>
              
              <div style="padding: 15px;">
                <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                  <button onclick="AppState.addNotification('Like - Función simulada', 'success')" style="background: none; border: none;">❤️ 89</button>
                  <button onclick="AppState.addNotification('Comentarios - Función simulada', 'info')" style="background: none; border: none;">💬 23</button>
                  <button onclick="AppState.addNotification('Compartir - Función simulada', 'info')" style="background: none; border: none;">🔄 15</button>
                </div>
                <div style="font-size: 13px; color: #666;">
                  Ver 12 comentarios más...
                </div>
              </div>
            </div>
            
            <!-- PUBLICACIÓN 5 - ENCUESTA -->
            <div style="background: white; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="padding: 15px;">
                <strong>Laura Torres</strong>
                <span style="color: #666; font-size: 13px; margin-left: 10px;">hace 8 horas</span>
                
                <p style="margin: 10px 0;">¿Qué raza de gallo prefieres para peleas?</p>
                
                <div style="margin: 15px 0;">
                  <div onclick="AppState.addNotification('Votaste por American Game', 'success')" style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 American Game</span>
                    <span style="float: right;">45% (23 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Roundhead', 'success')" style="background: #e8f5e8; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 Roundhead</span>
                    <span style="float: right;">30% (15 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Kelso', 'success')" style="background: #fff3e0; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                    <span>🐓 Kelso</span>
                    <span style="float: right;">15% (8 votos)</span>
                  </div>
                  <div onclick="AppState.addNotification('Votaste por Hatch', 'success')" style="background: #f3e5f5; padding: 12px; border-radius: 8px; cursor: pointer;">
                    <span>🐓 Hatch</span>
                    <span style="float: right;">10% (5 votos)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- BOTÓN CARGAR MÁS -->
            <div style="text-align: center; margin: 30px 0;">
              <button onclick="AppState.addNotification('Cargar más publicaciones - Función simulada', 'info')" style="background: white; border: 2px solid #8B4513; color: #8B4513; padding: 12px 30px; border-radius: 30px; font-weight: bold; cursor: pointer;">
                Cargar más publicaciones
              </button>
            </div>
            
          </div>
          
          <!-- ============================================== -->
          <!-- ESTADÍSTICAS RÁPIDAS                            -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 40px; text-align: center;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div>
                <div style="font-size: 24px; color: #8B4513;">124</div>
                <div style="font-size: 12px; color: #666;">Posts hoy</div>
              </div>
              <div>
                <div style="font-size: 24px; color: #8B4513;">45</div>
                <div style="font-size: 12px; color: #666;">Comentarios</div>
              </div>
              <div>
                <div style="font-size: 24px; color: #8B4513;">12</div>
                <div style="font-size: 12px; color: #666;">Torneos activos</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};

console.log("✅ publicaciones.js cargado - VERSIÓN CORREGIDA sin padding extra");
