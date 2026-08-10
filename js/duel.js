// ===========================
// CONJUGO QUEST - MODE DUEL (Version simplifiée sans faux noms)
// ===========================

// État du joueur
const PlayerState = {
    id: (window.SaveSystem ? SaveSystem.getCurrentUserId() : localStorage.getItem('conjugoquest_userId')) || ('player_' + Date.now()),
    name: (window.SaveSystem ? SaveSystem.getCurrentPlayerName() : null) || localStorage.getItem('conjugoquest_player_name') || 'Héros',
    unlockedLevels: [],
    currentLevel: 1,
    duelStats: {
        wins: 0,
        losses: 0,
        totalDuels: 0
    }
};

// État du duel en cours
let currentDuel = {
    roomId: null,
    level: 1,
    player1: null,
    player2: null,
    player1Health: 10,
    player2Health: 10,
    currentQuestion: null,
    turnStartTime: null,
    answered: false,
    resolved: false,
    timer: null,
    timeLimit: 10000,
    history: [],
    questions: [],
    questionIndex: 0,
    isCreator: false,
    waitingForOpponent: false
};

// JOUEURS EN LIGNE — depuis Firestore en temps réel
let onlinePlayers = [];
let _unsubscribeJoueurs = null; // pour arrêter l'écoute

function chargerJoueursEnLigne() {
    if (!window.FirebaseDB) {
        console.warn('⚠️ Firebase non disponible — liste joueurs vide');
        onlinePlayers = [];
        return;
    }

    // Stopper l'écoute précédente si elle existe
    if (_unsubscribeJoueurs) { _unsubscribeJoueurs(); _unsubscribeJoueurs = null; }

    const currentUserId = window.SaveSystem ? SaveSystem.getCurrentUserId() : null;
    console.log('👤 currentUserId pour duel:', currentUserId);

    // Afficher les joueurs actifs dans les 10 dernières minutes
    _unsubscribeJoueurs = window.FirebaseDB.collection('joueurs')
        .onSnapshot(snapshot => {
            console.log('🔥 Firestore snapshot reçu:', snapshot.size, 'documents');
            const limite = Date.now() - 10 * 60 * 1000; // 10 minutes
            onlinePlayers = [];
            snapshot.forEach(doc => {
                if (currentUserId && doc.id === currentUserId) return;
                const data = doc.data();
                if (!data.pseudo) return;
                // Joueur actif si derniereConnexion dans les 10 dernières minutes
                const ts = data.derniereConnexion?.toDate?.()?.getTime() || 0;
                if (ts > 0 && ts < limite) return; // exclure si trop ancien
                // Si pas de timestamp du tout → joueur vient de se connecter → inclure
                onlinePlayers.push({
                    id: doc.id,
                    name: data.pseudo,
                    level: (data.progression?.niveauxCompletes || []).length || 1,
                    avatar: 'hero'
                });
            });
            console.log(`👥 ${onlinePlayers.length} autres joueurs dans Firestore`);
            // Rafraîchir l'affichage si la liste est visible
            const grid = document.getElementById('online-players-grid');
            if (grid && grid.dataset.currentLevel) {
                afficherJoueursDisponibles(parseInt(grid.dataset.currentLevel));
            }
        }, err => {
            console.error('❌ Erreur écoute joueurs Firestore:', err.code, err.message);
            const grid = document.getElementById('online-players-grid');
            if (!grid) return;

            if (err.code === 'permission-denied') {
                grid.innerHTML = `
                    <div class="no-players" style="color:#f87171;">
                        🔒 Accès refusé par Firestore.<br>
                        <small>Dans la console Firebase → Firestore → Règles,<br>
                        remplace les règles par :<br>
                        <code style="font-size:0.8em;color:#fbbf24;">
                        rules_version = '2';<br>
                        service cloud.firestore {<br>
                        &nbsp;match /databases/{db}/documents {<br>
                        &nbsp;&nbsp;match /{doc=**} {<br>
                        &nbsp;&nbsp;&nbsp;allow read, write: if true;<br>
                        &nbsp;&nbsp;}<br>
                        &nbsp;}<br>
                        }</code>
                        </small>
                    </div>`;
            } else {
                grid.innerHTML = `<div class="no-players">❌ Erreur Firestore: ${err.code} — ${err.message}</div>`;
            }
        });
}

let selectedOpponent = null;

async function chargerDuelDepuisFirestore(roomCode) {
    // Attendre que Firebase soit prêt (max 5 secondes)
    let attente = 0;
    while (!window.FirebaseDB && attente < 50) {
        await new Promise(r => setTimeout(r, 100));
        attente++;
    }
    if (!window.FirebaseDB) {
        alert('Firebase non disponible. Réessaie.');
        return;
    }

    try {
        const doc = await window.FirebaseDB.collection('duels').doc(roomCode).get();
        if (!doc.exists) { alert('Duel introuvable.'); window.location.href = 'duel.html'; return; }
        const d = doc.data();

        // Qui suis-je dans ce duel ?
        const monUserId = window.SaveSystem ? SaveSystem.getCurrentUserId() : null;
        const jeSuisCreateur = (d.player1Id === monUserId);

        currentDuel = {
            roomId:        roomCode,
            level:         d.level,
            player1:       { id: d.player1Id, name: d.player1Name, character: d.player1Character,
                             health: d.health, isCreator: true,  accepted: true },
            player2:       { id: d.player2Id, name: d.player2Name, character: d.player2Character,
                             health: d.health, isCreator: false, accepted: true },
            timeLimit:     d.timeLimit,
            player1Health: d.health,
            player2Health: d.health,
            isCreator:     jeSuisCreateur,
            questions:     [],
            questionIndex: 0,
            history:       []
        };

        // Charger les questions (nécessaire pour le créateur et utile au receveur pour valider)
        chargerQuestionsNiveau(currentDuel.level);

        console.log('🎮 Je suis', jeSuisCreateur ? 'le CRÉATEUR' : "l'INVITÉ", '— questions:', currentDuel.questions?.length);

        // Afficher le combat
        demarrerCombatDuel();

    } catch(e) {
        console.error('Erreur chargement duel:', e);
        alert('Erreur : ' + e.message);
    }
}

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Si on rejoint un duel → ignorer toute l'init normale et aller direct au combat
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');

    if (joinCode) {
        afficherNomJoueur();
        chargerDuelDepuisFirestore(joinCode);
        return; // stopper ici, pas d'init de la liste/niveaux
    }

    chargerProgressionJoueur();
    chargerJoueursEnLigne();
    ecouterInvitationsEntrantesFirestore();
    genererNiveauxDisponibles();
    checkArenaUnlock();
    afficherNomJoueur();
});

function chargerProgressionJoueur() {
    const save = window.SaveSystem ? SaveSystem.getSave()
        : JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
    PlayerState.unlockedLevels = save.niveauxCompletes || [];
    PlayerState.currentLevel = save.niveauActuel || 1;
}

