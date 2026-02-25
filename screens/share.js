// ==============================================
// PANTALLA SHARE (COMPARTIR)
// ==============================================

window.renderShareScreen = function() {
  console.log("🔗 Renderizando pantalla de compartir");
  
  // Obtener el ID compartido
  const shareId = sessionStorage.getItem('currentShareId') || 'ID no especificado';
  
  // HTML de la pantalla
  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      
      <!-- Encabezado -->
      <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); border-radius: 16px; padding: 30px 20px; margin-bottom: 20px; color: white; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🔗</div>
        <h1 style="margin: 0 0 5px 0; font-size: 24px;">Contenido Compartido</h1>
        <p style="margin: 0; opacity: 0.9; font-size: 14px;">ID: ${shareId}</p>
      </div>
      
      <!-- Tarjeta de contenido -->
      <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="margin-bottom: 24px;">
          <h3 style="color: #8B4513; margin: 0 0 10px 0;">📝 Contenido</h3>
          <p style="color: #444; line-height: 1.6; margin: 0;">
            Este es el contenido compartido con ID: <strong>${shareId}</strong>
          </p>
        </div>
        
        <!-- Botones de acción -->
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button onclick="window.history.back()" style="flex: 1; padding: 14px; background: #f0f2f5; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            ⬅️ Volver
          </button>
          <button onclick="navigateTo('public')" style="flex: 1; padding: 14px; background: #8B4513; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            🏠 Inicio
          </button>
        </div>
        
        <!-- Mensaje según login -->
        ${!AppState.user.current ? `
          <div style="margin-top: 20px; padding: 16px; background: #fff8e1; border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 12px 0;">¿Quieres guardar este contenido?</p>
            <button onclick="navigateTo('login')" style="padding: 12px 24px; background: #8B4513; color: white; border: none; border-radius: 8px; cursor: pointer;">
              Inicia sesión
            </button>
          </div>
        ` : `
          <div style="margin-top: 20px; padding: 16px; background: #e8f5e8; border-radius: 12px;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <span style="font-size: 24px;">👤</span>
              <div>
                <div style="font-weight: 600;">${AppState.user.profile?.displayName || 'Usuario'}</div>
                <div style="font-size: 13px; color: #666;">Has iniciado sesión</div>
              </div>
            </div>
          </div>
        `}
        
      </div>
    </div>
  `;
};

// Registro para desarrollo
if (typeof ScreenLoader !== 'undefined') {
  ScreenLoader.registerLocalScreen('share', window.renderShareScreen);
}

console.log("✅ Pantalla share.js cargada correctamente");
