// ===========================
// CONJUGO QUEST - CARTE AVEC PORTALS DUEL/ARÈNE
// (+ mode debug caché — voir tout en bas du fichier)
// ===========================

console.log("🗺️ Système de plateau avec portails chargé !");

// Configuration
const CONFIG = {
    taileTour: 140,
    espaceTours: 200,
    toursParLigne: 8,
    tailleHero: 70,
    vitesseScroll: 1000,
    tailleDalle: 15
};

// Génération des positions
function genererPositionsTours() {
    const positions = [];
    let x = 200;
    let y = CONFIG.taileTour / 2 + 100;
    let direction = 1;
    let toursLigne = 0;
    
    for (let i = 1; i <= 21; i++) {
        positions.push({
            id: i,
            x: x,
            y: y,
            nom: getNomNiveau(i)
        });
        
        toursLigne++;
        
        if (toursLigne < CONFIG.toursParLigne) {
            x += (CONFIG.taileTour + CONFIG.espaceTours) * direction;
        } else {
            y += CONFIG.taileTour + CONFIG.espaceTours;
            toursLigne = 0;
            direction *= -1;
        }
    }
    
    return positions;
}

function getNomNiveau(id) {
    const noms = [
        "Indicatif Présent", "Indicatif Passé Composé", "Indicatif Imparfait",
        "Indicatif Futur", "Indicatif Plus-que-Parfait", "Indicatif Futur Antérieur",
        "Indicatif Passé Simple", "Indicatif Passé Antérieur", "Boss Indicatif",
        "Impératif Présent", "Impératif Passé", "Boss Impératif",
        "Conditionnel Présent", "Conditionnel Passé", "Boss Conditionnel",
        "Subjonctif Présent", "Subjonctif Passé", "Subjonctif Imparfait",
        "Boss Subjonctif", "Voix Passive", "BOSS ULTIME"
    ];
    return noms[id - 1] || `Niveau ${id}`;
}

// État du jeu
let etatJeu = {
    niveauActuel: 1,
    niveauxCompletes: [],
    viesHero: 3
};

let positionsTours = [];

// ===========================
// GESTION DES INVITATIONS
// ===========================

function verifierInvitations() {
    if (!window.FirebaseDB || !window.SaveSystem) {
        console.warn('⚠️ Firebase non disponible pour les invitations');
        return;
    }

    const userId = SaveSystem.getCurrentUserId();
    if (!userId) return;

    // Écoute Firestore en temps réel — remplace le polling localStorage
    window.FirebaseDB.collection('invitations')
        .where('pour', '==', userId)
        .where('statut', '==', 'en_attente')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const inv = change.doc.data();
                    const invId = change.doc.id;
                    console.log('📨 Invitation reçue de', inv.inviter);
                    afficherInvitation({
                        inviter:     inv.inviter,
                        level:       inv.level,
                        health:      inv.health,
                        time:        inv.timeLimit,
                        roomCode:    inv.roomCode,
                        invitationId: invId
                    });
                }
            });
        }, err => {
            console.error('❌ Erreur écoute invitations:', err.message);
        });
}

