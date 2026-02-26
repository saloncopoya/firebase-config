// ==============================================
// juez.js - SIN SEGURIDAD (solo obtiene UID de Firebase)
// ==============================================

(function() {
  'use strict';
  
  // ===== FUNCIÓN PRINCIPAL =====
  window.renderJuezScreen = async function() {
    
    try {
      // ===== 1. VERIFICAR QUE FIREBASE EXISTE =====
      if (typeof firebase === 'undefined' || !firebase.auth) {
        return '<div style="padding:20px;color:red;">❌ Firebase no está disponible</div>';
      }
      
      // ===== 2. OBTENER USUARIO ACTUAL DE FIREBASE AUTH =====
      const currentUser = firebase.auth().currentUser;
      
      if (!currentUser) {
        return '<div style="padding:20px;">🔒 No hay usuario autenticado</div>';
      }
      
      // ===== 3. OBTENER UID DIRECTAMENTE =====
      const uid = currentUser.uid; // ← ESTE ES EL UID
      
      // ===== 4. OBTENER PERFIL DE FIREBASE DATABASE =====
      const database = firebase.database();
      const snapshot = await database.ref('users/' + uid).once('value');
      
      if (!snapshot.exists()) {
        return '<div style="padding:20px;">📝 Perfil no encontrado</div>';
      }
      
      const profile = snapshot.val();
      
      // ===== 5. VERIFICAR SI ES JUEZ =====
      if (profile.isJudge !== true) {
        return `
          <div style="padding:40px;text-align:center;">
            <h2>⛔ Acceso Restringido</h2>
            <p>Esta sección es solo para jueces</p>
            <p>Tu permiso isJudge: ${profile.isJudge}</p>
          </div>
        `;
      }
      
      // ===== 6. VERIFICAR SI ESTÁ ACTIVADO =====
      if (profile.activated !== true) {
        return '<div style="padding:20px;">⏳ Cuenta pendiente de activación</div>';
      }
      
      // ===== 7. ¡YA TENEMOS UID Y PERMISOS! =====
      console.log('✅ UID obtenido directamente de Firebase:', uid);
      console.log('✅ Perfil:', profile);
      
      // ===== CONTENEDOR VISUAL CON EL UID =====
      return `
        <div style="padding:20px; max-width:800px; margin:0 auto;">
          
          <!-- TARJETA CON UID -->
          <div style="background:white; border-radius:10px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.1); margin-bottom:20px;">
            <h2 style="color:#8B4513;">👨‍⚖️ Panel del Juez</h2>
            
            <!-- UID DESTACADO -->
            <div style="background:#f0f7ff; padding:15px; border-radius:8px; margin:15px 0;">
              <div style="font-size:12px; color:#666;">UID (desde Firebase)</div>
              <div style="font-family:monospace; font-size:18px; font-weight:bold; color:#8B4513; word-break:break-all;">
                ${uid}
              </div>
              <button onclick="navigator.clipboard.writeText('${uid}').then(()=>alert('✅ UID copiado'))" 
                      style="margin-top:10px; padding:5px 10px; background:#8B4513; color:white; border:none; border-radius:5px; cursor:pointer;">
                📋 Copiar UID
              </button>
            </div>
            
            <!-- DATOS DEL PERFIL -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>Nombre:</strong> ${profile.displayName || 'N/A'}</div>
              <div><strong>Email:</strong> ${profile.realEmail || currentUser.email || 'N/A'}</div>
              <div><strong>Juez:</strong> ${profile.isJudge ? '✅ Sí' : '❌ No'}</div>
              <div><strong>Activado:</strong> ${profile.activated ? '✅ Sí' : '❌ No'}</div>
            </div>
          </div>
          
          <!-- AQUÍ VA EL RESTO DE TU CONTENIDO VISUAL -->
          <div style="background:white; border-radius:10px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h3>⚖️ Contenido del Juez</h3>
            <p>Aquí puedes poner todo lo que necesites...</p>
            <p>El UID ya está disponible para usar en tus funciones: <strong>${uid}</strong></p>
          </div>
          
        </div>
      `;
      
    } catch (error) {
      console.error('❌ Error:', error);
      return `<div style="padding:20px; color:red;">Error: ${error.message}</div>`;
    }
  };
  
  // ===== EXPONER FUNCIÓN GLOBALMENTE =====
  console.log('✅ juez.js cargado - SIN SEGURIDAD - Obtiene UID directo de Firebase');
  
})();
