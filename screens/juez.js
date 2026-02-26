// ==============================================
// juez.js - SEGURIDAD NIVEL SENIOR + ROOSTER STATE COMPLETO
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
  
  // ===== ROOSTER STATE GLOBAL =====
  let roosterState = {
    userAccess: null, // String: 'true' (admin), 'false' (espectador), 'juez', 'baneado', ''
    roosters: [], // Array de objetos, cada uno representando un gallo individual
    matches: [], // Array (actualmente con la misma info que pairings? Se usa poco, pero mantener para compatibilidad)
    pairings: [], // Array de objetos, cada uno representando un emparejamiento (una pelea)
    unpaired: [], // Array de gallos que no pudieron ser emparejados durante el último proceso
    loading: true, // Booleano para estados de carga
    tournamentInfo: { // Objeto con la configuración del torneo
      name: '',
      date: '',
      minWeight: null, // Se calcula automáticamente
      maxWeight: null, // Se calcula automáticamente
      weightRange: 50, // Número (gramos). Diferencia máxima de peso permitida para un emparejamiento
      location: '',
      organizer: '',
      numGallosPerMatch: 2, // Número de gallos que tiene un "partido" (se usa para el formulario de registro)
      registeredRoosters: 0 // Se calcula
    },
    representatives: [], // Array de strings con los nombres de los representantes
    scoring: [], // Array de objetos, cada uno representando la puntuación de un partido
    currentRoosterNumber: 1, // Control dinámico del número de campos de gallo en el formulario
    fights: [], // Array de objetos, cada uno representando una pelea calificada (resultados)
    tournamentConfigComplete: false // Booleano, true si el torneo tiene nombre, lugar, etc.
  };

  // Objeto para prevenir múltiples envíos de formularios
  let blockedButtons = {
    fightSave: false, // Para el botón de guardar pelea (admin)
    judgeSave: false // Para el botón de guardar pelea (juez)
  };

  // Sistema de sonidos
  const SoundSystem = {
    audioContext: null,
    
    init() {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    
    createBeep(frequency = 440, duration = 0.1) {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    },
    
    playSelection() {
      this.createBeep(523.25, 0.1); // Do5
    },
    
    playKeyboard() {
      this.createBeep(659.25, 0.05); // Mi5
    },
    
    playButton() {
      this.createBeep(392.00, 0.08); // Sol4
    },
    
    playSuccess() {
      this.createBeep(523.25, 0.1);
      setTimeout(() => this.createBeep(659.25, 0.1), 100);
    },
    
    playError() {
      this.createBeep(349.23, 0.2); // Fa4
    },
    
    vibrate(pattern) {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    },
    
    playWithVibration(soundType, vibrationPattern) {
      this[soundType]();
      this.vibrate(vibrationPattern);
    }
  };

  // Configuración de Firebase (pendiente de inicialización)
  let roosterDatabase = null;
  let backupDB = null;
  let pendingWrites = [];

  // ===== FUNCIONES DE CARGA DE DATOS =====
  async function loadTournamentInfo() {
    try {
      const snapshot = await roosterDatabase.ref('tournament').once('value');
      const data = snapshot.val() || {};
      roosterState.tournamentInfo = {
        ...roosterState.tournamentInfo,
        ...data
      };
      roosterState.tournamentConfigComplete = !!(data.name && data.location);
    } catch (error) {
      console.error('Error loading tournament info:', error);
    }
  }

  async function loadRepresentatives() {
    try {
      const snapshot = await roosterDatabase.ref('representatives').once('value');
      const data = snapshot.val() || {};
      roosterState.representatives = Object.values(data).map(r => r.name);
    } catch (error) {
      console.error('Error loading representatives:', error);
    }
  }

  async function loadRoostersAndMatches() {
    try {
      const [roostersSnap, pairingsSnap, fightsSnap] = await Promise.all([
        roosterDatabase.ref('roosters').once('value'),
        roosterDatabase.ref('pairings').once('value'),
        roosterDatabase.ref('fights').once('value')
      ]);
      
      roosterState.roosters = Object.values(roostersSnap.val() || {});
      roosterState.pairings = Object.values(pairingsSnap.val() || {});
      roosterState.fights = Object.values(fightsSnap.val() || {});
      
      // Calcular estadísticas
      if (roosterState.roosters.length > 0) {
        const weights = roosterState.roosters.map(r => r.weight);
        roosterState.tournamentInfo.minWeight = Math.min(...weights);
        roosterState.tournamentInfo.maxWeight = Math.max(...weights);
        roosterState.tournamentInfo.registeredRoosters = roosterState.roosters.length;
      }
      
      roosterState.loading = false;
    } catch (error) {
      console.error('Error loading roosters and matches:', error);
      roosterState.loading = false;
    }
  }

  async function loadScoring() {
    try {
      const snapshot = await roosterDatabase.ref('scoring').once('value');
      roosterState.scoring = Object.values(snapshot.val() || {});
    } catch (error) {
      console.error('Error loading scoring:', error);
    }
  }

  async function loadFightsForJudge() {
    try {
      const snapshot = await roosterDatabase.ref('fights').once('value');
      roosterState.fights = Object.values(snapshot.val() || {});
    } catch (error) {
      console.error('Error loading fights for judge:', error);
    }
  }

  // ===== FUNCIÓN DE PERMISOS =====
  async function checkRoosterPermissions(uid) {
    try {
      const snapshot = await roosterDatabase.ref(`users/${uid}/gallo`).once('value');
      const permission = snapshot.val() || '';
      roosterState.userAccess = permission;
      return permission;
    } catch (error) {
      console.error('Error checking permissions:', error);
      roosterState.userAccess = '';
      return '';
    }
  }

  // ===== FUNCIONES DE RENDERIZADO =====
  function renderHeader() {
    const { tournamentInfo } = roosterState;
    return `
      <div style="background: linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%); color: white; padding: 20px; border-radius: 0 0 20px 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🐓 ${tournamentInfo.name || 'TORNEO SIN NOMBRE'}</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">${tournamentInfo.location || 'Ubicación no especificada'} • ${tournamentInfo.date || 'Fecha no definida'}</p>
          </div>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <div style="background: rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 12px; text-align: center;">
              <div style="font-size: 12px; opacity: 0.8;">Gallos</div>
              <div style="font-size: 24px; font-weight: bold;">${tournamentInfo.registeredRoosters}</div>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 12px; text-align: center;">
              <div style="font-size: 12px; opacity: 0.8;">Peleas</div>
              <div style="font-size: 24px; font-weight: bold;">${roosterState.pairings.length}</div>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 12px; text-align: center;">
              <div style="font-size: 12px; opacity: 0.8;">Min/Max</div>
              <div style="font-size: 18px; font-weight: bold;">${tournamentInfo.minWeight || 0}g / ${tournamentInfo.maxWeight || 0}g</div>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 10px;">
            <span style="background: rgba(255,255,255,0.3); padding: 5px 12px; border-radius: 20px; font-size: 14px;">
              ⚖️ Rango: ±${tournamentInfo.weightRange}g
            </span>
            <span style="background: rgba(255,255,255,0.3); padding: 5px 12px; border-radius: 20px; font-size: 14px;">
              👥 ${tournamentInfo.numGallosPerMatch} gallos/partido
            </span>
          </div>
          <button onclick="window.forceRefresh()" style="background: white; color: #4a148c; border: none; padding: 8px 20px; border-radius: 25px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px;">
            🔄 Recargar Datos
          </button>
        </div>
      </div>
    `;
  }

  function renderJudgeSection() {
    const pendingFights = roosterState.pairings.filter(p => !p.result || p.result === '').length;
    const scoredFights = roosterState.fights.length;

    return `
      <div style="padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 5px solid #4a148c;">
            <div style="font-size: 14px; color: #666;">Peleas Pendientes</div>
            <div style="font-size: 32px; font-weight: bold; color: #4a148c;">${pendingFights}</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 5px solid #2e7d32;">
            <div style="font-size: 14px; color: #666;">Peleas Calificadas</div>
            <div style="font-size: 32px; font-weight: bold; color: #2e7d32;">${scoredFights}</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 5px solid #ed6c02;">
            <div style="font-size: 14px; color: #666;">Total Emparejamientos</div>
            <div style="font-size: 32px; font-weight: bold; color: #ed6c02;">${roosterState.pairings.length}</div>
          </div>
        </div>

        <!-- Sección de Calificación de Peleas (Juez) -->
        <div style="background: white; border-radius: 20px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #4a148c;">
          <h2 style="margin: 0 0 20px; color: #4a148c; display: flex; align-items: center; gap: 10px; font-size: 24px;">
            ⚖️ CALIFICAR PELEA
          </h2>
          
          <!-- Selector de Pelea -->
          <select id="fightNumberInputJudge" onchange="window.loadFightDetailsJudge()" style="width: 100%; padding: 15px; font-size: 18px; border: 2px solid #ddd; border-radius: 12px; margin-bottom: 20px; background: #f8f9fa;">
            <option value="">🔍 SELECCIONAR PELEA</option>
            ${roosterState.pairings.map((pairing, index) => {
              const isScored = roosterState.fights.some(f => f.fightNumber === pairing.fightNumber);
              return `
                <option value="${pairing.fightNumber}">
                  ${isScored ? '✅' : '❌'} Pelea #${pairing.fightNumber || index + 1} - ${pairing.rooster1MatchName} vs ${pairing.rooster2MatchName}
                </option>
              `;
            }).join('')}
          </select>

          <!-- Detalles de la Pelea -->
          <div id="fightDetailsJudge" style="display: none; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; margin-bottom: 20px;">
              <!-- CINTA ROJA -->
              <div id="redCorner" onclick="window.selectWinner('rojo')" style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 25px; border-radius: 15px; text-align: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(211,47,47,0.3);">
                <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;" id="redMatchName"></div>
                <div style="font-size: 24px; margin-bottom: 5px;" id="redRing"></div>
                <div style="font-size: 20px;" id="redWeight"></div>
              </div>
              
              <div style="text-align: center;">
                <button onclick="window.selectWinner('tabla')" style="background: #4a148c; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(74,20,140,0.3);">
                  🤝 TABLA
                </button>
              </div>
              
              <!-- CINTA VERDE -->
              <div id="greenCorner" onclick="window.selectWinner('verde')" style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: white; padding: 25px; border-radius: 15px; text-align: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(46,125,50,0.3);">
                <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;" id="greenMatchName"></div>
                <div style="font-size: 24px; margin-bottom: 5px;" id="greenRing"></div>
                <div style="font-size: 20px;" id="greenWeight"></div>
              </div>
            </div>

            <!-- Input de Tiempo -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">⏱️ TIEMPO (mm:ss)</label>
              <input type="text" id="fightTimeJudge" placeholder="00:00" maxlength="5" oninput="window.formatTimeInputJudge(this)" style="width: 100%; padding: 15px; font-size: 24px; text-align: center; border: 2px solid #4a148c; border-radius: 12px; background: #f8f9fa;">
            </div>

            <!-- Selector oculto de ganador -->
            <select id="fightResultJudge" style="display: none;">
              <option value="">Seleccionar</option>
              <option value="rojo">Gana Rojo</option>
              <option value="verde">Gana Verde</option>
              <option value="tabla">Tabla</option>
            </select>

            <!-- Botones de acción -->
            <div style="display: flex; gap: 15px;">
              <button onclick="window.clearFightFormJudge()" style="flex: 1; padding: 15px; background: #757575; color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer;">
                🔄 LIMPIAR
              </button>
              <button onclick="window.saveFightResultJudge()" style="flex: 2; padding: 15px; background: #4a148c; color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer;" id="saveFightJudgeBtn">
                💾 GUARDAR RESULTADO
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Emparejamientos (solo lectura) -->
        <div style="background: white; border-radius: 20px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px; color: #333; display: flex; align-items: center; gap: 10px;">
            📋 EMPAREJAMIENTOS
            <span style="background: #4a148c; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px;">${roosterState.pairings.length}</span>
          </h2>
          ${renderPairingsTableReadOnly()}
        </div>

        <!-- Tabla de Puntuaciones (solo lectura) -->
        <div style="background: white; border-radius: 20px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px; color: #333; display: flex; align-items: center; gap: 10px;">
            🏆 TABLA DE PUNTUACIONES
            <span style="background: #4a148c; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px;">${roosterState.scoring.length}</span>
          </h2>
          ${renderScoringTableReadOnly()}
        </div>

        <!-- Tiempos Más Rápidos -->
        <div style="background: white; border-radius: 20px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px; color: #333; display: flex; align-items: center; gap: 10px;">
            ⚡ TIEMPOS MÁS RÁPIDOS
          </h2>
          ${renderFastestTimesList()}
        </div>

        <!-- Calculadora de Porcentajes -->
        <div style="background: white; border-radius: 20px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px; color: #333;">📊 CALCULADORA DE PORCENTAJES</h2>
          <div style="max-width: 400px;">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Monto Total ($)</label>
              <input type="number" id="totalAmount" oninput="window.calculatePercentages()" style="width: 100%; padding: 10px; border: 2px solid #4a148c; border-radius: 8px;">
            </div>
            <div id="percentageFieldsContainer">
              <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="number" class="percentageInput" placeholder="%" oninput="window.calculatePercentages()" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
              </div>
            </div>
            <button onclick="window.addPercentageField()" style="background: #4a148c; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-bottom: 15px; cursor: pointer;">
              + Agregar Porcentaje
            </button>
            <div id="percentageResults" style="background: #f8f9fa; padding: 15px; border-radius: 8px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPairingsTableReadOnly() {
    if (roosterState.pairings.length === 0) {
      return `<p style="text-align: center; color: #666; padding: 40px;">No hay emparejamientos generados</p>`;
    }

    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #f5f5f5;">
            <tr>
              <th style="padding: 12px; text-align: left;">#</th>
              <th style="padding: 12px; text-align: left;">CINTA ROJA</th>
              <th style="padding: 12px; text-align: left;">CINTA VERDE</th>
              <th style="padding: 12px; text-align: center;">Diferencia</th>
              <th style="padding: 12px; text-align: center;">Resultado</th>
            </tr>
          </thead>
          <tbody>
            ${roosterState.pairings.map((pairing, index) => {
              const fight = roosterState.fights.find(f => f.fightNumber === pairing.fightNumber);
              const result = fight ? (fight.result === 'rojo' ? '🏆 Rojo' : fight.result === 'verde' ? '🏆 Verde' : '🤝 Tabla') : '⏳ Pendiente';
              
              return `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-weight: bold;">${pairing.fightNumber || index + 1}</td>
                  <td style="padding: 12px;">
                    <div><strong>${pairing.rooster1MatchName}</strong></div>
                    <div style="font-size: 12px; color: #666;">Anillo: ${pairing.rooster1Ring} | ${pairing.rooster1Weight}g</div>
                  </td>
                  <td style="padding: 12px;">
                    <div><strong>${pairing.rooster2MatchName}</strong></div>
                    <div style="font-size: 12px; color: #666;">Anillo: ${pairing.rooster2Ring} | ${pairing.rooster2Weight}g</div>
                  </td>
                  <td style="padding: 12px; text-align: center; font-weight: bold;">${pairing.weightDiff}g</td>
                  <td style="padding: 12px; text-align: center;">
                    <span style="background: ${fight ? '#4a148c' : '#ff9800'}; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">
                      ${result}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderScoringTableReadOnly() {
    if (roosterState.scoring.length === 0) {
      return `<p style="text-align: center; color: #666; padding: 40px;">No hay puntuaciones registradas</p>`;
    }

    // Ordenar puntuaciones
    const sortedScoring = [...roosterState.scoring].sort((a, b) => {
      if (a.totalTime !== b.totalTime) return a.totalTime.localeCompare(b.totalTime);
      return (b.totalPoints || 0) - (a.totalPoints || 0);
    });

    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #f5f5f5;">
            <tr>
              <th style="padding: 12px;">#</th>
              <th style="padding: 12px;">Partido</th>
              <th style="padding: 12px;">Puntos</th>
              <th style="padding: 12px;">Tiempo Total</th>
            </tr>
          </thead>
          <tbody>
            ${sortedScoring.map((score, index) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">${index + 1}</td>
                <td style="padding: 12px;">${score.matchName}</td>
                <td style="padding: 12px; font-weight: bold; color: #4a148c;">${score.totalPoints || 0}</td>
                <td style="padding: 12px; font-weight: bold;">${score.totalTime || '00:00'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderFastestTimesList() {
    const fastestTimes = calculateFastestTimes(5);
    
    if (fastestTimes.length === 0) {
      return `<p style="text-align: center; color: #666; padding: 20px;">No hay tiempos registrados</p>`;
    }

    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #f5f5f5;">
            <tr>
              <th style="padding: 12px;">#</th>
              <th style="padding: 12px;">Partido Ganador</th>
              <th style="padding: 12px;">Tiempo</th>
              <th style="padding: 12px;">Ronda</th>
              <th style="padding: 12px;">Oponente</th>
            </tr>
          </thead>
          <tbody>
            ${fastestTimes.map((time, index) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">${index + 1}</td>
                <td style="padding: 12px;">${time.matchName}</td>
                <td style="padding: 12px; font-weight: bold; color: #4a148c;">${time.time}</td>
                <td style="padding: 12px;">${time.round}</td>
                <td style="padding: 12px;">${time.opponent}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ===== FUNCIONES DE CÁLCULO =====
  function calculateFastestTimes(numToShow = 5) {
    const times = [];
    
    roosterState.scoring.forEach(score => {
      if (score.rounds && Array.isArray(score.rounds)) {
        score.rounds.forEach(round => {
          if (round.result === 'Ganó' && round.time && round.time !== '00:00') {
            times.push({
              matchName: score.matchName,
              time: round.time,
              round: round.round,
              opponent: round.opponent || 'Desconocido'
            });
          }
        });
      }
    });
    
    // Ordenar por tiempo (convertir a segundos para comparar)
    return times.sort((a, b) => {
      const timeA = a.time.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0);
      const timeB = b.time.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0);
      return timeA - timeB;
    }).slice(0, numToShow);
  }

  // ===== FUNCIONES DE ACCIÓN DEL JUEZ =====
  window.loadFightDetailsJudge = function() {
    const select = document.getElementById('fightNumberInputJudge');
    const fightNumber = select.value;
    
    if (!fightNumber) {
      document.getElementById('fightDetailsJudge').style.display = 'none';
      return;
    }
    
    const pairing = roosterState.pairings.find(p => p.fightNumber == fightNumber);
    if (!pairing) return;
    
    // Actualizar detalles
    document.getElementById('redMatchName').textContent = pairing.rooster1MatchName;
    document.getElementById('redRing').textContent = `Anillo: ${pairing.rooster1Ring}`;
    document.getElementById('redWeight').textContent = `${pairing.rooster1Weight}g`;
    
    document.getElementById('greenMatchName').textContent = pairing.rooster2MatchName;
    document.getElementById('greenRing').textContent = `Anillo: ${pairing.rooster2Ring}`;
    document.getElementById('greenWeight').textContent = `${pairing.rooster2Weight}g`;
    
    // Verificar si ya está calificada
    const existingFight = roosterState.fights.find(f => f.fightNumber == fightNumber);
    if (existingFight) {
      document.getElementById('fightTimeJudge').value = existingFight.time || '';
      document.getElementById('fightResultJudge').value = existingFight.result || '';
      
      // Resaltar ganador
      if (existingFight.result === 'rojo') {
        document.getElementById('redCorner').style.transform = 'scale(1.05)';
        document.getElementById('greenCorner').style.transform = 'scale(1)';
      } else if (existingFight.result === 'verde') {
        document.getElementById('greenCorner').style.transform = 'scale(1.05)';
        document.getElementById('redCorner').style.transform = 'scale(1)';
      }
    }
    
    SoundSystem.playSelection();
    document.getElementById('fightDetailsJudge').style.display = 'block';
  };

  window.selectWinner = function(winner) {
    const select = document.getElementById('fightResultJudge');
    select.value = winner;
    
    // Resetear transformaciones
    document.getElementById('redCorner').style.transform = 'scale(1)';
    document.getElementById('greenCorner').style.transform = 'scale(1)';
    
    // Resaltar selección
    if (winner === 'rojo') {
      document.getElementById('redCorner').style.transform = 'scale(1.05)';
    } else if (winner === 'verde') {
      document.getElementById('greenCorner').style.transform = 'scale(1.05)';
    }
    
    SoundSystem.playButton();
  };

  window.formatTimeInputJudge = function(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 3) {
      value = value.substring(0, 2) + ':' + value.substring(2, 4);
    } else if (value.length >= 1) {
      value = value;
    }
    
    input.value = value;
  };

  window.clearFightFormJudge = function() {
    document.getElementById('fightTimeJudge').value = '';
    document.getElementById('fightResultJudge').value = '';
    document.getElementById('redCorner').style.transform = 'scale(1)';
    document.getElementById('greenCorner').style.transform = 'scale(1)';
    SoundSystem.playKeyboard();
  };

  window.saveFightResultJudge = function() {
    if (blockedButtons.judgeSave) return;
    
    const fightNumber = document.getElementById('fightNumberInputJudge').value;
    const result = document.getElementById('fightResultJudge').value;
    const time = document.getElementById('fightTimeJudge').value;
    
    if (!fightNumber || !result || !time) {
      SoundSystem.playWithVibration('playError', [200]);
      alert('Debes seleccionar un ganador y ingresar el tiempo');
      return;
    }
    
    blockedButtons.judgeSave = true;
    document.getElementById('saveFightJudgeBtn').disabled = true;
    
    // Simular guardado (aquí iría la integración con Firebase)
    setTimeout(() => {
      SoundSystem.playWithVibration('playSuccess', [100, 50, 100]);
      alert('✅ Resultado guardado correctamente');
      
      blockedButtons.judgeSave = false;
      document.getElementById('saveFightJudgeBtn').disabled = false;
      window.clearFightFormJudge();
      
      // Recargar datos (simulado)
      roosterState.loading = true;
      setTimeout(() => {
        roosterState.loading = false;
        if (window.currentScreen === 'rooster') {
          window.renderApp();
        }
      }, 500);
    }, 500);
  };

  window.forceRefresh = function() {
    SoundSystem.playButton();
    roosterState.loading = true;
    window.renderApp();
    
    setTimeout(() => {
      roosterState.loading = false;
      window.renderApp();
      SoundSystem.playSuccess();
    }, 1000);
  };

  // ===== FUNCIONES DE CALCULADORA =====
  window.addPercentageField = function() {
    const container = document.getElementById('percentageFieldsContainer');
    const newField = document.createElement('div');
    newField.style.display = 'flex';
    newField.style.gap = '10px';
    newField.style.marginBottom = '10px';
    newField.innerHTML = `
      <input type="number" class="percentageInput" placeholder="%" oninput="window.calculatePercentages()" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
    `;
    container.appendChild(newField);
    SoundSystem.playKeyboard();
  };

  window.calculatePercentages = function() {
    const total = parseFloat(document.getElementById('totalAmount').value) || 0;
    const percentages = document.querySelectorAll('.percentageInput');
    let results = '';
    let sum = 0;
    
    percentages.forEach((input, index) => {
      const percent = parseFloat(input.value) || 0;
      sum += percent;
      const amount = (total * percent) / 100;
      results += `<div style="margin-bottom: 5px;">${percent}% = $${amount.toFixed(2)}</div>`;
    });
    
    if (Math.abs(sum - 100) > 0.01) {
      results += `<div style="color: #d32f2f; margin-top: 10px;">⚠️ Los porcentajes suman ${sum}% (debe ser 100%)</div>`;
    }
    
    results += `<div style="font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #4a148c;">Total: $${total.toFixed(2)}</div>`;
    
    document.getElementById('percentageResults').innerHTML = results;
  };

  // ===== FUNCIÓN PRINCIPAL DE RENDERIZADO =====
  function renderRoosterScreen() {
    if (roosterState.loading) {
      return `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8f9fa;">
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">🐓</div>
            <div style="font-size: 24px; color: #4a148c;">Cargando sistema...</div>
            <div style="width: 200px; height: 4px; background: #e0e0e0; margin: 20px auto; border-radius: 2px; overflow: hidden;">
              <div style="width: 60%; height: 100%; background: #4a148c; animation: loading 1.5s infinite;"></div>
            </div>
          </div>
        </div>
        <style>
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        </style>
      `;
    }
    
    return `
      <div style="min-height: 100vh; background: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${renderHeader()}
        ${renderJudgeSection()}
      </div>
    `;
  }

  // ===== FUNCIÓN PRINCIPAL CON INTERFAZ WINDOWS =====
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
    
    // Inicializar datos si es necesario
    if (roosterState.roosters.length === 0 && !roosterState.loading) {
      roosterState.loading = true;
      
      // Simular carga de datos
      setTimeout(() => {
        // Datos de ejemplo para pruebas
        roosterState.tournamentInfo = {
          name: 'TORNEO NACIONAL DE GALLOS 2024',
          date: '15-03-2024',
          location: 'MEDELLÍN',
          organizer: 'ASOCIACIÓN DE CRIADORES',
          weightRange: 50,
          numGallosPerMatch: 2,
          registeredRoosters: 8,
          minWeight: 1800,
          maxWeight: 2200
        };
        
        roosterState.pairings = [
          {
            fightNumber: 1,
            rooster1MatchName: 'EL HALCÓN',
            rooster1Ring: '001',
            rooster1Weight: 1950,
            rooster2MatchName: 'EL TIGRE',
            rooster2Ring: '002',
            rooster2Weight: 1980,
            weightDiff: 30
          },
          {
            fightNumber: 2,
            rooster1MatchName: 'EL RAYO',
            rooster1Ring: '003',
            rooster1Weight: 2100,
            rooster2MatchName: 'EL FURIOSO',
            rooster2Ring: '004',
            rooster2Weight: 2050,
            weightDiff: 50
          }
        ];
        
        roosterState.scoring = [
          {
            matchName: 'EL HALCÓN',
            totalPoints: 6,
            totalTime: '01:45',
            rounds: [
              { round: 1, result: 'Ganó', time: '01:45', opponent: 'EL TIGRE' }
            ]
          }
        ];
        
        roosterState.tournamentConfigComplete = true;
        roosterState.loading = false;
        window.renderApp();
      }, 500);
    }
    
    return renderRoosterScreen();
  };
  
  // ===== 4. PROTECCIÓN CONTRA MODIFICACIONES =====
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
  
  // Exponer funciones necesarias
  window.roosterState = roosterState;
  window.SoundSystem = SoundSystem;
  window.renderApp = function() {
    const container = document.getElementById('social-app');
    if (container) {
      container.innerHTML = f();
    }
  };
  
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
  console.log(`✅ juez.js v${CONFIG.VERSION} - Modo Windows - Rooster State - Protegido [${tokenSesion.substring(0, 8)}]`);
  
})();