function afficherInvitation(invite) {
    let overlay = document.getElementById('duel-invite-popup');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'duel-invite-popup';
        overlay.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,10,30,0.98);border:3px solid #fbbf24;border-radius:20px;padding:30px 40px;z-index:9999;text-align:center;font-family:Cinzel,serif;color:white;box-shadow:0 0 60px rgba(251,191,36,0.4);min-width:320px;';
        document.body.appendChild(overlay);
    }
    const noms = ['Présent','Passé Composé','Imparfait','Futur','Plus-que-Parfait','Futur Antérieur','Passé Simple','Passé Antérieur','BOSS Indicatif','Impératif Présent','Impératif Passé','BOSS Impératif','Conditionnel Présent','Conditionnel Passé','BOSS Conditionnel','Subjonctif Présent','Subjonctif Passé','Subjonctif Imparfait','BOSS Subjonctif','Voix Passive','BOSS FINAL'];
    const nomNiveau = noms[(invite.level||1)-1] || 'Niveau '+(invite.level||1);
    const roleLabel = invite.currentRole === 'hero' ? '🦸 Héros' : '👹 Gardien';
    overlay.innerHTML = `
        <div style="font-size:2em;margin-bottom:10px;">⚔️</div>
        <div style="color:#fbbf24;font-size:1.3em;font-weight:bold;margin-bottom:5px;">DÉFI DE ${invite.inviter.toUpperCase()}</div>
        <div style="color:#94a3b8;margin-bottom:20px;font-size:0.9em;">t'invite à un combat de conjugaison</div>
        <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:15px;margin-bottom:20px;">
            <div style="margin-bottom:8px;">📚 <strong>${nomNiveau}</strong></div>
            <div style="margin-bottom:8px;">⏱️ <strong>${invite.time||invite.timeLimit}s</strong> par réponse</div>
            <div style="margin-bottom:8px;">❤️ <strong>${invite.health}</strong> vies chacun</div>
            <div>🎭 Tu joues : <strong>${roleLabel}</strong></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
            <button onclick="rejoindreDuel('${invite.roomCode}','${invite.invitationId}')" style="padding:12px 25px;background:linear-gradient(145deg,#fbbf24,#f59e0b);border:none;border-radius:10px;color:#1a1a2e;font-family:'Cinzel',serif;font-weight:bold;cursor:pointer;">⚔️ REJOINDRE</button>
            <button onclick="refuserDuel('${invite.invitationId}')" style="padding:12px 20px;background:rgba(255,255,255,0.1);border:2px solid #f43f5e;border-radius:10px;color:#f43f5e;font-family:'Cinzel',serif;cursor:pointer;">✕ Refuser</button>
        </div>`;
    overlay.style.display = 'block';
    setTimeout(() => { if (overlay.style.display !== 'none') refuserDuel(invite.invitationId); }, 30000);
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

function fermerInvitation() {
    const o = document.getElementById('duel-invite-popup');
    if (o) o.style.display = 'none';
}

async function refuserInvitation(invitationId) {
    fermerInvitation();
    if (invitationId && window.FirebaseDB) {
        try {
            await window.FirebaseDB.collection('invitations').doc(invitationId).update({ statut: 'refuse' });
        } catch(e) {}
    }
}

function quitterJeu() {
    if (confirm("🚪 Quitter le jeu ?\n(La progression sera sauvegardée)")) {
        window.location.href = 'login.html';
    }
}

// ===========================
// INITIALISATION
// ===========================

window.addEventListener('load', () => {
    chargerProgression();
    positionsTours = genererPositionsTours();
    creerPlateau();
    positionnerHero();
    centrerCamera();
    mettreAJourUI();
    verifierInvitations(); // Démarre la vérification des invitations
    initDeclencheurDebug(); // Active l'écoute clavier discrète du mode debug
});

function chargerProgression() {
    try {
        const donnees = (window.SaveSystem ? SaveSystem.getSave() : null)
            || JSON.parse(localStorage.getItem('conjugoquest_save') || 'null')
            || { niveauActuel: 1, viesHero: 3, niveauxCompletes: [] };
        etatJeu = { ...etatJeu, ...donnees };
        console.log("✅ Progression chargée:", etatJeu);
    } catch(e) {
        console.error("❌ chargerProgression() échoué:", e);
        // On garde les valeurs par défaut de etatJeu
    }
}

