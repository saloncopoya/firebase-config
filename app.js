
// ==============================================
// FIREBASE CONFIG - CARGADA DESDE GITHUB
// ==============================================
// Esperamos a que se cargue la configuración externa
const firebaseConfig = window.FIREBASE_CONFIG || null;

if (!firebaseConfig) {
  console.error('❌ No se pudo cargar la configuración de Firebase desde GitHub');
}

// ==============================================
// STATE MANAGER (Patrón Store) - VERSIÓN CORREGIDA
// ==============================================
const AppState = {
  // --- Estado ---
  firebase: {
    app: null,
    auth: null,
    database: null,
    isEnabled: false,
    isInitialized: false,
  },
  user: {
    current: null,          // Firebase User
    profile: null,          // Datos de /users/{uid}
  },
  ui: {
    currentScreen: 'public',
    pendingScreen: null,     // <-- SOLO AGREGAS ESTA LÍNEA
    isLoading: true,
    notifications: [],
  },
  rooster: {
    cotejoState: false,
    listener: null,
    tournamentInfo: null,
    roosters: [],
  },

  // --- BANDERA PARA EVITAR RECURSIÓN ---
  _isNotifying: false,

  // --- Métodos para modificar el estado (solo estos pueden hacerlo) ---
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
    // Limpiar listeners
    if (this.rooster.listener && this.firebase.database) {
      this.firebase.database.ref('system/cotejo').off('value', this.rooster.listener);
      this.rooster.listener = null;
    }
    this.notify();
  },

  setScreen(screen) {
    // Evitar notificar si no hay cambio real
    if (this.ui.currentScreen === screen) return;
    this.ui.currentScreen = screen;
    this.notify();
  },

  setLoading(loading) {
    // Evitar notificar si no hay cambio real
    if (this.ui.isLoading === loading) return;
    this.ui.isLoading = loading;
    this.notify();
  },

  setCotejoState(state) {
    if (this.rooster.cotejoState === state) return;
    this.rooster.cotejoState = state;
    this.notify();
  },

 
 
   // ==============================================
// SISTEMA DE NOTIFICACIONES MEJORADO (Toast)
// ==============================================
addNotification(message, type = 'info', duration = 3000) {
  const id = Date.now() + Math.random();
  
  // --- Lógica DOM para mostrar el toast ---
  const container = document.getElementById('toast-container');
  if (container) {
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.id = `toast-${id}`;
    container.appendChild(toast);

    // Programar la desaparición
    setTimeout(() => {
      const toastToRemove = document.getElementById(`toast-${id}`);
      if (toastToRemove) {
        // Añadir clase de salida para animación (opcional, ya la tiene en el CSS)
        // toastToRemove.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
          if(toastToRemove.parentNode) toastToRemove.remove();
        }, 300); // Esperar a que termine fadeOut
      }
    }, duration);
  }
  
  // --- Lógica del estado (para mantener la cola) ---
  this.ui.notifications.push({ id, message, type, duration });
  this.notify(); // Notificar a los suscriptores por si alguno necesita la cola
  
  // Limpiar de la cola después de la duración
  setTimeout(() => {
    this.ui.notifications = this.ui.notifications.filter(n => n.id !== id);
    this.notify();
  }, duration);
},

  // Método para suscribir la UI
  subscribers: [],
  subscribe(callback) {
    this.subscribers.push(callback);
  },
  
  notify() {
    // 🚨 EVITAR RECURSIÓN INFINITA
    if (this._isNotifying) return;
    
    this._isNotifying = true;
    try {
      this.subscribers.forEach(callback => {
        try {
          callback();
        } catch (e) {
          console.error("Error en callback de suscriptor:", e);
        }
      });
    } finally {
      this._isNotifying = false;
    }
  }
};

// Hacemos el store globalmente accesible
// Hacemos el store globalmente accesible
window.AppState = AppState;
window.handleLoginClick = function() {
  if (typeof navigateTo === 'function') {
    navigateTo('login');
  } else {
    console.log("Esperando a que cargue...");
    setTimeout(() => {
      if (typeof navigateTo === 'function') {
        navigateTo('login');
      } else {
        window.location.href = '/?section=login';
      }
    }, 500);
  }
};
// ==============================================
// FUNCIÓN DE NAVEGACIÓN (DEFINIDA TEMPRANO)
// ==============================================


// ==============================================
// FUNCIÓN DE NAVEGACIÓN (DEFINIDA TEMPRANO) - VERSIÓN CORREGIDA
// ==============================================
window.navigateTo = function(section) {
  console.log("🚦 Navegando a:", section, "Firebase habilitado:", AppState.firebase.isEnabled, "Usuario:", AppState.user.current ? "si" : "no");

  // Actualizar URL
  window.history.pushState({}, '', `/?section=${section}`);
  
  // CASO 1: Si es login
  if (section === 'login') {
    // Si ya estamos en login, no hacer nada
    if (AppState.ui.currentScreen === 'login') {
      return;
    }
    
    // Si Firebase NO está inicializado
    if (!AppState.firebase.isEnabled) {
      console.log("📱 Inicializando Firebase para login...");
      showLoadingScreen('Preparando inicio de sesión...', 10);
      AppState.ui.pendingScreen = 'login'; // Guardamos que quiere login
      initializeFirebase();
      return;
    }
    
    // Si Firebase ya está inicializado, mostrar login directamente
    AppState.setScreen('login');
    return;
  }
  
  // CASO 2: Para CUALQUIER otra sección (rooster, perfil, admin, etc)
  // Si NO hay usuario logueado, redirigir a login
  if (!AppState.user.current) {
    console.log("🔒 Acceso denegado - No hay usuario. Redirigiendo a login");
    
    // Si Firebase no está inicializado, lo inicializamos y guardamos la sección que quería
    if (!AppState.firebase.isEnabled) {
      console.log("📱 Inicializando Firebase por acceso a sección protegida");
      showLoadingScreen('Verificando acceso...', 10);
      AppState.ui.pendingScreen = section; // Guardamos la sección que quería (rooster, perfil, etc)
      initializeFirebase();
      return;
    }
    
    // Si Firebase ya está inicializado pero no hay usuario, vamos a login
    AppState.setScreen('login');
    return;
  }
  
  // CASO 3: Usuario logueado y Firebase activo - navegación normal
  console.log("✅ Usuario logueado, navegando a:", section);
  AppState.setScreen(section);
}


// ==============================================
// NUEVA FUNCIÓN: INICIALIZAR FIREBASE (USA APPSTATE)
// ==============================================
// ==============================================
// INICIALIZAR FIREBASE (MEJORADO)
// ==============================================

function initializeFirebase() {
  // Evitar inicializar múltiples veces
  if (AppState.firebase.isEnabled && AppState.firebase.app) {
    console.log("Firebase ya estaba inicializado");
    return true;
  }
  
  console.log("🔥 Inicializando Firebase por primera vez...");
  updateLoadingProgress(25, 'Conectando con servidores...');

  try {
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    AppState.setFirebase(firebaseApp);
    
    updateLoadingProgress(60, 'Verificando autenticación...');
    setupAuthListener();
    
    console.log("✅ Firebase inicializado");
    return true;
  } catch (e) {
    console.error("❌ Error al iniciar Firebase:", e);
    handleFirebaseError(e, 'inicializar la conexión');
    
    // IMPORTANTE: Ocultar pantalla de carga si hay error
    hideLoadingScreen();
    return false;
  }
}

// ==============================================
// NUEVA FUNCIÓN: LISTENER DE AUTENTICACIÓN (USA APPSTATE)
// ==============================================
// ==============================================
// NUEVA FUNCIÓN: LISTENER DE AUTENTICACIÓN (USA APPSTATE) - VERSIÓN CORREGIDA
// ==============================================
function setupAuthListener() {
  if (!AppState.firebase.auth) {
    console.error("❌ Auth no disponible en AppState");
    hideLoadingScreen();
    return;
  }

  console.log("👂 Configurando listener de autenticación...");
  
  AppState.firebase.auth.onAuthStateChanged(async (user) => {
    console.log("🔄 Cambio en autenticación:", user ? `Usuario ${user.uid}` : "No usuario");
    console.log("📌 Pantalla pendiente:", AppState.ui.pendingScreen);
    
    if (user) {
      // USUARIO LOGUEADO
      updateLoadingProgress(80, 'Cargando perfil...');
      await loadUserProfile(user.uid);
      const profile = AppState.user.profile;
      
      // Verificar si hay una pantalla pendiente (la que quería visitar antes de loguearse)
      const pantallaPendiente = AppState.ui.pendingScreen;
      AppState.ui.pendingScreen = null; // Limpiar después de leer
      
      if (!profile?.activated) {
        console.log("⏳ Usuario no activado");
        AppState.setScreen('activation_pending');
        window.history.pushState({}, '', '/?section=activation_pending');
      } 
      else if (pantallaPendiente && ['rooster', 'perfil', 'admin'].includes(pantallaPendiente)) {
        // Si quería ir a alguna sección específica, lo mandamos ahí
        console.log(`👉 Usuario quería ir a ${pantallaPendiente}, redirigiendo...`);
        AppState.setScreen(pantallaPendiente);
        window.history.pushState({}, '', `/?section=${pantallaPendiente}`);
      }
      else {
        // Si no, vamos a rooster por defecto
        console.log("✅ Usuario activado, yendo a rooster");
        AppState.setScreen('rooster');
        window.history.pushState({}, '', '/?section=rooster');
      }
      
      setTimeout(() => {
        hideLoadingScreen();
      }, 500);
      
    } else {
      // USUARIO NO LOGUEADO
      console.log("👤 Usuario no logueado");
      AppState.clearUser(); // Esto pone currentScreen a 'public'
      
      // Verificar si hay una pantalla pendiente
      const pantallaPendiente = AppState.ui.pendingScreen;
      AppState.ui.pendingScreen = null; // Limpiar después de leer
      
      if (pantallaPendiente) {
        // Si quería ir a alguna sección pero no está logueado, lo mandamos a login
        console.log(`👉 Usuario quería ir a ${pantallaPendiente} pero no está logueado. A login.`);
        AppState.setScreen('login');
        window.history.pushState({}, '', '/?section=login');
      } else {
        // Si no hay pantalla pendiente, vamos a pública
        console.log("🏠 Usuario no logueado sin destino, yendo a pantalla pública");
        window.history.pushState({}, '', '/');
      }
      
      hideLoadingScreen();
    }
    
    AppState.setLoading(false);
  });
}
// ==============================================
// NUEVA FUNCIÓN: VERIFICAR CARGA (USA APPSTATE)
// ==============================================

