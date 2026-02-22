// ==============================================
// PANTALLA PEDIGRÍ - ÁRBOLES GENEALÓGICOS SIMULADOS
// ==============================================
window.renderPedigriScreen = function() {
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
  
  // Inicializar Firebase específico de Pedigrí
  if (window.PedigriFirebase && !window._pedigriFirebaseInitialized) {
    window.PedigriFirebase.initialize();
    window._pedigriFirebaseInitialized = true;
  }
  
  // ===== SOLO PARA USUARIOS ACTIVADOS =====
  return `
    <div class="pedigri-screen" style="min-height: 100vh; background: #f8f9fa;">
      <div style="padding-top: 0;">
        
        <!-- ============================================== -->
        <!-- CABECERA CON INFORMACIÓN DEL USUARIO           -->
        <!-- ============================================== -->
        <div style="background: white; border-bottom: 1px solid #e0e0e0; padding: 20px; margin-bottom: 20px;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px;">
            <!-- Icono -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              🧬
            </div>
            <!-- Info -->
            <div>
              <h2 style="margin: 0; color: #333;">🧬 PEDIGRÍ - Árboles Genealógicos</h2>
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
          <!-- 1. BUSCADOR Y FILTROS                          -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🔍</span> BUSCAR GALLOS
            </h3>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
              <input type="text" id="pedigriSearch" placeholder="Nombre del gallo, criador o ID..." 
                     style="flex: 1; padding: 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
              <button onclick="AppState.addNotification('Búsqueda simulada: ' + document.getElementById('pedigriSearch').value, 'info')" 
                      style="background: #8B4513; color: white; border: none; padding: 14px 30px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                Buscar
              </button>
            </div>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #666; cursor: pointer;" onclick="AppState.addNotification('Filtro: Todos', 'info')">🐓 Todos</span>
              <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #666; cursor: pointer;" onclick="AppState.addNotification('Filtro: American Game', 'info')">🇺🇸 American Game</span>
              <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #666; cursor: pointer;" onclick="AppState.addNotification('Filtro: Roundhead', 'info')">🔄 Roundhead</span>
              <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #666; cursor: pointer;" onclick="AppState.addNotification('Filtro: Kelso', 'info')">🔥 Kelso</span>
              <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #666; cursor: pointer;" onclick="AppState.addNotification('Filtro: Hatch', 'info')">🐣 Hatch</span>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 2. ÁRBOL GENEALÓGICO DESTACADO                 -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🌳</span> ÁRBOL GENEALÓGICO: EL CAMPEÓN
            </h3>
            
            <!-- Árbol visual simplificado -->
            <div style="text-align: center; margin: 30px 0; position: relative;">
              
              <!-- Bisabuelos -->
              <div style="display: flex; justify-content: center; gap: 60px; margin-bottom: 30px;">
                <div style="text-align: center;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #8B4513; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white;">B1</div>
                  <div style="font-size: 11px; color: #666;">Rey Negro</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #D2691E; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white;">B2</div>
                  <div style="font-size: 11px; color: #666;">Linda Gris</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #8B4513; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white;">B3</div>
                  <div style="font-size: 11px; color: #666;">Tornado</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #D2691E; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white;">B4</div>
                  <div style="font-size: 11px; color: #666;">Estrella</div>
                </div>
              </div>
              
              <!-- Líneas verticales conectoras -->
              <div style="display: flex; justify-content: center; gap: 200px; margin-bottom: 10px;">
                <div style="width: 2px; height: 30px; background: #8B4513;"></div>
                <div style="width: 2px; height: 30px; background: #8B4513;"></div>
              </div>
              
              <!-- Abuelos -->
              <div style="display: flex; justify-content: center; gap: 200px; margin-bottom: 10px;">
                <div style="text-align: center;">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: #8B4513; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">A1</div>
                  <div style="font-size: 12px; font-weight: bold;">El Feroz</div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 60px; height: 60px; border-radius: 50%; background: #D2691E; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">A2</div>
                  <div style="font-size: 12px; font-weight: bold;">La Reina</div>
                </div>
              </div>
              
              <!-- Línea conectora -->
              <div style="display: flex; justify-content: center;">
                <div style="width: 2px; height: 30px; background: #8B4513;"></div>
              </div>
              
              <!-- Padre -->
              <div style="display: flex; justify-content: center; gap: 100px; margin-bottom: 30px;">
                <div style="text-align: center;">
                  <div style="width: 70px; height: 70px; border-radius: 50%; background: #8B4513; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid gold;">P</div>
                  <div style="font-size: 14px; font-weight: bold;">El Campeón</div>
                  <div style="font-size: 11px; color: #4CAF50;">✓ 34 peleas ganadas</div>
                </div>
              </div>
              
              <!-- Estadísticas -->
              <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; padding-top: 20px; border-top: 1px dashed #ccc;">
                <div><span style="color: #666;">Línea paterna:</span> <strong>American Game</strong></div>
                <div><span style="color: #666;">Línea materna:</span> <strong>Roundhead</strong></div>
                <div><span style="color: #666;">Consanguinidad:</span> <strong style="color: #ff9800;">12%</strong></div>
              </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
              <button onclick="AppState.addNotification('Ver árbol completo (simulado)', 'info')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                VER ÁRBOL COMPLETO
              </button>
              <button onclick="AppState.addNotification('Exportar pedigrí (simulado)', 'info')" style="background: transparent; border: 2px solid #8B4513; color: #8B4513; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                📥 EXPORTAR PDF
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 3. MIS GALLOS REGISTRADOS                      -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>📋</span> MIS GALLOS REGISTRADOS (4)
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
              
              <!-- Gallo 1 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #8B4513; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">R-01</div>
                  <div>
                    <div style="font-weight: bold; color: #333;">Rey Peligroso</div>
                    <div style="font-size: 12px; color: #666;">ID: G-2024-001</div>
                  </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 11px;">American Game</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">3 años</span>
                  <span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">12 peleas</span>
                </div>
                <button onclick="AppState.addNotification('Ver árbol de Rey Peligroso', 'info')" style="width: 100%; margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 8px; border-radius: 20px; cursor: pointer;">
                  Ver árbol
                </button>
              </div>
              
              <!-- Gallo 2 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #D2691E; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">R-02</div>
                  <div>
                    <div style="font-weight: bold; color: #333;">Relámpago</div>
                    <div style="font-size: 12px; color: #666;">ID: G-2024-002</div>
                  </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Roundhead</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">2 años</span>
                  <span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">8 peleas</span>
                </div>
                <button onclick="AppState.addNotification('Ver árbol de Relámpago', 'info')" style="width: 100%; margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 8px; border-radius: 20px; cursor: pointer;">
                  Ver árbol
                </button>
              </div>
              
              <!-- Gallo 3 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #8B4513; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">R-03</div>
                  <div>
                    <div style="font-weight: bold; color: #333;">Trueno</div>
                    <div style="font-size: 12px; color: #666;">ID: G-2024-003</div>
                  </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Kelso</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">4 años</span>
                  <span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">15 peleas</span>
                </div>
                <button onclick="AppState.addNotification('Ver árbol de Trueno', 'info')" style="width: 100%; margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 8px; border-radius: 20px; cursor: pointer;">
                  Ver árbol
                </button>
              </div>
              
              <!-- Gallo 4 -->
              <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: #D2691E; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">R-04</div>
                  <div>
                    <div style="font-weight: bold; color: #333;">Sombra</div>
                    <div style="font-size: 12px; color: #666;">ID: G-2024-004</div>
                  </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Hatch</span>
                  <span style="background: #f3e5f5; padding: 4px 8px; border-radius: 4px; font-size: 11px;">1 año</span>
                  <span style="background: #e8f5e8; padding: 4px 8px; border-radius: 4px; font-size: 11px;">3 peleas</span>
                </div>
                <button onclick="AppState.addNotification('Ver árbol de Sombra', 'info')" style="width: 100%; margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 8px; border-radius: 20px; cursor: pointer;">
                  Ver árbol
                </button>
              </div>
              
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="AppState.addNotification('Registrar nuevo gallo (simulado)', 'info')" style="background: #8B4513; color: white; border: none; padding: 12px 30px; border-radius: 30px; cursor: pointer; font-weight: bold;">
                + REGISTRAR NUEVO GALLO
              </button>
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 4. GALLOS DESTACADOS DE LA COMUNIDAD           -->
          <!-- ============================================== -->
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
              <span>🌟</span> GALLOS DESTACADOS DE LA COMUNIDAD
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              
              <!-- Destacado 1 -->
              <div style="text-align: center; padding: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(45deg, #FFD700, #FFA500); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 30px;">👑</div>
                <div style="font-weight: bold;">El Invencible</div>
                <div style="font-size: 12px; color: #666;">de Juan Pérez</div>
                <div style="font-size: 11px; margin-top: 5px;">32 peleas · 30 victorias</div>
                <button onclick="AppState.addNotification('Ver árbol de El Invencible', 'info')" style="margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 5px 15px; border-radius: 20px; cursor: pointer; font-size: 12px;">
                  Ver árbol
                </button>
              </div>
              
              <!-- Destacado 2 -->
              <div style="text-align: center; padding: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(45deg, #C0C0C0, #E0E0E0); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 30px;">⚡</div>
                <div style="font-weight: bold;">Relámpago Azul</div>
                <div style="font-size: 12px; color: #666;">de María García</div>
                <div style="font-size: 11px; margin-top: 5px;">25 peleas · 22 victorias</div>
                <button onclick="AppState.addNotification('Ver árbol de Relámpago Azul', 'info')" style="margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 5px 15px; border-radius: 20px; cursor: pointer; font-size: 12px;">
                  Ver árbol
                </button>
              </div>
              
              <!-- Destacado 3 -->
              <div style="text-align: center; padding: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(45deg, #CD7F32, #B87333); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 30px;">🔥</div>
                <div style="font-weight: bold;">Fuego Sagrado</div>
                <div style="font-size: 12px; color: #666;">de Carlos López</div>
                <div style="font-size: 11px; margin-top: 5px;">18 peleas · 16 victorias</div>
                <button onclick="AppState.addNotification('Ver árbol de Fuego Sagrado', 'info')" style="margin-top: 10px; background: transparent; border: 1px solid #8B4513; color: #8B4513; padding: 5px 15px; border-radius: 20px; cursor: pointer; font-size: 12px;">
                  Ver árbol
                </button>
              </div>
              
            </div>
          </div>
          
          <!-- ============================================== -->
          <!-- 5. ESTADÍSTICAS DE RAZAS                       -->
          <!-- ============================================== -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 40px;">
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 32px; margin-bottom: 10px;">🇺🇸</div>
              <div style="font-size: 20px; font-weight: bold; color: #8B4513;">156</div>
              <div style="color: #666; font-size: 14px;">American Game</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 32px; margin-bottom: 10px;">🔄</div>
              <div style="font-size: 20px; font-weight: bold; color: #8B4513;">124</div>
              <div style="color: #666; font-size: 14px;">Roundhead</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 32px; margin-bottom: 10px;">🔥</div>
              <div style="font-size: 20px; font-weight: bold; color: #8B4513;">98</div>
              <div style="color: #666; font-size: 14px;">Kelso</div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 32px; margin-bottom: 10px;">🐣</div>
              <div style="font-size: 20px; font-weight: bold; color: #8B4513;">87</div>
              <div style="color: #666; font-size: 14px;">Hatch</div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  `;
};

// ==============================================
// FIREBASE ESPECÍFICO PARA PEDIGRÍ (SIMULADO)
// ==============================================
window.PedigriFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Pedigrí (SIMULADO)");
    
    // No inicializamos Firebase real, solo simulamos
    this.initialized = true;
    
    // Simular datos de pedigrí
    window.pedigriDatabase = {
      getTree: (id) => {
        console.log("📦 Obteniendo árbol genealógico simulado para:", id);
        return {
          id: id,
          name: "Gallo " + id,
          parents: ["Padre 1", "Padre 2"],
          grandparents: ["Abuelo 1", "Abuela 1", "Abuelo 2", "Abuela 2"]
        };
      }
    };
  }
};

console.log("✅ pedigri.js cargado con datos simulados");