// Création du plateau
function creerPlateau() {
    const plateau = document.getElementById('plateau');
    plateau.innerHTML = '';
    
    positionsTours.forEach(pos => {
        const tourContainer = document.createElement('div');
        tourContainer.className = 'tour-container';
        tourContainer.style.left = pos.x + 'px';
        tourContainer.style.top = pos.y + 'px';
        tourContainer.dataset.niveau = pos.id;
        
        // Masquer les tours futures
        if (pos.id > etatJeu.niveauActuel + 2 && !etatJeu.niveauxCompletes.includes(pos.id)) {
            tourContainer.classList.add('invisible');
        }
        
        const tourImg = document.createElement('img');
        tourImg.src = `img/map/${pos.id}.png`;
        tourImg.className = 'tour-image';
        tourImg.alt = pos.nom;
        
        // Image de secours si manquante
        tourImg.onerror = () => {
            tourImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="140" height="140"%3E%3Crect fill="%23333" width="140" height="140" rx="20"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23fff" font-size="20"%3E' + pos.id + '%3C/text%3E%3C/svg%3E';
        };
        
        // État de la tour
        if (etatJeu.niveauxCompletes.includes(pos.id)) {
            tourContainer.classList.add('complete');
        } else if (pos.id === etatJeu.niveauActuel) {
            tourContainer.classList.add('actuelle');
        } else if (pos.id > etatJeu.niveauActuel) {
            tourContainer.classList.add('verrouille');
        }
        
        const nomTour = document.createElement('div');
        nomTour.className = 'nom-tour';
        nomTour.textContent = pos.nom;
        
        tourContainer.addEventListener('click', () => {
            if (pos.id === etatJeu.niveauActuel) {
                commencerNiveau(pos);
            } else if (etatJeu.niveauxCompletes.includes(pos.id)) {
                // Permettre de rejouer les niveaux complétés
                if (confirm(`⚔️ Niveau ${pos.id} déjà complété.\nVoulez-vous le rejouer ?`)) {
                    localStorage.setItem('conjugoquest_replay', pos.id);
                    commencerNiveau(pos);
                }
            } else if (pos.id > etatJeu.niveauActuel) {
                alert(`🔒 Niveau verrouillé !\n\nTerminez d'abord : ${getNomNiveau(etatJeu.niveauActuel)}`);
            }
        });
        
        tourContainer.appendChild(tourImg);
        tourContainer.appendChild(nomTour);
        plateau.appendChild(tourContainer);
        
        // ===========================
        // AJOUT DES PORTAILS DUEL
        // ===========================
        
        // Portail duel pour les niveaux complétés
        if (etatJeu.niveauxCompletes.includes(pos.id) && pos.id < 21) {
            ajouterPortailDuel(plateau, pos);
        }
        
        // Portail spécial arène après le niveau 21
        if (etatJeu.niveauxCompletes.includes(21)) {
            ajouterPortailArena(plateau);
        }
    });
    
    dessinerChemin();
}

// ===========================
// FONCTIONS PORTAILS
// ===========================

function ajouterPortailDuel(plateau, pos) {
    const portailContainer = document.createElement('div');
    portailContainer.className = 'portail-duel';
    portailContainer.style.left = (pos.x + CONFIG.taileTour / 2 - 35) + 'px';
    portailContainer.style.top = (pos.y - 70) + 'px';
    portailContainer.dataset.niveau = pos.id;
    
    portailContainer.innerHTML = `
        <div class="portail-anneau"></div>
        <div class="portail-anneau interne"></div>
        <div class="portail-icone">⚔️</div>
        <div class="portail-tooltip">Mode Duel - Niv ${pos.id}</div>
    `;
    
    portailContainer.onclick = (e) => {
        e.stopPropagation();
        ouvrirDuelPourNiveau(pos.id);
    };
    
    plateau.appendChild(portailContainer);
}

function ajouterPortailArena(plateau) {
    // Trouver la position après le dernier niveau
    const derniereTour = positionsTours[20];
    const posX = derniereTour.x + 150;
    const posY = derniereTour.y - 50;
    
    const portailContainer = document.createElement('div');
    portailContainer.className = 'portail-arena';
    portailContainer.style.left = posX + 'px';
    portailContainer.style.top = posY + 'px';
    
    portailContainer.innerHTML = `
        <div class="portail-anneau arena"></div>
        <div class="portail-anneau interne arena"></div>
        <div class="portail-icone">🏆</div>
        <div class="portail-tooltip">ARÈNE - Combat ultime</div>
    `;
    
    portailContainer.onclick = () => {
        ouvrirArena();
    };
    
    plateau.appendChild(portailContainer);
}

function ouvrirDuelPourNiveau(niveauId) {
    console.log(`⚔️ Ouverture duel pour niveau ${niveauId}`);
    
    // Sauvegarder le niveau sélectionné
    sessionStorage.setItem('duel_selected_level', niveauId);
    
    // Rediriger vers la page duel
    window.location.href = 'duel.html';
}

