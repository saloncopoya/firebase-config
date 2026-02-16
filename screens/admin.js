// ==============================================
// PANEL DE ADMINISTRACIÓN - SOLO PARA GALLO = TRUE
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

  // Cargar lista de usuarios para el panel
  const users = await window.loadAllUsers();

  return `
    <div class="admin-screen">
      ${window.renderMobileNavBar ? window.renderMobileNavBar() : ''}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Header del admin -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
                👑
              </div>
              <div>
                <h2 style="color: #8B4513; margin: 0 0 5px 0;">Panel de Administración</h2>
                <p style="color: #666; margin: 0;">Bienvenido, <strong>${userProfile.displayName || 'Administrador'}</strong></p>
              </div>
            </div>
            <div style="background: #f0f8ff; padding: 10px 20px; border-radius: 20px; color: #8B4513;">
  <span style="font-weight: 700;">${users ? (users.length || 0) : 0}</span> usuarios registrados
</div>
          </div>

          <!-- Tabs de navegación admin -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; background: white; padding: 10px; border-radius: 12px; overflow-x: auto;">
            <button onclick="window.showAdminTab('usuarios')" class="admin-tab ${window.currentAdminTab === 'usuarios' ? 'active' : ''}" style="padding: 12px 20px; background: ${window.currentAdminTab === 'usuarios' ? '#8B4513' : 'transparent'}; color: ${window.currentAdminTab === 'usuarios' ? 'white' : '#666'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              👥 Usuarios
            </button>
            <button onclick="window.showAdminTab('activaciones')" class="admin-tab ${window.currentAdminTab === 'activaciones' ? 'active' : ''}" style="padding: 12px 20px; background: ${window.currentAdminTab === 'activaciones' ? '#8B4513' : 'transparent'}; color: ${window.currentAdminTab === 'activaciones' ? 'white' : '#666'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              ⏳ Activaciones pendientes
            </button>
            <button onclick="window.showAdminTab('contenido')" class="admin-tab ${window.currentAdminTab === 'contenido' ? 'active' : ''}" style="padding: 12px 20px; background: ${window.currentAdminTab === 'contenido' ? '#8B4513' : 'transparent'}; color: ${window.currentAdminTab === 'contenido' ? 'white' : '#666'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              📊 Contenido
            </button>
            <button onclick="window.showAdminTab('estadisticas')" class="admin-tab ${window.currentAdminTab === 'estadisticas' ? 'active' : ''}" style="padding: 12px 20px; background: ${window.currentAdminTab === 'estadisticas' ? '#8B4513' : 'transparent'}; color: ${window.currentAdminTab === 'estadisticas' ? 'white' : '#666'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              📈 Estadísticas
            </button>
          </div>

          <!-- Contenido dinámico según tab -->
          <div id="admin-content">
  ${users ? window.renderAdminUsersList(users) : '<div>Cargando usuarios...</div>'}
</div>

        </div>
      </div>
    </div>
  `;
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
      storageBucket: "tu-proyecto-admin.appspot.com",
      messagingSenderId: "444555666"
    };
    
    if (!window.adminFirebaseApp) {
      window.adminFirebaseApp = firebase.initializeApp(adminFirebaseConfig, "admin");
      window.adminDatabase = window.adminFirebaseApp.database();
    }
    
    this.initialized = true;
  }
};

// ==============================================
// VARIABLES GLOBALES DE ADMIN
// ==============================================
window.currentAdminTab = 'usuarios';

// ==============================================
// FUNCIONES PARA CARGAR DATOS
// ==============================================

window.loadAllUsers = async function() {
  try {
    const database = AppState.firebase.database;
    if (!database) return [];
    
    const snapshot = await database.ref('users').once('value');
    if (snapshot.exists()) {
      const users = [];
      snapshot.forEach(child => {
        users.push({ uid: child.key, ...child.val() });
      });
      return users.sort((a, b) => (b.registeredAt || 0) - (a.registeredAt || 0));
    }
    return [];
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    return [];
  }
};

// ==============================================
// RENDERIZADO DE LISTA DE USUARIOS
// ==============================================