function checkIfEverythingLoaded() {
  console.log("⏳ Verificando carga de componentes...");
  
  // SIMULAR PROGRESO DE CARGA MIENTRAS ESPERAMOS
  let progress = 10;
  const interval = setInterval(() => {
    if (progress < 90 && AppState.ui.isLoading) {
      progress += 5;
      updateLoadingProgress(progress, 'Cargando componentes...');
    }
  }, 200);
  
  const checkInterval = setInterval(() => {
    if (!AppState.ui.isLoading) {
      console.log("✅ Todo cargado - Ocultando pantalla de carga");
      
      updateLoadingProgress(100, '¡Listo!');
      
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const socialApp = document.getElementById('social-app');
        
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          setTimeout(() => {
            loadingScreen.style.display = 'none';
            if (socialApp) socialApp.style.display = 'block';
          }, 500);
        }
      }, 300);
      
      clearInterval(checkInterval);
      clearInterval(interval);
    }
  }, 200);
  
  setTimeout(() => {
    if (AppState.ui.isLoading) {
      console.warn("⚠️ Timeout de carga - Forzando ocultar pantalla");
      AppState.setLoading(false);
    }
  }, 8000);
}

// ==============================================
// VERIFICAR/REEMPLAZAR loadUserProfile
// ==============================================
// ==============================================
// LOAD USER PROFILE - VERSIÓN MEJORADA CON PERMISOS
// ==============================================
async function loadUserProfile(uid) {
  if (!AppState.firebase.database) {
    console.error("❌ Database no disponible");
    return;
  }
  
  try {
    console.log(`📥 Cargando perfil de usuario: ${uid}`);
    const snapshot = await AppState.firebase.database.ref('users/' + uid).once('value');
    
    if (snapshot.exists()) {
      const profile = { id: uid, ...snapshot.val() };
      
      // Asegurar valores por defecto
      if (profile.activated === undefined) profile.activated = false;
      if (profile.gallo === undefined) profile.gallo = false;
      if (profile.isJudge === undefined) profile.isJudge = false;
      
      // ========== NUEVO: PERMISOS DE MENÚ ==========
      // Leer desde Firebase si existen, si no, false por defecto
      if (profile.publicaciones === undefined) profile.publicaciones = false;
      if (profile.pedigri === undefined) profile.pedigri = false;
      // =============================================
      
      console.log("✅ Perfil cargado:", profile.displayName, {
        publicaciones: profile.publicaciones,
        pedigri: profile.pedigri,
        gallo: profile.gallo
      });
      
      // Actualizar AppState
      AppState.setUser(AppState.firebase.auth.currentUser, profile);
    } else {
      console.warn("⚠️ Perfil no encontrado en BD");
      await AppState.firebase.auth.signOut();
      AppState.clearUser();
    }
  } catch (error) {
    console.error("❌ Error cargando perfil:", error);
    AppState.addNotification('Error cargando perfil', 'error');
  }
}

// ==============================================
// PROTECCIONES DE SEGURIDAD
// ==============================================
(function() {
  if (window.location.hostname !== 'localhost') {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
  }
  Object.freeze(Object.prototype);
  Object.freeze(Array.prototype);
  Object.freeze(Function.prototype);
  window.addEventListener('message', function(event) {
    const allowedOrigins = [window.location.origin, 'https://firebaseio.com'];
    if (!allowedOrigins.some(origin => event.origin.includes(origin))) return;
    if (typeof event.data !== 'object' || event.data === null || Array.isArray(event.data)) return;
  });
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (typeof value === 'string' && value.length > 5000) throw new Error('Dato demasiado grande');
    const sensitiveKeys = ['password', 'token', 'secret', 'credit', 'card'];
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) throw new Error('No se permite almacenar datos sensibles');
    return originalSetItem.call(this, key, value);
  };
})();

// ==============================================
// VALIDACIONES
// ==============================================
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ==============================================
// LOGIN (SOLO DISPONIBLE SI FIREBASE ESTÁ ACTIVADO)
// ==============================================
// ==============================================
// LOGIN MEJORADO CON FEEDBACK EN BOTÓN
// ==============================================
async function handleLogin() {
  const email = document.getElementById('loginPhone')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const loginBtn = document.querySelector('#loginForm .btn-primary');

  if (!email || !password) {
    AppState.addNotification('Completa todos los campos', 'warning');
    return;
  }

  // VALIDAR QUE FIREBASE ESTÉ INICIALIZADO
  if (!AppState.firebase.isEnabled || !AppState.firebase.auth) {
    AppState.addNotification('Error: Firebase no inicializado', 'error');
    return;
  }

  // MOSTRAR PANTALLA DE CARGA
  showLoadingScreen('Iniciando sesión...', 30);
  
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = 'INICIANDO...';
  }

  try {
    updateLoadingProgress(50, 'Verificando credenciales...');
    await AppState.firebase.auth.signInWithEmailAndPassword(email, password);
    updateLoadingProgress(80, 'Cargando perfil...');
    // El onAuthStateChanged se encargará de ocultar la pantalla
  } catch (error) {
    console.error('❌ Error login:', error);
    
    // OCULTAR PANTALLA DE CARGA INMEDIATAMENTE SI HAY ERROR
    hideLoadingScreen();
    
    handleFirebaseError(error, 'iniciar sesión');
    
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = 'ACCEDER';
    }
  }
}

