// ==============================================
// TEST PARA PANTALLA ROOSTER (rooster.js)
// Incluye: Botones, Textbox, Notificaciones, Simulación de Datos
// ==============================================

(function() {
  window.renderRoosterScreen = function() {
    // Simulamos algunos datos de torneo para que la pantalla no se vea vacía
    const mockTournaments = [
      { id: 1, name: 'Torneo de Primavera', status: 'activo', participants: 12 },
      { id: 2, name: 'Copa Verano 2024', status: 'próximo', participants: 8 },
      { id: 3, name: 'Clásico de Otoño', status: 'finalizado', participants: 16 },
    ];

    const html = `
      <div style="padding-top: 80px; min-height: 100vh; background: #f8f9fa;">
        ${renderMobileNavBar()}
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          
          <!-- Título de la pantalla -->
          <h2 style="color: #8B4513; margin-bottom: 20px;">🧪 Pruebas - Pantalla Torneos (Rooster)</h2>
          
          <!-- SECCIÓN 1: PRUEBAS DE NOTIFICACIÓN -->
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 15px;">🔔 Prueba de Notificaciones</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <button id="rooster-test-info" class="test-btn" style="background: #2196F3;">Info</button>
              <button id="rooster-test-success" class="test-btn" style="background: #4CAF50;">Éxito</button>
              <button id="rooster-test-warning" class="test-btn" style="background: #FF9800;">Advertencia</button>
              <button id="rooster-test-error" class="test-btn" style="background: #f44336;">Error</button>
            </div>
          </div>

          <!-- SECCIÓN 2: PRUEBA DE INPUT Y BÚSQUEDA -->
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 15px;">🔍 Prueba de Búsqueda (Filtrado Local)</h3>
            <input type="text" id="rooster-search-input" placeholder="Buscar torneo por nombre..." 
                   style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; margin-bottom: 15px;">
            <button id="rooster-search-btn" style="background: #8B4513; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-right: 10px;">
              Buscar
            </button>
            <button id="rooster-reset-btn" style="background: #6c757d; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
              Restablecer Lista
            </button>
            <div id="rooster-search-results" style="margin-top: 20px;">
              <!-- Los resultados se inyectarán aquí -->
            </div>
          </div>

          <!-- SECCIÓN 3: LISTA DE TORNEOS SIMULADA (para probar scroll y renderizado) -->
          <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
              <span>🏆 Torneos Simulados</span>
              <button id="rooster-add-tournament" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-weight: 600; cursor: pointer;">+ Añadir Simulado</button>
            </h3>
            <div id="rooster-tournament-list" style="max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
              ${mockTournaments.map(t => `
                <div class="tournament-item" data-id="${t.id}" style="padding: 15px; margin-bottom: 8px; background: #f9f9f9; border-radius: 8px; border-left: 5px solid ${t.status === 'activo' ? '#4CAF50' : (t.status === 'próximo' ? '#FF9800' : '#9e9e9e')};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong style="font-size: 16px;">${t.name}</strong>
                      <span style="margin-left: 10px; font-size: 12px; color: #666;">(ID: ${t.id})</span>
                      <div style="font-size: 13px; color: #666;">Participantes: ${t.participants}</div>
                    </div>
                    <span style="background: ${t.status === 'activo' ? '#4CAF50' : (t.status === 'próximo' ? '#FF9800' : '#9e9e9e')}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${t.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Añadimos el script de configuración
    const finalHtml = html + `
      <script>
        (function() {
          setTimeout(() => {
            // === CONFIGURACIÓN DE PRUEBAS ===
            
            // 1. Notificaciones
            document.getElementById('rooster-test-info')?.addEventListener('click', () => AppState.addNotification('ℹ️ Info desde Rooster', 'info'));
            document.getElementById('rooster-test-success')?.addEventListener('click', () => AppState.addNotification('✅ Éxito desde Rooster', 'success'));
            document.getElementById('rooster-test-warning')?.addEventListener('click', () => AppState.addNotification('⚠️ Advertencia desde Rooster', 'warning'));
            document.getElementById('rooster-test-error')?.addEventListener('click', () => AppState.addNotification('❌ Error desde Rooster', 'error'));

            // 2. Lógica de Búsqueda (Filtrado)
            const searchInput = document.getElementById('rooster-search-input');
            const searchBtn = document.getElementById('rooster-search-btn');
            const resetBtn = document.getElementById('rooster-reset-btn');
            const tournamentList = document.getElementById('rooster-tournament-list');
            const originalItems = tournamentList ? tournamentList.innerHTML : '';

            if (searchBtn && searchInput && tournamentList) {
              searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (!searchTerm) {
                  AppState.addNotification('⚠️ Ingresa un término de búsqueda.', 'warning');
                  return;
                }
                const items = tournamentList.querySelectorAll('.tournament-item');
                let matchCount = 0;
                items.forEach(item => {
                  const nameElement = item.querySelector('strong');
                  if (nameElement && nameElement.textContent.toLowerCase().includes(searchTerm)) {
                    item.style.display = 'block';
                    matchCount++;
                  } else {
                    item.style.display = 'none';
                  }
                });
                AppState.addNotification(\`🔍 Búsqueda "\${searchTerm}": \${matchCount} resultados.\`, 'info');
              });
            }

            if (resetBtn && tournamentList) {
              resetBtn.addEventListener('click', () => {
                const items = tournamentList.querySelectorAll('.tournament-item');
                items.forEach(item => item.style.display = 'block');
                if (searchInput) searchInput.value = '';
                AppState.addNotification('🔄 Lista restablecida.', 'success');
              });
            }

            // 3. Añadir elemento simulado (prueba de carga)
            const addBtn = document.getElementById('rooster-add-tournament');
            if (addBtn && tournamentList) {
              addBtn.addEventListener('click', () => {
                const newId = Date.now();
                const newTournament = {
                  id: newId,
                  name: \`Torneo Dinámico #\${Math.floor(Math.random() * 100)}\`,
                  status: ['activo', 'próximo', 'finalizado'][Math.floor(Math.random() * 3)],
                  participants: Math.floor(Math.random() * 20) + 5
                };
                const newItemHtml = \`
                  <div class="tournament-item" data-id="\${newTournament.id}" style="padding: 15px; margin-bottom: 8px; background: #f9f9f9; border-radius: 8px; border-left: 5px solid \${newTournament.status === 'activo' ? '#4CAF50' : (newTournament.status === 'próximo' ? '#FF9800' : '#9e9e9e')};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong>\${newTournament.name}</strong>
                        <span style="margin-left: 10px; font-size: 12px; color: #666;">(ID: \${newTournament.id})</span>
                        <div style="font-size: 13px; color: #666;">Participantes: \${newTournament.participants}</div>
                      </div>
                      <span style="background: \${newTournament.status === 'activo' ? '#4CAF50' : (newTournament.status === 'próximo' ? '#FF9800' : '#9e9e9e')}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">\${newTournament.status}</span>
                    </div>
                  </div>
                \`;
                tournamentList.insertAdjacentHTML('beforeend', newItemHtml);
                AppState.addNotification(\`✅ Nuevo torneo "\${newTournament.name}" añadido.\`, 'success');
              });
            }
          }, 50);
        })();
      <\/script>
    `;
    return finalHtml;
  };

  console.log('✅ rooster.js (TEST) cargado.');
})();
