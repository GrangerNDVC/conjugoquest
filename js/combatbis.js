// ===========================
// CONJUGO QUEST - SYSTÈME DE COMBAT CORRIGÉ
// ===========================

let donneesNiveau = null;
let niveauActuel = 1;
let phaseActuelle = 'intro';
let viesJoueur = 3;
let viesTour = 20;
let viesTourActuelles = 20;
let combo = 0;

let poolAttaques = [];
let poolDefenses = [];
let indexAttaque = 0;
let indexDefense = 0;

let questionActuelle = null;
let enDefense = false;

// ===========================
// CHARGER / SAUVEGARDER VIA SaveSystem (source unique de vérité)
// ===========================

function chargerSauvegarde() {
    try {
        const save = window.SaveSystem ? SaveSystem.getSave()
            : JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
        viesJoueur = (save.viesHero !== undefined && save.viesHero > 0) ? save.viesHero : 3;
        console.log("✅ Sauvegarde chargée, vies:", viesJoueur);
        // Corriger en local si viesHero était 0
        if (!save.viesHero || save.viesHero <= 0) {
            if (window.SaveSystem) SaveSystem.saveVies(3);
        }
    } catch(e) {
        console.error("❌ chargerSauvegarde() échoué:", e);
        viesJoueur = 3;
    }
}

function sauvegarderVies() {
    try {
        if (window.SaveSystem) {
            SaveSystem.saveVies(viesJoueur);
        } else {
            const save = JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
            save.viesHero = viesJoueur;
            localStorage.setItem('conjugoquest_save', JSON.stringify(save));
        }
    } catch(e) {
        console.error("❌ sauvegarderVies() échoué:", e);
    }
}

// ===========================
// GESTION AUDIO (inchangée)
// ===========================

const AudioManager = {
    music: null,
    currentMusic: '',
    musicVolume: 0.15,
    sfxVolume: 0.22,
    audioContext: null,
    
    init() {
        const savedMusicVolume = localStorage.getItem('conjugoquest_music_volume');
        const savedSfxVolume = localStorage.getItem('conjugoquest_sfx_volume');
        
        if (savedMusicVolume !== null) this.musicVolume = parseFloat(savedMusicVolume);
        if (savedSfxVolume !== null) this.sfxVolume = parseFloat(savedSfxVolume);
        
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn("Web Audio API non supportée");
        }
        
        this.updateVolumeSliders();
    },
    
    updateVolumeSliders() {
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        
        if (musicSlider) {
            musicSlider.value = this.musicVolume * 100;
            const musicValue = document.getElementById('music-volume-value');
            if (musicValue) musicValue.textContent = Math.round(this.musicVolume * 100) + '%';
        }
        
        if (sfxSlider) {
            sfxSlider.value = this.sfxVolume * 100;
            const sfxValue = document.getElementById('sfx-volume-value');
            if (sfxValue) sfxValue.textContent = Math.round(this.sfxVolume * 100) + '%';
        }
    },
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        localStorage.setItem('conjugoquest_music_volume', volume.toString());
        if (this.music) this.music.volume = volume;
        this.updateVolumeSliders();
    },
    
    setSfxVolume(volume) {
        this.sfxVolume = volume;
        localStorage.setItem('conjugoquest_sfx_volume', volume.toString());
        this.updateVolumeSliders();
    },
    
    playTirHero(niveau) {
        const freq = 300 + (niveau * 20);
        this.playBeep(freq, 0.1, 'sawtooth', this.sfxVolume);
    },
    
    playTirEnnemi(niveau) {
        const freq = 200 + (niveau * 15);
        this.playBeep(freq, 0.15, 'triangle', this.sfxVolume * 0.8);
    },
    
    playHitEnemy() {
        this.playBeep(150, 0.2, 'square', this.sfxVolume);
    },
    
    playHitHero() {
        this.playBeep(80, 0.3, 'sawtooth', this.sfxVolume);
    },
    
    playRebond() {
        this.playBeep(400, 0.1, 'sine', this.sfxVolume * 0.7);
        setTimeout(() => this.playBeep(600, 0.1, 'sine', this.sfxVolume * 0.5), 50);
    },
    
    playError() {
        this.playBeep(200, 0.2, 'square', this.sfxVolume * 0.8);
        setTimeout(() => this.playBeep(150, 0.3, 'square', this.sfxVolume * 0.8), 100);
    },
    
    playTransition() {
        this.playBeep(300, 0.3, 'sine', this.sfxVolume);
        setTimeout(() => this.playBeep(400, 0.3, 'sine', this.sfxVolume), 150);
        setTimeout(() => this.playBeep(500, 0.4, 'sine', this.sfxVolume), 300);
    },
    
    playBeep(frequency, duration, type = 'sine', volume = 0.2) {
        if (!this.audioContext) return;
        
        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log("Erreur son:", e);
        }
    },
    
    play(name, volume = this.musicVolume, loop = true) {
        try {
            if (this.currentMusic === name && this.music && !this.music.paused) return;
            
            if (this.music) {
                this.music.pause();
                this.music = null;
            }
            
            this.music = new Audio(`sounds/${name}.mp3`);
            this.music.volume = volume;
            this.music.loop = loop;
            
            this.music.addEventListener('error', (e) => {
                console.warn(`⚠️ Audio non trouvé: sounds/${name}.mp3`);
            });
            
            const playPromise = this.music.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("🔇 Lecture automatique bloquée");
                });
            }
            
            this.currentMusic = name;
            
        } catch (e) {
            console.error("❌ Erreur audio:", e);
        }
    },
    
    stop() {
        if (this.music) {
            this.music.pause();
            this.music = null;
            this.currentMusic = '';
        }
    },
    
    unlockAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.playBeep(1, 0.01, 'sine', 0);
    }
};

AudioManager.init();

document.addEventListener('click', function unlockOnFirstClick() {
    AudioManager.unlockAudio();
    document.removeEventListener('click', unlockOnFirstClick);
}, { once: true });

function toggleAudioPanel() {
    const panel = document.getElementById('audio-controls');
    const button = document.getElementById('audio-toggle');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        button.textContent = '🔊';
    } else {
        panel.style.display = 'none';
        button.textContent = '🔈';
    }
}

function updateMusicVolume(value) {
    AudioManager.setMusicVolume(value / 100);
}

function updateSfxVolume(value) {
    AudioManager.setSfxVolume(value / 100);
}