// ==============================================
// MUNICIPIOS (SE MANTIENEN IGUAL)
// ==============================================
const municipiosChiapas = [
  { id: 1, nombre: "Acacoyagua", prefijo: "919" },
  { id: 2, nombre: "Acala", prefijo: "961" },
  { id: 3, nombre: "Acapetahua", prefijo: "918" },
  { id: 4, nombre: "Aldama", prefijo: "919" },
  { id: 5, nombre: "Altamirano", prefijo: "919" },
  { id: 6, nombre: "Amatán", prefijo: "932" },
  { id: 7, nombre: "Amatenango de la Frontera", prefijo: "963" },
  { id: 8, nombre: "Amatenango del Valle", prefijo: "992" },
  { id: 9, nombre: "Angel Albino Corzo", prefijo: "992" },
  { id: 10, nombre: "Arriaga", prefijo: "966" },
  { id: 11, nombre: "Bejucal de Ocampo", prefijo: "919" },
  { id: 12, nombre: "Bella Vista", prefijo: "963" },
  { id: 13, nombre: "Benemérito de las Américas", prefijo: "934" },
  { id: 14, nombre: "Berriozábal", prefijo: "961" },
  { id: 15, nombre: "Bochil", prefijo: "919" },
  { id: 16, nombre: "El Bosque", prefijo: "919" },
  { id: 17, nombre: "Cacahoatán", prefijo: "962" },
  { id: 18, nombre: "Catazajá", prefijo: "916" },
  { id: 19, nombre: "Cintalapa", prefijo: "968" },
  { id: 20, nombre: "Coapilla", prefijo: "919" },
  { id: 21, nombre: "Comitán de Domínguez", prefijo: "963" },
  { id: 22, nombre: "La Concordia", prefijo: "992" },
  { id: 23, nombre: "Copainalá", prefijo: "968" },
  { id: 24, nombre: "Chalchihuitán", prefijo: "919" },
  { id: 25, nombre: "Chamula", prefijo: "967" },
  { id: 26, nombre: "Chanal", prefijo: "963" },
  { id: 27, nombre: "Chapultenango", prefijo: "932" },
  { id: 28, nombre: "Chenalhó", prefijo: "919" },
  { id: 29, nombre: "Chiapa de Corzo", prefijo: "961" },
  { id: 30, nombre: "Chiapilla", prefijo: "961" },
  { id: 31, nombre: "Chicoasén", prefijo: "961" },
  { id: 32, nombre: "Chicomuselo", prefijo: "963" },
  { id: 33, nombre: "Chilón", prefijo: "919" },
  { id: 34, nombre: "Coyutla", prefijo: "932" },
  { id: 35, nombre: "Dominguez", prefijo: "963" },
  { id: 36, nombre: "Escuintla", prefijo: "918" },
  { id: 37, nombre: "Francisco León", prefijo: "932" },
  { id: 38, nombre: "Frontera Comalapa", prefijo: "963" },
  { id: 39, nombre: "Frontera Hidalgo", prefijo: "962" },
  { id: 40, nombre: "La Grandeza", prefijo: "919" },
  { id: 41, nombre: "Huehuetán", prefijo: "962" },
  { id: 42, nombre: "Huixtán", prefijo: "967" },
  { id: 43, nombre: "Huitiupán", prefijo: "932" },
  { id: 44, nombre: "Huixtla", prefijo: "962" },
  { id: 45, nombre: "La Independencia", prefijo: "963" },
  { id: 46, nombre: "Ixhuatán", prefijo: "932" },
  { id: 47, nombre: "Ixtacomitán", prefijo: "932" },
  { id: 48, nombre: "Ixtapa", prefijo: "961" },
  { id: 49, nombre: "Ixtapangajoya", prefijo: "932" },
  { id: 50, nombre: "Jiquipilas", prefijo: "968" },
  { id: 51, nombre: "Jitotol", prefijo: "919" },
  { id: 52, nombre: "Juárez", prefijo: "932" },
  { id: 53, nombre: "Larráinzar", prefijo: "967" },
  { id: 54, nombre: "La Libertad", prefijo: "934" },
  { id: 55, nombre: "Mapastepec", prefijo: "918" },
  { id: 56, nombre: "Las Margaritas", prefijo: "963" },
  { id: 57, nombre: "Mazapa de Madero", prefijo: "963" },
  { id: 58, nombre: "Mazatán", prefijo: "962" },
  { id: 59, nombre: "Metapa", prefijo: "962" },
  { id: 60, nombre: "Mitontic", prefijo: "967" },
  { id: 61, nombre: "Motozintla", prefijo: "963" },
  { id: 62, nombre: "Nicolás Ruíz", prefijo: "961" },
  { id: 63, nombre: "Ocosingo", prefijo: "919" },
  { id: 64, nombre: "Ocotepec", prefijo: "919" },
  { id: 65, nombre: "Ocozocoautla de Espinosa", prefijo: "968" },
  { id: 66, nombre: "Ostuacán", prefijo: "932" },
  { id: 67, nombre: "Osumacinta", prefijo: "961" },
  { id: 68, nombre: "Oxchuc", prefijo: "967" },
  { id: 69, nombre: "Palenque", prefijo: "916" },
  { id: 70, nombre: "Pantelhó", prefijo: "919" },
  { id: 71, nombre: "Pantepec", prefijo: "932" },
  { id: 72, nombre: "Pichucalco", prefijo: "932" },
  { id: 73, nombre: "Pijijiapan", prefijo: "918" },
  { id: 74, nombre: "El Porvenir", prefijo: "963" },
  { id: 75, nombre: "Pueblo Nuevo Solistahuacán", prefijo: "932" },
  { id: 76, nombre: "Rayón", prefijo: "919" },
  { id: 77, nombre: "Reforma", prefijo: "916" },
  { id: 78, nombre: "Las Rosas", prefijo: "992" },
  { id: 79, nombre: "Sabanilla", prefijo: "919" },
  { id: 80, nombre: "Salto de Agua", prefijo: "916" },
  { id: 81, nombre: "San Andrés Duraznal", prefijo: "919" },
  { id: 82, nombre: "San Cristóbal de las Casas", prefijo: "967" },
  { id: 83, nombre: "San Fernando", prefijo: "961" },
  { id: 84, nombre: "San Juan Cancuc", prefijo: "919" },
  { id: 85, nombre: "San Lucas", prefijo: "992" },
  { id: 86, nombre: "Santiago el Pinar", prefijo: "919" },
  { id: 87, nombre: "Siltepec", prefijo: "963" },
  { id: 88, nombre: "Simojovel", prefijo: "932" },
  { id: 89, nombre: "Sitalá", prefijo: "919" },
  { id: 90, nombre: "Socoltenango", prefijo: "992" },
  { id: 91, nombre: "Solosuchiapa", prefijo: "932" },
  { id: 92, nombre: "Soyaló", prefijo: "961" },
  { id: 93, nombre: "Suchiapa", prefijo: "961" },
  { id: 94, nombre: "Suchiate", prefijo: "962" },
  { id: 95, nombre: "Sunuapa", prefijo: "932" },
  { id: 96, nombre: "Tapachula", prefijo: "962" },
  { id: 97, nombre: "Tapalapa", prefijo: "919" },
  { id: 98, nombre: "Tapilula", prefijo: "932" },
  { id: 99, nombre: "Tecpatán", prefijo: "968" },
  { id: 100, nombre: "Tenejapa", prefijo: "967" },
  { id: 101, nombre: "Teopisca", prefijo: "992" },
  { id: 102, nombre: "Tila", prefijo: "919" },
  { id: 103, nombre: "Tonalá", prefijo: "966" },
  { id: 104, nombre: "Totolapa", prefijo: "961" },
  { id: 105, nombre: "La Trinitaria", prefijo: "963" },
  { id: 106, nombre: "Tumbalá", prefijo: "919" },
  { id: 107, nombre: "Tuxtla Gutiérrez", prefijo: "961" },
  { id: 108, nombre: "Tuxtla Chico", prefijo: "962" },
  { id: 109, nombre: "Tuzantán", prefijo: "962" },
  { id: 110, nombre: "Tzimol", prefijo: "963" },
  { id: 111, nombre: "Unión Juárez", prefijo: "962" },
  { id: 112, nombre: "Venustiano Carranza", prefijo: "992" },
  { id: 113, nombre: "Villa Comaltitlán", prefijo: "918" },
  { id: 114, nombre: "Villa Corzo", prefijo: "992" },
  { id: 115, nombre: "Villaflores", prefijo: "965" },
  { id: 116, nombre: "Yajalón", prefijo: "919" },
  { id: 117, nombre: "Zinacantán", prefijo: "967" }
];

