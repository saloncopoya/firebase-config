// ==============================================
// PANTALLA ROOSTER - PRUEBAS DE RENDIMIENTO
// ==============================================
window.renderRoosterScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="rooster-screen" style="min-height: 100vh; background: #f0f0f0;">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      
      <div style=" max-width: 1200px; margin: 0 auto;">
        
        <!-- TÍTULO -->
        <h1 style="color: #333; margin-bottom: 30px; text-align: center;">🐓 ROOSTER - PRUEBAS DE RENDIMIENTO</h1>
        
        <!-- CONTENEDOR PRINCIPAL (EN BLANCO) -->
        <div id="test-container-rooster" style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-height: 500px;">
          
          <!-- INFORMACIÓN DEL USUARIO -->
          <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Usuario:</strong> ${userProfile.displayName || 'N/A'}</p>
            <p><strong>UID:</strong> ${currentUser.uid}</p>
            <p><strong>Pantalla:</strong> Rooster (Pruebas)</p>
          </div>
          
          <!-- BOTONES DE PRUEBA DE RENDIMIENTO -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            
            <!-- BOTÓN 1: Cargar 100 elementos -->
            <button id="rooster-test-100" style="background: #2196F3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📊 Cargar 100 elementos
            </button>
            
            <!-- BOTÓN 2: Cargar 1000 elementos -->
            <button id="rooster-test-1000" style="background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📈 Cargar 1000 elementos
            </button>
            
            <!-- BOTÓN 3: Cargar 5000 elementos -->
            <button id="rooster-test-5000" style="background: #FF9800; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🔥 Cargar 5000 elementos
            </button>
            
            <!-- BOTÓN 4: Liberar memoria -->
            <button id="rooster-test-clear" style="background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🧹 Liberar memoria
            </button>
            
            <!-- BOTÓN 5: Medir FPS -->
            <button id="rooster-test-fps" style="background: #9C27B0; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📐 Medir FPS (30s)
            </button>
            
            <!-- BOTÓN 6: Stress test -->
            <button id="rooster-test-stress" style="background: #8B4513; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ⚡ Stress test (animaciones)
            </button>
            
          </div>
          
          <!-- ÁREA DE RESULTADOS -->
          <div id="rooster-results" style="margin: 20px 0; padding: 15px; background: #333; color: #0f0; border-radius: 8px; font-family: monospace; min-height: 60px;">
            ⏳ Listo para pruebas. Selecciona un botón.
          </div>
          
          <!-- CONTENEDOR PARA ELEMENTOS DE PRUEBA (INICIALMENTE VACÍO) -->
          <div id="rooster-test-area" style="min-height: 200px; transition: all 0.3s;">
            <!-- Aquí se inyectarán los elementos de prueba -->
          </div>
          
          <!-- ESTADÍSTICAS EN TIEMPO REAL -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 30px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">ELEMENTOS</div>
              <div id="rooster-stats-count" style="font-size: 24px; font-weight: bold; color: #2196F3;">0</div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">MEMORIA (aprox)</div>
              <div id="rooster-stats-memory" style="font-size: 24px; font-weight: bold; color: #4CAF50;">0 MB</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">TIEMPO CARGA</div>
              <div id="rooster-stats-time" style="font-size: 24px; font-weight: bold; color: #FF9800;">0 ms</div>
            </div>
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">FPS</div>
              <div id="rooster-stats-fps" style="font-size: 24px; font-weight: bold; color: #9C27B0;">60</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
  
  // Inicializar eventos después de renderizar
  setTimeout(initRoosterTests, 100);
};