console.log("⚔️ Système de combat chargé !");

if (typeof VISUAL_CONFIG !== 'undefined') {
    console.log("✅ VISUAL_CONFIG trouvé !");
} else {
    console.error("❌ VISUAL_CONFIG n'est PAS trouvé !");
}

// ===========================
// INVITATIONS DUEL (reçues pendant le combat)
// ===========================

function ecouterInvitationsPendantCombat() {
    if (!window.FirebaseDB || !window.SaveSystem) return;
    const userId = SaveSystem.getCurrentUserId();
    if (!userId) return;

    window.FirebaseDB.collection('invitations')
        .where('pour', '==', userId)
        .where('statut', '==', 'en_attente')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    afficherInvitationCombat(change.doc.data(), change.doc.id);
                }
            });
        }, err => console.warn('Invitations combat:', err.message));
}

function afficherInvitationCombat(inv, invId) {
    let overlay = document.getElementById('duel-invite-popup');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'duel-invite-popup';
        overlay.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,10,30,0.98);border:3px solid #fbbf24;border-radius:20px;padding:30px 40px;z-index:9999;text-align:center;font-family:Cinzel,serif;color:white;box-shadow:0 0 60px rgba(251,191,36,0.4);min-width:320px;';
        document.body.appendChild(overlay);
    }
    const noms = ['Présent','Passé Composé','Imparfait','Futur','Plus-que-Parfait','Futur Antérieur','Passé Simple','Passé Antérieur','BOSS Indicatif','Impératif Présent','Impératif Passé','BOSS Impératif','Conditionnel Présent','Conditionnel Passé','BOSS Conditionnel','Subjonctif Présent','Subjonctif Passé','Subjonctif Imparfait','BOSS Subjonctif','Voix Passive','BOSS FINAL'];
    const nomNiveau = noms[(inv.level||1)-1] || 'Niveau '+(inv.level||1);
    const roleLabel = inv.currentRole === 'hero' ? '🦸 Héros' : '👹 Gardien';
    const roomCode = inv.roomCode || inv.roomCode;
    overlay.innerHTML = `
        <div style="font-size:2em;margin-bottom:10px;">⚔️</div>
        <div style="color:#fbbf24;font-size:1.3em;font-weight:bold;margin-bottom:5px;">DÉFI DE ${inv.inviter.toUpperCase()}</div>
        <div style="color:#94a3b8;margin-bottom:20px;font-size:0.9em;">t'invite à un combat de conjugaison</div>
        <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:15px;margin-bottom:20px;">
            <div style="margin-bottom:8px;">📚 <strong>${nomNiveau}</strong></div>
            <div style="margin-bottom:8px;">⏱️ <strong>${inv.timeLimit||inv.time}s</strong> par réponse</div>
            <div style="margin-bottom:8px;">❤️ <strong>${inv.health}</strong> vies chacun</div>
            <div>🎭 Tu joues : <strong>${roleLabel}</strong></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
            <button onclick="rejoindreDuel('${roomCode}','${invId}')" style="padding:12px 25px;background:linear-gradient(145deg,#fbbf24,#f59e0b);border:none;border-radius:10px;color:#1a1a2e;font-family:'Cinzel',serif;font-weight:bold;cursor:pointer;">⚔️ REJOINDRE</button>
            <button onclick="refuserDuel('${invId}')" style="padding:12px 20px;background:rgba(255,255,255,0.1);border:2px solid #f43f5e;border-radius:10px;color:#f43f5e;font-family:'Cinzel',serif;cursor:pointer;">✕ Refuser</button>
        </div>`;
    overlay.style.display = 'block';
    setTimeout(() => { if (overlay.style.display !== 'none') refuserDuel(invId); }, 30000);
}

async function rejoindreDuel(roomCode, invId) {
    if (window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'acceptee' });
            await window.FirebaseDB.collection('duels').doc(roomCode).update({ statut: 'accepte' });
        } catch(e) {}
    }
    window.location.href = 'duel.html?join=' + roomCode;
}

async function refuserDuel(invId) {
    const o = document.getElementById('duel-invite-popup');
    if (o) o.style.display = 'none';
    if (invId && window.FirebaseDB) {
        try { await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'refuse' }); } catch(e) {}
    }
}

async function accepterInvitationCombat(roomCode, invId) {
    if (window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'acceptee' });
            await window.FirebaseDB.collection('duels').doc(roomCode).update({ statut: 'accepte' });
        } catch(e) {}
    }
    window.location.href = 'duel.html?accepted=true&code=' + roomCode;
}

async function refuserInvitationCombat(invId) {
    const o = document.getElementById('duel-invitation-overlay');
    if (o) o.style.display = 'none';
    if (window.FirebaseDB) {
        try { await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'refuse' }); } catch(e) {}
    }
}

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    niveauActuel = parseInt(params.get('niveau')) || 1;

    console.log(`📚 Chargement du niveau ${niveauActuel}...`);

    // CHARGER LA SAUVEGARDE AU DÉBUT
    chargerSauvegarde();
    // Écouter les invitations duel même pendant un combat
    ecouterInvitationsPendantCombat();
    // ===========================
    // VÉRIFICATION ANTI-TRICHE : contrôler le droit d'accès via Firestore
    // Un élève ne peut pas accéder à un niveau en modifiant l'URL ou localStorage
    // ===========================
    const accesAutorise = await verifierAccesNiveau(niveauActuel);
    if (!accesAutorise) {
        // Rediriger vers la carte sans message d'erreur (éviter de donner des infos)
        window.location.href = 'map.html';
        return;
    }

    await chargerDonneesNiveau();
    afficherPhaseIntro();

    const audioPanel = document.getElementById('audio-controls');
    if (audioPanel) {
        audioPanel.style.display = 'none';
    }
});

