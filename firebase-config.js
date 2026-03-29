const dominiosPermitidos = [
    'cmbt-2211-94b-omega.blogspot.com',
    'localhost',
    '127.0.0.1'
];

const dominioActual = window.location.hostname;
const dominioPermitido = dominiosPermitidos.includes(dominioActual);

if (!dominioPermitido) {
    console.error(`🚫 Dominio: ${dominioActual}`);
    window.FIREBASE_CONFIG = null;
} else {
    window.FIREBASE_CONFIG = {
        apiKey: "AIzaSyASox7mRak5V0py29htEVWCVeipGpA0yfs",
        authDomain: "galloslivebadge.firebaseapp.com",
        databaseURL: "https://galloslivebadge-default-rtdb.firebaseio.com",
        projectId: "galloslivebadge",
        messagingSenderId: "979482928760",
        appId: "1:979482928760:web:3ea879dc4ee1e020df6f8d"
    };
    
    console.log('✅ Servidor Conectado');
}
