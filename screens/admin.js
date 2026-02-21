// ==============================================
// PANEL DE ADMINISTRACIÓN - PRUEBAS DE RENDIMIENTO
// SOLO PARA GALLO = TRUE
// ==============================================
window.renderAdminPanel = async function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;

  // Seguridad: verificar permisos de admin
  if (!currentUser || !userProfile || userProfile.gallo !== true) {
    console.warn("🚫 Intento de acceso a admin sin permisos");
    return `
      <div style="padding: 40px; text-align: center; min-height: 100vh; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; margin: 50px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="font-size: 60px; margin-bottom: 20px; color: #d32f2f;">⛔</div>
          <h2 style="color: #d32f2f; margin-bottom: 10px;">Acceso Denegado</h2>
          <p style="color: #666; margin-bottom: 20px;">No tienes permisos para ver esta sección.</p>
          <button onclick="navigateTo('rooster')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Volver a Torneos</button>
        </div>
      </div>
    `;
  }

  // Inicializar Firebase específico de Admin
  if (window.AdminFirebase && !window._adminFirebaseInitialized) {
    window.AdminFirebase.initialize();
    window._adminFirebaseInitialized = true;
  }

  return `
    <div class="admin-screen" style="min-height: 100vh; background: #f0f0f0;">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      
      <div style="padding: 90px 20px 20px 20px; max-width: 1200px; margin: 0 auto;">
        
        <!-- TÍTULO -->
        <h1 style="color: #333; margin-bottom: 30px; text-align: center;">👑 ADMIN - PRUEBAS DE RENDIMIENTO</h1>
        
        <!-- CONTENEDOR PRINCIPAL (EN BLANCO) -->
        <div id="test-container-admin" style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-height: 600px;">
          
          <!-- INFORMACIÓN DEL ADMIN -->
          <div style="margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #8B4513, #D2691E); border-radius: 8px; color: white;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px;">👑</div>
              <div>
                <h2 style="margin: 0 0 5px 0; color: white;">Panel de Administración - MODO PRUEBAS</h2>
                <p style="margin: 0; opacity: 0.9;"><strong>${userProfile.displayName || 'Administrador'}</strong> (${currentUser.uid})</p>
                <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">Rol: Administrador Principal</p>
              </div>
            </div>
          </div>
          
          <!-- BOTONES DE PRUEBA DE RENDIMIENTO - FILA 1 -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            
            <!-- BOTÓN 1: Cargar 100 usuarios -->
            <button id="admin-test-100" style="background: #2196F3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📋 Cargar 100 usuarios
            </button>
            
            <!-- BOTÓN 2: Cargar 1000 usuarios -->
            <button id="admin-test-1000" style="background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📊 Cargar 1000 usuarios
            </button>
            
            <!-- BOTÓN 3: Cargar 5000 usuarios -->
            <button id="admin-test-5000" style="background: #FF9800; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🔥 Cargar 5000 usuarios
            </button>
            
            <!-- BOTÓN 4: Tabla 50x50 -->
            <button id="admin-test-table" style="background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📈 Tabla 50x50 (2500 celdas)
            </button>
            
          </div>
          
          <!-- BOTONES DE PRUEBA DE RENDIMIENTO - FILA 2 -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            
            <!-- BOTÓN 5: Gráfica de rendimiento -->
            <button id="admin-test-chart" style="background: #9C27B0; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📊 Generar gráfica (500 puntos)
            </button>
            
            <!-- BOTÓN 6: Stress test memoria -->
            <button id="admin-test-memory" style="background: #8B4513; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💾 Stress test memoria
            </button>
            
            <!-- BOTÓN 7: Medir FPS -->
            <button id="admin-test-fps" style="background: #00BCD4; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🎮 Medir FPS (30s)
            </button>
            
            <!-- BOTÓN 8: Limpiar -->
            <button id="admin-test-clear" style="background: #607D8B; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🧹 Limpiar todo
            </button>
            
          </div>
          
          <!-- BOTONES DE PRUEBA ADICIONALES - FILA 3 -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            
            <!-- BOTÓN 9: Logs en tiempo real -->
            <button id="admin-test-logs" style="background: #E91E63; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📝 1000 logs en tiempo real
            </button>
            
            <!-- BOTÓN 10: Checkboxes masivos -->
            <button id="admin-test-checkboxes" style="background: #3F51B5; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ☑️ 500 checkboxes
            </button>
            
            <!-- BOTÓN 11: Inputs en vivo -->
            <button id="admin-test-inputs" style="background: #009688; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ⌨️ 200 inputs con eventos
            </button>
            
            <!-- BOTÓN 12: Simular carga Cloudinary -->
            <button id="admin-test-cloudinary" style="background: #FF5722; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ☁️ Simular Cloudinary
            </button>
            
          </div>
          
          <!-- ÁREA DE RESULTADOS -->
          <div id="admin-results" style="margin: 20px 0; padding: 15px; background: #333; color: #0f0; border-radius: 8px; font-family: monospace; min-height: 60px; font-size: 14px;">
            ⏳ Listo para pruebas de rendimiento. Selecciona un botón.
          </div>
          
          <!-- CONTENEDOR PARA ELEMENTOS DE PRUEBA (INICIALMENTE VACÍO) -->
          <div id="admin-test-area" style="min-height: 300px; max-height: 500px; overflow: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fafafa;">
            <!-- Aquí se inyectarán los elementos de prueba -->
            <div style="text-align: center; color: #999; padding: 50px;">
              ↑ Selecciona un botón de prueba para comenzar ↑
            </div>
          </div>
          
          <!-- ESTADÍSTICAS EN TIEMPO REAL -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-top: 30px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">ELEMENTOS</div>
              <div id="admin-stats-count" style="font-size: 20px; font-weight: bold; color: #2196F3;">0</div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">MEMORIA (aprox)</div>
              <div id="admin-stats-memory" style="font-size: 20px; font-weight: bold; color: #4CAF50;">0 MB</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">TIEMPO CARGA</div>
              <div id="admin-stats-time" style="font-size: 20px; font-weight: bold; color: #FF9800;">0 ms</div>
            </div>
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">FPS</div>
              <div id="admin-stats-fps" style="font-size: 20px; font-weight: bold; color: #9C27B0;">60</div>
            </div>
            <div style="background: #ffebee; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">OPS</div>
              <div id="admin-stats-ops" style="font-size: 20px; font-weight: bold; color: #f44336;">0</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
  
  // Inicializar eventos después de renderizar
  setTimeout(initAdminTests, 100);
};

// ==============================================
// FIREBASE ESPECÍFICO PARA ADMIN
// ==============================================
window.AdminFirebase = {
  initialized: false,
  
  initialize() {
    if (this.initialized) return;
    console.log("🔥 Inicializando Firebase de Admin");
    
    const adminFirebaseConfig = {
      apiKey: "TU_API_KEY_ADMIN", // ⚠️ CAMBIA ESTO
      authDomain: "tu-proyecto-admin.firebaseapp.com",
      databaseURL: "https://tu-proyecto-admin.firebaseio.com",
      projectId: "tu-proyecto-admin",
      messagingSenderId: "444555666"
    };
    
    if (!window.adminFirebaseApp) {
      try {
        window.adminFirebaseApp = firebase.initializeApp(adminFirebaseConfig, "admin");
        window.adminDatabase = window.adminFirebaseApp.database();
        console.log("✅ Firebase Admin inicializado");
      } catch(e) {
        console.error("Error inicializando Firebase Admin:", e);
      }
    }
    
    this.initialized = true;
  }
};

// ==============================================
// FUNCIONES DE PRUEBA DE RENDIMIENTO
// ==============================================
function initAdminTests() {
  console.log("👑 Inicializando pruebas de rendimiento en Admin");
  
  const testArea = document.getElementById('admin-test-area');
  const resultsDiv = document.getElementById('admin-results');
  const statsCount = document.getElementById('admin-stats-count');
  const statsMemory = document.getElementById('admin-stats-memory');
  const statsTime = document.getElementById('admin-stats-time');
  const statsFps = document.getElementById('admin-stats-fps');
  const statsOps = document.getElementById('admin-stats-ops');
  
  let operationCount = 0;
  let fpsInterval = null;
  
  // ===== 1. CARGAR 100 USUARIOS =====
  document.getElementById('admin-test-100').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 100 usuarios simulados...';
    
    setTimeout(() => {
      let html = '<table style="width:100%; border-collapse:collapse;">';
      html += '<tr style="background:#f0f0f0;"><th>ID</th><th>Nombre</th><th>Email</th><th>Estado</th><th>Rol</th></tr>';
      
      for (let i = 1; i <= 100; i++) {
        const status = i % 3 === 0 ? 'ACTIVO' : (i % 3 === 1 ? 'PENDIENTE' : 'INACTIVO');
        const role = i % 5 === 0 ? 'ADMIN' : (i % 4 === 0 ? 'JUEZ' : 'USUARIO');
        html += `<tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px;">${i}</td>
          <td style="padding:8px;">Usuario ${i}</td>
          <td style="padding:8px;">usuario${i}@test.com</td>
          <td style="padding:8px;"><span style="background:${status === 'ACTIVO' ? '#4CAF50' : (status === 'PENDIENTE' ? '#FF9800' : '#f44336')}; color:white; padding:2px 8px; border-radius:10px;">${status}</span></td>
          <td style="padding:8px;">${role}</td>
        </tr>`;
      }
      html += '</table>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 100 usuarios cargados en ${loadTime}ms`;
      statsCount.innerText = '100';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 200);
  };
  
  // ===== 2. CARGAR 1000 USUARIOS =====
  document.getElementById('admin-test-1000').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 1000 usuarios simulados...';
    
    setTimeout(() => {
      let html = '<div style="font-family:monospace; font-size:12px;">';
      
      for (let i = 1; i <= 1000; i++) {
        html += `<div style="padding:5px; border-bottom:1px solid #eee; display:flex; gap:10px;">
          <span style="width:50px;">#${i}</span>
          <span style="width:150px;">Usuario ${i}</span>
          <span style="width:200px;">usuario${i}@test.com</span>
          <span style="width:80px; background:${i % 2 === 0 ? '#4CAF50' : '#FF9800'}; color:white; padding:2px 5px; border-radius:4px;">${i % 2 === 0 ? 'ACTIVO' : 'PENDIENTE'}</span>
        </div>`;
      }
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 1000 usuarios cargados en ${loadTime}ms`;
      statsCount.innerText = '1000';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 400);
  };
  
  // ===== 3. CARGAR 5000 USUARIOS =====
  document.getElementById('admin-test-5000').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 5000 usuarios... (puede tardar)';
    
    setTimeout(() => {
      let html = '<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:5px;">';
      
      for (let i = 1; i <= 5000; i++) {
        html += `<div style="background:#f5f5f5; padding:5px; border-radius:4px; font-size:10px; text-align:center;">
          <div><strong>U${i}</strong></div>
          <div style="color:#666;">${i % 3 === 0 ? '✓' : '○'}</div>
        </div>`;
      }
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 5000 usuarios cargados en ${loadTime}ms`;
      statsCount.innerText = '5000';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 800);
  };
  
  // ===== 4. TABLA 50x50 =====
  document.getElementById('admin-test-table').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Generando tabla 50x50...';
    
    setTimeout(() => {
      let html = '<table style="width:100%; border-collapse:collapse; font-size:10px;">';
      
      // Encabezados
      html += '<tr style="background:#8B4513; color:white;">';
      for (let col = 0; col <= 50; col++) {
        html += `<th style="padding:5px; border:1px solid #ddd;">${col === 0 ? '#' : 'C' + col}</th>`;
      }
      html += '</tr>';
      
      // Filas
      for (let row = 1; row <= 50; row++) {
        html += '<tr>';
        html += `<td style="padding:5px; border:1px solid #ddd; background:#f0f0f0; font-weight:bold;">R${row}</td>`;
        for (let col = 1; col <= 50; col++) {
          const value = Math.floor(Math.random() * 1000);
          html += `<td style="padding:5px; border:1px solid #ddd; text-align:center;">${value}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ Tabla 50x50 (2500 celdas) generada en ${loadTime}ms`;
      statsCount.innerText = '2500 celdas';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 300);
  };
  
  // ===== 5. GRÁFICA DE RENDIMIENTO =====
  document.getElementById('admin-test-chart').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Generando gráfica con 500 puntos...';
    
    setTimeout(() => {
      let html = '<div style="height:300px; position:relative; background:#f8f9fa; padding:20px;">';
      
      // Simular gráfica de barras
      for (let i = 1; i <= 20; i++) {
        const height = Math.floor(Math.random() * 150) + 50;
        html += `<div style="position:absolute; bottom:20px; left:${i * 35}px; width:25px; height:${height}px; background:${i % 2 === 0 ? '#2196F3' : '#FF9800'}; border-radius:4px 4px 0 0; text-align:center; color:white; font-size:10px; padding-top:5px;">${height}</div>`;
      }
      
      // Líneas de puntos
      html += '<svg width="100%" height="200" style="position:absolute; top:50px; left:0;">';
      let points = '';
      for (let i = 0; i <= 500; i++) {
        const x = i * 2;
        const y = 150 - Math.sin(i * 0.1) * 50 + Math.cos(i * 0.05) * 30;
        points += `${x},${y} `;
      }
      html += `<polyline points="${points}" style="fill:none;stroke:#4CAF50;stroke-width:2" />`;
      html += '</svg>';
      
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ Gráfica generada en ${loadTime}ms`;
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 350);
  };
  
  // ===== 6. STRESS TEST MEMORIA =====
  document.getElementById('admin-test-memory').onclick = function() {
    resultsDiv.innerHTML = '💾 Iniciando stress test de memoria...';
    
    // Crear muchos objetos para probar memoria
    const objetos = [];
    for (let i = 0; i < 10000; i++) {
      objetos.push({
        id: i,
        nombre: `Objeto ${i}`,
        data: new Array(100).fill('test data').join(''),
        timestamp: Date.now(),
        aleatorio: Math.random()
      });
    }
    
    // Mostrar algunos en el área de prueba
    let html = '<div style="max-height:300px; overflow-y:auto;">';
    html += '<h4>10000 objetos creados en memoria</h4>';
    for (let i = 0; i < 50; i++) {
      html += `<div style="padding:5px; border-bottom:1px solid #eee;">Objeto #${i}: ${JSON.stringify(objetos[i]).substring(0, 100)}...</div>`;
    }
    html += '<div style="padding:10px; background:#f0f0f0;">... y 9950 objetos más en memoria</div>';
    html += '</div>';
    
    testArea.innerHTML = html;
    
    resultsDiv.innerHTML = `💾 Stress test completado. 10000 objetos en memoria.`;
    statsCount.innerText = '10000 obj';
    operationCount++;
    statsOps.innerText = operationCount;
    updateMemory();
    
    // Forzar garbage collection si está disponible
    if (window.gc) {
      setTimeout(() => {
        window.gc();
        resultsDiv.innerHTML += ' GC ejecutado.';
      }, 1000);
    }
  };
  
  // ===== 7. MEDIR FPS =====
  document.getElementById('admin-test-fps').onclick = function() {
    resultsDiv.innerHTML = '🎮 Midiendo FPS por 30 segundos...';
    
    let frames = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function measureFPS() {
      frames++;
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        fps = Math.round((frames * 1000) / delta);
        statsFps.innerText = fps;
        frames = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(measureFPS);
    }
    
    // Detener medición anterior si existe
    if (fpsInterval) {
      cancelAnimationFrame(fpsInterval);
    }
    fpsInterval = requestAnimationFrame(measureFPS);
    
    // Detener después de 30 segundos
    setTimeout(() => {
      if (fpsInterval) {
        cancelAnimationFrame(fpsInterval);
        resultsDiv.innerHTML = `✅ Medición completada. FPS promedio: ${statsFps.innerText}`;
      }
    }, 30000);
  };
  
  // ===== 8. LIMPIAR TODO =====
  document.getElementById('admin-test-clear').onclick = function() {
    testArea.innerHTML = '<div style="text-align: center; color: #999; padding: 50px;">↑ Selecciona un botón de prueba para comenzar ↑</div>';
    resultsDiv.innerHTML = '🧹 Área de pruebas limpiada. Memoria liberada.';
    statsCount.innerText = '0';
    statsTime.innerText = '0 ms';
    operationCount = 0;
    statsOps.innerText = '0';
    updateMemory();
    
    if (window.gc) {
      window.gc();
      resultsDiv.innerHTML += ' GC ejecutado.';
    }
  };
  
  // ===== 9. LOGS EN TIEMPO REAL =====
  let logInterval;
  document.getElementById('admin-test-logs').onclick = function() {
    resultsDiv.innerHTML = '📝 Generando logs en tiempo real...';
    
    // Limpiar intervalo anterior
    if (logInterval) clearInterval(logInterval);
    
    let logCount = 0;
    testArea.innerHTML = '<div id="log-container" style="height:300px; overflow-y:auto; background:#1e1e1e; color:#0f0; padding:10px; font-family:monospace; font-size:12px;"></div>';
    const logContainer = document.getElementById('log-container');
    
    logInterval = setInterval(() => {
      logCount++;
      const logEntry = document.createElement('div');
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] LOG #${logCount}: Operación de prueba completada - Memoria: ${statsMemory.innerText} - FPS: ${statsFps.innerText}`;
      logContainer.appendChild(logEntry);
      logContainer.scrollTop = logContainer.scrollHeight;
      
      statsCount.innerText = logCount;
      operationCount++;
      statsOps.innerText = operationCount;
      
      if (logCount >= 1000) {
        clearInterval(logInterval);
        resultsDiv.innerHTML = '✅ 1000 logs generados';
      }
    }, 50);
  };
  
  // ===== 10. 500 CHECKBOXES =====
  document.getElementById('admin-test-checkboxes').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Generando 500 checkboxes...';
    
    setTimeout(() => {
      let html = '<div style="display:grid; grid-template-columns:repeat(10,1fr); gap:5px; max-height:400px; overflow-y:auto;">';
      
      for (let i = 1; i <= 500; i++) {
        html += `<div style="padding:5px; background:#f5f5f5; border-radius:4px;">
          <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
            <input type="checkbox" onchange="AppState.addNotification('Checkbox #${i} ' + (this.checked ? '✓' : '○'), 'info')">
            <span style="font-size:11px;">Item ${i}</span>
          </label>
        </div>`;
      }
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 500 checkboxes generados en ${loadTime}ms`;
      statsCount.innerText = '500';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 250);
  };
  
  // ===== 11. 200 INPUTS CON EVENTOS =====
  document.getElementById('admin-test-inputs').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Generando 200 inputs con eventos...';
    
    setTimeout(() => {
      let html = '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; max-height:400px; overflow-y:auto;">';
      
      for (let i = 1; i <= 200; i++) {
        html += `<div style="padding:10px; background:#f5f5f5; border-radius:4px;">
          <div style="font-size:11px; margin-bottom:5px;">Input #${i}</div>
          <input type="text" id="input-${i}" placeholder="Escribe algo..." 
                 oninput="document.getElementById('admin-results').innerHTML = '⌨️ Input #${i}: ' + this.value"
                 style="width:100%; padding:5px; border:1px solid #ddd; border-radius:4px;">
        </div>`;
      }
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 200 inputs generados en ${loadTime}ms`;
      statsCount.innerText = '200';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 300);
  };
  
  // ===== 12. SIMULAR CLOUDINARY =====
  document.getElementById('admin-test-cloudinary').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '☁️ Simulando carga de Cloudinary...';
    
    setTimeout(() => {
      let html = '<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:15px;">';
      
      // Simular 50 imágenes de Cloudinary
      for (let i = 1; i <= 50; i++) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        html += `<div style="text-align:center;">
          <div style="width:100%; padding-bottom:100%; background: linear-gradient(135deg, #${randomColor}, #${randomColor.substring(0,4)}); border-radius:8px; margin-bottom:5px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
            ${i}
          </div>
          <div style="font-size:10px;">cloudinary/img_${i}</div>
          <div style="font-size:9px; color:#666;">${(Math.random() * 100).toFixed(1)} KB</div>
        </div>`;
      }
      html += '</div>';
      
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 50 imágenes simuladas de Cloudinary en ${loadTime}ms`;
      statsCount.innerText = '50 img';
      statsTime.innerText = loadTime + 'ms';
      operationCount++;
      statsOps.innerText = operationCount;
      updateMemory();
    }, 400);
  };
  
  // ===== ACTUALIZAR ESTIMACIÓN DE MEMORIA =====
  function updateMemory() {
    if (performance.memory) {
      const memoryMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      statsMemory.innerText = memoryMB + ' MB';
    } else {
      // Estimación aproximada basada en elementos
      const elementCount = testArea.children.length;
      statsMemory.innerText = (elementCount * 0.1).toFixed(2) + ' MB (est)';
    }
  }
  
  // Actualizar memoria cada 2 segundos
  setInterval(updateMemory, 2000);
}

// ==============================================
// EXPORTAR FUNCIÓN PRINCIPAL
// ==============================================
window.renderAdminPanel = window.renderAdminPanel;
window.renderAdminScreen = window.renderAdminPanel;
console.log("✅ admin.js cargado - MODO PRUEBAS DE RENDIMIENTO");
