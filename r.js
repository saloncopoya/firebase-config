var dominiosPermitidosRooster = [
    'cmbt-2211-94b-omega.blogspot.com',
    'legadoavicola.blogspot.com'
];

var dominioActualRooster = window.location.hostname;
var dominioPermitidoRooster = dominiosPermitidosRooster.includes(dominioActualRooster);

if (dominioPermitidoRooster) {
    window.FIREBASE_ROOSTER_CONFIG = {
        apiKey: "AIzaSyBMON_hBlUJfE-_L6qrt8MEP6JZrculRcs",
        authDomain: "premiumcotejosgallistico-59e76.firebaseapp.com",
        databaseURL: "https://premiumcotejosgallistico-59e76-default-rtdb.firebaseio.com",
        projectId: "premiumcotejosgallistico-59e76",
        storageBucket: "premiumcotejosgallistico-59e76.firebasestorage.app",
        messagingSenderId: "785051078042",
        appId: "1:785051078042:web:8e749ba849c5e7e5407e23"
    };
    console.log('✅ Servidor Rooster conectado.');
} else {
    window.FIREBASE_ROOSTER_CONFIG = null;
    console.warn('🚫 Dominio no autorizado para Rooster:', dominioActualRooster);
}