async function verifierAccesNiveau(niveau) {
    // Niveau 1 toujours accessible
    if (niveau <= 1) return true;

    try {
        // Vérifier dans Firestore (source de vérité, non modifiable par l'élève)
        if (window.FirebaseDB && window.SaveSystem) {
            const userId = SaveSystem.getCurrentUserId();
            if (!userId) return false;

            const doc = await window.FirebaseDB.collection('joueurs').doc(userId).get();
            if (!doc.exists) return false;

            const data = doc.data();
            const niveauxCompletes = data.progression?.niveauxCompletes || [];

            // Pour accéder au niveau N, il faut avoir complété le niveau N-1
            const peutAcceder = niveauxCompletes.includes(niveau - 1) || niveauxCompletes.includes(niveau);
            if (!peutAcceder) {
                console.warn(`🚫 Accès refusé au niveau ${niveau} — niveaux complétés:`, niveauxCompletes);
            }
            return peutAcceder;
        }

        // Fallback si Firebase indisponible : accepter (mode hors ligne)
        return true;

    } catch(e) {
        console.warn('⚠️ Vérification accès échouée, accès accordé par défaut:', e.message);
        return true; // En cas d'erreur réseau, ne pas bloquer le jeu
    }
}

function appliquerForme(element, shape) {
    if (!element) return;
    
    element.style.borderRadius = '';
    element.style.clipPath = '';
    element.style.transform = '';
    
    switch(shape) {
        case 'circle':
            element.style.borderRadius = '50%';
            break;
        case 'square':
            element.style.borderRadius = '10%';
            break;
        case 'triangle-right':
            element.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 50%)';
            break;
        case 'triangle-left':
            element.style.clipPath = 'polygon(100% 0%, 100% 100%, 0% 50%)';
            break;
        case 'triangle-up':
            element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            break;
        case 'triangle-down':
            element.style.clipPath = 'polygon(50% 100%, 0% 0%, 100% 0%)';
            break;
        case 'star':
            element.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            break;
        case 'lightning':
            element.style.clipPath = 'polygon(50% 0%, 40% 30%, 60% 30%, 30% 60%, 50% 60%, 20% 100%, 55% 55%, 80% 70%, 55% 40%, 70% 10%)';
            break;
        case 'light':
            element.style.clipPath = 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)';
            break;
        case 'flame':
            element.style.borderRadius = '50% 0 50% 50%';
            element.style.transform = 'rotate(-45deg)';
            break;
        default:
            element.style.borderRadius = '50%';
    }
}

function appliquerStyleNiveau() {
    console.log(`🎨 Application du style pour niveau ${niveauActuel}...`);
    
    if (typeof VISUAL_CONFIG === 'undefined') {
        console.error('❌ VISUAL_CONFIG est undefined !');
        return;
    }
    
    if (!VISUAL_CONFIG.levels[niveauActuel]) {
        console.error(`❌ Niveau ${niveauActuel} non trouvé dans VISUAL_CONFIG !`);
        return;
    }
    
    const visual = VISUAL_CONFIG.levels[niveauActuel];
    console.log(`✅ Configuration trouvée pour ${visual.name}`);
    
    const root = document.documentElement;
    
    try {
        if (visual.projectile) {
            root.style.setProperty('--projectile-size', `${visual.projectile.size}px`);
            root.style.setProperty('--projectile-color-1', visual.projectile.colors[0]);
            root.style.setProperty('--projectile-color-2', visual.projectile.colors[1]);
            root.style.setProperty('--projectile-shadow', visual.projectile.glowColor);
            root.style.setProperty('--projectile-glow-intensity', `${visual.projectile.glowIntensity}px`);
            root.style.setProperty('--projectile-speed', visual.projectile.speed);
        }
        
        if (visual.circle) {
            root.style.setProperty('--circle-size', `${visual.circle.size}px`);
            root.style.setProperty('--circle-color-1', visual.circle.colors[0] || 'rgba(100, 149, 237, 0.9)');
            root.style.setProperty('--circle-color-2', visual.circle.colors[1] || 'rgba(65, 105, 225, 0.85)');
            root.style.setProperty('--circle-color-3', visual.circle.colors[2] || 'rgba(135, 206, 250, 0.9)');
            root.style.setProperty('--circle-color-4', visual.circle.colors[3] || 'rgba(70, 130, 180, 0.8)');
            root.style.setProperty('--particle-color', visual.circle.particleColor);
            root.style.setProperty('--ring-style', visual.circle.ringStyle);
            root.style.setProperty('--circle-rotation-speed', `${visual.circle.rotationSpeed}s`);
        }
        
        if (visual.enemy && visual.enemy.projectile) {
            root.style.setProperty('--enemy-projectile-size', `${visual.enemy.projectile.size}px`);
            root.style.setProperty('--enemy-projectile-color-1', visual.enemy.projectile.colors[0]);
            root.style.setProperty('--enemy-projectile-color-2', visual.enemy.projectile.colors[1]);
            root.style.setProperty('--enemy-projectile-shadow', visual.enemy.projectile.glowColor);
            root.style.setProperty('--enemy-projectile-glow-intensity', `${visual.enemy.projectile.glowIntensity}px`);
            root.style.setProperty('--enemy-projectile-speed', visual.enemy.projectile.speed);
        }
        
        console.log(`✨ Style appliqué pour le niveau ${niveauActuel}`);
        
    } catch (error) {
        console.error('❌ Erreur style:', error);
    }
}

