// ==============================================
// CONFIGURACIÓN DE FIREBASE - Archivo externo
// ==============================================

// DOMINIOS PERMITIDOS (SOLO ESTOS)
const dominiosPermitidos = [
    'cmbt-2211-94b-omega.blogspot.com',
    'legadoavicola.blogspot.com'
];

const dominioActual = window.location.hostname;
const dominioPermitido = dominiosPermitidos.includes(dominioActual);

if (dominioPermitido) {
    // SOLO SI ES TU DOMINIO, CARGA LA CONFIGURACIÓN
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
    // SI NO ES TU DOMINIO, NO CARGA NADA
    window.FIREBASE_CONFIG = null;
}