window.renderAdminUsersList = function(users = []) {
  const pendingUsers = users.filter(u => u.activated === false);
  
  return `
    <div style="background: white; border-radius: 12px; padding: 20px;">
      
      <!-- Buscador -->
      <div style="margin-bottom: 20px;">
        <input type="text" id="userSearch" placeholder="🔍 Buscar usuario por nombre, email o teléfono..." 
               onkeyup="window.filterUsers()"
               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
      </div>
      
      <!-- Estadísticas rápidas -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
          <div style="font-size: 24px; color: #8B4513; margin-bottom: 5px;">${users.length}</div>
          <div style="font-size: 13px; color: #666;">Total usuarios</div>
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
          <div style="font-size: 24px; color: #ff9800; margin-bottom: 5px;">${pendingUsers.length}</div>
          <div style="font-size: 13px; color: #666;">Pendientes</div>
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
          <div style="font-size: 24px; color: #42b72a; margin-bottom: 5px;">${users.filter(u => u.activated === true).length}</div>
          <div style="font-size: 13px; color: #666;">Activos</div>
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
          <div style="font-size: 24px; color: #9c27b0; margin-bottom: 5px;">${users.filter(u => u.gallo === true).length}</div>
          <div style="font-size: 13px; color: #666;">Admins</div>
        </div>
      </div>
      
      <!-- Lista de usuarios -->
      <div id="users-list-container">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #ddd;">
              <th style="padding: 12px; text-align: left;">Usuario</th>
              <th style="padding: 12px; text-align: left;">Contacto</th>
              <th style="padding: 12px; text-align: left;">Estado</th>
              <th style="padding: 12px; text-align: left;">Rol</th>
              <th style="padding: 12px; text-align: left;">Acciones</th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            ${users.map(user => window.renderUserRow(user)).join('')}
          </tbody>
        </table>
      </div>
      
    </div>
  `;
};

window.renderUserRow = function(user) {
  const fechaRegistro = user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Desconocido';
  
  return `
    <tr style="border-bottom: 1px solid #eee;" data-user-id="${user.uid}" data-user-name="${user.displayName || ''}" data-user-email="${user.realEmail || ''}" data-user-phone="${user.phone || ''}">
      <td style="padding: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${window.getInitials ? window.getInitials(user.displayName) : 'U'}
          </div>
          <div>
            <div style="font-weight: 600; color: #333;">${user.displayName || 'Sin nombre'}</div>
            <div style="font-size: 12px; color: #999;">${fechaRegistro}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px;">
        <div style="font-size: 13px;">${user.realEmail || '—'}</div>
        <div style="font-size: 12px; color: #666;">${user.phone || '—'}</div>
      </td>
      <td style="padding: 12px;">
        <span style="background: ${user.activated ? '#42b72a' : '#ff9800'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
          ${user.activated ? 'ACTIVADO' : 'PENDIENTE'}
        </span>
      </td>
      <td style="padding: 12px;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${user.gallo ? '<span style="background: #8B4513; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; width: fit-content;">👑 ADMIN</span>' : ''}
          ${user.isJudge ? '<span style="background: #2196f3; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; width: fit-content;">⚖️ JUEZ</span>' : ''}
          ${user.publicaciones ? '<span style="background: #4caf50; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; width: fit-content;">📱 PUB</span>' : ''}
          ${user.pedigri ? '<span style="background: #9c27b0; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; width: fit-content;">🧬 PED</span>' : ''}
        </div>
      </td>
      <td style="padding: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button onclick="window.toggleUserActivation('${user.uid}', ${!user.activated})" style="background: ${user.activated ? '#ff9800' : '#42b72a'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ${user.activated ? 'Desactivar' : 'Activar'}
          </button>
          <button onclick="window.toggleUserGallo('${user.uid}', ${!user.gallo})" style="background: ${user.gallo ? '#d32f2f' : '#8B4513'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ${user.gallo ? 'Quitar Admin' : 'Hacer Admin'}
          </button>
          <button onclick="window.showUserDetails('${user.uid}')" style="background: #2196f3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Detalles
          </button>
        </div>
      </td>
    </tr>
  `;
};

// ==============================================
// FUNCIONES DE ADMIN (GLOBALES)
// ==============================================

window.toggleUserActivation = async function(uid, activate) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await AppState.firebase.database.ref(`users/${uid}/activated`).set(activate);
    AppState.addNotification(`Usuario ${activate ? 'activado' : 'desactivado'}`, 'success');
    
    // Recargar la lista
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  } catch (error) {
    console.error('Error:', error);
    AppState.addNotification('Error al cambiar estado', 'error');
  }
};

window.toggleUserGallo = async function(uid, setGallo) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await AppState.firebase.database.ref(`users/${uid}/gallo`).set(setGallo);
    AppState.addNotification(`Usuario ${setGallo ? 'ahora es ADMIN' : 'ya no es admin'}`, 'success');
    
    // Recargar la lista
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  } catch (error) {
    console.error('Error:', error);
    AppState.addNotification('Error al cambiar rol', 'error');
  }
};

window.toggleUserJudge = async function(uid, setJudge) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await AppState.firebase.database.ref(`users/${uid}/isJudge`).set(setJudge);
    AppState.addNotification(`Usuario ${setJudge ? 'ahora es JUEZ' : 'ya no es juez'}`, 'success');
    
    // Recargar la lista
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  } catch (error) {
    console.error('Error:', error);
    AppState.addNotification('Error al cambiar rol', 'error');
  }
};