function ouvrirArena() {
    console.log("🏆 Ouverture de l'arène");
    
    // Sauvegarder qu'on vient de l'arène
    sessionStorage.setItem('arena_access', 'true');
    
    // Rediriger vers la page duel en mode arène
    window.location.href = 'duel.html?mode=arena';
}

// Positionnement du héros
function positionnerHero() {
    const hero = document.getElementById('hero-chibi');
    const position = positionsTours.find(p => p.id === etatJeu.niveauActuel);
    
    if (position && hero) {
        hero.style.left = (position.x + CONFIG.taileTour / 2 - 70 / 2) + 'px';
        hero.style.top = (position.y + CONFIG.taileTour - 70 - 20) + 'px';
    }
}

// Caméra
function centrerCamera() {
    const viewport = document.getElementById('carte-container');
    const position = positionsTours.find(p => p.id === etatJeu.niveauActuel);
    
    if (!position || !viewport) return;
    
    const scrollX = position.x - (viewport.clientWidth / 2) + (CONFIG.taileTour / 2);
    const scrollY = position.y - (viewport.clientHeight / 2) + (CONFIG.taileTour / 2);
    
    viewport.scrollTo({
        left: Math.max(0, scrollX),
        top: Math.max(0, scrollY),
        behavior: 'smooth'
    });
}

// Dessin du chemin
function dessinerChemin() {
    const plateau = document.getElementById('plateau');
    const ancienChemin = document.getElementById('chemin-dalles');
    if (ancienChemin) ancienChemin.remove();
    
    const cheminContainer = document.createElement('div');
    cheminContainer.id = 'chemin-dalles';
    cheminContainer.style.position = 'absolute';
    cheminContainer.style.top = '0';
    cheminContainer.style.left = '0';
    cheminContainer.style.width = '100%';
    cheminContainer.style.height = '100%';
    cheminContainer.style.zIndex = '1';
    cheminContainer.style.pointerEvents = 'none';
    
    for (let i = 0; i < positionsTours.length - 1; i++) {
        const pos1 = positionsTours[i];
        const pos2 = positionsTours[i + 1];
        
        if (pos2.id > etatJeu.niveauActuel + 2) continue;
        
        const x1 = pos1.x + CONFIG.taileTour / 2;
        const y1 = pos1.y + CONFIG.taileTour;
        const x2 = pos2.x + CONFIG.taileTour / 2;
        const y2 = pos2.y + CONFIG.taileTour;
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const nombreDalles = Math.floor(distance / 50);
        
        for (let j = 0; j <= nombreDalles; j++) {
            const progression = j / nombreDalles;
            const x = x1 + (x2 - x1) * progression;
            const y = y1 + (y2 - y1) * progression;
            
            const dalle = document.createElement('div');
            dalle.className = 'dalle-chemin';
            
            if (pos1.id < etatJeu.niveauActuel) {
                dalle.classList.add('dalle-complete');
            } else if (pos1.id === etatJeu.niveauActuel) {
                dalle.classList.add('dalle-actuelle');
            } else {
                dalle.classList.add('dalle-future');
            }
            
            dalle.style.left = (x - CONFIG.tailleDalle / 2) + 'px';
            dalle.style.top = (y - CONFIG.tailleDalle / 2) + 'px';
            
            cheminContainer.appendChild(dalle);
        }
    }
    
    plateau.appendChild(cheminContainer);
}

// Déplacement du héros
async function deplacerHeroVers(niveauId) {
    const hero = document.getElementById('hero-chibi');
    const positionCible = positionsTours.find(p => p.id === niveauId);
    
    if (!positionCible || !hero) return;
    
    hero.classList.add('marche');
    
    hero.style.left = (positionCible.x + CONFIG.taileTour / 2 - 35) + 'px';
    hero.style.top = (positionCible.y + CONFIG.taileTour - 90) + 'px';
    
    setTimeout(() => centrerCamera(), 200);
    
    await new Promise(resolve => setTimeout(resolve, CONFIG.vitesseScroll));
    
    hero.classList.remove('marche');
    etatJeu.niveauActuel = niveauId;
    sauvegarderProgression();
    mettreAJourUI();
    creerPlateau();
    positionnerHero();
}