async function chargerDonneesNiveau() {
    try {
        if (niveauActuel === 1) {
            if (typeof NIVEAU_01_DATA === 'undefined') throw new Error("Données du niveau 1 non chargées");
            donneesNiveau = NIVEAU_01_DATA;
        } else if (niveauActuel === 2) {
            if (typeof NIVEAU_02_DATA === 'undefined') throw new Error("Données du niveau 2 non chargées");
            donneesNiveau = NIVEAU_02_DATA;
        } else if (niveauActuel === 3) {
            if (typeof NIVEAU_03_DATA === 'undefined') throw new Error("Données du niveau 3 non chargées");
            donneesNiveau = NIVEAU_03_DATA;
        } else if (niveauActuel === 4) {
            if (typeof NIVEAU_04_DATA === 'undefined') throw new Error("Données du niveau 4 non chargées");
            donneesNiveau = NIVEAU_04_DATA;
        } else if (niveauActuel === 5) {
            if (typeof NIVEAU_05_DATA === 'undefined') throw new Error("Données du niveau 5 non chargées");
            donneesNiveau = NIVEAU_05_DATA;
        } else if (niveauActuel === 6) {
            if (typeof NIVEAU_06_DATA === 'undefined') throw new Error("Données du niveau 6 non chargées");
            donneesNiveau = NIVEAU_06_DATA;
        } else if (niveauActuel === 7) {
            if (typeof NIVEAU_07_DATA === 'undefined') throw new Error("Données du niveau 7 non chargées");
            donneesNiveau = NIVEAU_07_DATA;
        } else if (niveauActuel === 8) {
            if (typeof NIVEAU_08_DATA === 'undefined') throw new Error("Données du niveau 8 non chargées");
            donneesNiveau = NIVEAU_08_DATA;
        } else if (niveauActuel === 9) {
            if (typeof NIVEAU_09_DATA === 'undefined') throw new Error("Données du niveau 9 non chargées");
            donneesNiveau = NIVEAU_09_DATA;
        } else if (niveauActuel === 10) {
            if (typeof NIVEAU_10_DATA === 'undefined') throw new Error("Données du niveau 10 non chargées");
            donneesNiveau = NIVEAU_10_DATA;
        } else if (niveauActuel === 11) {
            if (typeof NIVEAU_11_DATA === 'undefined') throw new Error("Données du niveau 11 non chargées");
            donneesNiveau = NIVEAU_11_DATA;
        } else if (niveauActuel === 12) {
            if (typeof NIVEAU_12_DATA === 'undefined') throw new Error("Données du niveau 12 non chargées");
            donneesNiveau = NIVEAU_12_DATA;
        } else if (niveauActuel === 13) {
            if (typeof NIVEAU_13_DATA === 'undefined') throw new Error("Données du niveau 13 non chargées");
            donneesNiveau = NIVEAU_13_DATA;
        } else if (niveauActuel === 14) {
            if (typeof NIVEAU_14_DATA === 'undefined') throw new Error("Données du niveau 14 non chargées");
            donneesNiveau = NIVEAU_14_DATA;
        } else if (niveauActuel === 15) {
            if (typeof NIVEAU_15_DATA === 'undefined') throw new Error("Données du niveau 15 non chargées");
            donneesNiveau = NIVEAU_15_DATA;
        } else if (niveauActuel === 16) {
            if (typeof NIVEAU_16_DATA === 'undefined') throw new Error("Données du niveau 16 non chargées");
            donneesNiveau = NIVEAU_16_DATA;
        } else if (niveauActuel === 17) {
            if (typeof NIVEAU_17_DATA === 'undefined') throw new Error("Données du niveau 17 non chargées");
            donneesNiveau = NIVEAU_17_DATA;
        } else if (niveauActuel === 18) {
            if (typeof NIVEAU_18_DATA === 'undefined') throw new Error("Données du niveau 18 non chargées");
            donneesNiveau = NIVEAU_18_DATA;
        } else if (niveauActuel === 19) {
            if (typeof NIVEAU_19_DATA === 'undefined') throw new Error("Données du niveau 19 non chargées");
            donneesNiveau = NIVEAU_19_DATA;
        } else if (niveauActuel === 20) {
            if (typeof NIVEAU_20_DATA === 'undefined') throw new Error("Données du niveau 20 non chargées");
            donneesNiveau = NIVEAU_20_DATA;
        } else if (niveauActuel === 21) {
            if (typeof NIVEAU_21_DATA === 'undefined') throw new Error("Données du niveau 21 non chargées");
            donneesNiveau = NIVEAU_21_DATA;
        } else {
            throw new Error(`Le niveau ${niveauActuel} n'existe pas`);
        }
        
        console.log("✅ Données niveau chargées:", donneesNiveau.nom);
        
        appliquerStyleNiveau();
        
        viesTour = donneesNiveau.viesTour || 20;
        viesTourActuelles = viesTour;
        
        melangerQuestions();
        
    } catch (error) {
        console.error("❌ Erreur de chargement:", error);
        alert("Erreur: " + error.message);
    }
}

function melangerQuestions() {
    poolAttaques = [...donneesNiveau.attaques];
    poolDefenses = [...donneesNiveau.defenses];
    shuffleArray(poolAttaques);
    shuffleArray(poolDefenses);
    indexAttaque = 0;
    indexDefense = 0;
    console.log(`🔀 ${poolAttaques.length} attaques et ${poolDefenses.length} défenses mélangées`);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getQuestionAttaque() {
    if (indexAttaque >= poolAttaques.length) {
        shuffleArray(poolAttaques);
        indexAttaque = 0;
    }
    return poolAttaques[indexAttaque++];
}

function getQuestionDefense() {
    if (indexDefense >= poolDefenses.length) {
        shuffleArray(poolDefenses);
        indexDefense = 0;
    }
    return poolDefenses[indexDefense++];
}

function afficherPhaseIntro() {
    console.log("🎬 Affichage phase intro...");
    phaseActuelle = 'intro';
    
    if (!donneesNiveau) {
        console.error("❌ donneesNiveau est null !");
        alert("Erreur: Les données du niveau ne sont pas chargées.");
        return;
    }
    
    AudioManager.play('Debut', AudioManager.musicVolume);
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    const nomNiveau = document.getElementById('nom-niveau');
    if (nomNiveau) {
        nomNiveau.textContent = donneesNiveau.nom;
        nomNiveau.classList.add('titre-niveau');
    }
    
    const tourIntact = document.getElementById('img-tour-intact');
    const ennemiArrogant = document.getElementById('img-ennemi-arrogant');
    const dialogueDefi = document.getElementById('dialogue-defi');
    
    if (tourIntact) tourIntact.src = `img/towers/${numeroFormatte}_intact.png`;
    
    if (ennemiArrogant) {
        ennemiArrogant.src = `img/enemies/${numeroFormatte}_arrogant.png`;
        const ennemiIntro = document.getElementById('ennemi-intro');
        if (ennemiIntro) {
            ennemiIntro.classList.remove('halo-dore', 'halo-rouge', 'halo-noir');
            ennemiIntro.classList.add('halo-dore');
        }
    }
    
    if (dialogueDefi) {
        dialogueDefi.textContent = donneesNiveau.dialogues.defi;
        dialogueDefi.classList.add('dialogue-bottom');
    }
    
    const tourIntro = document.getElementById('tour-intro');
    if (tourIntro) {
        tourIntro.classList.add('tour-container');
        if (!document.querySelector('.tour-glow')) {
            const glow = document.createElement('div');
            glow.className = 'tour-glow';
            tourIntro.appendChild(glow);
        }
    }
    
    setTimeout(() => {
        if (tourIntro) tourIntro.classList.add('assombrir');
    }, 2500);
    
    afficherPhase('phase-intro');
}

function demarrerCombat() {
    console.log("⚔️ Démarrage du combat...");
    
    const musicName = `Level${String(niveauActuel).padStart(2, '0')}`;
    AudioManager.play(musicName, AudioManager.musicVolume);
    
    const phaseIntro = document.getElementById('phase-intro');
    if (phaseIntro) phaseIntro.classList.add('fadeOut');
    
    setTimeout(() => {
        phaseActuelle = 'combat';
        
        const numeroFormatte = String(niveauActuel).padStart(2, '0');
        
        const bg = document.getElementById('background-combat');
        const tourEtat = document.getElementById('img-tour-etat');
        const ennemiEtat = document.getElementById('img-ennemi-etat');
        const heroCombat = document.getElementById('hero-combat');
        
        if (bg) bg.src = `img/backgrounds/${numeroFormatte}_debut.png`;
        if (tourEtat) tourEtat.src = `img/towers/${numeroFormatte}_intact.png`;
        if (ennemiEtat) ennemiEtat.src = `img/enemies/${numeroFormatte}_profil.png`;
        if (heroCombat) heroCombat.src = `img/combat/${numeroFormatte}_attaque.png`;
        
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.style.display = 'flex';
        }
        
        mettreAJourVies();
        mettreAJourBarreVieTour();
        
        afficherPhase('phase-combat');
        
        setTimeout(() => {
            afficherBoutonQuitter();
        }, 2000);
        
        setTimeout(() => {
            afficherQuestionAttaque();
        }, 2000);
        
    }, 1500);
}

