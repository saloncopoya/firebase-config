// ==============================================
// PANTALLA PUBLICACIONES - PRUEBAS DE RENDIMIENTO
// ==============================================
window.renderPublicacionesScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="publicaciones-screen" style="min-height: 100vh; background: #f0f0f0;">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      
      <div style="padding: 90px 20px 20px 20px; max-width: 1200px; margin: 0 auto;">
        
        <!-- TÍTULO -->
        <h1 style="color: #333; margin-bottom: 30px; text-align: center;">📱 PUBLICACIONES - PRUEBAS DE RENDIMIENTO</h1>
        
        <!-- CONTENEDOR PRINCIPAL (EN BLANCO) -->
        <div id="test-container-publicaciones" style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-height: 500px;">
          
          <!-- INFORMACIÓN DEL USUARIO -->
          <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Usuario:</strong> ${userProfile.displayName || 'N/A'}</p>
            <p><strong>UID:</strong> ${currentUser.uid}</p>
            <p><strong>Pantalla:</strong> Publicaciones (Pruebas)</p>
          </div>
          
          <!-- BOTONES DE PRUEBA DE RENDIMIENTO -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            
            <!-- BOTÓN 1: Posts simples -->
            <button id="pub-test-100" style="background: #2196F3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              📊 100 Posts simples
            </button>
            
            <!-- BOTÓN 2: Posts con imágenes -->
            <button id="pub-test-images" style="background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🖼️ 50 Posts con imágenes
            </button>
            
            <!-- BOTÓN 3: Posts con comentarios -->
            <button id="pub-test-comments" style="background: #FF9800; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💬 200 comentarios anidados
            </button>
            
            <!-- BOTÓN 4: Liberar memoria -->
            <button id="pub-test-clear" style="background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🧹 Limpiar feed
            </button>
            
            <!-- BOTÓN 5: Scroll infinito -->
            <button id="pub-test-infinite" style="background: #9C27B0; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ♾️ Simular scroll infinito
            </button>
            
            <!-- BOTÓN 6: Videos -->
            <button id="pub-test-videos" style="background: #8B4513; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🎥 20 videos embebidos
            </button>
            
          </div>
          
          <!-- ÁREA DE RESULTADOS -->
          <div id="pub-results" style="margin: 20px 0; padding: 15px; background: #333; color: #0f0; border-radius: 8px; font-family: monospace; min-height: 60px;">
            ⏳ Listo para pruebas. Selecciona un botón.
          </div>
          
          <!-- FEED DE PRUEBA (INICIALMENTE VACÍO) -->
          <div id="pub-test-feed" style="min-height: 200px; max-height: 500px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
            <!-- Los posts se inyectan aquí -->
          </div>
          
          <!-- ESTADÍSTICAS -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 30px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">POSTS</div>
              <div id="pub-stats-count" style="font-size: 24px; font-weight: bold; color: #2196F3;">0</div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">COMENTARIOS</div>
              <div id="pub-stats-comments" style="font-size: 24px; font-weight: bold; color: #4CAF50;">0</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">TIEMPO CARGA</div>
              <div id="pub-stats-time" style="font-size: 24px; font-weight: bold; color: #FF9800;">0 ms</div>
            </div>
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #666;">MEMORIA</div>
              <div id="pub-stats-memory" style="font-size: 24px; font-weight: bold; color: #9C27B0;">0 MB</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
  
  setTimeout(initPublicacionesTests, 100);
};

