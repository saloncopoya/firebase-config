// ==============================================
// PANTALLA ROOSTER - CON SEGURIDAD
// ==============================================
window.renderRoosterScreen = function() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  // ===== SEGURIDAD: Usuario no logueado =====
  if (!currentUser) {
    return `<div style="padding: 40px; text-align: center; color: #666;">
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
        <!-- CONTENIDO SOLO PARA ACTIVADOS -->
        <div style="text-align: center; padding: 40px;">
          <h2>🐓 ROOSTER</h2>
          <p>Bienvenido, ${userProfile.displayName || 'usuario'}!</p>
          <p style="color: green;">✅ Cuenta activada</p>
        </div>
      </div>
    </div>
  `;
};

console.log("✅ rooster.js cargado con seguridad");