function afficherQuestionAttaque() {
    enDefense = false;
    questionActuelle = getQuestionAttaque();
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    const hero = document.getElementById('hero-combat');
    if (hero) hero.src = `img/combat/${numeroFormatte}_attaque.png`;
    
    const zoneDefense = document.getElementById('zone-defense');
    if (zoneDefense) zoneDefense.style.display = 'none';
    
    const zoneInput = document.getElementById('zone-input-attaque');
    const zoneIncantation = document.getElementById('zone-incantation');
    
    if (zoneInput) zoneInput.style.display = 'block';
    if (zoneIncantation) zoneIncantation.style.display = 'block';
    
    const incantationDiv = document.getElementById('incantation-text');
    if (incantationDiv) incantationDiv.classList.remove('correct', 'incorrect');
    
    const verbeInf = document.getElementById('verbe-infinitif');
    const tempsVerb = document.getElementById('temps-verbal');
    const personneVerb = document.getElementById('personne-verbal');
    
    if (verbeInf) verbeInf.textContent = questionActuelle.verbe.toUpperCase();
    
    if (tempsVerb) {
        if (questionActuelle.temps) {
            tempsVerb.textContent = questionActuelle.temps;
        } else {
            tempsVerb.textContent = donneesNiveau.nom;
        }
    }
    
    if (personneVerb) personneVerb.textContent = questionActuelle.personne;
    
    if (incantationDiv) {
        incantationDiv.innerHTML = `<div class="incantation-complete">${questionActuelle.incantation.replace('{VERBE}', '<span class="trou-verbe">___</span>')}</div>`;
    }
    
    const input = document.getElementById('input-conjugaison');
    if (input) {
        input.value = '';
        input.focus();
    }
}

function validerAttaque() {
    const reponse = document.getElementById('input-conjugaison')?.value.trim().toLowerCase() || '';
    const solution = questionActuelle.solution.toLowerCase();
    
    const incantationDiv = document.getElementById('incantation-text');
    
    if (reponse === solution) {
        console.log("✅ Bonne conjugaison !");
        
        AudioManager.playTirHero(niveauActuel);
        
        if (incantationDiv) {
            incantationDiv.innerHTML = `<div class="incantation-complete">${questionActuelle.incantation.replace('{VERBE}', `<span class="verbe-remplace">${questionActuelle.solution}</span>`)}</div>`;
            incantationDiv.classList.add('correct');
        }
        
        const zoneInput = document.getElementById('zone-input-attaque');
        if (zoneInput) zoneInput.style.display = 'none';
        
        setTimeout(() => {
            lancerParticuleAttaque(questionActuelle.solution);
            
            const zoneIncantation = document.getElementById('zone-incantation');
            if (zoneIncantation) zoneIncantation.style.display = 'none';
            
            setTimeout(() => {
                viesTourActuelles--;
                mettreAJourBarreVieTour();
                
                const ennemi = document.getElementById('img-ennemi-etat');
                if (ennemi) {
                    ennemi.classList.add('touche');
                    AudioManager.playHitEnemy();
                    setTimeout(() => ennemi.classList.remove('touche'), 500);
                }
                
                combo++;
                if (combo >= 5) {
                    if (viesJoueur < 3) {
                        viesJoueur++;
                        mettreAJourVies();
                        sauvegarderVies(); // SAUVEGARDE LES VIES
                        afficherMessage("🔥 COMBO ! +1 ❤️", 'success');
                    }
                    combo = 0;
                }
                mettreAJourCombo();
                
                if (viesTourActuelles === Math.floor(viesTour / 2)) {
                    afficherMilieuCombat();
                } else if (viesTourActuelles <= 0) {
                    setTimeout(() => afficherPhaseVictoire(), 1000);
                } else {
                    setTimeout(() => afficherQuestionDefense(), 1500);
                }
            }, 1000);
        }, 1200);
        
    } else {
        console.log("❌ Mauvaise conjugaison...");
        
        AudioManager.playError();
        
        if (incantationDiv) {
            incantationDiv.innerHTML = `<div class="incantation-complete">${questionActuelle.incantation.replace('{VERBE}', `<span class="verbe-remplace">${reponse || '?'}</span>`)}</div>`;
            incantationDiv.classList.add('incorrect');
        }
        
        const zoneInput = document.getElementById('zone-input-attaque');
        if (zoneInput) {
            const messageErreur = document.createElement('div');
            messageErreur.id = 'message-erreur-conjugaison';
            messageErreur.style.cssText = `
                color: #ff4444;
                font-size: 1.4em;
                font-weight: bold;
                margin-top: 10px;
                text-shadow: 0 0 10px #ff0000;
            `;
            messageErreur.textContent = `✗ Réponse : ${questionActuelle.solution}`;
            zoneInput.appendChild(messageErreur);
            
            setTimeout(() => {
                if (messageErreur.parentNode) messageErreur.remove();
                if (zoneInput) zoneInput.style.display = 'none';
                
                const zoneIncantation = document.getElementById('zone-incantation');
                if (zoneIncantation) zoneIncantation.style.display = 'none';
                
                combo = 0;
                mettreAJourCombo();
                
                setTimeout(() => afficherQuestionDefense(), 1000);
            }, 2500);
        }
    }
}

