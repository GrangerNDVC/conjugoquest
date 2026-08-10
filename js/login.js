// ===========================
// LOGIN.JS - GESTION DES CONNEXIONS
// ===========================

import { auth, db } from './firebase-config.js';
import { 
    signInAnonymously 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ===========================
// MUSIQUE DE LOGIN
// ===========================

const LoginAudio = {
    music: null,
    
    play() {
        try {
            this.music = new Audio('sounds/login_choix_mode.mp3');
            this.music.volume = 0.3;
            this.music.loop = true;
            
            this.music.addEventListener('error', (e) => {
                console.warn('⚠️ Audio login non trouvé: sounds/login_choix_mode.mp3');
            });
            
            const playPromise = this.music.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("🔇 Lecture automatique bloquée sur login");
                });
            }
            
            console.log('🎵 Lecture: sounds/login_choix_mode.mp3');
            
        } catch (e) {
            console.error("❌ Erreur audio login:", e);
        }
    },
    
    stop() {
        if (this.music) {
            this.music.pause();
            this.music = null;
        }
    },
    
    unlockAudio() {
        const silentAudio = new Audio();
        silentAudio.volume = 0;
        silentAudio.play().then(() => {
            silentAudio.pause();
            console.log("🔊 Audio login déverrouillé");
        }).catch(() => {});
    }
};

// Déverrouiller l'audio au premier clic
document.addEventListener('click', function unlockLoginAudio() {
    LoginAudio.unlockAudio();
    document.removeEventListener('click', unlockLoginAudio);
}, { once: true });

// Lancer la musique au chargement
window.addEventListener('load', () => {
    LoginAudio.play();
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pseudo = document.getElementById('pseudo').value.trim();
    const codeAcces = document.getElementById('code-acces').value.trim();
    const classe = document.getElementById('classe').value.trim();
    
    const messageDiv = document.getElementById('login-message');
    
    try {
        // 1. Authentification anonyme
        await signInAnonymously(auth);
        
        // 2. Vérifier si le pseudo est déjà pris
        const userQuery = query(
            collection(db, "users"), 
            where("pseudo", "==", pseudo),
            where("classe", "==", classe)
        );
        
        const userSnapshot = await getDocs(userQuery);
        
        let userId;
        let userData;
        
        if (!userSnapshot.empty) {
            // Pseudo existant
            const userDoc = userSnapshot.docs[0];
            userData = userDoc.data();
            userId = userDoc.id;
            
            // Mettre à jour la dernière connexion
            await updateDoc(doc(db, "users", userId), {
                lastLogin: new Date()
            });
            
        } else {
            // Nouveau pseudo
            const newUser = {
                pseudo: pseudo,
                classe: classe,
                codeAcces: codeAcces,
                createdAt: new Date(),
                lastLogin: new Date(),
                isActive: true,
                isBanned: false,
                progression: {
                    niveauActuel: 1,
                    viesHero: 3,
                    niveauxCompletes: [],
                    equipements: [],
                    scoreTotal: 0,
                    tempsTotal: 0
                },
                stats: {
                    attaquesReussies: 0,
                    defensesReussies: 0,
                    combatsGagnes: 0,
                    combatsPerdus: 0
                }
            };
            
            const userRef = await setDoc(doc(collection(db, "users")), newUser);
            userId = userRef.id;
            userData = newUser;
        }
        
        // 3. Stocker la session
        localStorage.setItem('conjugoquest_user', JSON.stringify({
            userId: userId,
            pseudo: userData.pseudo,
            classe: userData.classe,
            progression: userData.progression
        }));
        
        // 4. Rediriger
        messageDiv.textContent = "✅ Connexion réussie ! Redirection...";
        messageDiv.className = "message success";
        
        // Arrêter la musique avant de quitter
        LoginAudio.stop();
        
        setTimeout(() => {
            window.location.href = 'map.html';
        }, 1500);
        
    } catch (error) {
        console.error("Erreur de connexion:", error);
        messageDiv.textContent = "❌ Erreur de connexion. Vérifie ta connexion internet.";
        messageDiv.className = "message error";
    }
});