window.toggleUserPublicaciones = async function(uid, setPublicaciones) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) return;
  
  try {
    await AppState.firebase.database.ref(`users/${uid}/publicaciones`).set(setPublicaciones);
    AppState.addNotification(`Acceso a Publicaciones ${setPublicaciones ? 'activado' : 'desactivado'}`, 'success');
    
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  } catch (error) {
    AppState.addNotification('Error', 'error');
  }
};

window.toggleUserPedigri = async function(uid, setPedigri) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) return;
  
  try {
    await AppState.firebase.database.ref(`users/${uid}/pedigri`).set(setPedigri);
    AppState.addNotification(`Acceso a Pedigrí ${setPedigri ? 'activado' : 'desactivado'}`, 'success');
    
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  } catch (error) {
    AppState.addNotification('Error', 'error');
  }
};

window.showUserDetails = async function(uid) {
  const users = await window.loadAllUsers();
  const user = users.find(u => u.uid === uid);
  
  if (!user) return;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; width: 90%; max-width: 500px; padding: 24px; max-height: 80vh; overflow-y: auto;">
      <h3 style="color: #8B4513; margin-bottom: 20px;">Detalles del usuario</h3>
      
      <div style="margin-bottom: 20px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
          ${window.getInitials ? window.getInitials(user.displayName) : 'U'}
        </div>
      </div>
      
      <table style="width: 100%;">
        <tr><td style="padding: 8px 0; color: #666;">UID:</td><td style="padding: 8px 0;"><code>${user.uid}</code></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Nombre:</td><td style="padding: 8px 0;"><strong>${user.displayName || '—'}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;">${user.realEmail || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Teléfono:</td><td style="padding: 8px 0;">${user.phone || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Municipio:</td><td style="padding: 8px 0;">${user.municipio || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Partido:</td><td style="padding: 8px 0;">${user.partyName || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Representante:</td><td style="padding: 8px 0;">${user.representative || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Registro:</td><td style="padding: 8px 0;">${new Date(user.registeredAt).toLocaleString()}</td></tr>
      </table>
      
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
        <button onclick="window.toggleUserActivation('${user.uid}', ${!user.activated})" style="flex:1; background: ${user.activated ? '#ff9800' : '#42b72a'}; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">
          ${user.activated ? 'Desactivar' : 'Activar'}
        </button>
        <button onclick="window.toggleUserGallo('${user.uid}', ${!user.gallo})" style="flex:1; background: ${user.gallo ? '#d32f2f' : '#8B4513'}; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">
          ${user.gallo ? 'Quitar Admin' : 'Hacer Admin'}
        </button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
        <button onclick="window.toggleUserJudge('${user.uid}', ${!user.isJudge})" style="background: ${user.isJudge ? '#d32f2f' : '#2196f3'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.isJudge ? 'Quitar Juez' : 'Hacer Juez'}
        </button>
        <button onclick="window.toggleUserPublicaciones('${user.uid}', ${!user.publicaciones})" style="background: ${user.publicaciones ? '#d32f2f' : '#4caf50'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.publicaciones ? 'Quitar Publis' : 'Dar Publis'}
        </button>
        <button onclick="window.toggleUserPedigri('${user.uid}', ${!user.pedigri})" style="background: ${user.pedigri ? '#d32f2f' : '#9c27b0'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.pedigri ? 'Quitar Pedigrí' : 'Dar Pedigrí'}
        </button>
        <button onclick="modal.remove()" style="background: #f0f2f5; color: #333; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          Cerrar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
};

window.filterUsers = function() {
  const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#users-table-body tr');
  
  rows.forEach(row => {
    const name = row.getAttribute('data-user-name')?.toLowerCase() || '';
    const email = row.getAttribute('data-user-email')?.toLowerCase() || '';
    const phone = row.getAttribute('data-user-phone')?.toLowerCase() || '';
    
    if (name.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

window.showAdminTab = function(tab) {
  window.currentAdminTab = tab;
  
  // Actualizar estilos de tabs
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.style.background = 'transparent';
    btn.style.color = '#666';
  });
  
  event.target.style.background = '#8B4513';
  event.target.style.color = 'white';
  
  // Aquí iría la lógica para cambiar el contenido según el tab
  AppState.addNotification(`Tab ${tab} - En construcción`, 'info');
};



// ==============================================
// EXPORTAR CON AMBOS NOMBRES (para que funcione)
// ==============================================
window.renderAdminPanel = renderAdminPanel;
window.renderAdminScreen = renderAdminPanel; // <-- ESTO SOLUCIONA EL ERROR
console.log("✅ admin.js cargado, funciones:", {
  panel: typeof window.renderAdminPanel,
  screen: typeof window.renderAdminScreen
});