function lancerParticuleAttaque(texteVerbe) {
    const particule = document.getElementById('particule-attaque');
    const ennemi = document.getElementById('ennemi-combat');
    const hero = document.getElementById('hero-combat');
    
    if (!particule || !ennemi || !hero) return;
    
    if (typeof VISUAL_CONFIG === 'undefined' || !VISUAL_CONFIG.levels[niveauActuel]) {
        console.error('❌ Configuration visuelle non disponible');
        return;
    }
    
    const visual = VISUAL_CONFIG.levels[niveauActuel].projectile;
    
    particule.style.cssText = `
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 5px black;
        z-index: 200;
        transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    particule.style.width = `${visual.size}px`;
    particule.style.height = `${visual.size}px`;
    particule.style.background = `radial-gradient(circle, ${visual.colors[0]}, ${visual.colors[1]})`;
    particule.style.boxShadow = `0 0 ${visual.glowIntensity}px ${visual.glowColor}`;
    
    appliquerForme(particule, visual.shape);
    
    particule.textContent = texteVerbe;
    
    const heroRect = hero.getBoundingClientRect();
    const ennemiRect = ennemi.getBoundingClientRect();
    
    particule.style.left = heroRect.left + heroRect.width / 2 - visual.size/2 + 'px';
    particule.style.top = heroRect.top + heroRect.height / 2 - visual.size/2 + 'px';
    particule.style.opacity = '1';
    
    setTimeout(() => {
        particule.style.left = ennemiRect.left + ennemiRect.width / 2 - visual.size/2 + 'px';
        particule.style.top = ennemiRect.top + ennemiRect.height / 2 - visual.size/2 + 'px';
        particule.style.opacity = '0.2';
    }, 50);
    
    const heroCombat = document.getElementById('hero-combat');
    if (heroCombat) heroCombat.classList.add('attaque-recoil');
    
    setTimeout(() => {
        particule.style.display = 'none';
        particule.style.transition = 'none';
        particule.style.opacity = '1';
        particule.textContent = '';
        if (heroCombat) heroCombat.classList.remove('attaque-recoil');
    }, 1100);
}

function afficherQuestionDefense() {
    enDefense = true;
    questionActuelle = getQuestionDefense();
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    const hero = document.getElementById('hero-combat');
    if (hero) hero.src = `img/combat/${numeroFormatte}_defense.png`;
    
    const zoneIncantation = document.getElementById('zone-incantation');
    if (zoneIncantation) zoneIncantation.style.display = 'none';
    
    const zoneDefense = document.getElementById('zone-defense');
    if (zoneDefense) zoneDefense.style.display = 'block';
    
    const questionDefense = document.getElementById('question-defense');
    if (questionDefense) questionDefense.textContent = questionActuelle.question;
    
    const reponsesDiv = document.getElementById('reponses-defense');
    if (reponsesDiv) {
        reponsesDiv.innerHTML = '';
        
        const choix = questionActuelle.choix || questionActuelle.reponses || [];
        
        choix.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'reponse-btn';
            btn.textContent = item;
            btn.onclick = () => validerDefense(index);
            reponsesDiv.appendChild(btn);
        });
    }
}

function validerDefense(indexReponse) {
    const boutons = document.querySelectorAll('.reponse-btn');
    const bonneReponse = questionActuelle.solution;
    
    boutons.forEach(btn => btn.disabled = true);
    
    AudioManager.playTirEnnemi(niveauActuel);
    
    lancerProjectileEnnemi(indexReponse === bonneReponse);
    
    setTimeout(() => {
        if (indexReponse === bonneReponse) {
            console.log("✅ Bonne défense !");
            boutons[indexReponse].classList.add('correcte');
            
            combo++;
            if (combo >= 5) {
                if (viesJoueur < 3) {
                    viesJoueur++;
                    mettreAJourVies();
                    sauvegarderVies(); // SAUVEGARDE LES VIES
                    afficherMessage("🔥 COMBO ! +1 ❤️", 'success');
                }
                combo = 0;
            }
            mettreAJourCombo();
            
            setTimeout(() => afficherQuestionAttaque(), 1500);
            
        } else {
            console.log("❌ Mauvaise défense...");
            boutons[indexReponse].classList.add('incorrecte');
            boutons[bonneReponse].classList.add('correcte');
            
            AudioManager.playHitHero();
            
            const hero = document.getElementById('hero-combat');
            if (hero) {
                hero.classList.add('touche', 'recul-defense');
                setTimeout(() => {
                    hero.classList.remove('touche', 'recul-defense');
                }, 800);
            }
            
            viesJoueur--;
            mettreAJourVies();
            sauvegarderVies(); // SAUVEGARDE LES VIES
            
            combo = 0;
            mettreAJourCombo();
            
            setTimeout(() => {
                if (viesJoueur <= 0) {
                    afficherPhaseDefaite();
                } else {
                    afficherQuestionAttaque();
                }
            }, 2000);
        }
    }, 800);
}

function lancerProjectileEnnemi(rebondit = false) {
    if (typeof VISUAL_CONFIG === 'undefined' || !VISUAL_CONFIG.levels[niveauActuel]) {
        console.error('❌ Configuration visuelle non disponible');
        return;
    }
    
    const visual = VISUAL_CONFIG.levels[niveauActuel].enemy.projectile;
    
    let proj = document.getElementById('projectile-ennemi');
    if (!proj) {
        proj = document.createElement('div');
        proj.id = 'projectile-ennemi';
        proj.style.cssText = `position: fixed; z-index: 150; display: none;`;
        document.getElementById('phase-combat')?.appendChild(proj);
    }
    
    const ennemi = document.getElementById('ennemi-combat');
    const hero = document.getElementById('hero-combat');
    if (!ennemi || !hero) return;
    
    proj.style.cssText = `
        position: fixed;
        display: block;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 150;
    `;
    
    proj.style.width = `${visual.size}px`;
    proj.style.height = `${visual.size}px`;
    proj.style.background = `radial-gradient(circle, ${visual.colors[0]}, ${visual.colors[1]})`;
    proj.style.boxShadow = `0 0 ${visual.glowIntensity}px ${visual.glowColor}`;
    
    appliquerForme(proj, visual.shape);
    
    const ennemiRect = ennemi.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    
    proj.style.left = ennemiRect.left + ennemiRect.width / 2 - visual.size/2 + 'px';
    proj.style.top = ennemiRect.top + ennemiRect.height / 2 - visual.size/2 + 'px';
    
    setTimeout(() => {
        proj.style.left = heroRect.left + heroRect.width / 2 - visual.size/2 + 'px';
        proj.style.top = heroRect.top + heroRect.height / 2 - visual.size/2 + 'px';
    }, 50);
    
    if (rebondit) {
        AudioManager.playRebond();
        
        setTimeout(() => {
            proj.style.transition = 'all 1.2s cubic-bezier(0.3, 0.9, 0.4, 1)';
            proj.style.top = '-150px';
            proj.style.transform = 'scale(0.3)';
            proj.style.opacity = '0';
        }, 650);
        
        setTimeout(() => {
            proj.style.display = 'none';
            proj.style.transition = 'none';
            proj.style.transform = 'scale(1)';
            proj.style.opacity = '1';
        }, 1900);
    } else {
        setTimeout(() => {
            proj.style.display = 'none';
            proj.style.transition = 'none';
        }, 700);
    }
}

function afficherMilieuCombat() {
    console.log("🔥 Milieu du combat !");
    
    masquerBoutonQuitter();
    
    AudioManager.playTransition();
    
    const zoneIncantation = document.getElementById('zone-incantation');
    const zoneDefense = document.getElementById('zone-defense');
    if (zoneIncantation) zoneIncantation.style.display = 'none';
    if (zoneDefense) zoneDefense.style.display = 'none';
    
    const transition = document.createElement('div');
    transition.id = 'transition-milieu';
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 500;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;
    document.getElementById('phase-combat')?.appendChild(transition);
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    setTimeout(() => {
        const tourImg = document.createElement('img');
        tourImg.src = `img/towers/${numeroFormatte}_abime.png`;
        tourImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(tourImg);
    }, 500);
    
    setTimeout(() => {
        const ennemiImg = document.createElement('img');
        ennemiImg.src = `img/enemies/${numeroFormatte}_colere.png`;
        ennemiImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
            filter: drop-shadow(0 0 30px #ff4444) drop-shadow(0 0 60px rgba(255, 68, 68, 0.5));
        `;
        transition.appendChild(ennemiImg);
    }, 2500);
    
    setTimeout(() => {
        const dialogue = document.createElement('div');
        dialogue.textContent = donneesNiveau.dialogues.milieu_combat;
        dialogue.className = 'dialogue-box';
        dialogue.style.cssText = `
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 700px;
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards;
            z-index: 501;
        `;
        transition.appendChild(dialogue);
    }, 4500);
    
    setTimeout(() => {
        transition.style.opacity = '0';
        transition.style.transition = 'opacity 1s';
        
        setTimeout(() => {
            transition.remove();
            
            const bg = document.getElementById('background-combat');
            const ennemi = document.getElementById('img-ennemi-etat');
            
            if (bg) bg.src = `img/backgrounds/${numeroFormatte}_milieu.png`;
            if (ennemi) ennemi.src = `img/enemies/${numeroFormatte}_profil.png`;
            
            afficherBoutonQuitter();
            
            afficherQuestionDefense();
        }, 1000);
    }, 7500);
}

