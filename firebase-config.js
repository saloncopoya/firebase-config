// ==============================================
// CONFIGURACIÓN DE FIREBASE - Archivo externo
// ==============================================

(function(){
    var DOMINIOS_AUTORIZADOS = [
        'cmbt-2211-94b-omega.blogspot.com',
        'legadoavicola.blogspot.com'
    ];

    var DOMINIO_ACTUAL = window.location.hostname;
    var DOMINIO_AUTORIZADO = DOMINIOS_AUTORIZADOS.includes(DOMINIO_ACTUAL);

    if (DOMINIO_AUTORIZADO) {
        window.FIREBASE_CONFIG = {
            apiKey: "AIzaSyASox7mRak5V0py29htEVWCVeipGpA0yfs",
            authDomain: "galloslivebadge.firebaseapp.com",
            databaseURL: "https://galloslivebadge-default-rtdb.firebaseio.com",
            projectId: "galloslivebadge",
            messagingSenderId: "979482928760",
            appId: "1:979482928760:web:3ea879dc4ee1e020df6f8d"
        };
        console.log('✅ Servidor conectado.');
    } else {
        window.FIREBASE_CONFIG = null;
    }
})();
