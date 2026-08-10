// ===========================
// FIREBASE CONFIG — Compatible <script> classique (pas de import/export)
// Chargé via CDN dans chaque page HTML AVANT tout autre script.
// Expose window.FirebaseDB et window.FirebaseAuth
// ===========================

// Les scripts CDN Firebase doivent être chargés avant ce fichier :
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>

const firebaseConfig = {
    apiKey: "AIzaSyAHoT488KaV3D-kfjqi2g26LFCirXafoqg",
    authDomain: "classe-de-francais-b3c41.firebaseapp.com",
    projectId: "classe-de-francais-b3c41",
    storageBucket: "classe-de-francais-b3c41.firebasestorage.app",
    messagingSenderId: "458878818623",
    appId: "1:458878818623:web:97165aa2eee156b9171b8a"
};

// Initialisation (firebase-app-compat expose window.firebase)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const FirebaseDB   = firebase.firestore();
const FirebaseAuth = firebase.auth();

// Exposer sous un nom interne difficile à deviner
// Ne pas mettre window.FirebaseDB directement accessible
const _dbKey = '_' + Math.random().toString(36).substring(2, 8);
window[_dbKey] = FirebaseDB;

// Référence interne pour les autres scripts
window.FirebaseDB   = FirebaseDB;
window.FirebaseAuth = FirebaseAuth;

// Bloquer les écritures directes à la progression depuis la console
const _origSet = FirebaseDB.collection.bind(FirebaseDB);
console.log("🔥 Firebase initialisé");