function afficherPhaseVictoire() {
    console.log("🎉 VICTOIRE !");
    phaseActuelle = 'victoire';
    
    masquerBoutonQuitter();
    
    if (niveauActuel === 21) {
        AudioManager.play('Victoire_boss_fin', AudioManager.musicVolume);
    } else {
        AudioManager.play('Victoire', AudioManager.musicVolume);
    }
    
    const zoneIncantation = document.getElementById('zone-incantation');
    const zoneDefense = document.getElementById('zone-defense');
    if (zoneIncantation) zoneIncantation.style.display = 'none';
    if (zoneDefense) zoneDefense.style.display = 'none';
    
    const transition = document.createElement('div');
    transition.id = 'transition-victoire';
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 500;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;
    document.getElementById('phase-combat')?.appendChild(transition);
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    setTimeout(() => {
        const tourImg = document.createElement('img');
        tourImg.src = `img/towers/${numeroFormatte}_detruit.png`;
        tourImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(tourImg);
    }, 500);
    
    setTimeout(() => {
        const ennemiImg = document.createElement('img');
        ennemiImg.src = `img/enemies/${numeroFormatte}_vaincu.png`;
        ennemiImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
            filter: drop-shadow(0 0 30px #2a2a2a) drop-shadow(0 0 60px rgba(0, 0, 0, 0.8));
        `;
        transition.appendChild(ennemiImg);
    }, 2500);
    
    setTimeout(() => {
        const dialogue = document.createElement('div');
        dialogue.textContent = donneesNiveau.dialogues.victoire_joueur;
        dialogue.className = 'dialogue-box';
        dialogue.style.cssText = `
            position: absolute;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 700px;
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards;
            z-index: 501;
        `;
        transition.appendChild(dialogue);
    }, 4500);
    
    setTimeout(() => {
        transition.innerHTML = '';
        
        const recompenseImg = document.createElement('img');
        recompenseImg.src = `img/combat/${numeroFormatte}_recompense.png`;
        recompenseImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 70vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
            filter: drop-shadow(0 0 50px gold);
        `;
        transition.appendChild(recompenseImg);
        
        const texteEquipement = document.createElement('div');
        texteEquipement.textContent = '🎁 Tu as obtenu de nouveaux équipements !';
        texteEquipement.className = 'dialogue-box';
        texteEquipement.style.cssText = `
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.5em;
            opacity: 0;
            animation: fadeIn 0.5s ease-out 0.5s forwards;
            text-align: center;
            max-width: 80%;
            z-index: 501;
        `;
        transition.appendChild(texteEquipement);
        
        setTimeout(() => {
            texteEquipement.style.transition = 'opacity 0.5s';
            texteEquipement.style.opacity = '0';
            
            setTimeout(() => {
                texteEquipement.remove();
                
                const btnRetour = document.createElement('button');
                btnRetour.textContent = '🗺️ RETOUR À LA CARTE';
                btnRetour.style.cssText = `
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 20px 50px;
                    font-size: 1.5em;
                    font-family: 'Cinzel', serif;
                    font-weight: 700;
                    background: linear-gradient(145deg, #c8a871 0%, #a88a5f 100%);
                    border: 4px solid #8B4513;
                    border-radius: 50px;
                    color: #2d2416;
                    cursor: pointer;
                    box-shadow: 0 8px 0 #4a2c0f, 0 10px 20px rgba(0,0,0,0.5);
                    opacity: 0;
                    animation: fadeIn 0.5s ease-out forwards;
                    z-index: 503;
                `;
                btnRetour.onclick = async () => {
                    btnRetour.disabled = true;
                    btnRetour.textContent = '⏳ Sauvegarde...';
                    await sauvegarderVictoire();
                    window.location.href = 'map.html';
                };
                transition.appendChild(btnRetour);
            }, 500);
        }, 2000);
    }, 7000);
}

async function sauvegarderVictoire() {
    try {
        if (window.SaveSystem) {
            // completeLevelAndWait attend la confirmation Firestore avant de continuer
            await SaveSystem.completeLevelAndWait(niveauActuel);
        } else {
            const save = JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
            if (!save.niveauxCompletes) save.niveauxCompletes = [];
            if (!save.niveauxCompletes.includes(niveauActuel)) save.niveauxCompletes.push(niveauActuel);
            if (niveauActuel < 21) save.niveauActuel = niveauActuel + 1;
            save.viesHero = 3;
            localStorage.setItem('conjugoquest_save', JSON.stringify(save));
        }
        console.log("💾 Victoire sauvegardée et confirmée !");
    } catch(e) {
        console.error("❌ sauvegarderVictoire() échoué:", e);
    }
}

function afficherPhaseDefaite() {
    phaseActuelle = 'defaite';
    
    masquerBoutonQuitter();
    
    AudioManager.play('Defaite', AudioManager.musicVolume);
    
    const hero = document.getElementById('img-hero-defaite');
    const message = document.getElementById('message-defaite');
    
    if (hero) hero.src = `img/combat/hero_defaite.png`;
    if (message) message.textContent = donneesNiveau.dialogues.defaite_joueur;
    
    afficherPhase('phase-defaite');
}

function recommencerCombat() {
    viesJoueur = 3;
    viesTourActuelles = viesTour;
    combo = 0;
    
    sauvegarderVies(); // SAUVEGARDE LES VIES
    
    melangerQuestions();
    demarrerCombat();
}

function retourCarte() {
    AudioManager.stop();
    window.location.href = 'map.html';
}

function quitterJeu() {
    if (confirm("🚪 Quitter le jeu ?\n(La progression sera sauvegardée)")) {
        AudioManager.stop();
        window.location.href = 'login.html';
    }
}

function afficherBoutonQuitter() {
    const btnQuitter = document.getElementById('btn-quitter-jeu');
    
    if (btnQuitter) {
        btnQuitter.style.display = 'flex';
        btnQuitter.onclick = quitterJeu;
    }
}

function masquerBoutonQuitter() {
    const btnQuitter = document.getElementById('btn-quitter-jeu');
    
    if (btnQuitter) btnQuitter.style.display = 'none';
}

function afficherPhase(phaseId) {
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    document.getElementById(phaseId)?.classList.add('active');
}

function mettreAJourVies() {
    const viesDiv = document.getElementById('vies-joueur');
    if (viesDiv) {
        const coeurs = '❤️'.repeat(viesJoueur) + '🖤'.repeat(3 - viesJoueur);
        viesDiv.innerHTML = coeurs;
    }
}

function mettreAJourBarreVieTour() {
    const vieTour = document.getElementById('vie-tour-actuelle');
    if (vieTour) {
        const pourcentage = (viesTourActuelles / viesTour) * 100;
        vieTour.style.width = pourcentage + '%';
    }
}

function mettreAJourCombo() {
    const comboDiv = document.getElementById('combo-counter');
    if (!comboDiv) return;
    
    if (combo > 0) {
        comboDiv.style.display = 'block';
        const comboNombre = document.getElementById('combo-nombre');
        if (comboNombre) comboNombre.textContent = combo;
    } else {
        comboDiv.style.display = 'none';
    }
}

function afficherMessage(texte, type) {
    const msg = document.createElement('div');
    msg.textContent = texte;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: ${type === 'success' ? '#4CAF50' : '#F44336'};
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 2em;
        z-index: 9999;
        animation: fadeInOut 2s ease-out;
        border: 3px solid ${type === 'success' ? '#4CAF50' : '#F44336'};
        box-shadow: 0 0 50px ${type === 'success' ? '#4CAF50' : '#F44336'};
    `;
    document.body.appendChild(msg);
    
    setTimeout(() => msg.remove(), 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (phaseActuelle === 'combat' && !enDefense) {
            validerAttaque();
        }
    }
});

const urlParams = new URLSearchParams(window.location.search);
const skipTo = urlParams.get('skipTo');

if (skipTo) {
    console.log(`🛠️ DEBUG: Skip vers ${skipTo}`);
    
    setTimeout(() => {
        if (skipTo === 'milieu') {
            viesTourActuelles = Math.floor(viesTour / 2);
            mettreAJourBarreVieTour();
            afficherMilieuCombat();
        } else if (skipTo === 'victoire') {
            afficherPhaseVictoire();
        } else if (skipTo === 'defaite') {
            afficherPhaseDefaite();
        }
    }, 2000);
}

window.skipToMilieu = function() {
    console.log("🛠️ DEBUG: Skip forcé vers milieu combat");
    afficherMilieuCombat();
};

window.skipToVictoire = function() {
    console.log("🛠️ DEBUG: Skip forcé vers victoire");
    afficherPhaseVictoire();
};

window.skipToDefaite = function() {
    console.log("🛠️ DEBUG: Skip forcé vers défaite");
    afficherPhaseDefaite();
};

window.setViesHero = function(vies) {
    viesJoueur = vies;
    mettreAJourVies();
    sauvegarderVies();
    console.log(`❤️ Vies héros: ${vies}`);
};

window.setViesTour = function(vies) {
    viesTourActuelles = vies;
    mettreAJourBarreVieTour();
    console.log(`🏰 Vies tour: ${vies}`);
};

window.godMode = function() {
    viesJoueur = 999;
    mettreAJourVies();
    sauvegarderVies();
    console.log("⚡ Mode Dieu activé !");
};