function afficherNomJoueur() {
    const header = document.querySelector('.duel-header');
    if (header && !document.getElementById('player-name-badge')) {
        const nameBadge = document.createElement('div');
        nameBadge.id = 'player-name-badge';
        nameBadge.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            border: 2px solid #fbbf24;
            border-radius: 30px;
            padding: 10px 20px;
            color: #fbbf24;
            font-size: 1.1em;
            z-index: 100;
        `;
        nameBadge.innerHTML = `👤 ${PlayerState.name}`;
        header.appendChild(nameBadge);
    }
}

function genererNiveauxDisponibles() {
    const grid = document.getElementById('level-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const niveaux = [
        { id: 1, nom: "Présent" },
        { id: 2, nom: "Passé Composé" },
        { id: 3, nom: "Imparfait" },
        { id: 4, nom: "Futur" },
        { id: 5, nom: "Plus-que-Parfait" },
        { id: 6, nom: "Futur Antérieur" },
        { id: 7, nom: "Passé Simple" },
        { id: 8, nom: "Passé Antérieur" },
        { id: 9, nom: "BOSS Indicatif" },
        { id: 10, nom: "Impératif Présent" },
        { id: 11, nom: "Impératif Passé" },
        { id: 12, nom: "BOSS Impératif" },
        { id: 13, nom: "Conditionnel Présent" },
        { id: 14, nom: "Conditionnel Passé" },
        { id: 15, nom: "BOSS Conditionnel" },
        { id: 16, nom: "Subjonctif Présent" },
        { id: 17, nom: "Subjonctif Passé" },
        { id: 18, nom: "Subjonctif Imparfait" },
        { id: 19, nom: "BOSS Subjonctif" },
        { id: 20, nom: "Voix Passive" },
        { id: 21, nom: "BOSS FINAL" }
    ];
    
    // Seuls les niveaux COMPLÉTÉS sont débloqués (pas le niveau en cours)
    const niveauxAccessibles = new Set(PlayerState.unlockedLevels);

    niveaux.forEach(niveau => {
        const estDebloque = niveauxAccessibles.has(niveau.id);
        const btn = document.createElement('button');
        btn.className = `level-btn ${estDebloque ? 'unlocked' : 'locked'}`;
        btn.innerHTML = `
            <span class="level-number">${niveau.id}</span>
            <span class="level-name">${niveau.nom}</span>
            ${estDebloque ? '' : '🔒'}
        `;
        
        if (estDebloque) {
            btn.onclick = () => selectLevel(niveau.id);
        }
        
        grid.appendChild(btn);
    });
}

function checkArenaUnlock() {
    const arenaBtn = document.getElementById('arena-mode');
    if (!arenaBtn) return;
    
    if (PlayerState.unlockedLevels.length >= 21) {
        arenaBtn.disabled = false;
        arenaBtn.querySelector('.lock').style.display = 'none';
    }
}

function selectLevel(levelId) {
    sessionStorage.setItem('duel_selected_level', levelId);
}

// ===========================
// NAVIGATION
// ===========================

function showCreateDuel() {
    const select = document.getElementById('duel-level');
    select.innerHTML = '';
    
    const niveaux = [
        { id: 1, nom: "Présent" },
        { id: 2, nom: "Passé Composé" },
        { id: 3, nom: "Imparfait" },
        { id: 4, nom: "Futur" },
        { id: 5, nom: "Plus-que-Parfait" },
        { id: 6, nom: "Futur Antérieur" },
        { id: 7, nom: "Passé Simple" },
        { id: 8, nom: "Passé Antérieur" },
        { id: 9, nom: "BOSS Indicatif" },
        { id: 10, nom: "Impératif Présent" },
        { id: 11, nom: "Impératif Passé" },
        { id: 12, nom: "BOSS Impératif" },
        { id: 13, nom: "Conditionnel Présent" },
        { id: 14, nom: "Conditionnel Passé" },
        { id: 15, nom: "BOSS Conditionnel" },
        { id: 16, nom: "Subjonctif Présent" },
        { id: 17, nom: "Subjonctif Passé" },
        { id: 18, nom: "Subjonctif Imparfait" },
        { id: 19, nom: "BOSS Subjonctif" },
        { id: 20, nom: "Voix Passive" },
        { id: 21, nom: "BOSS FINAL" }
    ];
    
    // Seuls les niveaux COMPLÉTÉS sont disponibles en duel
    const niveauxJouables = new Set(PlayerState.unlockedLevels);

    niveaux.forEach(niveau => {
        if (niveauxJouables.has(niveau.id)) {
            const option = document.createElement('option');
            option.value = niveau.id;
            option.textContent = `${niveau.id} - ${niveau.nom}`;
            select.appendChild(option);
        }
    });

    // Aucun niveau complété → message explicite
    if (select.options.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = "⚔️ Complète un niveau en Aventure d'abord !";
        option.disabled = true;
        select.appendChild(option);
    }

    updateVisualPreview(select.value);
    updateOnlinePlayersList(select.value);

    // Si Firestore n'a pas encore répondu, relancer l'écoute
    if (!_unsubscribeJoueurs) {
        chargerJoueursEnLigne();
    }
    
    select.addEventListener('change', (e) => {
        updateVisualPreview(e.target.value);
        updateOnlinePlayersList(e.target.value);
    });
    
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.getElementById('create-duel').classList.add('active');
}

function showArenaMode() {
    if ((PlayerState.unlockedLevels || []).length < 21) {
        alert("🔒 Débloque tous les niveaux pour accéder à l'Arène !");
        return;
    }
    
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.getElementById('arena-mode').classList.add('active');
    updateArenaPreview();
}

function backToModeSelect() {
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.getElementById('mode-select').classList.add('active');
}

// ===========================
// CRÉATION DU DUEL
// ===========================

function selectCharacter(type) {
    document.querySelectorAll('#create-duel .character-option').forEach(opt => opt.classList.remove('selected'));
    event.target.closest('.character-option').classList.add('selected');
}

function updateVisualPreview(levelId) {
    const preview = document.getElementById('visual-preview');
    if (!preview || !window.VISUAL_CONFIG || !VISUAL_CONFIG.levels[levelId]) return;
    
    const config = VISUAL_CONFIG.levels[levelId];
    
    preview.innerHTML = `
        <div class="preview-circle" style="
            width: 100px;
            height: 100px;
            border: 3px dashed ${config.circle.colors[0]};
            border-radius: 50%;
            box-shadow: 0 0 20px ${config.circle.colors[0]};
        "></div>
        <div class="preview-projectile" style="
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, ${config.projectile.colors[0]}, ${config.projectile.colors[1]});
            border-radius: 50%;
            box-shadow: 0 0 15px ${config.projectile.glowColor};
        "></div>
        <span>${config.name}</span>
    `;
}

function updateOnlinePlayersList(levelId) {
    const grid = document.getElementById('online-players-grid');
    if (!grid) return;

    // Mémoriser le niveau pour que le onSnapshot puisse rafraîchir automatiquement
    grid.dataset.currentLevel = levelId;

    afficherJoueursDisponibles(parseInt(levelId));
}

function afficherJoueursDisponibles(levelId) {
    const grid = document.getElementById('online-players-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (onlinePlayers.length === 0) {
        grid.innerHTML = "<div class='no-players'>Aucun autre joueur connecté pour l'instant</div>";
        return;
    }

    // Montrer tous les joueurs (pas de filtre par niveau)
    const availablePlayers = onlinePlayers;
    
    availablePlayers.forEach(player => {
        const card = document.createElement('div');
        card.className = 'online-player-card';
        card.dataset.playerId = player.id;
        
        const niveauFormatte = String(levelId).padStart(2, '0');
        const imgSrc = player.avatar === 'hero' 
            ? `img/combat/${niveauFormatte}_attaque.png` 
            : `img/enemies/${niveauFormatte}_profil.png`;
        
        card.innerHTML = `
            <div class="player-avatar-small">
                <img src="${imgSrc}" alt="${player.name}" onerror="this.src='img/recompense01.png'">
            </div>
            <div class="player-info-small">
                <div class="player-name-small">${player.name}</div>
                <div class="player-level-small">Niveau ${player.level}</div>
            </div>
            <button class="invite-btn" onclick="selectPlayerForDuel('${player.id}', this)">⚔️ Défier</button>
        `;
        
        grid.appendChild(card);
    });
}

function selectPlayerForDuel(playerId, btn) {
    const player = onlinePlayers.find(p => p.id === playerId);
    if (!player) return;
    selectedOpponent = player;
    // Envoyer l'invitation directement sans étape intermédiaire
    sendDuelInvitation();
}

function sendDuelInvitation() {
    if (!selectedOpponent) {
        alert("Sélectionne d'abord un adversaire !");
        return;
    }
    
    const level = parseInt(document.getElementById('duel-level').value);
    const character = document.querySelector('#create-duel .character-option.selected').dataset.character;
    
    const tempsReponse = parseInt(document.getElementById('duel-temps-reponse')?.value || 10);
    const touchesGagner = parseInt(document.getElementById('duel-touches-gagner')?.value || 10);
    const timeLimit = tempsReponse * 1000;
    const health = touchesGagner;
    
    const roomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    currentDuel = {
        roomId: roomId,
        level: level,
        player1: { id: PlayerState.id, name: PlayerState.name, character: character,
                   health: health, isCreator: true, accepted: true },
        player2: { id: selectedOpponent.id, name: selectedOpponent.name,
                   character: character === 'hero' ? 'enemy' : 'hero',
                   health: health, isCreator: false, accepted: false },
        timeLimit: timeLimit,
        player1Health: health,
        player2Health: health,
        isCreator: true,
        waitingForOpponent: true,
        history: [],
        questions: [],
        questionIndex: 0
    };

    // Charger les questions MAINTENANT pendant qu'on attend la réponse
    chargerQuestionsNiveau(level);
    console.log("📚 Questions préchargées pour niveau", level, ":", currentDuel.questions.length);
    
    sessionStorage.setItem('current_duel', JSON.stringify(currentDuel));

    // Afficher un écran d'attente simple
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    const waiting = document.getElementById('waiting-room');
    waiting.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:30px;">
            <div style="font-size:2em;">⚔️</div>
            <div style="color:#fbbf24;font-size:1.5em;font-family:'Cinzel',serif;">
                Invitation envoyée à <strong>${selectedOpponent.name}</strong>
            </div>
            <div style="color:#94a3b8;animation:pulse 1.5s infinite;">
                En attente de réponse...
            </div>
            <button onclick="annulerInvitation()" style="margin-top:20px;padding:10px 25px;
                background:rgba(244,63,94,0.2);border:2px solid #f43f5e;border-radius:8px;
                color:#f43f5e;font-family:'Cinzel',serif;cursor:pointer;">
                ✕ Annuler
            </button>
        </div>`;
    waiting.classList.add('active');

    envoyerInvitationFirestore();
}

