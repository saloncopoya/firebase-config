// share.js
window.renderShareScreen = function() {
  const shareId = AppState.firebaseShare.shareId || 'sin-id';
  const shareReady = AppState.firebaseShare.isEnabled;
  
  return `
    <div style="min-height: 100vh; background: #f8f9fa; padding: 20px;">
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Cabecera del contenido compartido -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    border-radius: 20px; padding: 30px; margin-bottom: 20px; 
                    color: white; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 15px;">🔗</div>
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Contenido Compartido</h2>
          <p style="margin: 0; opacity: 0.9;">
            ID: <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; 
                        border-radius: 20px;">${shareId}</span>
          </p>
        </div>
        
        <!-- Estado de Firebase Share -->
        <div style="background: white; border-radius: 12px; padding: 15px; 
                    margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: flex; align-items: center; gap: 10px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; 
                      background: ${shareReady ? '#4CAF50' : '#FF9800'};"></div>
          <span style="color: #666;">
            ${shareReady 
              ? '✅ Conectado al servidor de contenido'
              : '⏳ Conectando con servidor...'}
          </span>
        </div>
        
        <!-- Aquí se cargará el contenido real -->
        <div style="background: white; border-radius: 16px; padding: 40px 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;
                    border: 2px dashed #8B4513;">
          <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
          <h3 style="color: #333; margin: 0 0 10px 0;">Contenido del Share</h3>
          <p style="color: #666; margin: 0;">
            Aquí se mostrará el contenido correspondiente al ID: 
            <strong>${shareId}</strong>
          </p>
        </div>
      </div>
    </div>
  `;
};

console.log("✅ share.js cargado correctamente");