// ==============================================
// REGISTRO SIN FOTO (ELIMINADO CLOUDINARY COMPLETAMENTE)
// ==============================================
function renderRegisterForm() {
  return `
    <div class="login-form" style="gap:12px;">
      <div class="input-group2">
        <input type="text" id="registerFullName" name="fullName" placeholder="Nombre completo *" required aria-label="Nombre completo" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
      </div>
      <div class="input-group2">
        <input type="email" id="registerRealEmail" name="realEmail" placeholder="📧 Correo electronico *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        <div style="font-size:11px;color:#65676b;margin-top:4px;">* Email para recuperar contraseña olvidada.</div>
      </div>
      <div class="input-group">
        <input type="text" id="registerPartyName" name="partyName" placeholder="Partido (opcional)" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
      </div>
      <div class="input-group">
        <input type="text" id="registerRepresentative" name="representative" placeholder="Representante/Criadero (opcional)" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
      </div>
      <div class="input-group">
        <select id="registerMunicipio" name="municipio" onchange="updatePhonePrefix()" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;font-size:16px;background:white;">
          <option value="">Selecciona tu municipio (Opcional)</option>
          ${municipiosChiapas.map(m => `<option value="${m.nombre}" data-prefijo="${m.prefijo}">${m.nombre}</option>`).join('')}
          <option value="otro">Otro (especificar)</option>
        </select>
        <div id="customMunicipioContainer" style="display:none;margin-top:8px;">
          <input type="text" id="registerCustomMunicipio" placeholder="Escribe tu ubicación" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:6px;" />
        </div>
      </div>
      <div class="input-group">
        <div style="display:flex;gap:8px;align-items:center;">
          <div style="flex:1;max-width:100px;">
            <input type="text" id="registerPhonePrefix" value="+52 961" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:8px;background:white;text-align:center;font-size:14px;" />
          </div>
          <div style="flex:2;">
            <input type="tel" id="registerPhone" name="phone" placeholder="Últimos 7 dígitos" pattern="[0-9]{7}" maxlength="7" style="width:100%;padding:12px;border:1px solid #dddfe2;border-radius:8px;" oninput="this.value = this.value.replace(/\D/g,'').slice(0,7)" />
          </div>
        </div>
      </div>
      <div class="input-group2" style="position:relative;">
        <input type="password" id="registerPassword" name="password" placeholder="Contraseña *" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$" title="Mínimo 6 caracteres con al menos 1 mayúscula, 1 minúscula y 1 número" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        <button type="button" onclick="togglePasswordVisibility('registerPassword', this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;">👁️</button>
        <div style="font-size:11px;color:#65676b;margin-top:4px;">* mínimo 6 caracteres que incluya mayúsculas, minúsculas y números.</div>
      </div>
      <div class="input-group2" style="position:relative;">
        <input type="password" id="registerConfirmPassword" name="confirmPassword" placeholder="Confirmar contraseña *" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        <button type="button" onclick="togglePasswordVisibility('registerConfirmPassword', this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;">👁️</button>
      </div>
      <button class="btn-primary" onclick="handleCompleteRegister()" id="registerSubmitBtn" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;">Crear cuenta</button>
      <div id="registerError" class="error-msg" style="text-align:left;color:#d93025;margin-top:12px;"></div>
      <div id="registerSuccess" class="success-msg" style="text-align:left;color:#42b72a;margin-top:12px;"></div>
      <div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:10px;border:2px solid #e4e6eb;">
        <div style="margin-top:10px;font-size:11px;color:#8a8d91;text-align:center;">* Campo obligatorio para crear tu cuenta</div>
        <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;">
          <input type="checkbox" id="registerTerms" required style="margin-top:4px;width:20px;height:20px;accent-color:#42b72a;cursor:pointer;" />
          <div style="flex:1;">
            <div style="font-weight:700;color:#050505;font-size:15px;margin-bottom:8px;display:flex;align-items:center;gap:8px;">ACEPTACIÓN OBLIGATORIA *</div>
            <div style="font-size:13px;color:#65676b;line-height:1.5;">
              <div style="margin-bottom:6px;padding:8px;background:#fff;border-radius:6px;border-left:3px solid #667eea;"><strong>He leído y acepto completamente:</strong></div>
              <div style="display:grid;grid-template-columns:1fr;gap:6px;margin:10px 0;">
                <div style="display:flex;align-items:flex-start;gap:8px;"><span style="color:#42b72a;font-size:14px;">✓</span><span><strong>Términos de Servicio</strong> - Normas de uso de la plataforma</span></div>
                <div style="display:flex;align-items:flex-start;gap:8px;"><span style="color:#42b72a;font-size:14px;">✓</span><span><strong>Política de Privacidad</strong> - Manejo de mis datos personales</span></div>
                <div style="display:flex;align-items:flex-start;gap:8px;"><span style="color:#42b72a;font-size:14px;">✓</span><span><strong>Normas de la Comunidad</strong> - Comportamiento aceptado</span></div>
                <div style="display:flex;align-items:flex-start;gap:8px;"><span style="color:#ff9800;font-size:14px;">⚠️</span><span><strong>Confirmo que soy mayor de 18 años</strong></span></div>
              </div>
              <div style="margin-top:12px;padding:10px;background:#fff8e1;border-radius:6px;border-left:3px solid #ff9800;">
                <div style="font-weight:600;color:#d93025;margin-bottom:4px;font-size:12px;">🚫 PROHIBIDO Y NUNCA PERMITIDO:</div>
                <div style="font-size:11px;color:#65676b;">• Phishing o solicitud de contraseñas • Estafas financieras<br>• Contenido ilegal o dañino • Suplantación de identidad<br><strong>LEGADO AVICOLA NUNCA te pedirá contraseñas por mensaje privado</strong></div>
              </div>
            </div>
            <div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;">
              <a href="#" onclick="event.preventDefault(); openTermsModal()" style="font-size:12px;color:#667eea;font-weight:600;text-decoration:none;padding:6px 12px;background:#f0f8ff;border-radius:4px;">📄 Leer Términos Completos</a>
              <a href="#" onclick="event.preventDefault(); openPrivacyModal()" style="font-size:12px;color:#667eea;font-weight:600;text-decoration:none;padding:6px 12px;background:#f0f8ff;border-radius:4px;">🔒 Leer Política de Privacidad</a>
            </div>
          </div>
        </label>
      </div>
    </div>
  `;
}

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

function updatePhonePrefix() {
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
}


// ==============================================
// REGISTRO (USA APPSTATE) - VERSIÓN CORREGIDA
// ==============================================
async function handleCompleteRegister() {
  // Validar que Firebase esté activado usando AppState
  if (!AppState.firebase.isEnabled) {
AppState.addNotification('Firebase no está inicializado. Intenta de nuevo.', 'error');
    return;
  }
  
  const btn = document.getElementById('registerSubmitBtn');
  const errorDiv = document.getElementById('registerError');
  const successDiv = document.getElementById('registerSuccess');
  const fullName = document.getElementById('registerFullName')?.value.trim() || '';
  const partyName = document.getElementById('registerPartyName')?.value.trim() || '';
  const representative = document.getElementById('registerRepresentative')?.value.trim() || '';
  const municipioSelect = document.getElementById('registerMunicipio');
  const customMunicipio = document.getElementById('registerCustomMunicipio')?.value.trim() || '';
  const phonePrefix = document.getElementById('registerPhonePrefix')?.value || '+52 961';
  const phoneNumber = document.getElementById('registerPhone')?.value.trim() || '';
  const password = document.getElementById('registerPassword')?.value || '';
  const confirmPassword = document.getElementById('registerConfirmPassword')?.value || '';
  const termsAccepted = document.getElementById('registerTerms')?.checked || false;
  const realEmail = document.getElementById('registerRealEmail')?.value.trim() || '';
  
  // Limpiar mensajes anteriores
  if (errorDiv) errorDiv.textContent = '';
  if (successDiv) successDiv.textContent = '';

  // Validaciones
  if (!fullName) { 
    if (errorDiv) errorDiv.textContent = 'Nombre completo requerido'; 
    return; 
  }
  
  if (!realEmail) { 
    if (errorDiv) errorDiv.textContent = 'Email real requerido para recuperación de contraseña'; 
    return; 
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(realEmail)) { 
    if (errorDiv) errorDiv.textContent = 'Email inválido. Usa un email real como: ejemplo@gmail.com'; 
    return; 
  }

  // Procesar municipio
  let municipioFinal = '';
  if (municipioSelect) {
    if (municipioSelect.value === 'otro') {
      if (!customMunicipio) { 
        if (errorDiv) errorDiv.textContent = 'Debes escribir tu ubicación'; 
        return; 
      }
      municipioFinal = customMunicipio;
    } else if (municipioSelect.value) { 
      municipioFinal = municipioSelect.options[municipioSelect.selectedIndex]?.text || ''; 
    }
  }

  // Validar teléfono (opcional pero si se ingresa, debe ser válido)
  if (phoneNumber && (phoneNumber.length !== 7 || !/^\d+$/.test(phoneNumber))) { 
    if (errorDiv) errorDiv.textContent = 'Si ingresas teléfono, debe tener 7 dígitos (sin prefijo)'; 
    return; 
  }
  
  // Validar contraseña
  if (password.length < 6) { 
    if (errorDiv) errorDiv.textContent = 'Contraseña mínimo 6 caracteres'; 
    return; 
  }
  
  if (password !== confirmPassword) { 
    if (errorDiv) errorDiv.textContent = 'Las contraseñas no coinciden'; 
    return; 
  }
  
  if (!termsAccepted) { 
    if (errorDiv) errorDiv.textContent = 'Debes aceptar los términos'; 
    return; 
  }

  // Deshabilitar botón mientras se procesa
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Registrando...';
  }
  
  try {
    const auth = AppState.firebase.auth;
    const database = AppState.firebase.database;
    
    // Limpiar prefijo y construir teléfono completo
    const cleanPrefix = phonePrefix.replace(/\D/g, '');
    const fullPhone = `${cleanPrefix}${phoneNumber}`;
    
    // Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(realEmail, password);
    const user = userCredential.user;
    
    // Actualizar perfil
    await user.updateProfile({ 
      displayName: fullName
    });
    
    // Generar URL única para el perfil
    const uniqueUrl = `/?section=profile&id=user-${user.uid}`;
    
    // Guardar datos en Realtime Database
    await database.ref('users/' + user.uid).set({
      uid: user.uid, 
      displayName: fullName, 
      partyName: partyName || '', 
      representative: representative || '',
      municipio: municipioFinal, 
      phone: fullPhone, 
      formattedPhone: cleanPrefix.slice(-3) + phoneNumber,
      phonePrefix: phonePrefix, 
      realEmail: realEmail, 
      devicesAllowed: 1, 
      activeSessions: {},
      photoURL: '', // Vacío por ahora
      coverURL: '', 
      bio: '', 
      friends: [], 
      showPhone: false, 
      allowWhatsAppMessages: false,
      showLocation: true, 
      showPartyName: true, 
      showRepresentative: true, 
      activated: false,
      accountStatus: 'miembro_nuevo', 
      registeredAt: Date.now(), 
      deviceId: generateDeviceId(),
      profileUrl: uniqueUrl, 
      sessionActive: false, 
      lastSessionId: null, 
      isActive: false,
      gallo: false,
      isJudge: false,
 publicaciones: false,  // Por defecto, sin acceso
  pedigri: false         // Por defecto, sin acceso
 
    });
    
    // Guardar device ID
    localStorage.setItem('socialapp_device_registered', 'true');
    if (!localStorage.getItem('socialapp_device_id')) {
      localStorage.setItem('socialapp_device_id', generateDeviceId());
    }
    
    // Mostrar éxito
    if (successDiv) successDiv.textContent = '✅ Cuenta creada. Pendiente de activación.';
    
    // Redirigir a pantalla de activación pendiente
    setTimeout(() => {
      AppState.setUser(user, {
        id: user.uid,
        displayName: fullName,
        activated: false,
        // otros campos por defecto...
      });
      AppState.setScreen('activation_pending');
    }, 1500);
    
  } catch (error) {
    console.error('❌ Error registro:', error);
    
    let errorMessage = 'Error al registrar';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email ya está registrado';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Contraseña muy débil';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    }
    
    if (errorDiv) errorDiv.textContent = errorMessage;
    
    // Re-habilitar botón
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  }
}