function annulerInvitation() {
    if (currentDuel.roomId && window.FirebaseDB) {
        window.FirebaseDB.collection('duels').doc(currentDuel.roomId).update({ statut: 'annule' }).catch(()=>{});
    }
    currentDuel = { roomId: null };
    selectedOpponent = null;
    backToModeSelect();
}

async function envoyerInvitationFirestore() {
    if (!window.FirebaseDB) {
        alert("❌ Firebase non disponible — impossible d'envoyer l'invitation.");
        return;
    }

    try {
        const db = window.FirebaseDB;

        // 1. Créer la salle dans Firestore
        await db.collection('duels').doc(currentDuel.roomId).set({
            roomId:    currentDuel.roomId,
            level:     currentDuel.level,
            player1Id: currentDuel.player1.id,
            player1Name: currentDuel.player1.name,
            player1Character: currentDuel.player1.character,
            player2Id: currentDuel.player2.id,
            player2Name: currentDuel.player2.name,
            player2Character: currentDuel.player2.character,
            health:    currentDuel.player1.health,
            timeLimit: currentDuel.timeLimit,
            statut:    'en_attente',
            creeLe:    firebase.firestore.FieldValue.serverTimestamp()
        });

        // 2. Créer l'invitation pour le joueur 2
        await db.collection('invitations').add({
            pour:            currentDuel.player2.id,
            de:              currentDuel.player1.id,
            inviter:         currentDuel.player1.name,
            inviterRole:     currentDuel.player1.character,
            currentRole:     currentDuel.player2.character,
            level:           currentDuel.level,
            health:          currentDuel.player1.health,
            timeLimit:       currentDuel.timeLimit / 1000,
            roomCode:        currentDuel.roomId,
            statut:          'en_attente',
            creeLe:          firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Invitation envoyée via Firestore à', currentDuel.player2.name);

        // 3. Écouter la réponse de l'adversaire
        ecouterAcceptationDuel(currentDuel.roomId);

    } catch(e) {
        console.error('❌ Erreur envoi invitation:', e);
        alert("Erreur lors de l'envoi de l'invitation.");
    }
}

function ecouterAcceptationDuel(roomId) {
    const unsubscribe = window.FirebaseDB.collection('duels').doc(roomId)
        .onSnapshot(doc => {
            if (!doc.exists) return;
            const data = doc.data();
            if (data.statut === 'accepte') {
                unsubscribe();
                currentDuel.player2.accepted = true;
                currentDuel.player1.accepted = true;
                // Démarrer le combat directement
                demarrerCombatDuel();
            } else if (data.statut === 'refuse' || data.statut === 'annule') {
                unsubscribe();
                if (data.statut === 'refuse') alert(`❌ ${currentDuel.player2.name} a refusé le duel.`);
                backToModeSelect();
            }
        });
}

function cancelDuelRequest() {
    if (confirm("Annuler la demande de duel ?")) {
        document.getElementById('send-invite-btn').disabled = false;
        document.getElementById('send-invite-btn').style.display = 'block';
        document.getElementById('waiting-request').style.display = 'none';
        selectedOpponent = null;
        sessionStorage.removeItem('current_duel');
    }
}

// ===========================
// ÉCOUTE DES INVITATIONS ENTRANTES (Firestore temps réel)
// ===========================

let _unsubscribeInvitations = null;

function ecouterInvitationsEntrantesFirestore() {
    if (!window.FirebaseDB) return;

    const currentUserId = SaveSystem.getCurrentUserId();
    if (!currentUserId) return;

    if (_unsubscribeInvitations) _unsubscribeInvitations();

    _unsubscribeInvitations = window.FirebaseDB.collection('invitations')
        .where('pour', '==', currentUserId)
        .where('statut', '==', 'en_attente')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const inv = change.doc.data();
                    const invId = change.doc.id;
                    console.log('📨 Invitation reçue de', inv.inviter);
                    afficherInvitationFirestore(inv, invId);
                }
            });
        }, err => {
            console.error('❌ Erreur écoute invitations:', err);
        });
}

