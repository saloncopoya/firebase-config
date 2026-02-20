// ==============================================
// PANTALLA DEL JUEZ - IGUAL QUE PUBLICACIONES/PEDIGRI
// ==============================================
window.renderJuezScreen = function() {
  const userProfile = AppState.user.profile;
  const currentUser = AppState.user.current;
  
  if (!userProfile || !currentUser) {
    return '<div>Error: Usuario no encontrado</div>';
  }
  
  // Obtener datos del usuario para mostrar
  const displayName = userProfile.displayName || currentUser.displayName || 'Juez';
  const photoURL = userProfile.photoURL || currentUser.photoURL || '';
  const initials = getInitials(displayName);
  
  // Aquí irá TODO el contenido de la pantalla del juez
  return `
    <div>
      ${renderMobileNavBar()}
      
      <div style="max-width: 800px; margin: 90px auto 20px; padding: 20px;">
        
        <!-- CABECERA CON FOTO -->
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 20px; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); border-radius: 16px; color: white;">
          <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 3px solid #FFD700;">
            ${photoURL ? 
              `<img src="${photoURL}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\'width:60px; height:60px; border-radius:50%; background: #FFD700; color: #8B4513; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:24px;\'>${initials}</div>';">` 
              : 
              `<div style="width:100%; height:100%; background: #FFD700; color: #8B4513; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:24px;">${initials}</div>`
            }
          </div>
          <div>
            <h1 style="margin:0; font-size:24px;">Panel del Juez</h1>
            <p style="margin:4px 0 0; opacity:0.9;">${displayName}</p>
          </div>
        </div>
        
        <!-- CONTENIDO PRINCIPAL -->
        <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color:#8B4513; margin-top:0;">Funciones de Juez</h2>
          <p style="color:#666; margin-bottom:24px;">Aquí podrás gestionar las funciones exclusivas para jueces.</p>
          
          <!-- TARJETAS DE FUNCIONES (EJEMPLO) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            
            <!-- Tarjeta 1: Calificar Peleas -->
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #e4e6eb;">
              <div style="font-size: 32px; margin-bottom: 12px;">⚔️</div>
              <h3 style="margin:0 0 8px; color:#333;">Calificar Peleas</h3>
              <p style="margin:0 0 16px; color:#666; font-size:14px;">Registra resultados y puntuaciones de las peleas en torneos.</p>
              <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%;">Acceder</button>
            </div>
            
            <!-- Tarjeta 2: Validar Resultados -->
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #e4e6eb;">
              <div style="font-size: 32px; margin-bottom: 12px;">✅</div>
              <h3 style="margin:0 0 8px; color:#333;">Validar Resultados</h3>
              <p style="margin:0 0 16px; color:#666; font-size:14px;">Confirma y certifica los resultados de las competencias.</p>
              <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%;">Acceder</button>
            </div>
            
            <!-- Tarjeta 3: Historial -->
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #e4e6eb;">
              <div style="font-size: 32px; margin-bottom: 12px;">📋</div>
              <h3 style="margin:0 0 8px; color:#333;">Historial</h3>
              <p style="margin:0 0 16px; color:#666; font-size:14px;">Revisa peleas pasadas y resultados certificados.</p>
              <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%;">Acceder</button>
            </div>
            
          </div>
          
          <!-- SECCIÓN DE PRÓXIMAS PELEAS -->
          <div style="margin-top: 32px; padding: 20px; background: #fff8e1; border-radius: 12px; border-left: 4px solid #FFD700;">
            <h3 style="margin:0 0 16px; color:#8B4513;">📅 Próximas peleas para calificar</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: white; border-radius: 8px;">
                <div><strong>Gallo 1 vs Gallo 2</strong><br><span style="font-size:12px; color:#666;">Torneo Regional • 25 Feb 2026</span></div>
                <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Calificar</button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: white; border-radius: 8px;">
                <div><strong>Gallo 3 vs Gallo 4</strong><br><span style="font-size:12px; color:#666;">Torneo Nacional • 26 Feb 2026</span></div>
                <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Calificar</button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: white; border-radius: 8px;">
                <div><strong>Gallo 5 vs Gallo 6</strong><br><span style="font-size:12px; color:#666;">Torneo Internacional • 27 Feb 2026</span></div>
                <button onclick="AppState.addNotification('Funcionalidad en desarrollo', 'info')" style="background:#8B4513; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Calificar</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};