// Commencer un niveau
function commencerNiveau(niveau) {
    console.log("🎮 Commencer niveau:", niveau.nom);
    sauvegarderProgression();
    
    // Rediriger vers la page de combat avec le numéro du niveau
    window.location.href = `combat.html?niveau=${niveau.id}`;
}

// Interface
function mettreAJourUI() {
    const niveauElem = document.getElementById('niveau-actuel');
    if (niveauElem) {
        niveauElem.textContent = `Niveau: ${etatJeu.niveauActuel}/21`;
    }
    
    const viesElem = document.getElementById('vies-hero');
    if (viesElem) {
        viesElem.innerHTML = '❤️'.repeat(etatJeu.viesHero) + '🖤'.repeat(3 - etatJeu.viesHero);
    }
}

function retourMenu() {
    if (confirm("Retourner au menu ?\n(Progression sauvegardée)")) {
        window.location.href = 'index.html';
    }
}

// Sauvegarde
function sauvegarderProgression() {
    try {
        if (window.SaveSystem) {
            SaveSystem.save(etatJeu);
        } else {
            localStorage.setItem('conjugoquest_save', JSON.stringify(etatJeu));
        }
    } catch(e) {
        console.error("❌ sauvegarderProgression() échoué:", e);
    }
}

// ===========================================================
// MODE DEBUG CACHÉ
// ===========================================================
// Aucun bouton, aucun texte "debug" dans le DOM ou la console.
// Déclenchement : taper les 7 lettres "granger" au clavier,
// n'importe où sur la page (aucun champ à cliquer avant).
// Le mot de passe demandé ensuite n'est JAMAIS stocké en clair :
// seul son hash SHA-256 est comparé, exactement comme pour
// l'accès admin de admin-prive.html.
//
// En cas d'échec, rien ne s'affiche (pas de message d'erreur) :
// un élève qui tombe sur le prompt par hasard n'a aucune preuve
// qu'un mode debug existe réellement derrière.
// ===========================================================

const DEBUG_TRIGGER = 'granger';
const DEBUG_HASH = "6d616e5b5db229bffa547956723a9f088c63f8782438a5712cf7321ba462aa04";
let _debugBuffer = '';

function initDeclencheurDebug() {
    document.addEventListener('keydown', (e) => {
        // Ignore les frappes faites dans un champ texte (pour ne pas gêner la saisie normale)
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        _debugBuffer = (_debugBuffer + e.key).slice(-DEBUG_TRIGGER.length).toLowerCase();
        if (_debugBuffer === DEBUG_TRIGGER) {
            _debugBuffer = '';
            ouvrirPromptDebug();
        }
    });
}

async function ouvrirPromptDebug() {
    const pwd = prompt('🔒');
    if (!pwd) return;

    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pwd));
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (hash !== DEBUG_HASH) return; // échec silencieux, aucun indice donné

    afficherPanelDebug();
}

async function afficherPanelDebug() {
    const saisie = prompt('Niveau (1-21) — laisser vide pour tout débloquer :');
    if (saisie === null) return;

    let niveauCible;
    let niveauxCompletes;

    if (saisie.trim() === '') {
        // Tout débloquer d'un coup
        niveauCible = 21;
        niveauxCompletes = Array.from({ length: 21 }, (_, i) => i + 1);
    } else {
        niveauCible = parseInt(saisie);
        if (!niveauCible || niveauCible < 1 || niveauCible > 21) return;
        niveauxCompletes = [];
        for (let i = 1; i < niveauCible; i++) niveauxCompletes.push(i);
    }

    const nouvelleSave = {
        niveauActuel: niveauCible < 21 ? niveauCible : 21,
        niveauxCompletes: niveauxCompletes,
        viesHero: 3
    };

    try {
        if (window.SaveSystem) {
            await SaveSystem.saveAndWait(nouvelleSave);
        } else {
            localStorage.setItem('conjugoquest_save', JSON.stringify(nouvelleSave));
        }
    } catch (e) {
        console.warn('Debug save échoué:', e.message);
    }

    window.location.href = `combat.html?niveau=${niveauCible}`;
}