function afficherInvitationFirestore(inv, invId) {
    // Créer ou réutiliser un overlay simple
    let overlay = document.getElementById('duel-invite-popup');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'duel-invite-popup';
        overlay.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:rgba(10,10,30,0.98);border:3px solid #fbbf24;
            border-radius:20px;padding:30px 40px;z-index:9999;
            text-align:center;font-family:'Cinzel',serif;color:white;
            box-shadow:0 0 60px rgba(251,191,36,0.4);min-width:320px;
        `;
        document.body.appendChild(overlay);
    }

    const nomNiveau = ['Présent','Passé Composé','Imparfait','Futur','Plus-que-Parfait',
        'Futur Antérieur','Passé Simple','Passé Antérieur','BOSS Indicatif','Impératif Présent',
        'Impératif Passé','BOSS Impératif','Conditionnel Présent','Conditionnel Passé',
        'BOSS Conditionnel','Subjonctif Présent','Subjonctif Passé','Subjonctif Imparfait',
        'BOSS Subjonctif','Voix Passive','BOSS FINAL'][inv.level - 1] || 'Niveau ' + inv.level;

    const roleLabel = inv.currentRole === 'hero' ? '🦸 Héros' : '👹 Gardien';

    overlay.innerHTML = `
        <div style="font-size:2em;margin-bottom:10px;">⚔️</div>
        <div style="color:#fbbf24;font-size:1.3em;font-weight:bold;margin-bottom:5px;">
            DÉFI DE ${inv.inviter.toUpperCase()}
        </div>
        <div style="color:#94a3b8;margin-bottom:20px;font-size:0.9em;">t'invite à un combat de conjugaison</div>
        <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:15px;margin-bottom:20px;">
            <div style="margin-bottom:8px;">📚 <strong>${nomNiveau}</strong></div>
            <div style="margin-bottom:8px;">⏱️ <strong>${inv.timeLimit}s</strong> par réponse</div>
            <div style="margin-bottom:8px;">❤️ <strong>${inv.health}</strong> vies chacun</div>
            <div>🎭 Tu joues : <strong>${roleLabel}</strong></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
            <button onclick="rejoindreDirectement('${inv.roomCode}','${invId}')"
                style="padding:12px 25px;background:linear-gradient(145deg,#fbbf24,#f59e0b);
                border:none;border-radius:10px;color:#1a1a2e;font-family:'Cinzel',serif;
                font-weight:bold;font-size:1em;cursor:pointer;">
                ⚔️ REJOINDRE
            </button>
            <button onclick="refuserInvitationFirestore('${invId}')"
                style="padding:12px 20px;background:rgba(255,255,255,0.1);
                border:2px solid #f43f5e;border-radius:10px;color:#f43f5e;
                font-family:'Cinzel',serif;cursor:pointer;">
                ✕ Refuser
            </button>
        </div>
    `;
    overlay.style.display = 'block';

    // Auto-refus après 30s
    setTimeout(() => {
        if (overlay.style.display !== 'none') refuserInvitationFirestore(invId);
    }, 30000);
}

async function rejoindreDirectement(roomCode, invId) {
    // Marquer accepté dans Firestore
    if (window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'acceptee' });
            await window.FirebaseDB.collection('duels').doc(roomCode).update({ statut: 'accepte' });
        } catch(e) { console.warn(e); }
    }
    // Aller directement à la salle d'attente
    sessionStorage.setItem('rejoindre_duel', roomCode);
    window.location.href = 'duel.html?join=' + roomCode;
}

async function refuserInvitationFirestore(invId) {
    if (!invId || !window.FirebaseDB) return;
    try {
        await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'refuse' });
    } catch(e) { /* silencieux */ }
}

// ===========================
// RÉCEPTION D'INVITATION
// ===========================

function showInvitation(inviter, level, health, time, roomCode, inviterRole, currentRole) {
    const overlay = document.getElementById('invitation-overlay');
    if (!overlay) return;
    
    document.getElementById('invitation-name').textContent = inviter;
    document.getElementById('invitation-level').textContent = `Niveau ${level}`;
    document.getElementById('invitation-health').textContent = `${health} vies`;
    document.getElementById('invitation-time').textContent = `${time}s`;
    
    const niveauFormatte = String(level).padStart(2, '0');
    const avatar = document.getElementById('invitation-avatar').querySelector('img');
    avatar.src = inviterRole === 'hero' 
        ? `img/combat/${niveauFormatte}_attaque.png` 
        : `img/enemies/${niveauFormatte}_profil.png`;
    
    overlay.dataset.inviter = inviter;
    overlay.dataset.level = level;
    overlay.dataset.health = health;
    overlay.dataset.time = time;
    overlay.dataset.roomCode = roomCode;
    overlay.dataset.inviterRole = inviterRole;
    overlay.dataset.currentRole = currentRole;
    
    overlay.style.display = 'block';
    
    setTimeout(() => {
        if (overlay.style.display === 'block') {
            overlay.style.display = 'none';
        }
    }, 30000);
}

async function acceptInvitation() {
    const overlay = document.getElementById('invitation-overlay');
    const invId   = overlay.dataset.invitationId;

    // Marquer l'invitation comme acceptée dans Firestore
    if (invId && window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'acceptee' });
            // Mettre à jour la salle de duel
            await window.FirebaseDB.collection('duels').doc(overlay.dataset.roomCode).update({ statut: 'accepte' });
        } catch(e) {
            console.error('❌ Erreur acceptation:', e);
        }
    }

    const invitation = {
        roomCode: overlay.dataset.roomCode,
        level: parseInt(overlay.dataset.level),
        health: parseInt(overlay.dataset.health),
        timeLimit: parseInt(overlay.dataset.time) * 1000,
        character: overlay.dataset.currentRole,
        inviter: overlay.dataset.inviter,
        inviterRole: overlay.dataset.inviterRole
    };
    
    overlay.style.display = 'none';
    
    rejoindreDuelApresAcceptation(invitation);
}

async function declineInvitation() {
    const overlay = document.getElementById('invitation-overlay');
    const invId   = overlay.dataset.invitationId;

    if (invId && window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invId).update({ statut: 'refuse' });
            await window.FirebaseDB.collection('duels').doc(overlay.dataset.roomCode).update({ statut: 'refuse' });
        } catch(e) { /* silencieux */ }
    }

    overlay.style.display = 'none';
}

function rejoindreDuelApresAcceptation(invitation) {
    currentDuel = {
        roomId: invitation.roomCode,
        level: invitation.level,
        player1: {
            id: 'creator',
            name: invitation.inviter,
            character: invitation.inviterRole,
            health: invitation.health,
            isCreator: true,
            accepted: true
        },
        player2: {
            id: PlayerState.id,
            name: PlayerState.name,
            character: invitation.character,
            health: invitation.health,
            isCreator: false,
            accepted: true
        },
        timeLimit: invitation.timeLimit,
        isCreator: false,
        waitingForOpponent: false
    };
    
    sessionStorage.setItem('current_duel', JSON.stringify(currentDuel));
    
    showWaitingRoom();
}

// ===========================
// SALLE D'ATTENTE
// ===========================

function showWaitingRoom() {
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.getElementById('waiting-room').classList.add('active');
    
    const niveauFormatte = String(currentDuel.level).padStart(2, '0');
    
    document.getElementById('waiting-creator-name').textContent = currentDuel.player1.name;
    const creatorImg = document.getElementById('waiting-creator-img');
    creatorImg.src = currentDuel.player1.character === 'hero' 
        ? `img/combat/${niveauFormatte}_attaque.png` 
        : `img/enemies/${niveauFormatte}_profil.png`;
    
    document.getElementById('waiting-challenger-name').textContent = currentDuel.player2.name;
    const challengerImg = document.getElementById('waiting-challenger-img');
    challengerImg.src = currentDuel.player2.character === 'hero' 
        ? `img/combat/${niveauFormatte}_attaque.png` 
        : `img/enemies/${niveauFormatte}_profil.png`;
    
    if (currentDuel.player1.accepted) {
        document.getElementById('waiting-creator-status').textContent = 'Prêt';
        document.getElementById('waiting-creator-status').className = 'player-status status-ready';
    }
    
    if (currentDuel.player2.accepted) {
        document.getElementById('waiting-challenger-status').textContent = 'Prêt';
        document.getElementById('waiting-challenger-status').className = 'player-status status-ready';
    }
    
    document.getElementById('waiting-info').innerHTML = `
        <div style="display: flex; justify-content: space-around; padding: 10px;">
            <div><strong>📚 Niveau</strong> ${currentDuel.level} - ${getNomNiveau(currentDuel.level)}</div>
            <div><strong>❤️ Vies</strong> ${currentDuel.player1.health}</div>
            <div><strong>⏱️ Temps</strong> ${currentDuel.timeLimit/1000}s</div>
        </div>
    `;
    
    if (currentDuel.player1.accepted && currentDuel.player2.accepted) {
        document.getElementById('start-duel-btn').disabled = false;
    }
    
    // Si on est le créateur et l'adversaire n'a pas encore accepté, écouter Firestore
    if (currentDuel.isCreator && !currentDuel.player2.accepted) {
        const unsub = window.FirebaseDB?.collection('duels').doc(currentDuel.roomId)
            .onSnapshot(doc => {
                if (!doc.exists) return;
                if (doc.data().statut === 'accepte') {
                    unsub();
                    currentDuel.player2.accepted = true;
                    document.getElementById('waiting-challenger-status').textContent = 'Prêt';
                    document.getElementById('waiting-challenger-status').className = 'player-status status-ready';
                    document.getElementById('start-duel-btn').disabled = false;
                }
            });
    }
}

function demarrerCombatDuel() {
    // Recharger seulement si vraiment vide
    if (!currentDuel.questions || currentDuel.questions.length === 0) {
        chargerQuestionsNiveau(currentDuel.level);
        console.log("📚 Questions rechargées dans demarrerCombatDuel:", currentDuel.questions.length);
    }
    document.querySelectorAll('.phase').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    const combat = document.getElementById('duel-combat');
    combat.classList.add('active');
    combat.style.display = 'block';
    initDuelCombat();
    lancerDecompte();
}

function lancerDecompte() {
    const overlay = document.getElementById('duel-countdown');
    const num = document.getElementById('countdown-number');
    if (!overlay || !num) { nextDuelTurn(); return; }

    // Masquer la zone de question pendant le décompte
    const qzone = document.getElementById('question-zone');
    if (qzone) qzone.style.display = 'none';

    overlay.style.display = 'flex';
    let compte = 5;

    function afficherChiffre(n) {
        num.textContent = n > 0 ? n : '⚔️';
        num.style.animation = 'none';
        // Force reflow
        void num.offsetWidth;
        num.style.animation = 'countdownPop 0.9s ease-out forwards';

        if (n === 0) {
            // Coup de sifflet
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(1200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
            } catch(e) {}

            setTimeout(() => {
                overlay.style.display = 'none';
                if (qzone) qzone.style.display = 'block';
                nextDuelTurn();
            }, 900);
        }
    }

    afficherChiffre(compte);
    const interval = setInterval(() => {
        compte--;
        afficherChiffre(compte);
        if (compte <= 0) clearInterval(interval);
    }, 1000);
}

function startDuelFromWaiting() {
    demarrerCombatDuel();
}

function cancelWaitingRoom() {
    if (confirm("Annuler le duel ?")) {
        sessionStorage.removeItem('current_duel');
        backToModeSelect();
    }
}

// ===========================
// COMBAT DUEL (identique à avant)
// ===========================

function initDuelCombat() {
    const n = String(currentDuel.level).padStart(2, '0');

    document.getElementById('duel-background').src = `img/backgrounds/${n}_debut.png`;

    // Héros TOUJOURS à gauche, Gardien TOUJOURS à droite (indépendamment de player1/player2)
    const heroSrc   = `img/combat/${n}_attaque.png`;
    const gardenSrc = `img/enemies/${n}_profil.png`;

    // player1-combat-img est à gauche dans le HTML → toujours héros
    document.getElementById('player1-combat-img').src = heroSrc;
    document.getElementById('player2-combat-img').src = gardenSrc;

    // Avatars dans la bannière : qui joue héros, qui joue gardien
    const p1IsHero = currentDuel.player1.character === 'hero';
    document.getElementById('player1-avatar').src = p1IsHero ? heroSrc : gardenSrc;
    document.getElementById('player2-avatar').src = p1IsHero ? gardenSrc : heroSrc;

    document.getElementById('player1-name').textContent = currentDuel.player1.name;
    document.getElementById('player2-name').textContent = currentDuel.player2.name;

    currentDuel.player1Health = 10;
    currentDuel.player2Health = 10;
    document.getElementById('player1-health').style.width = '100%';
    document.getElementById('player2-health').style.width = '100%';

    appliquerStyleDuel(currentDuel.level);
    // NE PAS appeler nextDuelTurn ici — lancerDecompte s'en charge après le compte à rebours
}

function chargerQuestionsNiveau(level) {
    let niveauData;
    switch(parseInt(level)) {
        case 1:  niveauData = (typeof NIVEAU_01_DATA !== 'undefined') ? NIVEAU_01_DATA : null; break;
        case 2:  niveauData = (typeof NIVEAU_02_DATA !== 'undefined') ? NIVEAU_02_DATA : null; break;
        case 3:  niveauData = (typeof NIVEAU_03_DATA !== 'undefined') ? NIVEAU_03_DATA : null; break;
        case 4:  niveauData = (typeof NIVEAU_04_DATA !== 'undefined') ? NIVEAU_04_DATA : null; break;
        case 5:  niveauData = (typeof NIVEAU_05_DATA !== 'undefined') ? NIVEAU_05_DATA : null; break;
        case 6:  niveauData = (typeof NIVEAU_06_DATA !== 'undefined') ? NIVEAU_06_DATA : null; break;
        case 7:  niveauData = (typeof NIVEAU_07_DATA !== 'undefined') ? NIVEAU_07_DATA : null; break;
        case 8:  niveauData = (typeof NIVEAU_08_DATA !== 'undefined') ? NIVEAU_08_DATA : null; break;
        case 9:  niveauData = (typeof NIVEAU_09_DATA !== 'undefined') ? NIVEAU_09_DATA : null; break;
        case 10: niveauData = (typeof NIVEAU_10_DATA !== 'undefined') ? NIVEAU_10_DATA : null; break;
        case 11: niveauData = (typeof NIVEAU_11_DATA !== 'undefined') ? NIVEAU_11_DATA : null; break;
        case 12: niveauData = (typeof NIVEAU_12_DATA !== 'undefined') ? NIVEAU_12_DATA : null; break;
        case 13: niveauData = (typeof NIVEAU_13_DATA !== 'undefined') ? NIVEAU_13_DATA : null; break;
        case 14: niveauData = (typeof NIVEAU_14_DATA !== 'undefined') ? NIVEAU_14_DATA : null; break;
        case 15: niveauData = (typeof NIVEAU_15_DATA !== 'undefined') ? NIVEAU_15_DATA : null; break;
        case 16: niveauData = (typeof NIVEAU_16_DATA !== 'undefined') ? NIVEAU_16_DATA : null; break;
        case 17: niveauData = (typeof NIVEAU_17_DATA !== 'undefined') ? NIVEAU_17_DATA : null; break;
        case 18: niveauData = (typeof NIVEAU_18_DATA !== 'undefined') ? NIVEAU_18_DATA : null; break;
        case 19: niveauData = (typeof NIVEAU_19_DATA !== 'undefined') ? NIVEAU_19_DATA : null; break;
        case 20: niveauData = (typeof NIVEAU_20_DATA !== 'undefined') ? NIVEAU_20_DATA : null; break;
        case 21: niveauData = (typeof NIVEAU_21_DATA !== 'undefined') ? NIVEAU_21_DATA : null; break;
        default: niveauData = (typeof NIVEAU_01_DATA !== 'undefined') ? NIVEAU_01_DATA : null;
    }
    if (niveauData && niveauData.attaques) {
        // En duel : uniquement les attaques (verbe + personne + solution)
        currentDuel.questions = niveauData.attaques.filter(q => q.verbe && q.personne && q.solution);
        shuffleArray(currentDuel.questions);
        currentDuel.questionIndex = 0;
        console.log(`📚 ${currentDuel.questions.length} questions d'attaque chargées pour niveau ${level}`);
    } else {
        console.warn(`⚠️ Données niveau ${level} non disponibles`);
        currentDuel.questions = [];
    }
}