function generateDeviceId() {
  let id = localStorage.getItem('socialapp_device_id');
  if (!id) {
    id = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2,9);
    localStorage.setItem('socialapp_device_id', id);
  }
  return id;
}


// ==============================================
// MANEJADOR CENTRALIZADO DE ERRORES DE FIREBASE
// ==============================================
function handleFirebaseError(error, action = 'realizar esta acción') {
  console.error(`Error en ${action}:`, error);
  let userMessage = `Error al ${action}.`;

  // Mapear códigos de error a mensajes amigables
  switch (error.code) {
    case 'auth/wrong-password':
      userMessage = 'Contraseña incorrecta.';
      break;
    case 'auth/user-not-found':
      userMessage = 'No existe una cuenta con este correo. ¿Quieres registrarte?';
      break;
    case 'auth/too-many-requests':
      userMessage = 'Demasiados intentos fallidos. Cuenta temporalmente bloqueada por seguridad. Intenta más tarde.';
      break;
    case 'auth/email-already-in-use':
      userMessage = 'Este correo electrónico ya está registrado.';
      break;
    case 'auth/weak-password':
      userMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      break;
    case 'auth/invalid-email':
      userMessage = 'El formato del correo electrónico no es válido.';
      break;
    case 'auth/network-request-failed':
      userMessage = 'Error de red. Por favor, verifica tu conexión a internet.';
      break;
    case 'auth/internal-error':
      userMessage = 'Error interno del servidor. Intenta de nuevo más tarde.';
      break;
    default:
      userMessage = `Error inesperado al ${action}. Código: ${error.code || 'desconocido'}`;
  }

  AppState.addNotification(userMessage, 'error');
}
// ==============================================
// LOAD USER PROFILE
// ==============================================
async function loadUserProfile(uid) {
  if (!AppState.firebase.database) return;
  try {
    const snapshot = await AppState.firebase.database.ref('users/' + uid).once('value');
    if (snapshot.exists()) {
      const profile = { id: uid, ...snapshot.val() };
      // Asegurar valores por defecto
      if (profile.activated === undefined) profile.activated = false;
      if (profile.gallo === undefined) profile.gallo = false;
      if (profile.isJudge === undefined) profile.isJudge = false;

      // Actualizar el store con el usuario y su perfil
      AppState.setUser(AppState.firebase.auth.currentUser, profile);
    }
  } catch (error) {
    AppState.addNotification('Error cargando perfil', 'error');
  }
}


// ==============================================
// ACTIVATION PENDING SCREEN (IDÉNTICA)
// ==============================================
function renderActivationPendingScreen() {
  const userProfile = AppState.user.profile;
  
  return `
    <div class="login-screen" style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);">
      <div class="login-container" style="text-align: center; max-width: 500px;">
        <div class="login-logo">
          <div style="font-size: 60px; color: white; margin-bottom: 20px;">⏳</div>
          <h1 style="color: white; margin-bottom: 8px;">Cuenta en revisión</h1>
          <p style="color: rgba(255,255,255,0.9);">Tu cuenta está siendo verificada por un administrador</p>
        </div>
        <div style="background: white; border-radius: 16px; padding: 24px; margin-top: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f0f8ff; border-radius: 12px;">
            <!-- ⚠️ SECCIÓN CORREGIDA: Sin photoURL -->
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
              ${getInitials(userProfile?.displayName || 'U')}
            </div>
            <div style="flex:1;text-align:left;">
              <div style="font-size:18px;font-weight:700;color:#050505;margin-bottom:4px;">${userProfile?.displayName || 'Usuario'}</div>
              <div style="font-size:14px;color:#65676b;">📱 ${userProfile?.formattedPhone || userProfile?.phone || 'Sin teléfono'}</div>
            </div>
          </div>

          <!-- El resto del código sigue IGUAL -->
          <div style="margin-bottom:24px;">
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;">
              <div style="width:40px;height:40px;background:#8B4513;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">1</div>
              <div style="height:2px;background:#8B4513;flex:1;max-width:100px;"></div>
              <div style="width:40px;height:40px;background:#e4e6eb;color:#65676b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">2</div>
              <div style="height:2px;background:#e4e6eb;flex:1;max-width:100px;"></div>
              <div style="width:40px;height:40px;background:#e4e6eb;color:#65676b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">3</div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#65676b;margin:0 20px;">
              <div style="text-align:center;"><div style="font-weight:600;color:#8B4513;">Registro</div><div>Completado</div></div>
              <div style="text-align:center;"><div style="font-weight:600;">Revisión</div><div>En proceso</div></div>
              <div style="text-align:center;"><div style="font-weight:600;">Activación</div><div>Pendiente</div></div>
            </div>
          </div>
          <div style="background:#f9f9f9;border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;">
            <h4 style="color:#8B4513;margin-bottom:12px;font-size:16px;">📋 Datos enviados para revisión:</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
              <div><div style="font-size:13px;color:#65676b;margin-bottom:2px;">Nombre completo:</div><div style="font-weight:600;color:#050505;">${userProfile?.displayName || 'No especificado'}</div></div>
              <div><div style="font-size:13px;color:#65676b;margin-bottom:2px;">Teléfono:</div><div style="font-weight:600;color:#050505;">${userProfile?.formattedPhone || userProfile?.phone || 'No especificado'}</div></div>
            </div>
            ${userProfile?.partyName ? `<div style="margin-bottom:8px;"><div style="font-size:13px;color:#65676b;margin-bottom:2px;">Partido político:</div><div style="font-weight:600;color:#050505;">${userProfile.partyName}</div></div>` : ''}
            ${userProfile?.representative ? `<div style="margin-bottom:8px;"><div style="font-size:13px;color:#65676b;margin-bottom:2px;">Representante:</div><div style="font-weight:600;color:#050505;">${userProfile.representative}</div></div>` : ''}
            ${userProfile?.municipio ? `<div style="margin-bottom:8px;"><div style="font-size:13px;color:#65676b;margin-bottom:2px;">Ubicación:</div><div style="font-weight:600;color:#050505;">${userProfile.municipio}</div></div>` : ''}
          </div>
          <div style="background:#fff8e1;border-radius:12px;padding:16px;margin-bottom:24px;border-left:4px solid #ffc107;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="color:#ff9800;font-size:24px;">ℹ️</div>
              <div><div style="font-weight:600;color:#050505;margin-bottom:4px;">Información importante</div><div style="font-size:14px;color:#65676b;line-height:1.4;">Tu cuenta está <strong>INACTIVA</strong> hasta que un administrador verifique tu información. No podrás usar funciones hasta que tu cuenta sea activada. El proceso puede tomar hasta 24 horas.</div></div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <button class="btn-primary" onclick="checkActivationStatus()" style="background:#8B4513;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border:none;border-radius:8px;color:white;font-weight:700;cursor:pointer;"><span>🔄</span> Verificar estado de activación</button>
            <button class="btn-register" onclick="handleLogout()" style="background:#f0f2f5;color:#050505;border:1px solid #e4e6eb;padding:14px;border-radius:8px;font-weight:700;cursor:pointer;">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
// ==============================================
// CHECK ACTIVATION STATUS (USA APPSTATE)
// ==============================================
async function checkActivationStatus() {
  // ✅ USAR AppState
  const currentUser = AppState.user.current;
  const database = AppState.firebase.database;
  
  if (!currentUser || !database) { 
    AppState.addNotification('No hay usuario logueado', 'error');
    return; 
  }
  
  try {
    const snapshot = await database.ref('users/' + currentUser.uid + '/activated').once('value');
    if (snapshot.val() === true) {
      AppState.addNotification('✅ ¡Cuenta activada!', 'success');
      
      // Recargar perfil para obtener el estado actualizado
      await loadUserProfile(currentUser.uid);
      
      setTimeout(() => {
        AppState.setScreen('rooster');
        window.history.pushState({}, '', '/?section=rooster');
      }, 1500);
    } else { 
      AppState.addNotification('⏳ Tu cuenta aún no ha sido activada', 'warning');
    }
  } catch (error) { 
    console.error('❌ Error verificando estado:', error); 
    AppState.addNotification('Error al verificar estado de activación', 'error');
  }
}

// ==============================================
// LOGOUT
// ==============================================
// ==============================================
// LOGOUT (USA APPSTATE)
// ==============================================
// ==============================================
// LOGOUT MEJORADO CON FEEDBACK
// ==============================================
// ==============================================
// LOGOUT MEJORADO CON FEEDBACK Y CIERRE DE MENÚ
// ==============================================
async function handleLogout() {
  // 👇 PRIMERO: CERRAR EL MENÚ OBLIGATORIAMENTE
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('side-menu-overlay');
  
  if (sideMenu) {
    sideMenu.style.right = '-350px';
    sideMenu.style.transition = 'right 0.3s ease';
  }
  if (overlay) {
    overlay.style.display = 'none';
  }
  document.body.style.overflow = '';
  
  // 👇 DESPUÉS: Mostrar notificación y cerrar sesión
  AppState.addNotification('Cerrando sesión...', 'info');
  
  try {
    await AppState.firebase.auth.signOut();
    AppState.clearUser();
    window.history.pushState({}, '', '/');
  } catch (error) {
    handleFirebaseError(error, 'cerrar sesión');
  }
}

// ==============================================
// FUNCIÓN: GENERAR CSRF TOKEN (para seguridad)
// ==============================================
function generateCSRFToken(formName) {
  // Usar crypto.getRandomValues para verdadera aleatoriedad
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  const token = Array.from(array, dec => ('0' + dec.toString(16)).substr(-8)).join('');
  
  const key = `csrf_${formName}`;
  sessionStorage.setItem(key, token);
  sessionStorage.setItem(`${key}_expiry`, Date.now() + 3600000);
  
  return token;
}


// ==============================================
// UTILS
// ==============================================
function formatTime(timestamp) {
  if (!timestamp) return 'Ahora';
  const now = new Date(), postDate = new Date(timestamp), diff = now - postDate;
  const minutes = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} h`;
  if (days < 7) return `${days} d`;
  return postDate.toLocaleDateString();
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
}





