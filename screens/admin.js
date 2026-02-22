// ==============================================
// PANEL DE ADMINISTRACIÓN - VERSIÓN SIMULADA PARA PRUEBAS
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
      <div class="main-content" style="min-height: 100vh; background: #f8f9fa;">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- ============================================== -->
          <!-- HEADER DEL ADMIN                                -->
          <!-- ============================================== -->
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
              <span style="font-weight: 700;">${users ? users.length : 0}</span> usuarios registrados
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TABS DE NAVEGACIÓN ADMIN                        -->
          <!-- ============================================== -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; background: white; padding: 10px; border-radius: 12px; overflow-x: auto;">
            <button onclick="window.showAdminTab('usuarios')" class="admin-tab" id="admin-tab-usuarios" style="padding: 12px 20px; background: #8B4513; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              👥 Usuarios
            </button>
            <button onclick="window.showAdminTab('activaciones')" class="admin-tab" id="admin-tab-activaciones" style="padding: 12px 20px; background: transparent; color: #666; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              ⏳ Activaciones pendientes
            </button>
            <button onclick="window.showAdminTab('contenido')" class="admin-tab" id="admin-tab-contenido" style="padding: 12px 20px; background: transparent; color: #666; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              📊 Contenido
            </button>
            <button onclick="window.showAdminTab('estadisticas')" class="admin-tab" id="admin-tab-estadisticas" style="padding: 12px 20px; background: transparent; color: #666; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              📈 Estadísticas
            </button>
          </div>

          <!-- ============================================== -->
          <!-- CONTENEDOR PRINCIPAL - CAMBIA SEGÚN TAB       -->
          <!-- ============================================== -->
          <div id="admin-content">
            ${window.renderAdminUsersList(users)}
          </div>

        </div>
      </div>
    </div>
  `;
};

// ==============================================
// VARIABLES GLOBALES DE ADMIN
// ==============================================
window.currentAdminTab = 'usuarios';

// ==============================================
// FUNCIONES PARA CARGAR DATOS SIMULADOS
// ==============================================

window.loadAllUsers = async function() {
  // En lugar de Firebase, devolvemos datos simulados
  return [
    {
      uid: "user_001",
      displayName: "Juan Pérez",
      realEmail: "juan.perez@gmail.com",
      phone: "+52 961 123 4567",
      municipio: "Tuxtla Gutiérrez",
      partyName: "Gallos del Norte",
      representative: "Juan Pérez Sr.",
      activated: true,
      gallo: true,
      isJudge: false,
      publicaciones: true,
      pedigri: true,
      registeredAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_002",
      displayName: "María García",
      realEmail: "maria.garcia@hotmail.com",
      phone: "+52 962 234 5678",
      municipio: "Tapachula",
      partyName: "Avícola García",
      representative: "María García",
      activated: true,
      gallo: false,
      isJudge: true,
      publicaciones: true,
      pedigri: false,
      registeredAt: Date.now() - 15 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_003",
      displayName: "Carlos López",
      realEmail: "carlos.lopez@yahoo.com",
      phone: "+52 961 345 6789",
      municipio: "San Cristóbal",
      partyName: "",
      representative: "",
      activated: false,
      gallo: false,
      isJudge: false,
      publicaciones: false,
      pedigri: false,
      registeredAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_004",
      displayName: "Ana Martínez",
      realEmail: "ana.martinez@gmail.com",
      phone: "+52 963 456 7890",
      municipio: "Comitán",
      partyName: "Martínez Gamefarm",
      representative: "Ana Martínez",
      activated: true,
      gallo: false,
      isJudge: false,
      publicaciones: true,
      pedigri: false,
      registeredAt: Date.now() - 45 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_005",
      displayName: "Roberto Sánchez",
      realEmail: "roberto.sanchez@outlook.com",
      phone: "+52 961 567 8901",
      municipio: "Chiapa de Corzo",
      partyName: "Sánchez Family",
      representative: "Roberto Sánchez",
      activated: true,
      gallo: false,
      isJudge: false,
      publicaciones: false,
      pedigri: true,
      registeredAt: Date.now() - 60 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_006",
      displayName: "Laura Torres",
      realEmail: "laura.torres@gmail.com",
      phone: "+52 962 678 9012",
      municipio: "Huixtla",
      partyName: "",
      representative: "",
      activated: false,
      gallo: false,
      isJudge: false,
      publicaciones: false,
      pedigri: false,
      registeredAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_007",
      displayName: "Miguel Ángel Ruiz",
      realEmail: "miguel.ruiz@icloud.com",
      phone: "+52 961 789 0123",
      municipio: "Berriozábal",
      partyName: "Ruiz Gamefarm",
      representative: "Miguel Ruiz",
      activated: true,
      gallo: false,
      isJudge: true,
      publicaciones: true,
      pedigri: true,
      registeredAt: Date.now() - 90 * 24 * 60 * 60 * 1000
    },
    {
      uid: "user_008",
      displayName: "Patricia Flores",
      realEmail: "patricia.flores@gmail.com",
      phone: "+52 963 890 1234",
      municipio: "Las Rosas",
      partyName: "Flores Aviary",
      representative: "Patricia Flores",
      activated: true,
      gallo: false,
      isJudge: false,
      publicaciones: true,
      pedigri: false,
      registeredAt: Date.now() - 20 * 24 * 60 * 60 * 1000
    }
  ];
};

// ==============================================
// RENDERIZADO DE LISTA DE USUARIOS
// ==============================================

window.renderAdminUsersList = function(users = []) {
  const pendingUsers = users.filter(u => u.activated === false);
  
  return `
    <div style="background: white; border-radius: 12px; padding: 20px;">
      
      <!-- ============================================== -->
      <!-- BUSCADOR                                        -->
      <!-- ============================================== -->
      <div style="margin-bottom: 20px;">
        <input type="text" id="userSearch" placeholder="🔍 Buscar usuario por nombre, email o teléfono..." 
               onkeyup="window.filterUsers()"
               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
      </div>
      
      <!-- ============================================== -->
      <!-- ESTADÍSTICAS RÁPIDAS                            -->
      <!-- ============================================== -->
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
      
      <!-- ============================================== -->
      <!-- LISTA DE USUARIOS                               -->
      <!-- ============================================== -->
      <div id="users-list-container" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 900px;">
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
            ${window.getInitials ? window.getInitials(user.displayName) : (user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U')}
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
        <div style="font-size: 11px; color: #999;">${user.municipio || '—'}</div>
      </td>
      <td style="padding: 12px;">
        <span style="background: ${user.activated ? '#42b72a' : '#ff9800'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
          ${user.activated ? '✅ ACTIVADO' : '⏳ PENDIENTE'}
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
// FUNCIONES DE ADMIN (GLOBALES) - VERSIÓN SIMULADA
// ==============================================

window.toggleUserActivation = async function(uid, activate) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  // SIMULACIÓN: Mostrar notificación y recargar
  AppState.addNotification(`Usuario ${activate ? 'activado' : 'desactivado'} (SIMULADO)`, 'success');
  
  // Recargar la lista (usando datos simulados)
  setTimeout(async () => {
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  }, 500);
};

window.toggleUserGallo = async function(uid, setGallo) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  AppState.addNotification(`Usuario ${setGallo ? 'ahora es ADMIN' : 'ya no es admin'} (SIMULADO)`, 'success');
  
  setTimeout(async () => {
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  }, 500);
};