// ===========================
// COMBAT MULTIJOUEUR RÉEL — via Firestore
// player1 (créateur) publie les questions
// les deux joueurs soumettent leurs réponses dans Firestore
// résolution simultanée quand les deux ont répondu
// ===========================

let _unsubscribeTour = null; // écoute Firestore du tour actuel
let _timeoutTimer = null;    // timer local pour le timeout
let _timerInterval = null;   // interval du décompte visuel

function nextDuelTurn() {
    currentDuel.answered = false;
    currentDuel.resolved = false;
    currentDuel.questionAffichee = false;
    currentDuel.turnStartTime = Date.now();
    resetHitFlags();

    const tourIndex = currentDuel.questionIndex;
    const tourId = 'tour_' + tourIndex;

    if (currentDuel.isCreator) {
        // Le créateur choisit et publie la question
        if (!currentDuel.questions || currentDuel.questions.length === 0) {
            console.error('❌ Aucune question disponible'); return;
        }
        if (currentDuel.questionIndex >= currentDuel.questions.length) {
            currentDuel.questionIndex = 0;
            shuffleArray(currentDuel.questions);
        }
        currentDuel.currentQuestion = currentDuel.questions[currentDuel.questionIndex];
        if (!currentDuel.currentQuestion) {
            console.error('❌ Question undefined! index:', currentDuel.questionIndex, 'total:', currentDuel.questions?.length);
            // Forcer reset
            currentDuel.questionIndex = 0;
            shuffleArray(currentDuel.questions);
            currentDuel.currentQuestion = currentDuel.questions[0];
        }
        currentDuel.questionIndex++;
        afficherQuestion(currentDuel.currentQuestion);
        publierQuestion(tourId, currentDuel.currentQuestion);
    } else {
        // Le non-créateur attend la question via Firestore (onSnapshot)
        // Afficher un message d'attente
        const verbeEl = document.getElementById('duel-verbe');
        const tempsEl = document.getElementById('duel-temps');
        const personneEl = document.getElementById('duel-personne');
        if (verbeEl) verbeEl.textContent = '...';
        if (tempsEl) tempsEl.textContent = '';
        if (personneEl) personneEl.textContent = '';
        currentDuel.questionIndex++;
    }

    // Les deux écoutent le tour Firestore
    ecouterTour(tourId);
    demarrerTimerLocal(tourId);
}

function afficherQuestion(q) {
    if (!q || !q.verbe) { console.error('❌ afficherQuestion: question invalide', q); return; }
    const verbeEl = document.getElementById('duel-verbe');
    const tempsEl = document.getElementById('duel-temps');
    const personneEl = document.getElementById('duel-personne');
    if (verbeEl) verbeEl.textContent = q.verbe.toUpperCase();
    if (tempsEl) tempsEl.textContent = getNomNiveau(currentDuel.level);
    if (personneEl) personneEl.textContent = q.personne;
    const qzone = document.getElementById('question-zone');
    if (qzone) qzone.style.display = 'block';
    const input = document.getElementById('duel-answer');
    if (input) { input.value = ''; input.disabled = false; input.focus(); }
    console.log('❓ Question:', q.verbe, q.personne, '→', q.solution);
}

async function publierQuestion(tourId, question) {
    if (!window.FirebaseDB) return;
    try {
        await window.FirebaseDB.collection('duels').doc(currentDuel.roomId)
            .collection('tours').doc(tourId).set({
                verbe:    question.verbe,
                personne: question.personne,
                solution: question.solution,
                debuteLe: firebase.firestore.FieldValue.serverTimestamp(),
                timeLimit: currentDuel.timeLimit,
                statut:   'en_cours',
                reponseJ1: null,
                reponseJ2: null
            });
    } catch(e) { console.error('Erreur publierQuestion:', e); }
}

function ecouterTour(tourId) {
    if (_unsubscribeTour) { _unsubscribeTour(); _unsubscribeTour = null; }
    if (!window.FirebaseDB) return;

    _unsubscribeTour = window.FirebaseDB.collection('duels').doc(currentDuel.roomId)
        .collection('tours').doc(tourId)
        .onSnapshot(doc => {
            if (!doc.exists) return;
            const d = doc.data();

            // Si le créateur a publié la question ET qu'on est le receveur → afficher UNE SEULE FOIS
            if (!currentDuel.isCreator && d.verbe && !currentDuel.questionAffichee) {
                currentDuel.questionAffichee = true;
                currentDuel.currentQuestion = { verbe: d.verbe, personne: d.personne, solution: d.solution };
                currentDuel.turnStartTime = Date.now();
                afficherQuestion(currentDuel.currentQuestion);
            }

            // Les deux ont répondu → résoudre
            if (d.reponseJ1 !== null && d.reponseJ2 !== null && !currentDuel.resolved) {
                clearTimeout(_timeoutTimer);
                if (_unsubscribeTour) { _unsubscribeTour(); _unsubscribeTour = null; }
                resolveTour(d);
            }
        }, err => console.error('Erreur écoute tour:', err));
}