function openAppInfoModal() { AppState.addNotification('Información de la App', 'info'); }
function openTermsModal() { AppState.addNotification('Términos de Servicio', 'info'); }
function openPrivacyModal() { AppState.addNotification('Política de Privacidad', 'info'); }

// ==============================================
// RESET PASSWORD (USA APPSTATE) - VERSIÓN CORREGIDA
// ==============================================
async function resetPassword() {
  // Validar que Firebase esté activado usando AppState
  if (!AppState.firebase.isEnabled) {
AppState.addNotification('Firebase no está inicializado', 'error');
    return;
  }
  
  const email = document.getElementById('loginPhone')?.value.trim();
  if (!email) {
AppState.addNotification('Ingresa tu correo electrónico', 'error');
    return;
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
AppState.addNotification('Ingresa un correo electrónico válido', 'error');
    return;
  }
  
  try {
    await AppState.firebase.auth.sendPasswordResetEmail(email);
AppState.addNotification(`✅ Se envió un enlace de recuperación a: ${email}`, 'success');
  } catch (error) {
    console.error('❌ Error:', error);
    
    let errorMessage = 'Error al enviar correo de recuperación';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No existe una cuenta con ese email';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    }
    
AppState.addNotification(errorMessage, 'error');
  }
}



// ==============================================
// NUEVA FUNCIÓN: NAVEGACIÓN POR URL
// ==============================================
// ==============================================
// NUEVA FUNCIÓN: NAVEGAR (ACTUALIZA APPSTATE Y URL)
// ==============================================



// ==============================================
// NUEVA FUNCIÓN: CERRAR SESIÓN Y VOLVER A PÚBLICO
// ==============================================
function logoutAndGoPublic() {
  handleLogout();
}

// ==============================================
// NUEVA FUNCIÓN: RENDER PANTALLA PÚBLICA (SIN FIREBASE)
// ==============================================
function renderPublicScreen() {
  return `
    <div class="public-screen" style="background: linear-gradient(135deg, #2c3e50 0%, #8B4513 100%); min-height: 100vh; color: white;">
      <!-- BOTÓN SUPERIOR DERECHA -->
      <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
<button onclick="window.handleLoginClick ? window.handleLoginClick() : navigateTo('login')"                 style="background: #D2691E; 
                       color: white; 
                       border: 2px solid #FFD700;
                       padding: 12px 28px; 
                       border-radius: 50px; 
                       font-weight: 800; 
                       font-size: 16px;
                       cursor: pointer;
                       box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
          INICIAR SESIÓN
        </button>
      </div>

      <!-- CONTENIDO VACÍO (solo título) -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
        <div style="font-size: 80px; margin-bottom: 20px;">🐓🏆</div>
        <h1 style="font-size: 48px; font-weight: 900; margin-bottom: 16px;">LEGADO AVÍCOLA</h1>
        <p style="font-size: 18px; color: #FFD700;">Contenido en construcción</p>
      </div>
    </div>
  `;
}

// ==============================================
// LOGIN SCREEN (MODIFICADA: SIN BOTÓN SOBRE LA APP)
// ==============================================
function renderLoginScreen() {
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
}

function renderLoginForm() {
  const csrfToken = generateCSRFToken('login');
  return `
    <div class="login-form">
     
      <div class="input-group">
        <input type="email" id="loginPhone" name="email" placeholder="Correo electrónico" required style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
        <div style="font-size:11px;color:#65676b;margin-top:4px;">Usa el correo con el que te registraste</div>
      </div>
      <div class="input-group">
        <input type="password" id="loginPassword" name="password" placeholder="Contraseña" aria-label="Contraseña" style="width:100%;padding:14px;border:1px solid #dddfe2;border-radius:8px;" />
      </div>
    <button class="btn-primary" onclick="handleLogin()" id="login-submit-btn" style="width:100%;padding:14px;background:#8B4513;color:white;border:none;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;">ACCEDER</button>
      <div style="margin-top:12px;text-align:center;">
        <a href="#" onclick="resetPassword()" style="color:#8B4513;font-size:14px;text-decoration:none;">¿Olvidaste tu contraseña?</a>
      </div>
      <div id="loginError" class="error-msg" style="color:#d93025;margin-top:12px;text-align:center;"></div>
    </div>
  `;
}

function showLoginForm() {
  const loginDiv = document.getElementById('loginForm');
  const registerDiv = document.getElementById('registerForm');
  if (loginDiv) loginDiv.classList.remove('hidden');
  if (registerDiv) registerDiv.classList.add('hidden');
  const tabs = document.querySelectorAll('.login-tab');
  tabs.forEach((t,i) => {
    t.classList.toggle('active', i===0);
    t.style.color = i===0 ? '#8B4513' : '#65676b';
    t.style.borderBottom = i===0 ? '2px solid #8B4513' : '2px solid transparent';
  });
}

function showRegisterForm() {
  const loginDiv = document.getElementById('loginForm');
  const registerDiv = document.getElementById('registerForm');
  if (loginDiv) loginDiv.classList.add('hidden');
  if (registerDiv) registerDiv.classList.remove('hidden');
  const tabs = document.querySelectorAll('.login-tab');
  tabs.forEach((t,i) => {
    t.classList.toggle('active', i===1);
    t.style.color = i===1 ? '#8B4513' : '#65676b';
    t.style.borderBottom = i===1 ? '2px solid #8B4513' : '2px solid transparent';
  });
}

// ==============================================
// NUEVA SECCIÓN: ADMIN PANEL (SOLO GALLO = TRUE)
// ==============================================
// ==============================================
// RENDER ADMIN PANEL (SOLO PARA GALLO = TRUE)
// ==============================================
async function renderAdminPanel() {
  // ✅ USAR AppState
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;

  // Seguridad extra: si por alguna razón un no-admin llega aquí, se le niega el acceso.
  if (!currentUser || !userProfile || userProfile.gallo !== true) {
    console.warn("🚫 Intento de acceso a admin sin permisos");
    return `<div style="padding: 40px; text-align: center; min-height: 100vh; background: #f5f5f5;">
              <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; margin: 50px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="font-size: 60px; margin-bottom: 20px; color: #d32f2f;">⛔</div>
                <h2 style="color: #d32f2f; margin-bottom: 10px;">Acceso Denegado</h2>
                <p style="color: #666; margin-bottom: 20px;">No tienes permisos para ver esta sección.</p>
                <button onclick="navigateTo('rooster')" style="background: #8B4513; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Volver a Torneos</button>
              </div>
            </div>`;
  }

  // Panel de administración con la nueva barra
  return `
    <div class="admin-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 80px; margin-bottom: 20px; color: #8B4513;">⚙️👑</div>
          <h2 style="color: #8B4513; margin-bottom: 10px; font-size: 32px;">Panel de Administración</h2>
          <p style="color: #666; font-size: 18px; max-width: 400px; text-align: center;">
            Bienvenido, <strong>${userProfile.displayName || 'Administrador'}</strong>. 
            Esta sección está reservada para la gestión de la plataforma.
          </p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin-top: 20px; width: 100%; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color: #888; text-align: center;">(Contenido del panel en construcción)</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==============================================
// FUNCIONES PARA ADMIN (GLOBALES)
// ==============================================
window.toggleUserActivation = async function(uid, activate) {
  if (!currentUser || !database || !userProfile || userProfile.gallo !== true) {
AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await database.ref(`users/${uid}/activated`).set(activate);
   AppState.addNotification(`Usuario ${activate ? 'activado' : 'desactivado'} correctamente`, 'success');
    
    // Recargar panel admin
    if (currentScreen === 'admin') {
      renderApp();
    }
  } catch (error) {
    console.error('Error:', error);
AppState.addNotification('Error al cambiar estado', 'error');
  }
};

window.toggleUserGallo = async function(uid, setGallo) {
  if (!currentUser || !database || !userProfile || userProfile.gallo !== true) {
AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await database.ref(`users/${uid}/gallo`).set(setGallo);
    AppState.addNotification(`Usuario ${setGallo ? 'ahora es ADMINISTRADOR' : 'ya no es administrador'}`, 'success');

    
    // Recargar panel admin
    if (currentScreen === 'admin') {
      renderApp();
    }
  } catch (error) {
    console.error('Error:', error);
AppState.addNotification('Error al cambiar rol', 'error');
  }
};

window.toggleUserJudge = async function(uid, setJudge) {
  if (!currentUser || !database || !userProfile || userProfile.gallo !== true) {
AppState.addNotification('No tienes permisos', 'error');
    return;
  }
  
  try {
    await database.ref(`users/${uid}/isJudge`).set(setJudge);
    AppState.addNotification(`Usuario ${setJudge ? 'ahora es JUEZ' : 'ya no es juez'}`, 'success');
    
    // Recargar panel admin
    if (currentScreen === 'admin') {
      renderApp();
    }
  } catch (error) {
    console.error('Error:', error);
AppState.addNotification('Error al cambiar rol', 'error');
  }
};



// ==============================================
// NUEVA PANTALLA: PUBLICACIONES
// ==============================================
function renderPublicacionesScreen() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="publicaciones-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">📱</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">PUBLICACIONES</h2>
          <p style="color: #666;">Aquí irán las publicaciones de la comunidad</p>
        </div>
      </div>
    </div>
  `;
}