// ==============================================
// FUNCIONES DE PRUEBA PARA PUBLICACIONES
// ==============================================
function initPublicacionesTests() {
  console.log("📱 Inicializando pruebas de Publicaciones");
  
  const feed = document.getElementById('pub-test-feed');
  const results = document.getElementById('pub-results');
  const statsCount = document.getElementById('pub-stats-count');
  const statsComments = document.getElementById('pub-stats-comments');
  const statsTime = document.getElementById('pub-stats-time');
  const statsMemory = document.getElementById('pub-stats-memory');
  
  // 1. CARGAR 100 POSTS SIMPLES
  document.getElementById('pub-test-100').onclick = function() {
    const start = performance.now();
    results.innerHTML = '⏳ Cargando 100 posts...';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 100; i++) {
        html += `
          <div style="padding: 15px; margin: 10px 0; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #2196F3;">
            <strong>Usuario ${Math.floor(Math.random()*10)+1}</strong>
            <p>Post de prueba #${i} - Lorem ipsum dolor sit amet...</p>
            <small>hace ${Math.floor(Math.random()*60)} minutos</small>
          </div>
        `;
      }
      feed.innerHTML = html;
      
      const loadTime = (performance.now() - start).toFixed(2);
      results.innerHTML = `✅ 100 posts cargados en ${loadTime}ms`;
      statsCount.innerText = '100';
      statsTime.innerText = loadTime + 'ms';
      updateMemory();
    }, 200);
  };
  
  // 2. CARGAR 50 POSTS CON IMÁGENES
  document.getElementById('pub-test-images').onclick = function() {
    const start = performance.now();
    results.innerHTML = '⏳ Cargando 50 posts con imágenes...';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 50; i++) {
        html += `
          <div style="padding: 15px; margin: 10px 0; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <strong>Usuario ${Math.floor(Math.random()*10)+1}</strong>
            <p>Post con imagen #${i}</p>
            <div style="background: #ddd; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
              🖼️ [IMAGEN SIMULADA ${i}]
            </div>
            <small>hace ${Math.floor(Math.random()*60)} minutos</small>
          </div>
        `;
      }
      feed.innerHTML = html;
      
      const loadTime = (performance.now() - start).toFixed(2);
      results.innerHTML = `✅ 50 posts con imágenes en ${loadTime}ms`;
      statsCount.innerText = '50';
      statsTime.innerText = loadTime + 'ms';
      updateMemory();
    }, 300);
  };
  
  // 3. CARGAR 200 COMENTARIOS ANIDADOS
  document.getElementById('pub-test-comments').onclick = function() {
    const start = performance.now();
    results.innerHTML = '⏳ Cargando 200 comentarios anidados...';
    
    setTimeout(() => {
      let html = '<div style="background: #f0f0f0; padding: 15px; border-radius: 8px;"><strong>Post principal</strong><p>Este es el post principal con muchos comentarios</p>';
      
      for (let i = 1; i <= 200; i++) {
        const indent = Math.floor(Math.random() * 3) * 20;
        html += `
          <div style="margin-left: ${indent}px; padding: 8px; margin-top: 5px; background: white; border-radius: 4px; border-left: 2px solid #4CAF50;">
            <small><strong>Comentarista ${i}</strong> - hace ${Math.floor(Math.random()*30)} min</small>
            <p style="margin: 5px 0 0;">Este es el comentario #${i}</p>
          </div>
        `;
      }
      html += '</div>';
      feed.innerHTML = html;
      
      const loadTime = (performance.now() - start).toFixed(2);
      results.innerHTML = `✅ 200 comentarios anidados en ${loadTime}ms`;
      statsCount.innerText = '1';
      statsComments.innerText = '200';
      statsTime.innerText = loadTime + 'ms';
      updateMemory();
    }, 400);
  };
  
  // 4. LIMPIAR
  document.getElementById('pub-test-clear').onclick = function() {
    feed.innerHTML = '';
    results.innerHTML = '🧹 Feed limpiado';
    statsCount.innerText = '0';
    statsComments.innerText = '0';
    statsTime.innerText = '0 ms';
    updateMemory();
  };
  
  // 5. SCROLL INFINITO
  document.getElementById('pub-test-infinite').onclick = function() {
    results.innerHTML = '♾️ Scroll infinito activado - Haz scroll para cargar más';
    
    // Cargar 20 posts iniciales
    let html = '';
    for (let i = 1; i <= 20; i++) {
      html += `<div class="infinite-post" style="padding: 15px; margin: 10px 0; background: #e3f2fd; border-radius: 8px;">Post inicial #${i}</div>`;
    }
    feed.innerHTML = html;
    statsCount.innerText = '20';
    
    // Detectar scroll al final
    feed.onscroll = function() {
      if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 100) {
        // Cargar más posts
        const currentCount = feed.children.length;
        for (let i = 1; i <= 10; i++) {
          const newPost = document.createElement('div');
          newPost.className = 'infinite-post';
          newPost.style.cssText = 'padding: 15px; margin: 10px 0; background: #c8e6c9; border-radius: 8px; animation: fadeIn 0.3s;';
          newPost.innerText = `Post cargado dinámicamente #${currentCount + i}`;
          feed.appendChild(newPost);
        }
        statsCount.innerText = feed.children.length;
        results.innerHTML = `♾️ Cargados ${feed.children.length} posts`;
      }
    };
  };
  
  // 6. VIDEOS EMBEBIDOS
  document.getElementById('pub-test-videos').onclick = function() {
    const start = performance.now();
    results.innerHTML = '⏳ Cargando 20 videos embebidos...';
    
    setTimeout(() => {
      let html = '';
      for (let i = 1; i <= 20; i++) {
        html += `
          <div style="padding: 15px; margin: 10px 0; background: #f5f5f5; border-radius: 8px;">
            <strong>Video #${i}</strong>
            <div style="background: #000; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
              🎬 [SIMULACIÓN VIDEO ${i}]
            </div>
            <progress value="0" max="100" style="width: 100%; height: 5px; margin-top: 5px;"></progress>
          </div>
        `;
      }
      feed.innerHTML = html;
      
      const loadTime = (performance.now() - start).toFixed(2);
      results.innerHTML = `✅ 20 videos embebidos en ${loadTime}ms`;
      statsCount.innerText = '20';
      statsTime.innerText = loadTime + 'ms';
      updateMemory();
    }, 350);
  };
  
  function updateMemory() {
    if (performance.memory) {
      const memoryMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      statsMemory.innerText = memoryMB + ' MB';
    }
  }
}

console.log("✅ publicaciones.js (pruebas rendimiento) cargado");
