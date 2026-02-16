// ==============================================
// FIREBASE-UI.JS - SOLO RENDERIZADO (NO CRÍTICO)
// ==============================================
(function() {
  'use strict';

  // ==============================================
  // FUNCIONES DE RENDERIZADO (PUEDEN SER VISTAS)
  // ==============================================
  window.renderPublicScreen = function() {
    return `
      <div class="public-screen" style="background: linear-gradient(135deg, #2c3e50 0%, #8B4513 100%); min-height: 100vh; color: white;">
        <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
          <button onclick="navigateTo('login')" style="background: #D2691E; color: white; border: 2px solid #FFD700; padding: 12px 28px; border-radius: 50px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
            INICIAR SESIÓN
          </button>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
          <div style="font-size: 80px; margin-bottom: 20px;">🐓🏆</div>
          <h1 style="font-size: 48px; font-weight: 900; margin-bottom: 16px;">LEGADO AVÍCOLA</h1>
          <p style="font-size: 18px; color: #FFD700;">Contenido en construcción</p>
        </div>
      </div>
    `;
  };

  window.renderLoginScreen = function() {
    return `
      <div class="login-screen">
        <div class="login-container">
          <div class="login-logo">
            <h1 style="color: #8B4513;">LEGADO AVÍCOLA</h1>
            <p>Conéctate con el mundo digital</p>
          </div>
          <div class="login-tabs" style="display:flex;margin-bottom:20px;border-bottom:2px solid #e4e6eb;">
            <button class="login-tab active" onclick="showLoginForm()" style="flex:1;padding:12px;background:none;border:none;font-weight:600;color:#8B4513;border-bottom:2px solid #8B4513;cursor:pointer;">
              Iniciar Sesión
            </button>
            <button class="login-tab" onclick="showRegisterForm()" style="flex:1;padding:12px;background:none;border:none;font-weight:600;color:#65676b;cursor:pointer;">
              Registrarse
            </button>
          </div>
          <div id="loginForm">${renderLoginForm()}</div>
          <div id="registerForm" class="hidden">${renderRegisterForm()}</div>
        </div>
      </div>
    `;
  };

  window.renderLoginForm = function() {
    return `
      <div class="login-form">
        <div class="input-group">
          <input type="email" id="loginPhone" placeholder="Correo electrónico" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <div class="input-group">
          <input type="password" id="loginPassword" placeholder="Contraseña" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <button class="btn-primary" onclick="handleLogin()" style="width:100%;padding:14px;background:#8B4513;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;">ACCEDER</button>
        <div style="margin-top:12px;text-align:center;">
          <a href="#" onclick="resetPassword()" style="color:#8B4513;font-size:14px;text-decoration:none;">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    `;
  };

  window.renderRegisterForm = function() {
    return `
      <div class="login-form" style="gap:12px;">
        <div class="input-group2">
          <input type="text" id="registerFullName" placeholder="Nombre completo *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <div class="input-group2">
          <input type="email" id="registerRealEmail" placeholder="📧 Correo electronico *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <div class="input-group">
          <input type="text" id="registerPartyName" placeholder="Partido (opcional)" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <div class="input-group">
          <input type="text" id="registerRepresentative" placeholder="Representante/Criadero (opcional)" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        </div>
        <div class="input-group">
          <select id="registerMunicipio" onchange="updatePhonePrefix()" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;">
            <option value="">Selecciona tu municipio (Opcional)</option>
            ${municipiosChiapas.map(m => `<option value="${m.nombre}" data-prefijo="${m.prefijo}">${m.nombre}</option>`).join('')}
            <option value="otro">Otro (especificar)</option>
          </select>
          <div id="customMunicipioContainer" style="display:none;margin-top:8px;">
            <input type="text" id="registerCustomMunicipio" placeholder="Escribe tu ubicación" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:6px;" />
          </div>
        </div>
        <div class="input-group">
          <div style="display:flex;gap:8px;">
            <div style="flex:1;max-width:100px;">
              <input type="text" id="registerPhonePrefix" value="+52 961" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:8px;text-align:center;" />
            </div>
            <div style="flex:2;">
              <input type="tel" id="registerPhone" placeholder="Últimos 7 dígitos" maxlength="7" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:8px;" oninput="this.value = this.value.replace(/\D/g,'').slice(0,7)" />
            </div>
          </div>
        </div>
        <div class="input-group2" style="position:relative;">
          <input type="password" id="registerPassword" placeholder="Contraseña *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
          <button type="button" onclick="togglePasswordVisibility('registerPassword', this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;">👁️</button>
        </div>
        <div class="input-group2" style="position:relative;">
          <input type="password" id="registerConfirmPassword" placeholder="Confirmar contraseña *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
          <button type="button" onclick="togglePasswordVisibility('registerConfirmPassword', this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;">👁️</button>
        </div>
        <button class="btn-primary" onclick="handleCompleteRegister()" id="registerSubmitBtn" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Crear cuenta</button>
        <div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:10px;">
          <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;">
            <input type="checkbox" id="registerTerms" required style="margin-top:4px;width:20px;height:20px;" />
            <div style="flex:1;font-size:13px;color:#65676b;">
              Acepto los <a href="#" onclick="openTermsModal()">Términos</a> y <a href="#" onclick="openPrivacyModal()">Privacidad</a>
            </div>
          </label>
        </div>
      </div>
    `;
  };

  window.renderActivationPendingScreen = function() {
    const profile = AppState.user.profile;
    return `
      <div class="login-screen" style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);">
        <div class="login-container" style="text-align: center; max-width: 500px;">
          <div class="login-logo">
            <div style="font-size: 60px; color: white; margin-bottom: 20px;">⏳</div>
            <h1 style="color: white;">Cuenta en revisión</h1>
          </div>
          <div style="background: white; border-radius: 16px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f0f8ff; border-radius: 12px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                ${getInitials(profile?.displayName || 'U')}
              </div>
              <div style="flex:1;text-align:left;">
                <div style="font-size:18px;font-weight:700;">${profile?.displayName || 'Usuario'}</div>
                <div style="font-size:14px;color:#65676b;">📱 ${profile?.phone || 'Sin teléfono'}</div>
              </div>
            </div>
            <div style="background:#fff8e1;border-radius:12px;padding:16px;margin-bottom:24px;">
              <p>Tu cuenta está INACTIVA hasta que un administrador verifique tu información.</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
              <button onclick="checkActivationStatus()" style="background:#8B4513;color:white;padding:14px;border:none;border-radius:8px;cursor:pointer;">Verificar estado</button>
              <button onclick="handleLogout()" style="background:#f0f2f5;padding:14px;border:none;border-radius:8px;cursor:pointer;">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  window.renderMobileNavBar = function() {
    const profile = AppState.user.profile;
    if (!profile) return '';
    
    const items = [];
    items.push({ id: 'rooster', icon: '🏆', label: 'Torneos' });
    if (profile.publicaciones) items.push({ id: 'publicaciones', icon: '📱', label: 'Publicaciones' });
    if (profile.pedigri) items.push({ id: 'pedigri', icon: '🧬', label: 'Pedigrí' });

    return `
      <nav id="main-top-nav" class="top-nav" style="position:fixed;top:0;left:0;right:0;height:70px;background:white;box-shadow:0 2px 20px rgba(0,0,0,0.1);display:flex;justify-content:space-between;align-items:center;padding:0 16px;z-index:1000;transition:transform 0.3s ease;">
        <div style="display: flex; gap: 2px; align-items: center;">
          ${items.map(item => `
            <button onclick="navigateTo('${item.id}')" style="background:transparent;border:none;display:flex;flex-direction:column;align-items:center;padding:4px 8px;color:${AppState.ui.currentScreen === item.id ? '#8B4513' : '#666'};font-size:12px;cursor:pointer;">
              <span style="font-size:20px;">${item.icon}</span>
              <span>${item.label}</span>
            </button>
          `).join('')}
        </div>
        <button onclick="toggleSideMenu()" style="background:transparent;border:none;cursor:pointer;padding:8px;display:flex;flex-direction:column;gap:5px;">
          <span style="width:25px;height:3px;background:#8B4513;border-radius:3px;"></span>
          <span style="width:25px;height:3px;background:#8B4513;border-radius:3px;"></span>
          <span style="width:25px;height:3px;background:#8B4513;border-radius:3px;"></span>
        </button>
      </nav>
    `;
  };

  window.renderRoosterScreen = function() {
    const profile = AppState.user.profile;
    return `
      <div class="rooster-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:60px;margin-bottom:20px;color:#8B4513;">🏆</div>
            <h2 style="color:#8B4513;">SECCIÓN TORNEOS</h2>
            <p style="color:#666;">Bienvenido ${profile?.displayName || 'Usuario'}</p>
          </div>
        </div>
      </div>
    `;
  };

  window.renderPublicacionesScreen = function() {
    return `
      <div class="publicaciones-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:60px;margin-bottom:20px;color:#8B4513;">📱</div>
            <h2 style="color:#8B4513;">PUBLICACIONES</h2>
          </div>
        </div>
      </div>
    `;
  };

  window.renderPedigriScreen = function() {
    return `
      <div class="pedigri-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:60px;margin-bottom:20px;color:#8B4513;">🧬</div>
            <h2 style="color:#8B4513;">PEDIGRÍ</h2>
          </div>
        </div>
      </div>
    `;
  };

  window.renderPerfilScreen = function() {
    const profile = AppState.user.profile;
    return `
      <div class="perfil-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#8B4513,#D2691E);display:flex;align-items:center;justify-content:center;color:white;font-size:40px;margin-bottom:20px;">
              ${getInitials(profile?.displayName || 'U')}
            </div>
            <h2 style="color:#8B4513;">${profile?.displayName || 'Usuario'}</h2>
          </div>
        </div>
      </div>
    `;
  };

  window.renderConfiguracionesScreen = function() {
    return `
      <div class="configuraciones-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:60px;margin-bottom:20px;color:#8B4513;">⚙️</div>
            <h2 style="color:#8B4513;">CONFIGURACIONES</h2>
          </div>
        </div>
      </div>
    `;
  };

  window.renderAdminPanel = async function() {
    const profile = AppState.user.profile;
    if (!profile?.gallo) {
      return `<div style="padding:40px;text-align:center;">Acceso denegado</div>`;
    }
    return `
      <div class="admin-screen">
        ${renderMobileNavBar()}
        <div class="main-content" style="background:#f5f5f5;min-height:100vh;padding:90px 20px 80px 20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="font-size:80px;margin-bottom:20px;color:#8B4513;">⚙️👑</div>
            <h2 style="color:#8B4513;">Panel de Administración</h2>
            <p>Bienvenido, ${profile.displayName}</p>
          </div>
        </div>
      </div>
    `;
  };

  // ==============================================
  // FUNCIONES AUXILIARES DE UI
  // ==============================================
  window.showLoginForm = function() {
    document.getElementById('loginForm')?.classList.remove('hidden');
    document.getElementById('registerForm')?.classList.add('hidden');
    document.querySelectorAll('.login-tab').forEach((t,i) => {
      t.classList.toggle('active', i===0);
      t.style.color = i===0 ? '#8B4513' : '#65676b';
      t.style.borderBottom = i===0 ? '2px solid #8B4513' : '2px solid transparent';
    });
  };

  window.showRegisterForm = function() {
    document.getElementById('loginForm')?.classList.add('hidden');
    document.getElementById('registerForm')?.classList.remove('hidden');
    document.querySelectorAll('.login-tab').forEach((t,i) => {
      t.classList.toggle('active', i===1);
      t.style.color = i===1 ? '#8B4513' : '#65676b';
      t.style.borderBottom = i===1 ? '2px solid #8B4513' : '2px solid transparent';
    });
  };

  window.updatePhonePrefix = function() {
    const select = document.getElementById('registerMunicipio');
    const prefix = document.getElementById('registerPhonePrefix');
    const custom = document.getElementById('customMunicipioContainer');
    if (!select || !prefix) return;
    const opt = select.options[select.selectedIndex];
    if (opt.value === 'otro') { 
      custom.style.display = 'block'; 
      prefix.value = '+52 961'; 
    } else { 
      custom.style.display = 'none'; 
      prefix.value = `+52 ${opt.getAttribute('data-prefijo') || '961'}`; 
    }
  };

  window.togglePasswordVisibility = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  };

  window.openAppInfoModal = function() { AppState.addNotification('Información de la App', 'info'); };
  window.openTermsModal = function() { AppState.addNotification('Términos de Servicio', 'info'); };
  window.openPrivacyModal = function() { AppState.addNotification('Política de Privacidad', 'info'); };
  window.copyRoosterUrl = function() {
    const url = window.location.origin + window.location.pathname + '?section=rooster';
    navigator.clipboard.writeText(url).then(() => AppState.addNotification('✅ Enlace copiado', 'success'));
  };
  window.shareRoosterSection = function() {
    const url = window.location.origin + window.location.pathname + '?section=rooster';
    if (navigator.share) navigator.share({ title: 'Legado Avícola', url: url });
    else window.copyRoosterUrl();
  };

  // ==============================================
  // RENDERIZADOR PRINCIPAL
  // ==============================================
  window.renderApp = async function() {
    const app = document.getElementById('social-app');
    if (!app) return;

    const isFirebaseEnabled = AppState.firebase.isEnabled;
    const user = AppState.user.current;
    const profile = AppState.user.profile;
    const screen = AppState.ui.currentScreen;

    let html = '';

    if (!isFirebaseEnabled) {
      html = renderPublicScreen();
    } else if (!user) {
      html = screen === 'login' ? renderLoginScreen() : renderPublicScreen();
    } else {
      switch (screen) {
        case 'activation_pending': html = renderActivationPendingScreen(); break;
        case 'rooster': html = renderRoosterScreen(); break;
        case 'publicaciones': html = renderPublicacionesScreen(); break;
        case 'pedigri': html = renderPedigriScreen(); break;
        case 'perfil': html = renderPerfilScreen(); break;
        case 'configuraciones': html = renderConfiguracionesScreen(); break;
        case 'admin': html = await renderAdminPanel(); break;
        default: html = renderRoosterScreen();
      }
    }

    app.innerHTML = html;
    
    if (user) {
      setTimeout(initScrollListener, 100);
      updateSideMenuContent();
    }
    
    AppState.setLoading(false);
  };

  // ==============================================
  // MUNICIPIOS (datos estáticos)
  // ==============================================
  window.municipiosChiapas = [
    { id: 1, nombre: "Acacoyagua", prefijo: "919" }, { id: 2, nombre: "Acala", prefijo: "961" },
    { id: 3, nombre: "Acapetahua", prefijo: "918" }, { id: 4, nombre: "Aldama", prefijo: "919" },
    { id: 5, nombre: "Altamirano", prefijo: "919" }, { id: 6, nombre: "Amatán", prefijo: "932" },
    { id: 7, nombre: "Amatenango de la Frontera", prefijo: "963" }, { id: 8, nombre: "Amatenango del Valle", prefijo: "992" },
    { id: 9, nombre: "Angel Albino Corzo", prefijo: "992" }, { id: 10, nombre: "Arriaga", prefijo: "966" },
    { id: 11, nombre: "Bejucal de Ocampo", prefijo: "919" }, { id: 12, nombre: "Bella Vista", prefijo: "963" },
    { id: 13, nombre: "Benemérito de las Américas", prefijo: "934" }, { id: 14, nombre: "Berriozábal", prefijo: "961" },
    { id: 15, nombre: "Bochil", prefijo: "919" }, { id: 16, nombre: "El Bosque", prefijo: "919" },
    { id: 17, nombre: "Cacahoatán", prefijo: "962" }, { id: 18, nombre: "Catazajá", prefijo: "916" },
    { id: 19, nombre: "Cintalapa", prefijo: "968" }, { id: 20, nombre: "Coapilla", prefijo: "919" },
    { id: 21, nombre: "Comitán de Domínguez", prefijo: "963" }, { id: 22, nombre: "La Concordia", prefijo: "992" },
    { id: 23, nombre: "Copainalá", prefijo: "968" }, { id: 24, nombre: "Chalchihuitán", prefijo: "919" },
    { id: 25, nombre: "Chamula", prefijo: "967" }, { id: 26, nombre: "Chanal", prefijo: "963" },
    { id: 27, nombre: "Chapultenango", prefijo: "932" }, { id: 28, nombre: "Chenalhó", prefijo: "919" },
    { id: 29, nombre: "Chiapa de Corzo", prefijo: "961" }, { id: 30, nombre: "Chiapilla", prefijo: "961" },
    { id: 31, nombre: "Chicoasén", prefijo: "961" }, { id: 32, nombre: "Chicomuselo", prefijo: "963" },
    { id: 33, nombre: "Chilón", prefijo: "919" }, { id: 34, nombre: "Coyutla", prefijo: "932" },
    { id: 35, nombre: "Dominguez", prefijo: "963" }, { id: 36, nombre: "Escuintla", prefijo: "918" },
    { id: 37, nombre: "Francisco León", prefijo: "932" }, { id: 38, nombre: "Frontera Comalapa", prefijo: "963" },
    { id: 39, nombre: "Frontera Hidalgo", prefijo: "962" }, { id: 40, nombre: "La Grandeza", prefijo: "919" },
    { id: 41, nombre: "Huehuetán", prefijo: "962" }, { id: 42, nombre: "Huixtán", prefijo: "967" },
    { id: 43, nombre: "Huitiupán", prefijo: "932" }, { id: 44, nombre: "Huixtla", prefijo: "962" },
    { id: 45, nombre: "La Independencia", prefijo: "963" }, { id: 46, nombre: "Ixhuatán", prefijo: "932" },
    { id: 47, nombre: "Ixtacomitán", prefijo: "932" }, { id: 48, nombre: "Ixtapa", prefijo: "961" },
    { id: 49, nombre: "Ixtapangajoya", prefijo: "932" }, { id: 50, nombre: "Jiquipilas", prefijo: "968" },
    { id: 51, nombre: "Jitotol", prefijo: "919" }, { id: 52, nombre: "Juárez", prefijo: "932" },
    { id: 53, nombre: "Larráinzar", prefijo: "967" }, { id: 54, nombre: "La Libertad", prefijo: "934" },
    { id: 55, nombre: "Mapastepec", prefijo: "918" }, { id: 56, nombre: "Las Margaritas", prefijo: "963" },
    { id: 57, nombre: "Mazapa de Madero", prefijo: "963" }, { id: 58, nombre: "Mazatán", prefijo: "962" },
    { id: 59, nombre: "Metapa", prefijo: "962" }, { id: 60, nombre: "Mitontic", prefijo: "967" },
    { id: 61, nombre: "Motozintla", prefijo: "963" }, { id: 62, nombre: "Nicolás Ruíz", prefijo: "961" },
    { id: 63, nombre: "Ocosingo", prefijo: "919" }, { id: 64, nombre: "Ocotepec", prefijo: "919" },
    { id: 65, nombre: "Ocozocoautla de Espinosa", prefijo: "968" }, { id: 66, nombre: "Ostuacán", prefijo: "932" },
    { id: 67, nombre: "Osumacinta", prefijo: "961" }, { id: 68, nombre: "Oxchuc", prefijo: "967" },
    { id: 69, nombre: "Palenque", prefijo: "916" }, { id: 70, nombre: "Pantelhó", prefijo: "919" },
    { id: 71, nombre: "Pantepec", prefijo: "932" }, { id: 72, nombre: "Pichucalco", prefijo: "932" },
    { id: 73, nombre: "Pijijiapan", prefijo: "918" }, { id: 74, nombre: "El Porvenir", prefijo: "963" },
    { id: 75, nombre: "Pueblo Nuevo Solistahuacán", prefijo: "932" }, { id: 76, nombre: "Rayón", prefijo: "919" },
    { id: 77, nombre: "Reforma", prefijo: "916" }, { id: 78, nombre: "Las Rosas", prefijo: "992" },
    { id: 79, nombre: "Sabanilla", prefijo: "919" }, { id: 80, nombre: "Salto de Agua", prefijo: "916" },
    { id: 81, nombre: "San Andrés Duraznal", prefijo: "919" }, { id: 82, nombre: "San Cristóbal de las Casas", prefijo: "967" },
    { id: 83, nombre: "San Fernando", prefijo: "961" }, { id: 84, nombre: "San Juan Cancuc", prefijo: "919" },
    { id: 85, nombre: "San Lucas", prefijo: "992" }, { id: 86, nombre: "Santiago el Pinar", prefijo: "919" },
    { id: 87, nombre: "Siltepec", prefijo: "963" }, { id: 88, nombre: "Simojovel", prefijo: "932" },
    { id: 89, nombre: "Sitalá", prefijo: "919" }, { id: 90, nombre: "Socoltenango", prefijo: "992" },
    { id: 91, nombre: "Solosuchiapa", prefijo: "932" }, { id: 92, nombre: "Soyaló", prefijo: "961" },
    { id: 93, nombre: "Suchiapa", prefijo: "961" }, { id: 94, nombre: "Suchiate", prefijo: "962" },
    { id: 95, nombre: "Sunuapa", prefijo: "932" }, { id: 96, nombre: "Tapachula", prefijo: "962" },
    { id: 97, nombre: "Tapalapa", prefijo: "919" }, { id: 98, nombre: "Tapilula", prefijo: "932" },
    { id: 99, nombre: "Tecpatán", prefijo: "968" }, { id: 100, nombre: "Tenejapa", prefijo: "967" },
    { id: 101, nombre: "Teopisca", prefijo: "992" }, { id: 102, nombre: "Tila", prefijo: "919" },
    { id: 103, nombre: "Tonalá", prefijo: "966" }, { id: 104, nombre: "Totolapa", prefijo: "961" },
    { id: 105, nombre: "La Trinitaria", prefijo: "963" }, { id: 106, nombre: "Tumbalá", prefijo: "919" },
    { id: 107, nombre: "Tuxtla Gutiérrez", prefijo: "961" }, { id: 108, nombre: "Tuxtla Chico", prefijo: "962" },
    { id: 109, nombre: "Tuzantán", prefijo: "962" }, { id: 110, nombre: "Tzimol", prefijo: "963" },
    { id: 111, nombre: "Unión Juárez", prefijo: "962" }, { id: 112, nombre: "Venustiano Carranza", prefijo: "992" },
    { id: 113, nombre: "Villa Comaltitlán", prefijo: "918" }, { id: 114, nombre: "Villa Corzo", prefijo: "992" },
    { id: 115, nombre: "Villaflores", prefijo: "965" }, { id: 116, nombre: "Yajalón", prefijo: "919" },
    { id: 117, nombre: "Zinacantán", prefijo: "967" }
  ];

  console.log('✅ firebase-ui.js cargado correctamente');
})();
