// ==============================================
// PANTALLA DE VENTAS
// ==============================================
window.renderVentasScreen = function() {
    const currentUser = AppState.user.current;
    const userProfile = AppState.user.profile;
    
    if (!currentUser || !userProfile) {
        return '<div>Error: Usuario no encontrado</div>';
    }
    
    return `
        <div class="ventas-screen" style="padding: 20px; max-width: 800px; margin: 0 auto;">
            <!-- ENCABEZADO -->
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #8B4513; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 24px;">💰</span>
                </div>
                <div>
                    <h1 style="margin: 0; color: #333;">Módulo de Ventas</h1>
                    <p style="margin: 5px 0 0; color: #666;">Bienvenido, ${userProfile.displayName || 'Usuario'}</p>
                </div>
            </div>
            
            <!-- CONTENIDO PRINCIPAL -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #8B4513; margin-top: 0;">Tus Ventas</h2>
                <p style="color: #666;">Aquí irá el contenido de tu sección de ventas...</p>
                
                <!-- Ejemplo de tarjeta -->
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Producto</span>
                        <span style="color: #8B4513;">$0.00</span>
                    </div>
                    <div style="color: #999; font-size: 14px; margin-top: 5px;">
                        Fecha: ${new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Registrar para caché (opcional pero recomendado)
if (window.ScreenLoader) {
    ScreenLoader.registerLocalScreen('ventas', window.renderVentasScreen);
}

console.log("✅ Módulo de Ventas cargado correctamente");