// ==============================================
// NUEVA PANTALLA: PEDIGRÍ
// ==============================================
function renderPedigriScreen() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="pedigri-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🧬</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">PEDIGRÍ</h2>
          <p style="color: #666;">Consulta de árboles genealógicos y consanguinidad</p>
        </div>
      </div>
    </div>
  `;
}

// ==============================================
// NUEVA PANTALLA: CONFIGURACIONES
// ==============================================
function renderConfiguracionesScreen() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="configuraciones-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">⚙️</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">CONFIGURACIONES</h2>
          <p style="color: #666;">Aquí podrás ajustar la configuración de tu cuenta</p>
        </div>
      </div>
    </div>
  `;
}

// ==============================================
// NUEVA SECCIÓN: PERFIL (SEGÚN GALLO/JUEZ)

function renderPerfilScreen() {
  // ✅ USAR AppState
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando perfil...</div>`;
  }
  
  return `
    <div class="perfil-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; margin-bottom: 20px;">
            ${getInitials(userProfile.displayName || 'U')}
          </div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">${userProfile.displayName || 'Usuario'}</h2>
          <p style="color: #666;">Perfil en construcción (PANTALLA)</p>
        </div>
      </div>
    </div>
  `;
}

// ==============================================
// NUEVA BARRA DE NAVEGACIÓN SUPERIOR (CON MENÚ LATERAL Y OCULTAMIENTO)
// ==============================================
// ==============================================
// BARRA DE NAVEGACIÓN CON PERMISOS DESDE FIREBASE
// ==============================================
function renderMobileNavBar() {
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) return '';
  
  const isAdmin = userProfile.gallo === true;
  
  // ========== NUEVA LÓGICA: PERMISOS DESDE FIREBASE ==========
  const tienePublicaciones = userProfile.publicaciones === true;
  const tienePedigri = userProfile.pedigri === true;
  // ============================================================
  
  // Construir items de la barra superior
  const topMenuItems = [];
  
  // 1️⃣ TORNEOS - Siempre visible para todos los usuarios logueados
  topMenuItems.push({
    id: 'rooster',
    icon: '🏆',
    label: 'Torneos',
    siempreVisible: true
  });
  
  // 2️⃣ PUBLICACIONES - Solo si el nodo en Firebase es true
  if (tienePublicaciones) {
    topMenuItems.push({
      id: 'publicaciones',
      icon: '📱',
      label: 'Publicaciones'
    });
  }
  
  // 3️⃣ PEDIGRÍ - Solo si el nodo en Firebase es true
  if (tienePedigri) {
    topMenuItems.push({
      id: 'pedigri',
      icon: '🧬',
      label: 'Pedigrí'
    });
  }
  
  return `
    <!-- BARRA SUPERIOR CON OCULTAMIENTO AL SCROLL -->
    <nav id="main-top-nav" class="top-nav" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: white;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      z-index: 1000;
      transition: transform 0.3s ease;
      border-bottom: 1px solid rgba(139, 69, 19, 0.2);
    ">
      
      
      <!-- CENTRO: Botones según permisos de Firebase -->
      <div style="display: flex; gap: 2px; align-items: center;">
        ${topMenuItems.map(item => `
          <button 
            onclick="navigateTo('${item.id}')"
            class="top-nav-item ${AppState.ui.currentScreen === item.id ? 'active' : ''}"
            style="
              background: transparent;
              border: none;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 2px;
              cursor: pointer;
              color: ${AppState.ui.currentScreen === item.id ? '#8B4513' : '#666'};
              font-size: 12px;
              font-weight: ${AppState.ui.currentScreen === item.id ? '700' : '500'};
              padding: 4px 8px;
              border-radius: 8px;
            "
            title="${item.label}"
          >
            <span style="font-size: 20px;">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
      
      <!-- DERECHA: Botón de 3 rallitas (siempre visible) -->
      <button 
        onclick="toggleSideMenu()"
        style="
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        "
        aria-label="Menú principal"
      >
        <span style="width: 25px; height: 3px; background: #8B4513; border-radius: 3px;"></span>
        <span style="width: 25px; height: 3px; background: #8B4513; border-radius: 3px;"></span>
        <span style="width: 25px; height: 3px; background: #8B4513; border-radius: 3px;"></span>
      </button>
    </nav>

   
  
  `;
}
// ==============================================
// NUEVAS FUNCIONES PARA EL MENÚ LATERAL Y OCULTAMIENTO
// ==============================================

// Función para abrir/cerrar el menú lateral
// ==============================================
// FUNCIÓN CORREGIDA PARA EL MENÚ LATERAL
// ==============================================
window.toggleSideMenu = function() {
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('side-menu-overlay');
  
  if (!sideMenu || !overlay) return;
  
  // CORRECCIÓN: Usar getComputedStyle para leer el valor actual de forma fiable
  const isOpen = window.getComputedStyle(sideMenu).right === '0px';
  
  if (isOpen) {
    // CERRAR MENÚ: Lo desplazamos completamente a la derecha (fuera de la pantalla)
    sideMenu.style.right = '-350px'; // CORREGIDO: Usamos el ancho real del menú
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Restaurar scroll
  } else {
    // ABRIR MENÚ: Lo traemos a la pantalla (posición 0)
    sideMenu.style.right = '0px';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }
};

// Variables para el control del scroll
// ==============================================
// LISTENER DE SCROLL MEJORADO Y OPTIMIZADO
// ==============================================
let lastScrollTop = 0;
const scrollThreshold = 10; // Mínimo desplazamiento para detectar dirección

window.handleNavBarScroll = function() {
  const navBar = document.getElementById('main-top-nav');
  if (!navBar) return;
  
  const currentScroll = window.scrollY; // Forma más moderna y directa
  
  // Si estamos en la parte superior, siempre mostrar
  if (currentScroll <= 0) {
    navBar.classList.remove('hidden');
    lastScrollTop = 0;
    return;
  }
  
  // Detectar dirección del scroll (solo si se supera el umbral)
  if (Math.abs(lastScrollTop - currentScroll) > scrollThreshold) {
    if (currentScroll > lastScrollTop) {
      // Scroll hacia abajo - ocultar barra
      navBar.classList.add('hidden');
    } else {
      // Scroll hacia arriba - mostrar barra
      navBar.classList.remove('hidden');
    }
    lastScrollTop = currentScroll;
  }
};

window.initScrollListener = function() {
  // Eliminar listener anterior para evitar duplicados
  window.removeEventListener('scroll', window.handleNavBarScroll);
  // Añadir el nuevo listener
  window.addEventListener('scroll', window.handleNavBarScroll, { passive: true });
  lastScrollTop = window.scrollY;
};
// Sobrescribir navigateTo para cerrar el menú automáticamente
// ==============================================
// NAVEGACIÓN CORREGIDA - RESTAURA EL SCROLL SIEMPRE
// ==============================================
const originalNavigateTo = window.navigateTo;
window.navigateTo = function(section) {
  // Cerrar menú lateral si está abierto y RESTAURAR SCROLL
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('side-menu-overlay');
  
  if (sideMenu) {
    // Forzar el cierre del menú y restaurar el scroll del body
    sideMenu.style.right = '-350px'; // CORREGIDO: Usar el mismo valor que en toggle
    document.body.style.overflow = ''; // CORREGIDO: Asegurar que el scroll se reactive
  }
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  // Llamar a la función original (que debería estar definida antes)
  if (typeof originalNavigateTo === 'function') {
    originalNavigateTo(section);
  } else {
    // Fallback si no existe
    window.location.href = `/?section=${section}`;
  }
};

// ==============================================
// RENDER ROOSTER SCREEN (USA APPSTATE)
// ==============================================

function renderRoosterScreen() {
  // ✅ USAR AppState
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  
  if (!currentUser || !userProfile) {
    return `<div style="padding: 40px; text-align: center;">Cargando...</div>`;
  }
  
  return `
    <div class="rooster-screen">
      ${renderMobileNavBar()}
      <div class="main-content" style="background: #f5f5f5; min-height: 100vh; padding: 90px 20px 80px 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 60px; margin-bottom: 20px; color: #8B4513;">🏆</div>
          <h2 style="color: #8B4513; margin-bottom: 10px;">SECCIÓN TORNEOS</h2>
          <p style="color: #666;">Bienvenido ${userProfile.displayName || 'Usuario'}</p>
          
          <!-- CONTENIDO DE PRUEBA PARA VER EL SCROLL -->
          ${Array(20).fill(0).map((_, i) => `
            <div style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p>Elemento de prueba #${i+1}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function copyRoosterUrl() {
  const url = window.location.origin + window.location.pathname + '?section=rooster';
  navigator.clipboard.writeText(url).then(() => AppState.addNotification('✅ Enlace copiado', 'success')).catch(() => AppState.addNotification('Error al copiar', 'error'));
}

function shareRoosterSection() {
  const url = window.location.origin + window.location.pathname + '?section=rooster';
  if (navigator.share) { navigator.share({ title: 'Legado Avícola - Torneos', text: 'Mira la sección Gallo', url: url }); }
  else { navigator.clipboard.writeText(url).then(() => AppState.addNotification('✅ Enlace copiado', 'success')); }
}

// ==============================================
// RENDER APP (PRINCIPAL - MANEJO DE URLS)
// ==============================================
// ==============================================
// NUEVA FUNCIÓN: RENDER APP (SOLO USA APPSTATE)
// ==============================================
async function renderApp() {
  const app = document.getElementById('social-app');
  if (!app) return;
  
  // Leer estado ACTUAL de AppState
  const isFirebaseEnabled = AppState.firebase.isEnabled;
  const currentUser = AppState.user.current;
  const userProfile = AppState.user.profile;
  const currentScreen = AppState.ui.currentScreen;
  
  console.log("🎨 Renderizando pantalla:", currentScreen, "Usuario:", currentUser?.uid || "No");
  
  // ==========================================
  // CASO 1: Firebase NO activado
  // ==========================================
  if (!isFirebaseEnabled) {
    app.innerHTML = renderPublicScreen();
    AppState.setLoading(false);
    return;
  }
  
  // ==========================================
  // CASO 2: Firebase activado, pero NO hay usuario
  // ==========================================
  if (!currentUser) {
    if (currentScreen === 'login') {
      app.innerHTML = renderLoginScreen();
    } else {
      app.innerHTML = renderPublicScreen();
    }
    AppState.setLoading(false);
    return;
  }
  
  // ==========================================
  // CASO 3: Usuario logueado
  // ==========================================
  let html = '';
  
  
        switch (currentScreen) {
        case 'activation_pending':
          html = renderActivationPendingScreen();
          break;
          
        case 'login':
          // Si está logueado pero en login, corregir
          AppState.setScreen('rooster');
          html = renderRoosterScreen();
          break;
          
        case 'rooster':
          html = renderRoosterScreen();
          break;
          
        case 'publicaciones':
          html = renderPublicacionesScreen();
          break;
          
        case 'pedigri':
          html = renderPedigriScreen();
          break;
          
        case 'perfil':
          html = renderPerfilScreen();
          break;
          
        case 'configuraciones':
          html = renderConfiguracionesScreen();
          break;
          
        case 'admin':
          if (userProfile?.gallo === true) {
            html = await renderAdminPanel();
          } else {
            AppState.addNotification('Acceso denegado', 'error');
            AppState.setScreen('rooster');
            html = renderRoosterScreen();
          }
          break;
          
        default:
          // Por defecto, rooster
          if (currentScreen !== 'rooster') {
            AppState.setScreen('rooster');
          }
          html = renderRoosterScreen();
      }

  app.innerHTML = html;
  
  // Inicializar el listener de scroll para la nueva barra
  if (currentUser) {
    setTimeout(() => {
      initScrollListener();
    }, 100);
  }
  
  AppState.setLoading(false);

  attachEventListeners();
}

// ==============================================
// ATTACH EVENT LISTENERS
// ==============================================
function attachEventListeners() {
  // Mantener compatibilidad
}

// ==============================================
// FUNCIONES GLOBALES EXPUESTAS
// ==============================================
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.resetPassword = resetPassword;
window.updatePhonePrefix = updatePhonePrefix;
window.handleCompleteRegister = handleCompleteRegister;
window.togglePasswordVisibility = togglePasswordVisibility;
window.checkActivationStatus = checkActivationStatus;
window.openAppInfoModal = openAppInfoModal;
window.openTermsModal = openTermsModal;
window.openPrivacyModal = openPrivacyModal;
window.copyRoosterUrl = copyRoosterUrl;
window.shareRoosterSection = shareRoosterSection;
window.getInitials = getInitials;
window.formatTime = formatTime;

window.logoutAndGoPublic = logoutAndGoPublic;




// ==============================================
// INICIALIZACIÓN - PUNTO DE ENTRADA ÚNICO
// ==============================================
window.addEventListener('load', () => {
  console.log("🚀 Aplicación iniciando...");
  
  // Mostrar pantalla de carga con barra de progreso
  showLoadingScreen('Inicializando aplicación...', 0);
  AppState.setLoading(true);
  
  // SIMULAR PROGRESO INICIAL
  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 40 && AppState.ui.isLoading) {
      progress += 5;
      updateLoadingProgress(progress, 'Cargando módulos...');
    } else {
      clearInterval(interval);
    }
  }, 100);
  
  // Leer URL inicial
  // Leer URL inicial
  const urlParams = new URLSearchParams(window.location.search);
const sectionParam = urlParams.get('section');
const section = sectionParam && /^[a-zA-Z0-9_-]+$/.test(sectionParam) ? sectionParam : null;

if (section === 'login') { /* ... */ } 
  

  console.log("🌐 URL inicial:", section);
  
  // CASO 1: URL pide login
  if (section === 'login') {
    console.log("🔑 URL pide login - Inicializando Firebase");
    updateLoadingProgress(20, 'Conectando con Firebase...');
    AppState.ui.pendingScreen = 'login';
    initializeFirebase();
  }
  // CASO 2: URL pide cualquier otra sección (rooster, perfil, admin)
  else if (section) {
    console.log(`🔒 URL pide ${section} - Verificando autenticación...`);
    updateLoadingProgress(20, 'Verificando acceso...');
    AppState.ui.pendingScreen = section; // Guardamos lo que quiere
    initializeFirebase(); // Inicializamos Firebase para ver si hay usuario
  }
  // CASO 3: URL sin sección (página principal)
  else {
    console.log("🌐 Modo público - Sin Firebase");
    AppState.setScreen('public');
    renderApp();
    
    setTimeout(() => {
      if (AppState.ui.isLoading) {
        updateLoadingProgress(100, '¡Listo!');
        setTimeout(() => {
          hideLoadingScreen();
          AppState.setLoading(false);
        }, 500);
      }
    }, 1500);
  }
  
  // Iniciar verificación de carga (modificada)
  checkIfEverythingLoaded();
});