window.toggleUserJudge = async function(uid, setJudge) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) {
    AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  AppState.addNotification(`Usuario ${setJudge ? 'ahora es JUEZ' : 'ya no es juez'} (SIMULADO)`, 'success');
  
  setTimeout(async () => {
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  }, 500);
};

window.toggleUserPublicaciones = async function(uid, setPublicaciones) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) return;
  
  AppState.addNotification(`Acceso a Publicaciones ${setPublicaciones ? 'activado' : 'desactivado'} (SIMULADO)`, 'success');
  
  setTimeout(async () => {
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  }, 500);
};

window.toggleUserPedigri = async function(uid, setPedigri) {
  const userProfile = AppState.user.profile;
  if (!userProfile || userProfile.gallo !== true) return;
  
  AppState.addNotification(`Acceso a Pedigrí ${setPedigri ? 'activado' : 'desactivado'} (SIMULADO)`, 'success');
  
  setTimeout(async () => {
    const users = await window.loadAllUsers();
    document.getElementById('users-table-body').innerHTML = users.map(u => window.renderUserRow(u)).join('');
  }, 500);
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="color: #8B4513; margin: 0;">Detalles del usuario</h3>
        <button onclick="this.closest('div').closest('div').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">✕</button>
      </div>
      
      <div style="margin-bottom: 20px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
          ${window.getInitials ? window.getInitials(user.displayName) : (user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U')}
        </div>
      </div>
      
      <table style="width: 100%;">
        <tr><td style="padding: 8px 0; color: #666;">UID:</td><td style="padding: 8px 0;"><code style="font-size: 11px;">${user.uid}</code></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Nombre:</td><td style="padding: 8px 0;"><strong>${user.displayName || '—'}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;">${user.realEmail || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Teléfono:</td><td style="padding: 8px 0;">${user.phone || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Municipio:</td><td style="padding: 8px 0;">${user.municipio || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Partido:</td><td style="padding: 8px 0;">${user.partyName || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Representante:</td><td style="padding: 8px 0;">${user.representative || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Registro:</td><td style="padding: 8px 0;">${new Date(user.registeredAt).toLocaleString()}</td></tr>
      </table>
      
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
        <button onclick="window.toggleUserActivation('${user.uid}', ${!user.activated}); this.closest('div').closest('div').remove()" style="flex:1; background: ${user.activated ? '#ff9800' : '#42b72a'}; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">
          ${user.activated ? 'Desactivar' : 'Activar'}
        </button>
        <button onclick="window.toggleUserGallo('${user.uid}', ${!user.gallo}); this.closest('div').closest('div').remove()" style="flex:1; background: ${user.gallo ? '#d32f2f' : '#8B4513'}; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">
          ${user.gallo ? 'Quitar Admin' : 'Hacer Admin'}
        </button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
        <button onclick="window.toggleUserJudge('${user.uid}', ${!user.isJudge}); this.closest('div').closest('div').remove()" style="background: ${user.isJudge ? '#d32f2f' : '#2196f3'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.isJudge ? 'Quitar Juez' : 'Hacer Juez'}
        </button>
        <button onclick="window.toggleUserPublicaciones('${user.uid}', ${!user.publicaciones}); this.closest('div').closest('div').remove()" style="background: ${user.publicaciones ? '#d32f2f' : '#4caf50'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.publicaciones ? 'Quitar Publis' : 'Dar Publis'}
        </button>
        <button onclick="window.toggleUserPedigri('${user.uid}', ${!user.pedigri}); this.closest('div').closest('div').remove()" style="background: ${user.pedigri ? '#d32f2f' : '#9c27b0'}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          ${user.pedigri ? 'Quitar Pedigrí' : 'Dar Pedigrí'}
        </button>
        <button onclick="this.closest('div').closest('div').closest('div').remove()" style="background: #f0f2f5; color: #333; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
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
  
  document.getElementById(`admin-tab-${tab}`).style.background = '#8B4513';
  document.getElementById(`admin-tab-${tab}`).style.color = 'white';
  
  // Contenido según tab
  let content = '';
  
  switch(tab) {
    case 'usuarios':
      loadAllUsers().then(users => {
        document.getElementById('admin-content').innerHTML = window.renderAdminUsersList(users);
      });
      break;
    case 'activaciones':
      content = `
        <div style="background: white; border-radius: 12px; padding: 40px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">⏳</div>
          <h3>Activaciones Pendientes</h3>
          <p style="color: #666; margin: 20px 0;">Hay 2 usuarios esperando activación</p>
          <button onclick="window.showAdminTab('usuarios')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            Ver en lista de usuarios
          </button>
        </div>
      `;
      document.getElementById('admin-content').innerHTML = content;
      break;
    case 'contenido':
      content = `
        <div style="background: white; border-radius: 12px; padding: 40px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">📊</div>
          <h3>Gestión de Contenido</h3>
          <p style="color: #666;">Panel de contenido - En construcción</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px;">
            <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4>📝 Publicaciones</h4>
              <p>24 publicaciones</p>
            </div>
            <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4>🏆 Torneos</h4>
              <p>8 torneos activos</p>
            </div>
          </div>
        </div>
      `;
      document.getElementById('admin-content').innerHTML = content;
      break;
    case 'estadisticas':
      content = `
        <div style="background: white; border-radius: 12px; padding: 40px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">📈</div>
          <h3>Estadísticas</h3>
          <p style="color: #666;">Panel de estadísticas - En construcción</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
            <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 24px;">👥</div>
              <div>8 usuarios</div>
            </div>
            <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 24px;">🐓</div>
              <div>32 gallos</div>
            </div>
            <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 24px;">🏆</div>
              <div>5 torneos</div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('admin-content').innerHTML = content;
      break;
  }
};

// ==============================================
// EXPORTAR FUNCIÓN PRINCIPAL
// ==============================================
window.renderAdminPanel = renderAdminPanel;
window.renderAdminScreen = renderAdminPanel;
console.log("✅ admin.js cargado - VERSIÓN SIMULADA para pruebas");
