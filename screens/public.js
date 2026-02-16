// ==============================================
// PANTALLA PÚBLICA (SIN LOGIN)
// ==============================================
window.renderPublicScreen = function() {
  return `
    <div class="public-screen" style="background: linear-gradient(135deg, #2c3e50 0%, #8B4513 100%); min-height: 100vh; color: white;">
      
      <!-- BOTÓN SUPERIOR DERECHA -->
      <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
        <button onclick="window.handleLoginClick ? window.handleLoginClick() : navigateTo('login')"                 
                style="background: #D2691E; 
                       color: white; 
                       border: 2px solid #FFD700;
                       padding: 12px 28px; 
                       border-radius: 50px; 
                       font-weight: 800; 
                       font-size: 16px;
                       cursor: pointer;
                       box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                       transition: transform 0.3s ease;"
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'">
          INICIAR SESIÓN
        </button>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 20px;">
        
        <!-- LOGO ANIMADO -->
        <div style="font-size: 100px; margin-bottom: 30px; animation: bounce 2s infinite;">🐓</div>
        
        <!-- TÍTULO CON LETRAS ANIMADAS -->
        <div style="margin-bottom: 30px;">
          ${'LEGADO AVÍCOLA'.split('').map((letra, i) => `
            <span style="display: inline-block; 
                         animation: bubble 1.5s infinite ease-in-out; 
                         animation-delay: ${i * 0.1}s; 
                         font-size: 48px; 
                         color: white; 
                         font-weight: 900;
                         text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
              ${letra === ' ' ? '&nbsp;' : letra}
            </span>
          `).join('')}
        </div>
        
        <!-- DESCRIPCIÓN -->
        <p style="font-size: 20px; color: #FFD700; margin-bottom: 40px; max-width: 600px;">
          La plataforma digital para la comunidad avícola
        </p>
        
        <!-- TARJETAS INFORMATIVAS -->
        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 900px; margin-bottom: 40px;">
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; flex: 1; min-width: 200px; border: 1px solid rgba(255,215,0,0.3);">
            <div style="font-size: 40px; margin-bottom: 15px;">🏆</div>
            <h3 style="color: #FFD700; margin-bottom: 10px;">Torneos</h3>
            <p style="color: rgba(255,255,255,0.8);">Registro y seguimiento de competencias</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; flex: 1; min-width: 200px; border: 1px solid rgba(255,215,0,0.3);">
            <div style="font-size: 40px; margin-bottom: 15px;">🧬</div>
            <h3 style="color: #FFD700; margin-bottom: 10px;">Pedigrí</h3>
            <p style="color: rgba(255,255,255,0.8);">Genealogía y líneas de sangre</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; flex: 1; min-width: 200px; border: 1px solid rgba(255,215,0,0.3);">
            <div style="font-size: 40px; margin-bottom: 15px;">👥</div>
            <h3 style="color: #FFD700; margin-bottom: 10px;">Comunidad</h3>
            <p style="color: rgba(255,255,255,0.8);">Conecta con otros criadores</p>
          </div>
        </div>
        
        <!-- BOTONES DE ACCIÓN -->
        <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
          <button onclick="navigateTo('login')" style="background: #8B4513; color: white; border: none; padding: 15px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            CREAR CUENTA
          </button>
          <button onclick="navigateTo('login')" style="background: transparent; color: white; border: 2px solid #FFD700; padding: 15px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; cursor: pointer;">
            INICIAR SESIÓN
          </button>
        </div>
      </div>
      
      <!-- ANIMACIONES CSS -->
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bubble {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
            text-shadow: 0 0 20px #FFD700;
          }
        }
      </style>
    </div>
  `;
};

// También necesitas la función handleLoginClick si no está global
if (!window.handleLoginClick) {
  window.handleLoginClick = function() {
    navigateTo('login');
  };
}

console.log("✅ Pantalla pública cargada desde GitHub");
