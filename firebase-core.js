// ==============================================
// FIREBASE-CORE.JS - LÓGICA CRÍTICA DE SEGURIDAD
// ==============================================
(function() {
  'use strict';

  // ==============================================
  // STATE MANAGER (AppState) - CORAZÓN DE LA APP
  // ==============================================
  window.AppState = {
    firebase: { app: null, auth: null, database: null, isEnabled: false, isInitialized: false },
    user: { current: null, profile: null },
    ui: { currentScreen: 'public', pendingScreen: null, isLoading: true, notifications: [] },
    rooster: { cotejoState: false, listener: null, tournamentInfo: null, roosters: [] },
    _isNotifying: false,
    subscribers: [],

    setFirebase(firebaseInstance) {
      this.firebase.app = firebaseInstance;
      this.firebase.auth = firebase.auth();
      this.firebase.database = firebase.database();
      this.firebase.isEnabled = true;
      this.firebase.isInitialized = true;
      this.notify();
    },

    setUser(userData, profileData) {
      this.user.current = userData;
      this.user.profile = profileData;
      this.notify();
    },

    clearUser() {
      this.user.current = null;
      this.user.profile = null;
      this.ui.currentScreen = 'public';
      if (this.rooster.listener && this.firebase.database) {
        this.firebase.database.ref('system/cotejo').off('value', this.rooster.listener);
        this.rooster.listener = null;
      }
      this.notify();
    },

    setScreen(screen) {
      if (this.ui.currentScreen === screen) return;
      this.ui.currentScreen = screen;
      this.notify();
    },

    setLoading(loading) {
      if (this.ui.isLoading === loading) return;
      this.ui.isLoading = loading;
      this.notify();
    },

    setCotejoState(state) {
      if (this.rooster.cotejoState === state) return;
      this.rooster.cotejoState = state;
      this.notify();
    },

    addNotification(message, type = 'info', duration = 3000) {
      const id = Date.now() + Math.random();
      const container = document.getElementById('toast-container');
      if (container) {
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        toast.id = `toast-${id}`;
        container.appendChild(toast);
        setTimeout(() => {
          const toastToRemove = document.getElementById(`toast-${id}`);
          if (toastToRemove) setTimeout(() => toastToRemove.remove(), 300);
        }, duration);
      }
      this.ui.notifications.push({ id, message, type, duration });
      this.notify();
      setTimeout(() => {
        this.ui.notifications = this.ui.notifications.filter(n => n.id !== id);
        this.notify();
      }, duration);
    },

    subscribe(callback) { this.subscribers.push(callback); },
    
    notify() {
      if (this._isNotifying) return;
      this._isNotifying = true;
      try {
        this.subscribers.forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
      } finally { this._isNotifying = false; }
    }
  };

  // ==============================================
  // FUNCIONES CRÍTICAS DE AUTENTICACIÓN
  // ==============================================
  window.initializeFirebase = function() {
    if (AppState.firebase.isEnabled && AppState.firebase.app) return true;
    
    console.log("🔥 Inicializando Firebase...");
    if (!window.FIREBASE_CONFIG) {
      console.error("❌ No hay configuración de Firebase");
      return false;
    }

    try {
      const firebaseApp = firebase.initializeApp(window.FIREBASE_CONFIG);
      AppState.setFirebase(firebaseApp);
      setupAuthListener();
      return true;
    } catch (e) {
      console.error("❌ Error:", e);
      return false;
    }
  };

  window.setupAuthListener = function() {
    if (!AppState.firebase.auth) return;
    
    AppState.firebase.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await loadUserProfile(user.uid);
        const profile = AppState.user.profile;
        const pendingScreen = AppState.ui.pendingScreen;
        AppState.ui.pendingScreen = null;

        if (!profile?.activated) {
          AppState.setScreen('activation_pending');
        } else if (pendingScreen && canAccessSection(pendingScreen, profile)) {
          AppState.setScreen(pendingScreen);
        } else {
          AppState.setScreen('rooster');
        }
      } else {
        AppState.clearUser();
      }
      AppState.setLoading(false);
    });
  };

  window.loadUserProfile = async function(uid) {
    if (!AppState.firebase.database) return;
    try {
      const snapshot = await AppState.firebase.database.ref('users/' + uid).once('value');
      if (snapshot.exists()) {
        const profile = { id: uid, ...snapshot.val() };
        profile.activated = profile.activated || false;
        profile.gallo = profile.gallo || false;
        profile.isJudge = profile.isJudge || false;
        profile.publicaciones = profile.publicaciones || false;
        profile.pedigri = profile.pedigri || false;
        AppState.setUser(AppState.firebase.auth.currentUser, profile);
      } else {
        await AppState.firebase.auth.signOut();
        AppState.clearUser();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  window.handleLogin = async function() {
    const email = document.getElementById('loginPhone')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
      AppState.addNotification('Completa todos los campos', 'warning');
      return;
    }
    if (!AppState.firebase.auth) {
      AppState.addNotification('Error: Firebase no inicializado', 'error');
      return;
    }

    try {
      await AppState.firebase.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      handleFirebaseError(error, 'iniciar sesión');
    }
  };

  window.handleLogout = async function() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    if (sideMenu) sideMenu.style.right = '-350px';
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';

    try {
      await AppState.firebase.auth.signOut();
      AppState.clearUser();
    } catch (error) {
      handleFirebaseError(error, 'cerrar sesión');
    }
  };

  window.handleCompleteRegister = async function() {
    if (!AppState.firebase.isEnabled) {
      AppState.addNotification('Firebase no inicializado', 'error');
      return;
    }

    const fullName = document.getElementById('registerFullName')?.value.trim();
    const realEmail = document.getElementById('registerRealEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
    const termsAccepted = document.getElementById('registerTerms')?.checked;

    if (!fullName || !realEmail || !password || !confirmPassword || !termsAccepted) {
      AppState.addNotification('Completa todos los campos obligatorios', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      AppState.addNotification('Las contraseñas no coinciden', 'error');
      return;
    }

    const btn = document.getElementById('registerSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Registrando...'; }

    try {
      const userCredential = await AppState.firebase.auth.createUserWithEmailAndPassword(realEmail, password);
      const user = userCredential.user;
      await user.updateProfile({ displayName: fullName });

      await AppState.firebase.database.ref('users/' + user.uid).set({
        uid: user.uid, displayName: fullName, realEmail: realEmail,
        partyName: document.getElementById('registerPartyName')?.value.trim() || '',
        representative: document.getElementById('registerRepresentative')?.value.trim() || '',
        municipio: document.getElementById('registerMunicipio')?.value || '',
        phone: document.getElementById('registerPhone')?.value || '',
        devicesAllowed: 1, activeSessions: {}, photoURL: '', coverURL: '', bio: '',
        friends: [], showPhone: false, allowWhatsAppMessages: false,
        showLocation: true, showPartyName: true, showRepresentative: true,
        activated: false, accountStatus: 'miembro_nuevo', registeredAt: Date.now(),
        gallo: false, isJudge: false, publicaciones: false, pedigri: false
      });

      AppState.addNotification('✅ Cuenta creada', 'success');
      setTimeout(() => {
        AppState.setUser(user, { id: user.uid, displayName: fullName, activated: false });
        AppState.setScreen('activation_pending');
      }, 1500);
    } catch (error) {
      handleFirebaseError(error, 'registrar');
      if (btn) { btn.disabled = false; btn.textContent = 'Crear cuenta'; }
    }
  };

  window.checkActivationStatus = async function() {
    const user = AppState.user.current;
    if (!user || !AppState.firebase.database) return;
    try {
      const activated = await AppState.firebase.database.ref('users/' + user.uid + '/activated').once('value');
      if (activated.val() === true) {
        AppState.addNotification('✅ ¡Cuenta activada!', 'success');
        await loadUserProfile(user.uid);
        setTimeout(() => AppState.setScreen('rooster'), 1500);
      } else {
        AppState.addNotification('⏳ Cuenta pendiente de activación', 'warning');
      }
    } catch (error) {
      AppState.addNotification('Error al verificar', 'error');
    }
  };

  window.resetPassword = async function() {
    const email = document.getElementById('loginPhone')?.value.trim();
    if (!email) {
      AppState.addNotification('Ingresa tu correo', 'error');
      return;
    }
    try {
      await AppState.firebase.auth.sendPasswordResetEmail(email);
      AppState.addNotification(`✅ Correo enviado a: ${email}`, 'success');
    } catch (error) {
      handleFirebaseError(error, 'recuperar contraseña');
    }
  };

  // ==============================================
  // SISTEMA DE PERMISOS (CRÍTICO)
  // ==============================================
  window.canAccessSection = function(section, profile) {
    if (!profile) return false;
    const permissions = {
      'publicaciones': profile.publicaciones === true,
      'pedigri': profile.pedigri === true,
      'admin': profile.gallo === true,
      'rooster': true,
      'perfil': true,
      'configuraciones': true,
      'activation_pending': true
    };
    return permissions[section] || false;
  };

  window.navigateTo = function(section) {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    if (sideMenu) sideMenu.style.right = '-350px';
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';

    window.history.pushState({}, '', `/?section=${section}`);

    if (!AppState.firebase.isEnabled && section !== 'public') {
      AppState.ui.pendingScreen = section;
      initializeFirebase();
      return;
    }

    if (section === 'login') {
      if (!AppState.firebase.isEnabled) {
        AppState.ui.pendingScreen = 'login';
        initializeFirebase();
        return;
      }
      AppState.setScreen('login');
      return;
    }

    if (!AppState.user.current) {
      if (!AppState.firebase.isEnabled) {
        AppState.ui.pendingScreen = section;
        initializeFirebase();
        return;
      }
      AppState.setScreen('login');
      return;
    }

    if (section === 'admin' && !AppState.user.profile?.gallo) {
      AppState.addNotification('Acceso denegado', 'error');
      AppState.setScreen('rooster');
      return;
    }

    if (canAccessSection(section, AppState.user.profile)) {
      AppState.setScreen(section);
    } else {
      AppState.addNotification('No tienes permiso para esta sección', 'error');
      AppState.setScreen('rooster');
    }
  };

  // ==============================================
  // UTILIDADES DE SEGURIDAD
  // ==============================================
  window.handleFirebaseError = function(error, action) {
    console.error(`Error en ${action}:`, error);
    let message = `Error al ${action}.`;
    switch (error.code) {
      case 'auth/wrong-password': message = 'Contraseña incorrecta'; break;
      case 'auth/user-not-found': message = 'Usuario no encontrado'; break;
      case 'auth/email-already-in-use': message = 'Email ya registrado'; break;
      case 'auth/weak-password': message = 'Contraseña muy débil'; break;
      case 'auth/invalid-email': message = 'Email inválido'; break;
      case 'auth/network-request-failed': message = 'Error de red'; break;
      default: message = `Error: ${error.code || 'desconocido'}`;
    }
    AppState.addNotification(message, 'error');
  };

  window.generateCSRFToken = function(formName) {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    const token = Array.from(array, dec => ('0' + dec.toString(16)).substr(-8)).join('');
    sessionStorage.setItem(`csrf_${formName}`, token);
    sessionStorage.setItem(`csrf_${formName}_expiry`, Date.now() + 3600000);
    return token;
  };

  window.getInitials = function(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  // ==============================================
  // FUNCIONES DE UI (solo las críticas)
  // ==============================================
  window.toggleSideMenu = function() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    if (!menu || !overlay) return;
    const isOpen = window.getComputedStyle(menu).right === '0px';
    menu.style.right = isOpen ? '-350px' : '0px';
    overlay.style.display = isOpen ? 'none' : 'block';
    document.body.style.overflow = isOpen ? '' : 'hidden';
  };

  // Variables para scroll
  let lastScrollTop = 0;
  window.handleNavBarScroll = function() {
    const navBar = document.getElementById('main-top-nav');
    if (!navBar) return;
    const currentScroll = window.scrollY;
    if (currentScroll <= 0) {
      navBar.classList.remove('hidden');
      lastScrollTop = 0;
      return;
    }
    if (Math.abs(lastScrollTop - currentScroll) > 10) {
      if (currentScroll > lastScrollTop) navBar.classList.add('hidden');
      else navBar.classList.remove('hidden');
      lastScrollTop = currentScroll;
    }
  };

  window.initScrollListener = function() {
    window.removeEventListener('scroll', window.handleNavBarScroll);
    window.addEventListener('scroll', window.handleNavBarScroll, { passive: true });
    lastScrollTop = window.scrollY;
  };

  // ==============================================
  // ACTUALIZAR MENÚ LATERAL
  // ==============================================
  window.updateSideMenuContent = function() {
    const menuContent = document.getElementById('side-menu-content');
    const profile = AppState.user.profile;
    if (!menuContent || !profile) return;

    const isAdmin = profile.gallo === true;
    const currentScreen = AppState.ui.currentScreen;

    menuContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${getInitials(profile.displayName || 'U')}
          </div>
          <div>
            <div style="font-weight: 700; color: #333;">${profile.displayName || 'Usuario'}</div>
            <div style="font-size: 12px; color: #666;">${isAdmin ? '👑 Admin' : '👤 Miembro'}</div>
          </div>
        </div>
        <button onclick="toggleSideMenu()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">✕</button>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
        <button onclick="navigateTo('perfil')" style="display: flex; align-items: center; gap: 16px; padding: 14px; background: ${currentScreen === 'perfil' ? '#f0f0f0' : 'none'}; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
          <span style="font-size: 20px;">👤</span> <span>Mi Perfil</span>
        </button>
        <button onclick="navigateTo('configuraciones')" style="display: flex; align-items: center; gap: 16px; padding: 14px; background: ${currentScreen === 'configuraciones' ? '#f0f0f0' : 'none'}; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
          <span style="font-size: 20px;">⚙️</span> <span>Configuraciones</span>
        </button>
        ${isAdmin ? `
        <button onclick="navigateTo('admin')" style="display: flex; align-items: center; gap: 16px; padding: 14px; background: ${currentScreen === 'admin' ? '#f0f0f0' : 'none'}; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left;">
          <span style="font-size: 20px;">🔧</span> <span>Panel Admin</span>
        </button>
        ` : ''}
        <div style="height: 1px; background: #eee; margin: 16px 0;"></div>
        <button onclick="handleLogout()" style="display: flex; align-items: center; gap: 16px; padding: 14px; background: none; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left; color: #d32f2f;">
          <span style="font-size: 20px;">🚪</span> <span>Cerrar Sesión</span>
        </button>
      </div>
    `;
  };

  console.log('✅ firebase-core.js cargado correctamente');
})();