function demarrerTimerLocal(tourId) {
    if (_timeoutTimer) clearTimeout(_timeoutTimer);
    const timeLimit = currentDuel.timeLimit || 10000;
    let remaining = Math.ceil(timeLimit / 1000);

    // Afficher le timer
    const timerEl = document.getElementById('duel-timer');
    if (timerEl) { timerEl.textContent = remaining + 's'; timerEl.style.color = '#fbbf24'; }

    if (_timerInterval) clearInterval(_timerInterval);
    _timerInterval = setInterval(() => {
        remaining--;
        if (timerEl) {
            timerEl.textContent = remaining + 's';
            if (remaining <= 3) timerEl.style.color = '#ff4444';
        }
        if (remaining <= 0) { clearInterval(_timerInterval); _timerInterval = null; }
    }, 1000);

    _timeoutTimer = setTimeout(async () => {
        if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
        if (currentDuel.resolved) return;
        // Timeout : soumettre une réponse vide si pas encore répondu
        if (!currentDuel.answered) {
            await soumettreReponseFirestore(tourId, '', currentDuel.timeLimit);
        }
    }, timeLimit);
}

async function submitDuelAnswer() {
    if (currentDuel.answered || currentDuel.resolved) return;

    const answer = document.getElementById('duel-answer').value.trim().toLowerCase();
    const responseTime = Date.now() - currentDuel.turnStartTime;
    const solution = currentDuel.currentQuestion?.solution?.toLowerCase() || '';
    const isCorrect = answer === solution;

    currentDuel.answered = true;
    clearTimeout(_timeoutTimer);  // Stopper le timer immédiatement
    if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
    document.getElementById('duel-answer').disabled = true;

    const tourIndex = currentDuel.questionIndex - 1;
    const tourId = 'tour_' + tourIndex;

    // Résolution immédiate locale (sans attendre l'autre)
    if (isCorrect) {
        // Bonne réponse → projectile sur l'adversaire immédiatement
        const p1EstHero = currentDuel.player1.character === 'hero';
        const jesuisP1 = currentDuel.isCreator;
        const fromHero = (jesuisP1 && p1EstHero) || (!jesuisP1 && !p1EstHero);
        lancerProjectileDuel(answer, fromHero);
    } else {
        // Mauvaise réponse → éclair sur soi-même uniquement
        const jesuisP1 = currentDuel.isCreator;
        const p1EstHero = currentDuel.player1.character === 'hero';
        const jeSuisHero = (jesuisP1 && p1EstHero) || (!jesuisP1 && !p1EstHero);
        // fromHero=true signifie "la cible est le gardien", donc pour s'éclairer soi-même :
        afficherEclairSurSoi(jeSuisHero);
    }

    await soumettreReponseFirestore(tourId, answer, responseTime);
}

// Éclair sur soi-même (pas sur l'adversaire)
function afficherEclairSurSoi(jeSuisHero) {
    const monId = jeSuisHero ? 'player1-combat-img' : 'player2-combat-img';
    const moi = document.getElementById(monId);
    if (!moi) return;
    let eclair = document.createElement('div');
    eclair.textContent = '⚡';
    eclair.style.cssText = 'position:fixed;font-size:2.5em;z-index:400;pointer-events:none;animation:eclairPop 0.8s ease-out forwards;';
    const rect = moi.getBoundingClientRect();
    eclair.style.left = (rect.left + rect.width/2 - 20) + 'px';
    eclair.style.top  = (rect.top - 10) + 'px';
    document.body.appendChild(eclair);
    setTimeout(() => eclair.remove(), 900);
}

async function soumettreReponseFirestore(tourId, reponse, temps) {
    if (!window.FirebaseDB) return;
    const isP1 = currentDuel.isCreator;
    const champ = isP1 ? 'reponseJ1' : 'reponseJ2';
    const solution = currentDuel.currentQuestion?.solution?.toLowerCase() || '';
    const isCorrect = solution !== '' && reponse.toLowerCase() === solution;
    try {
        await window.FirebaseDB.collection('duels').doc(currentDuel.roomId)
            .collection('tours').doc(tourId).set({
                [champ]: { reponse: reponse.toLowerCase(), temps, correct: isCorrect }
            }, { merge: true });
    } catch(e) { console.error('Erreur soumettreReponse:', e); }
}

function resolveTour(tourData) {
    currentDuel.resolved = true;
    clearTimeout(_timeoutTimer);

    const r1 = tourData.reponseJ1 || { correct: false, temps: currentDuel.timeLimit, reponse: '' };
    const r2 = tourData.reponseJ2 || { correct: false, temps: currentDuel.timeLimit, reponse: '' };
    const solution = tourData.solution || currentDuel.currentQuestion?.solution || '';
    const solutionStr = String(solution || '?');
    const nom1 = currentDuel.player1.name;
    const nom2 = currentDuel.player2.name;

    // Construire le message d'événement lisible par les deux joueurs
    let evenement = '';
    if (r1.correct && !r2.correct) {
        const secs = (r1.temps / 1000).toFixed(1);
        evenement = `✅ <strong>${nom1}</strong> a répondu correctement en ${secs}s !`;
        if (!r2.reponse) evenement += `<br><small>${nom2} n'a pas répondu</small>`;
        else evenement += `<br><small>${nom2} s'est trompé (${r2.reponse})</small>`;
    } else if (!r1.correct && r2.correct) {
        const secs = (r2.temps / 1000).toFixed(1);
        evenement = `✅ <strong>${nom2}</strong> a répondu correctement en ${secs}s !`;
        if (!r1.reponse) evenement += `<br><small>${nom1} n'a pas répondu</small>`;
        else evenement += `<br><small>${nom1} s'est trompé (${r1.reponse})</small>`;
    } else if (r1.correct && r2.correct) {
        if (r1.temps <= r2.temps) {
            evenement = `⚡ <strong>${nom1}</strong> plus rapide ! (${(r1.temps/1000).toFixed(1)}s vs ${(r2.temps/1000).toFixed(1)}s)`;
        } else {
            evenement = `⚡ <strong>${nom2}</strong> plus rapide ! (${(r2.temps/1000).toFixed(1)}s vs ${(r1.temps/1000).toFixed(1)}s)`;
        }
    } else {
        if (!r1.reponse && !r2.reponse) {
            evenement = `⏰ Personne n'a répondu !`;
        } else {
            evenement = `❌ Les deux se sont trompés !`;
        }
        evenement += `<br><small>Bonne réponse : <strong>${solution}</strong></small>`;
    }

    // Afficher dans la zone d'incantation
    afficherEvenementCombat(evenement, solution, r1, r2);

    resolveTurn(r1.correct, r2.correct, r1.temps, r2.temps);
}

function afficherEvenementCombat(message, solution, r1, r2) {
    // Zone incantation : afficher la bonne réponse
    const centre = document.getElementById('duel-cercle');
    if (centre) {
        centre.innerHTML = `<div style="
            display:flex;align-items:center;justify-content:center;
            width:100%;height:100%;
            font-family:'Cinzel',serif;font-size:2em;
            color:#fbbf24;text-align:center;
            text-shadow:0 0 20px #fbbf24;font-weight:bold;">
            ${solution.toUpperCase()}
        </div>`;
        setTimeout(() => { if (centre) centre.innerHTML = ''; }, 2000);
    }

    // Feedback principal
    const fb = document.getElementById('duel-feedback');
    if (fb) {
        fb.innerHTML = message;
        fb.style.display = 'block';
        fb.style.fontSize = '1.2em';
        fb.style.lineHeight = '1.6';
        fb.style.textAlign = 'center';
        fb.style.background = 'rgba(0,0,0,0.85)';
        fb.style.padding = '15px 25px';
        fb.style.borderRadius = '12px';
        fb.style.border = '2px solid #fbbf24';
        fb.style.color = '#fff';
        fb.style.maxWidth = '500px';
    }
}

// Gardé pour compatibilité mais ne devrait plus être appelé directement
function handleTimeout() {
    if (currentDuel.answered || currentDuel.resolved) return;
    currentDuel.answered = true;
    const tourIndex = currentDuel.questionIndex - 1;
    soumettreReponseFirestore('tour_' + tourIndex, '', currentDuel.timeLimit);
}