// Manejar botones atrás/adelante del navegador
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get('section') || 'public';
  
  if (section === 'login' && !AppState.firebase.isEnabled) {
    initializeFirebase();
  } else {
    AppState.setScreen(section);
  }
});




// ✅ SOLO UNA VEZ - Suscribimos nuestra función de renderizado principal al store
AppState.subscribe(() => {
  // Esto se llamará cada vez que cambie el estado
  console.log("🔄 Notificación de AppState - Re-renderizando");
  renderApp();
});



// ==============================================
// FUNCIONES PARA CONTROLAR LA PANTALLA DE CARGA
// ==============================================
function showLoadingScreen(message = 'Cargando...', progress = 0) {
  const loadingScreen = document.getElementById('loading-screen');
  const statusEl = document.getElementById('loading-status');
  const progressBar = document.getElementById('loading-progress-bar');
  
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
  }
  
  updateLoadingProgress(progress, message);
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

function updateLoadingProgress(percent, message) {
  const statusEl = document.getElementById('loading-status');
  const progressBar = document.getElementById('loading-progress-bar');
  
  if (statusEl && message) {
    statusEl.textContent = message;
  }
  
  if (progressBar) {
    progressBar.style.width = percent + '%';
  }
}

// ==============================================
// MEJORAR EL BOTÓN "INICIAR SESIÓN" DE LA PANTALLA PÚBLICA
// ==============================================
// Busca en renderPublicScreen() y modifica el botón para que muestre la carga
// Pero como no podemos modificar esa función directamente aquí, 
// sobrescribimos la función navigateTo para login
// ==============================================
// CORRECCIÓN: NAVEGACIÓN SIN PANTALLA DE CARGA PEGADA
// ==============================================
// Guardar referencia a la función original

// Sobrescribir navigateTo de manera segura
// ==============================================
// FUNCIÓN DE NAVEGACIÓN ÚNICA (CON PANTALLA DE CARGA)
// ==============================================