// ==============================================
// FUNCIONES DE PRUEBA DE RENDIMIENTO
// ==============================================
function initRoosterTests() {
  console.log("🐓 Inicializando pruebas de rendimiento");
  
  const testArea = document.getElementById('rooster-test-area');
  const resultsDiv = document.getElementById('rooster-results');
  const statsCount = document.getElementById('rooster-stats-count');
  const statsMemory = document.getElementById('rooster-stats-memory');
  const statsTime = document.getElementById('rooster-stats-time');
  const statsFps = document.getElementById('rooster-stats-fps');
  
  // ===== 1. CARGAR 100 ELEMENTOS =====
  document.getElementById('rooster-test-100').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 100 elementos...';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 100; i++) {
        html += `<div style="padding: 10px; margin: 5px; background: #e0e0e0; border-radius: 4px; display: inline-block; width: 100px;">Item ${i}</div>`;
      }
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 100 elementos cargados en ${loadTime}ms`;
      statsCount.innerText = '100';
      statsTime.innerText = loadTime + 'ms';
      updateMemoryUsage();
    }, 100);
  };
  
  // ===== 2. CARGAR 1000 ELEMENTOS =====
  document.getElementById('rooster-test-1000').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 1000 elementos...';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 1000; i++) {
        html += `<div style="padding: 10px; margin: 5px; background: #e0e0e0; border-radius: 4px; display: inline-block; width: 100px;">Item ${i}</div>`;
      }
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 1000 elementos cargados en ${loadTime}ms`;
      statsCount.innerText = '1000';
      statsTime.innerText = loadTime + 'ms';
      updateMemoryUsage();
    }, 200);
  };
  
  // ===== 3. CARGAR 5000 ELEMENTOS =====
  document.getElementById('rooster-test-5000').onclick = function() {
    const startTime = performance.now();
    resultsDiv.innerHTML = '⏳ Cargando 5000 elementos... (puede tardar)';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 5000; i++) {
        html += `<div style="padding: 8px; margin: 4px; background: #e0e0e0; border-radius: 4px; display: inline-block; width: 80px; font-size: 10px;">#${i}</div>`;
      }
      testArea.innerHTML = html;
      
      const endTime = performance.now();
      const loadTime = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `✅ 5000 elementos cargados en ${loadTime}ms`;
      statsCount.innerText = '5000';
      statsTime.innerText = loadTime + 'ms';
      updateMemoryUsage();
    }, 500);
  };
  
  // ===== 4. LIMPIAR / LIBERAR MEMORIA =====
  document.getElementById('rooster-test-clear').onclick = function() {
    testArea.innerHTML = '';
    resultsDiv.innerHTML = '🧹 Memoria liberada. Contenedor vacío.';
    statsCount.innerText = '0';
    statsTime.innerText = '0 ms';
    updateMemoryUsage();
    
    if (window.gc) {
      window.gc();
      resultsDiv.innerHTML += ' GC ejecutado.';
    }
  };
  
  // ===== 5. MEDIR FPS =====
  let fpsInterval = null;
  document.getElementById('rooster-test-fps').onclick = function() {
    resultsDiv.innerHTML = '📐 Midiendo FPS por 30 segundos...';
    
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
  
  // ===== 6. STRESS TEST (ANIMACIONES) =====
  document.getElementById('rooster-test-stress').onclick = function() {
    resultsDiv.innerHTML = '⚡ Iniciando stress test...';
    
    // Cargar 200 elementos con animación
    let html = '';
    for (let i = 1; i <= 200; i++) {
      html += `<div class="stress-item" style="padding: 15px; margin: 10px; background: linear-gradient(45deg, #2196F3, #9C27B0); color: white; border-radius: 8px; animation: pulse 1s infinite; width: 150px; display: inline-block;">Stress ${i}</div>`;
    }
    testArea.innerHTML = html;
    
    // Añadir estilos de animación
    if (!document.getElementById('stress-styles')) {
      const style = document.createElement('style');
      style.id = 'stress-styles';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    statsCount.innerText = '200';
    resultsDiv.innerHTML = '⚡ Stress test activo - 200 elementos animados';
    updateMemoryUsage();
  };
  
  // ===== ACTUALIZAR ESTIMACIÓN DE MEMORIA =====
  function updateMemoryUsage() {
    if (performance.memory) {
      const memoryMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      statsMemory.innerText = memoryMB + ' MB';
    } else {
      statsMemory.innerText = 'N/A';
    }
  }
  
  // Actualizar memoria cada 2 segundos
  setInterval(updateMemoryUsage, 2000);
}

// ==============================================
// EXPORTAR
// ==============================================
console.log("✅ rooster.js (pruebas rendimiento) cargado");