function resolveTurn(player1Correct, player2Correct, player1Time, player2Time) {
    currentDuel.resolved = true;

    // Déterminer qui est héros et qui est gardien pour les animations
    const p1EstHero = currentDuel.player1.character === 'hero';
    // hitterHero = celui dont le projectile part du héros vers le gardien
    function hitByHero()   { currentDuel.player2Health--; showDuelHit(p1EstHero ? 'player1' : 'player2'); }
    function hitByGardien(){ currentDuel.player1Health--; showDuelHit(p1EstHero ? 'player2' : 'player1'); }

    if (player1Correct && !player2Correct) {
        p1EstHero ? hitByHero() : hitByGardien();
    } else if (!player1Correct && player2Correct) {
        p1EstHero ? hitByGardien() : hitByHero();
    } else if (player1Correct && player2Correct) {
        if (player1Time <= player2Time) {
            p1EstHero ? hitByHero() : hitByGardien();
        } else {
            p1EstHero ? hitByGardien() : hitByHero();
        }
    } else {
        currentDuel.player1Health--;
        currentDuel.player2Health--;
        showDuelHit('both');
    }

    updateHealthBars();

    if (!currentDuel.history) currentDuel.history = [];
    currentDuel.history.push({
        question: currentDuel.currentQuestion,
        player1Correct, player2Correct, player1Time, player2Time
    });

    if (currentDuel.player1Health <= 0 || currentDuel.player2Health <= 0) {
        setTimeout(() => endDuel(), 1500);
    } else {
        setTimeout(() => {
            // Nettoyer pour le prochain tour
            const fb = document.getElementById('duel-feedback');
            if (fb) fb.style.display = 'none';
            const timer = document.getElementById('duel-timer');
            if (timer) timer.style.color = '#fbbf24';
            currentDuel.answered = false;
            currentDuel.resolved = false;
            nextDuelTurn();
        }, 1500);
    }
}


function showDuelHit(hitter, reponse) {
    // hitter = 'player1' (héros touche), 'player2' (gardien touche), 'both', 'timeout'
    const solution = currentDuel.currentQuestion?.solution || '';

    switch(hitter) {
        case 'player1':
            // Héros a la bonne réponse → projectile héros→gardien, éclair sur gardien
            lancerProjectileDuel(solution, true);
            setTimeout(() => afficherEclairSurJoueur(true), 500);
            break;
        case 'player2':
            // Gardien a la bonne réponse → projectile gardien→héros, éclair sur héros
            lancerProjectileDuel(solution, false);
            setTimeout(() => afficherEclairSurJoueur(false), 500);
            break;
        case 'both':
            // Les deux faux ou timeout → éclair sur les deux
            afficherEclairSurJoueur(true);
            afficherEclairSurJoueur(false);
            break;
    }
}

function showDuelFeedback(isCorrect, reason = '') {
    const feedback = document.getElementById('duel-feedback');
    feedback.style.display = 'block';
    
    if (isCorrect) {
        feedback.innerHTML = '✅ BONNE RÉPONSE !';
        feedback.style.color = '#4CAF50';
    } else if (reason === 'timeout') {
        feedback.innerHTML = '⏰ TEMPS ÉCOULÉ !';
        feedback.style.color = '#ff4444';
    } else {
        feedback.innerHTML = '❌ MAUVAISE RÉPONSE !';
        feedback.style.color = '#ff4444';
    }
}

function updateHealthBars() {
    const player1Percent = (currentDuel.player1Health / currentDuel.player1.health) * 100;
    const player2Percent = (currentDuel.player2Health / currentDuel.player2.health) * 100;
    
    document.getElementById('player1-health').style.width = `${player1Percent}%`;
    document.getElementById('player2-health').style.width = `${player2Percent}%`;
}

function endDuel() {
    let winner = null;
    
    if (currentDuel.player1Health <= 0 && currentDuel.player2Health <= 0) {
        winner = 'draw';
    } else if (currentDuel.player1Health <= 0) {
        winner = 'player2';
    } else {
        winner = 'player1';
    }
    
    if (winner === 'player1') {
        PlayerState.duelStats.wins++;
    } else if (winner === 'player2') {
        PlayerState.duelStats.losses++;
    }
    PlayerState.duelStats.totalDuels++;
    if (window.SaveSystem) SaveSystem.save({ duelStats: PlayerState.duelStats });

    // Marquer le duel comme terminé dans Firestore avec le gagnant
    if (window.FirebaseDB && currentDuel.roomId) {
        window.FirebaseDB.collection('duels').doc(currentDuel.roomId).update({
            statut: 'termine',
            gagnant: winner
        }).catch(() => {});
    }
    
    document.getElementById('incantation-zone').style.display = 'none';
    document.getElementById('question-zone').style.display = 'none';
    document.getElementById('duel-result').style.display = 'block';
    
    let message = '';
    const v1 = currentDuel.player1Health;
    const v2 = currentDuel.player2Health;
    if (winner === 'player1') {
        message = `🏆 ${currentDuel.player1.name.toUpperCase()} GAGNE !`;
    } else if (winner === 'player2') {
        message = `🏆 ${currentDuel.player2.name.toUpperCase()} GAGNE !`;
    } else {
        message = '🤝 ÉGALITÉ !';
    }
    
    document.getElementById('result-message').textContent = message;
    
    if (currentDuel.history.length > 0) {
        const totalTime = currentDuel.history.reduce((sum, turn) => sum + turn.player1Time + turn.player2Time, 0);
        const avgTime = totalTime / (currentDuel.history.length * 2);
        const correctAnswers = currentDuel.history.filter(turn => turn.player1Correct).length;
        const accuracy = (correctAnswers / currentDuel.history.length) * 100;
        
        document.getElementById('avg-time').textContent = `${(avgTime / 1000).toFixed(1)}s`;
        document.getElementById('accuracy').textContent = `${accuracy.toFixed(1)}%`;
    }
}

// ===========================
// FORMES ET PROJECTILES (identique au mode aventure)
// ===========================

function appliquerForme(element, shape) {
    if (!element) return;
    element.style.borderRadius = '';
    element.style.clipPath = '';
    element.style.transform = '';
    switch(shape) {
        case 'circle':         element.style.borderRadius = '50%'; break;
        case 'square':         element.style.borderRadius = '10%'; break;
        case 'triangle-right': element.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 50%)'; break;
        case 'triangle-left':  element.style.clipPath = 'polygon(100% 0%, 100% 100%, 0% 50%)'; break;
        case 'triangle-up':    element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; break;
        case 'triangle-down':  element.style.clipPath = 'polygon(50% 100%, 0% 0%, 100% 0%)'; break;
        case 'star':           element.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'; break;
        case 'lightning':      element.style.clipPath = 'polygon(50% 0%, 40% 30%, 60% 30%, 30% 60%, 50% 60%, 20% 100%, 55% 55%, 80% 70%, 55% 40%, 70% 10%)'; break;
        case 'light':          element.style.clipPath = 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'; break;
        case 'flame':          element.style.borderRadius = '50% 0 50% 50%'; element.style.transform = 'rotate(-45deg)'; break;
        default:               element.style.borderRadius = '50%';
    }
}

// Flag : joueur déjà touché ce tour (pas d'éclair si projectile reçu)
let _p1HitByProjectile = false;
let _p2HitByProjectile = false;

function resetHitFlags() {
    _p1HitByProjectile = false;
    _p2HitByProjectile = false;
    const p1 = document.getElementById('player1-combat-img');
    const p2 = document.getElementById('player2-combat-img');
    if (p1) p1.style.filter = '';
    if (p2) p2.style.filter = '';
}

// Lance un projectile du héros vers le gardien (fromHero=true) ou inverse
function lancerProjectileDuel(texte, fromHero) {
    if (!window.VISUAL_CONFIG || !VISUAL_CONFIG.levels[currentDuel.level]) return;
    const level = currentDuel.level;
    const visual = fromHero
        ? VISUAL_CONFIG.levels[level].projectile
        : (VISUAL_CONFIG.levels[level].enemy?.projectile || VISUAL_CONFIG.levels[level].projectile);

    const sourceId = fromHero ? 'player1-combat-img' : 'player2-combat-img';
    const cibleId  = fromHero ? 'player2-combat-img' : 'player1-combat-img';
    const source   = document.getElementById(sourceId);
    const cible    = document.getElementById(cibleId);
    if (!source || !cible || !visual) return;

    // Créer ou réutiliser un élément projectile
    let proj = document.getElementById(fromHero ? 'proj-hero' : 'proj-gardien');
    if (!proj) {
        proj = document.createElement('div');
        proj.id = fromHero ? 'proj-hero' : 'proj-gardien';
        proj.style.position = 'fixed';
        proj.style.zIndex = '300';
        proj.style.display = 'flex';
        proj.style.alignItems = 'center';
        proj.style.justifyContent = 'center';
        proj.style.color = 'white';
        proj.style.fontSize = '13px';
        proj.style.fontWeight = 'bold';
        proj.style.textShadow = '0 0 5px black';
        document.body.appendChild(proj);
    }

    proj.style.transition = 'none';
    proj.style.width  = visual.size + 'px';
    proj.style.height = visual.size + 'px';
    proj.style.background = `radial-gradient(circle, ${visual.colors[0]}, ${visual.colors[1]})`;
    proj.style.boxShadow = `0 0 ${visual.glowIntensity}px ${visual.glowColor}`;
    proj.style.opacity = '1';
    proj.style.display = 'flex';
    proj.textContent = texte;
    appliquerForme(proj, visual.shape);

    const srcRect = source.getBoundingClientRect();
    const dstRect = cible.getBoundingClientRect();
    proj.style.left = (srcRect.left + srcRect.width/2  - visual.size/2) + 'px';
    proj.style.top  = (srcRect.top  + srcRect.height/2 - visual.size/2) + 'px';

    // Recoil sur la source
    source.style.transition = 'transform 0.15s';
    source.style.transform = fromHero ? 'translateX(15px)' : 'translateX(-15px)';
    setTimeout(() => { source.style.transform = ''; }, 300);

    // Lancer
    setTimeout(() => {
        proj.style.transition = 'all 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
        proj.style.left = (dstRect.left + dstRect.width/2  - visual.size/2) + 'px';
        proj.style.top  = (dstRect.top  + dstRect.height/2 - visual.size/2) + 'px';
        proj.style.opacity = '0.2';
    }, 50);

    // Effet rouge sur la cible au moment de l'impact
    const cibleHit = document.getElementById(cibleId);
    setTimeout(() => {
        if (fromHero) _p2HitByProjectile = true;
        else          _p1HitByProjectile = true;
        if (cibleHit) {
            cibleHit.style.filter = 'drop-shadow(0 0 15px red) sepia(1) saturate(5) hue-rotate(-30deg)';
            setTimeout(() => { if (cibleHit) cibleHit.style.filter = ''; }, 600);
        }
        proj.style.display = 'none';
        proj.style.transition = 'none';
        proj.style.opacity = '1';
        proj.textContent = '';
    }, 1050);
}

// Affiche un éclair sur la tête du joueur touché (seulement si pas déjà touché par projectile)
function afficherEclairSurJoueur(fromHero) {
    // Si déjà touché par un projectile ce tour → pas d'éclair
    if (fromHero && _p2HitByProjectile) return;
    if (!fromHero && _p1HitByProjectile) return;
    const cibleId = fromHero ? 'player2-combat-img' : 'player1-combat-img';
    const cible = document.getElementById(cibleId);
    if (!cible) return;

    let eclair = document.createElement('div');
    eclair.textContent = '⚡';
    eclair.style.cssText = `
        position:fixed;font-size:2.5em;z-index:400;
        pointer-events:none;
        animation:eclairPop 0.8s ease-out forwards;
    `;
    const rect = cible.getBoundingClientRect();
    eclair.style.left = (rect.left + rect.width/2 - 20) + 'px';
    eclair.style.top  = (rect.top - 10) + 'px';
    document.body.appendChild(eclair);
    setTimeout(() => eclair.remove(), 900);
}

function appliquerStyleDuel(level) {
    if (!window.VISUAL_CONFIG || !VISUAL_CONFIG.levels[level]) return;
    const config = VISUAL_CONFIG.levels[level];

    // Appliquer le style sur les 3 cercles
    ['duel-cercle', 'duel-cercle-hero', 'duel-cercle-gardien'].forEach(id => {
        const cercle = document.getElementById(id);
        if (!cercle) return;
        cercle.innerHTML = '';
        const rings = Math.min(config.circle.ringCount, 3);
        for (let i = 0; i < rings; i++) {
            const ring = document.createElement('div');
            ring.className = `ellipse-magique ellipse-${i+1}`;
            const size = (id === 'duel-cercle' ? 250 : 180) - (i * 20);
            ring.style.width  = size + 'px';
            ring.style.height = size + 'px';
            ring.style.borderColor = config.circle.colors[i] || config.circle.colors[0];
            ring.style.animation = `rotateClockwise ${config.circle.rotationSpeed}s linear infinite`;
            cercle.appendChild(ring);
        }
    });
}

function requestRematch() {
    if (confirm('🔄 Demander une revanche ?')) {
        currentDuel.player1Health = currentDuel.player1.health;
        currentDuel.player2Health = currentDuel.player2.health;
        currentDuel.history = [];
        currentDuel.questionIndex = 0;
        shuffleArray(currentDuel.questions);
        
        document.getElementById('duel-result').style.display = 'none';
        document.getElementById('incantation-zone').style.display = 'block';
        document.getElementById('question-zone').style.display = 'block';
        
        nextDuelTurn();
    }
}

function retourCarte() {
    window.location.href = 'map.html';
}

// ===========================
// ARÈNE
// ===========================

function updateArenaPreview() {
    const preview = document.getElementById('arena-preview');
    if (!preview) return;
    
    const color1 = document.getElementById('circle-color1')?.value || '#4169E1';
    const color2 = document.getElementById('circle-color2')?.value || '#1E90FF';
    const ringCount = document.getElementById('ring-count-slider')?.value || 4;
    
    document.getElementById('ring-count').textContent = ringCount;
    
    preview.innerHTML = `
        <div class="arena-preview-circle" style="
            width: 200px;
            height: 200px;
            border: 3px dashed ${color1};
            border-radius: 50%;
            box-shadow: 0 0 30px ${color1};
            animation: spin 8s linear infinite;
        "></div>
    `;
}

document.getElementById('ring-count-slider')?.addEventListener('input', updateArenaPreview);
document.getElementById('circle-color1')?.addEventListener('input', updateArenaPreview);
document.getElementById('circle-color2')?.addEventListener('input', updateArenaPreview);

function createArenaRoom() {
    const config = {
        time: document.getElementById('arena-time')?.value || 'present',
        circleColors: [
            document.getElementById('circle-color1')?.value || '#4169E1',
            document.getElementById('circle-color2')?.value || '#1E90FF'
        ],
        ringCount: parseInt(document.getElementById('ring-count-slider')?.value || 4),
        rotationSpeed: parseInt(document.getElementById('rotation-speed')?.value || 8),
        attackType: document.getElementById('attack-type')?.value || 'classic',
        playerCount: parseInt(document.getElementById('player-count')?.value || 2),
        rules: document.getElementById('arena-rules')?.value || 'standard'
    };
    
    alert(`🏆 Arène créée avec ${config.playerCount} joueurs !`);
    window.location.href = 'duel.html';
}

// ===========================
// UTILITAIRES
// ===========================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getNomNiveau(id) {
    const noms = [
        "Présent", "Passé Composé", "Imparfait", "Futur",
        "Plus-que-Parfait", "Futur Antérieur", "Passé Simple",
        "Passé Antérieur", "BOSS Indicatif", "Impératif Présent",
        "Impératif Passé", "BOSS Impératif", "Conditionnel Présent",
        "Conditionnel Passé", "BOSS Conditionnel", "Subjonctif Présent",
        "Subjonctif Passé", "Subjonctif Imparfait", "BOSS Subjonctif",
        "Voix Passive", "BOSS FINAL"
    ];
    return noms[id - 1] || `Niveau ${id}`;
}

// ===========================
// EXPOSITION GLOBALE
// ===========================

window.showCreateDuel = showCreateDuel;
window.showArenaMode = showArenaMode;
window.backToModeSelect = backToModeSelect;
window.selectCharacter = selectCharacter;
window.selectPlayerForDuel = selectPlayerForDuel;
window.sendDuelInvitation = sendDuelInvitation;
window.cancelDuelRequest = cancelDuelRequest;
window.acceptInvitation = acceptInvitation;
window.declineInvitation = declineInvitation;
window.startDuelFromWaiting = startDuelFromWaiting;
window.cancelWaitingRoom = cancelWaitingRoom;
window.submitDuelAnswer = submitDuelAnswer;
window.requestRematch = requestRematch;
window.retourCarte = retourCarte;
window.rejoindreDirectement = rejoindreDirectement;
window.createArenaRoom = createArenaRoom;