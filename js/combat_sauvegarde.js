// ===========================
// CONJUGO QUEST - SYSTÈME DE COMBAT
// ===========================

console.log("⚔️ Système de combat chargé !");

// ===========================
// VARIABLES GLOBALES
// ===========================

let donneesNiveau = null;
let niveauActuel = 1;
let phaseActuelle = 'intro'; // intro, combat, victoire, defaite

// État du combat
let viesJoueur = 3;
let viesTour = 20;
let viesTourActuelles = 20;
let combo = 0;

// Pools de questions (avec shuffle et recyclage)
let poolAttaques = [];
let poolDefenses = [];
let indexAttaque = 0;
let indexDefense = 0;

// Question en cours
let questionActuelle = null;
let enDefense = false; // true si en phase défense, false si en attaque

// ===========================
// INITIALISATION
// ===========================

window.addEventListener('load', async () => {
    // Récupérer le niveau depuis l'URL
    const params = new URLSearchParams(window.location.search);
    niveauActuel = parseInt(params.get('niveau')) || 1;
    
    console.log(`📚 Chargement du niveau ${niveauActuel}...`);
    
    // Charger les données du niveau
    await chargerDonneesNiveau();
    
    // Initialiser la phase d'intro
    afficherPhaseIntro();
});

// ===========================
// CHARGEMENT DES DONNÉES
// ===========================

// Appliquer la configuration visuelle du niveau
function appliquerStyleNiveau() {
    // Utiliser la configuration depuis donneesNiveau.visual
    if (donneesNiveau && donneesNiveau.visual) {
        const visual = donneesNiveau.visual;
        const root = document.documentElement;
        
        // Projectile du héros
        if (visual.projectile) {
            root.style.setProperty('--projectile-size', `${visual.projectile.size}px`);
            root.style.setProperty('--projectile-color-1', visual.projectile.colors[0]);
            root.style.setProperty('--projectile-color-2', visual.projectile.colors[1]);
            root.style.setProperty('--projectile-shadow', visual.projectile.glowColor);
        }
        
        // Cercle magique
        if (visual.circle) {
            root.style.setProperty('--circle-size', `${visual.circle.size}px`);
            root.style.setProperty('--circle-color-1', visual.circle.colors[0] || 'rgba(100, 149, 237, 0.9)');
            root.style.setProperty('--circle-color-2', visual.circle.colors[1] || 'rgba(65, 105, 225, 0.85)');
            root.style.setProperty('--circle-color-3', visual.circle.colors[2] || 'rgba(135, 206, 250, 0.9)');
            root.style.setProperty('--circle-color-4', visual.circle.colors[3] || 'rgba(70, 130, 180, 0.8)');
            root.style.setProperty('--particle-color', visual.circle.particleColor);
        }
        
        // Projectile ennemi
        if (visual.enemy && visual.enemy.projectile) {
            root.style.setProperty('--enemy-projectile-size', `${visual.enemy.projectile.size}px`);
            root.style.setProperty('--enemy-projectile-color-1', visual.enemy.projectile.colors[0]);
            root.style.setProperty('--enemy-projectile-color-2', visual.enemy.projectile.colors[1]);
            root.style.setProperty('--enemy-projectile-shadow', visual.enemy.projectile.glowColor);
        }
        
        console.log(`🎨 Configuration visuelle niveau ${niveauActuel} appliquée`);
    } else {
        console.warn('⚠️ Aucune configuration visuelle trouvée pour ce niveau');
    }
}

async function chargerDonneesNiveau() {
    try {
        // Charger le bon niveau selon niveauActuel
        if (niveauActuel === 1) {
            // Niveau 1 : Présent de l'Indicatif
            if (typeof NIVEAU_01_DATA === 'undefined') {
                throw new Error("Données du niveau 1 non chargées");
            }
            donneesNiveau = NIVEAU_01_DATA;
            
        } else if (niveauActuel === 2) {
            // Niveau 2 : Passé Composé
            if (typeof NIVEAU_02_DATA === 'undefined') {
                throw new Error("Données du niveau 2 non chargées");
            }
            donneesNiveau = NIVEAU_02_DATA;
            
        } else if (niveauActuel === 3) {
            // Niveau 3 : Imparfait
            if (typeof NIVEAU_03_DATA === 'undefined') {
                throw new Error("Données du niveau 3 non chargées");
            }
            donneesNiveau = NIVEAU_03_DATA;
            
        } else if (niveauActuel === 4) {
            // Niveau 4 : Futur Simple
            if (typeof NIVEAU_04_DATA === 'undefined') {
                throw new Error("Données du niveau 4 non chargées");
            }
            donneesNiveau = NIVEAU_04_DATA;
            
        } else {
            throw new Error(`Le niveau ${niveauActuel} n'est pas encore disponible`);
        }
        
        console.log("✅ Données chargées:", donneesNiveau);
        
        // Appliquer le style visuel du niveau (couleurs, tailles)
        appliquerStyleNiveau();
        
        // Initialiser les vies de la tour
        viesTour = donneesNiveau.viesTour || 20;
        viesTourActuelles = viesTour;
        
        // Mélanger les pools de questions
        melangerQuestions();
        
    } catch (error) {
        console.error("❌ Erreur de chargement:", error);
        alert("Erreur: " + error.message);
    }
}

// ===========================
// SHUFFLE ET RECYCLAGE
// ===========================

function melangerQuestions() {
    // Copier et mélanger les attaques
    poolAttaques = [...donneesNiveau.attaques];
    shuffleArray(poolAttaques);
    
    // Copier et mélanger les défenses
    poolDefenses = [...donneesNiveau.defenses];
    shuffleArray(poolDefenses);
    
    // Réinitialiser les index
    indexAttaque = 0;
    indexDefense = 0;
    
    console.log(`🔀 ${poolAttaques.length} attaques et ${poolDefenses.length} défenses mélangées`);
}

// Algorithme de Fisher-Yates pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Obtenir la prochaine question d'attaque
function getQuestionAttaque() {
    if (indexAttaque >= poolAttaques.length) {
        // Remélanger et recommencer
        console.log("🔄 Recyclage des attaques...");
        shuffleArray(poolAttaques);
        indexAttaque = 0;
    }
    return poolAttaques[indexAttaque++];
}

// Obtenir la prochaine question de défense
function getQuestionDefense() {
    if (indexDefense >= poolDefenses.length) {
        // Remélanger et recommencer
        console.log("🔄 Recyclage des défenses...");
        shuffleArray(poolDefenses);
        indexDefense = 0;
    }
    return poolDefenses[indexDefense++];
}

// ===========================
// PHASE INTRO
// ===========================

function afficherPhaseIntro() {
    console.log("🎬 Affichage phase intro...");
    phaseActuelle = 'intro';
    
    if (!donneesNiveau) {
        console.error("❌ donneesNiveau est null !");
        alert("Erreur: Les données du niveau ne sont pas chargées.");
        return;
    }
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    // Afficher le nom du niveau
    document.getElementById('nom-niveau').textContent = donneesNiveau.nom;
    
    // Charger les images
    document.getElementById('img-tour-intact').src = `img/towers/${numeroFormatte}_intact.png`;
    document.getElementById('img-ennemi-arrogant').src = `img/enemies/${numeroFormatte}_arrogant.png`;
    
    // Afficher le dialogue de défi
    document.getElementById('dialogue-defi').textContent = donneesNiveau.dialogues.defi;
    
    // Assombrir la tour après 2.5 secondes (quand l'ennemi apparaît)
    setTimeout(() => {
        document.getElementById('tour-intro').classList.add('assombrir');
    }, 2500);
    
    // Afficher la phase
    afficherPhase('phase-intro');
}

// ===========================
// DÉMARRAGE DU COMBAT
// ===========================

function demarrerCombat() {
    console.log("⚔️ Démarrage du combat...");
    
    // Fondu de sortie de l'intro
    const phaseIntro = document.getElementById('phase-intro');
    phaseIntro.classList.add('fadeOut');
    
    // Attendre la fin du fondu (1.5s) avant d'afficher le combat
    setTimeout(() => {
        phaseActuelle = 'combat';
        
        const numeroFormatte = String(niveauActuel).padStart(2, '0');
        
        // Charger le background de début
        document.getElementById('background-combat').src = `img/backgrounds/${numeroFormatte}_debut.png`;
        
        // Charger l'image de la tour intacte
        document.getElementById('img-tour-etat').src = `img/towers/${numeroFormatte}_intact.png`;
        
        // Charger l'ennemi profil (pour le combat)
        document.getElementById('img-ennemi-etat').src = `img/enemies/${numeroFormatte}_profil.png`;
        
        // Charger le héros en attaque
        document.getElementById('hero-combat').src = `img/combat/${numeroFormatte}_attaque.png`;
        
        // Initialiser l'interface
        mettreAJourVies();
        mettreAJourBarreVieTour();
        
        // Afficher la phase
        afficherPhase('phase-combat');
        
        // Attendre 2 secondes avant d'afficher l'incantation
        setTimeout(() => {
            afficherQuestionAttaque();
        }, 2000);
        
    }, 1500);
}

// ===========================
// ATTAQUE DU JOUEUR
// ===========================

function afficherQuestionAttaque() {
    enDefense = false;
    questionActuelle = getQuestionAttaque();
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    // Changer l'image du héros en position d'attaque
    document.getElementById('hero-combat').src = `img/combat/${numeroFormatte}_attaque.png`;
    
    // Masquer la zone de défense
    document.getElementById('zone-defense').style.display = 'none';
    
    // AFFICHER la zone input EN HAUT
    const zoneInput = document.getElementById('zone-input-attaque');
    zoneInput.style.display = 'block';
    
    // Afficher la zone d'incantation (cercle magique)
    const zoneIncantation = document.getElementById('zone-incantation');
    zoneIncantation.style.display = 'block';
    
    // NETTOYER les classes précédentes
    const incantationDiv = document.getElementById('incantation-text');
    incantationDiv.classList.remove('correct', 'incorrect');
    
    // Remplir les infos EN HAUT
    document.getElementById('verbe-infinitif').textContent = questionActuelle.verbe.toUpperCase();
    document.getElementById('temps-verbal').textContent = donneesNiveau.nom;
    document.getElementById('personne-verbal').textContent = questionActuelle.personne;
    
    // AFFICHER L'INCANTATION avec le trou dans le cercle magique
    const incantationTexte = questionActuelle.incantation.replace(
        '{VERBE}',
        '<span class="trou-verbe">___</span>'
    );
    incantationDiv.innerHTML = `<div class="incantation-complete">${incantationTexte}</div>`;
    
    // Réinitialiser l'input
    document.getElementById('input-conjugaison').value = '';
    document.getElementById('input-conjugaison').focus();
}

// Fonction pour créer du texte en arc de cercle
function creerTexteEnArc(texte) {
    // Pour simplifier, on garde le texte horizontal mais mieux centré
    // Un vrai arc de cercle nécessiterait SVG ou canvas
    return `<div style="max-width: 400px; margin: 0 auto;">${texte}</div>`;
}

function getModeClass() {
    if (niveauActuel <= 9) return 'indicatif';
    if (niveauActuel <= 12) return 'imperatif';
    if (niveauActuel <= 15) return 'conditionnel';
    if (niveauActuel <= 19) return 'subjonctif';
    return 'passif';
}

function validerAttaque() {
    const reponse = document.getElementById('input-conjugaison').value.trim().toLowerCase();
    const solution = questionActuelle.solution.toLowerCase();
    
    const incantationDiv = document.getElementById('incantation-text');
    
    if (reponse === solution) {
        // ✅ ATTAQUE RÉUSSIE - TOUTE LA PHRASE EN BLEU
        console.log("✅ Bonne conjugaison !");
        
        // Remplacer le trou par le verbe (sans style inline pour que la phrase entière hérite de la couleur)
        const incantationComplete = questionActuelle.incantation.replace(
            '{VERBE}',
            `<span class="verbe-remplace">${questionActuelle.solution}</span>`
        );
        incantationDiv.innerHTML = `<div class="incantation-complete">${incantationComplete}</div>`;
        
        // Ajouter la classe correct pour que TOUTE la phrase devienne bleue
        incantationDiv.classList.add('correct');
        
        // Masquer la zone input
        document.getElementById('zone-input-attaque').style.display = 'none';
        
        // Attendre pour voir l'effet puis lancer le projectile
        setTimeout(() => {
            // Lancer la particule d'attaque avec le texte
            lancerParticuleDattaque(questionActuelle.solution);
            
            // Masquer le cercle magique
            document.getElementById('zone-incantation').style.display = 'none';
            
            setTimeout(() => {
                // Dégâts à la tour
                viesTourActuelles--;
                mettreAJourBarreVieTour();
                
                // Animation de dégât sur l'ennemi
                document.getElementById('img-ennemi-etat').classList.add('touche');
                setTimeout(() => {
                    document.getElementById('img-ennemi-etat').classList.remove('touche');
                }, 500);
                
                // Incrémenter le combo
                combo++;
                if (combo >= 5) {
                    // Bonus de combo !
                    if (viesJoueur < 3) {
                        viesJoueur++;
                        mettreAJourVies();
                        afficherMessage("🔥 COMBO ! +1 ❤️", 'success');
                    }
                    combo = 0;
                }
                mettreAJourCombo();
                
                // Vérifier si la tour est à mi-vie
                if (viesTourActuelles === Math.floor(viesTour / 2)) {
                    afficherMilieuCombat();
                } else if (viesTourActuelles <= 0) {
                    // Victoire !
                    setTimeout(() => afficherPhaseVictoire(), 1000);
                } else {
                    // Passer à la défense
                    setTimeout(() => afficherQuestionDefense(), 1500);
                }
            }, 1000);
        }, 1200);
        
    } else {
        // ❌ ATTAQUE RATÉE - TOUTE LA PHRASE EN ROUGE
        console.log("❌ Mauvaise conjugaison...");
        
        // Remplacer le trou par la mauvaise réponse
        const incantationErreur = questionActuelle.incantation.replace(
            '{VERBE}',
            `<span class="verbe-remplace">${reponse || '?'}</span>`
        );
        incantationDiv.innerHTML = `<div class="incantation-complete">${incantationErreur}</div>`;
        
        // Ajouter la classe incorrect pour que TOUTE la phrase devienne rouge
        incantationDiv.classList.add('incorrect');
        
        // Afficher la bonne réponse en haut
        const zoneInput = document.getElementById('zone-input-attaque');
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
            // Retirer le message d'erreur
            if (messageErreur.parentNode) {
                messageErreur.remove();
            }
            
            // Masquer les zones
            document.getElementById('zone-input-attaque').style.display = 'none';
            document.getElementById('zone-incantation').style.display = 'none';
            
            // Réinitialiser le combo
            combo = 0;
            mettreAJourCombo();
            
            // Passer directement à la défense
            setTimeout(() => afficherQuestionDefense(), 1000);
        }, 2500);
    }
}

function lancerParticuleDattaque(texteVerbe) {
    const particule = document.getElementById('particule-attaque');
    const ennemi = document.getElementById('ennemi-combat');
    const hero = document.getElementById('hero-combat');
    
    // Positions
    const heroRect = hero.getBoundingClientRect();
    const ennemiRect = ennemi.getBoundingClientRect();
    
    // Afficher le projectile bleu avec le texte
    particule.style.display = 'flex';
    particule.style.opacity = '1';
    particule.textContent = texteVerbe; // AFFICHER LE VERBE DANS LE PROJECTILE
    
    // Position de départ (héros)
    particule.style.left = heroRect.left + heroRect.width / 2 + 'px';
    particule.style.bottom = heroRect.bottom - heroRect.height / 2 + 'px';
    particule.style.top = 'auto';
    
    // Animation vers l'ennemi avec opacité décroissante
    setTimeout(() => {
        particule.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        particule.style.left = ennemiRect.left + ennemiRect.width / 2 + 'px';
        particule.style.top = ennemiRect.top + ennemiRect.height / 2 + 'px';
        particule.style.bottom = 'auto';
        particule.style.opacity = '0.2'; // Très translucide en arrivant
    }, 50);
    
    // Effet de recul sur le héros
    document.getElementById('hero-combat').classList.add('attaque-recoil');
    
    setTimeout(() => {
        particule.style.display = 'none';
        particule.style.transition = 'none';
        particule.style.opacity = '1';
        particule.textContent = ''; // Nettoyer le texte
        document.getElementById('hero-combat').classList.remove('attaque-recoil');
    }, 1100);
}

// ===========================
// DÉFENSE DU JOUEUR
// ===========================

function afficherQuestionDefense() {
    enDefense = true;
    questionActuelle = getQuestionDefense();
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    // Changer l'image du héros en position de défense
    document.getElementById('hero-combat').src = `img/combat/${numeroFormatte}_defense.png`;
    
    // Masquer la zone d'attaque
    document.getElementById('zone-incantation').style.display = 'none';
    
    // Afficher le QCM
    const zoneDefense = document.getElementById('zone-defense');
    zoneDefense.style.display = 'block';
    
    // Afficher la question
    document.getElementById('question-defense').textContent = questionActuelle.question;
    
    // Créer les boutons de réponse
    const reponsesDiv = document.getElementById('reponses-defense');
    reponsesDiv.innerHTML = '';
    
    questionActuelle.reponses.forEach((reponse, index) => {
        const btn = document.createElement('button');
        btn.className = 'reponse-btn';
        btn.textContent = reponse;
        btn.onclick = () => validerDefense(index);
        reponsesDiv.appendChild(btn);
    });
}

function validerDefense(indexReponse) {
    const boutons = document.querySelectorAll('.reponse-btn');
    const bonneReponse = questionActuelle.solution;
    
    // Désactiver tous les boutons
    boutons.forEach(btn => btn.disabled = true);
    
    // Lancer le projectile ennemi AVANT de vérifier la réponse
    lancerProjectileEnnemi(indexReponse === bonneReponse);
    
    setTimeout(() => {
        if (indexReponse === bonneReponse) {
            // ✅ DÉFENSE RÉUSSIE - Projectile rebondit
            console.log("✅ Bonne défense !");
            boutons[indexReponse].classList.add('correcte');
            
            // Le rebond est géré dans lancerProjectileEnnemi
            
            // Incrémenter le combo
            combo++;
            if (combo >= 5) {
                if (viesJoueur < 3) {
                    viesJoueur++;
                    mettreAJourVies();
                    afficherMessage("🔥 COMBO ! +1 ❤️", 'success');
                }
                combo = 0;
            }
            mettreAJourCombo();
            
            setTimeout(() => {
                // Passer à l'attaque suivante
                afficherQuestionAttaque();
            }, 1500);
            
        } else {
            // ❌ DÉFENSE RATÉE - Projectile touche
            console.log("❌ Mauvaise défense...");
            boutons[indexReponse].classList.add('incorrecte');
            boutons[bonneReponse].classList.add('correcte');
            
            // Flash rouge et recul sur le héros
            const hero = document.getElementById('hero-combat');
            hero.classList.add('touche', 'recul-defense');
            setTimeout(() => {
                hero.classList.remove('touche', 'recul-defense');
            }, 800);
            
            // Perdre une vie
            viesJoueur--;
            mettreAJourVies();
            
            // Réinitialiser le combo
            combo = 0;
            mettreAJourCombo();
            
            setTimeout(() => {
                if (viesJoueur <= 0) {
                    // Défaite
                    afficherPhaseDefaite();
                } else {
                    // Continuer
                    afficherQuestionAttaque();
                }
            }, 2000);
        }
    }, 800); // Attendre que le projectile arrive
}

// Fonction pour lancer le projectile ennemi
function lancerProjectileEnnemi(rebondit = false) {
    const projectile = document.getElementById('projectile-ennemi');
    if (!projectile) {
        // Créer le projectile s'il n'existe pas
        const proj = document.createElement('div');
        proj.id = 'projectile-ennemi';
        proj.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, #ff4444, #cc0000);
            border-radius: 50%;
            box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
            z-index: 150;
            display: none;
        `;
        document.getElementById('phase-combat').appendChild(proj);
    }
    
    const proj = document.getElementById('projectile-ennemi');
    const ennemi = document.getElementById('ennemi-combat');
    const hero = document.getElementById('hero-combat');
    
    // Position de départ (ennemi)
    const ennemiRect = ennemi.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    
    proj.style.display = 'block';
    proj.style.left = ennemiRect.left + ennemiRect.width / 2 + 'px';
    proj.style.top = ennemiRect.top + ennemiRect.height / 2 + 'px';
    
    // Animation vers le héros
    setTimeout(() => {
        proj.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        proj.style.left = heroRect.left + heroRect.width / 2 + 'px';
        proj.style.top = heroRect.top + heroRect.height / 2 + 'px';
    }, 50);
    
    if (rebondit) {
        // Rebondir IMMÉDIATEMENT vers le haut
        setTimeout(() => {
            proj.style.transition = 'all 1.2s cubic-bezier(0.3, 0.9, 0.4, 1)';
            proj.style.left = heroRect.left + heroRect.width / 2 + 'px';
            proj.style.top = '-150px'; // Sort de l'écran vers le haut
            proj.style.transform = 'scale(0.3)';
            proj.style.opacity = '0';
        }, 650); // Rebond immédiat dès l'arrivée
        
        // Masquer après le rebond
        setTimeout(() => {
            proj.style.display = 'none';
            proj.style.transition = 'none';
            proj.style.transform = 'scale(1)';
            proj.style.opacity = '1';
        }, 1900);
    } else {
        // Masquer après impact
        setTimeout(() => {
            proj.style.display = 'none';
            proj.style.transition = 'none';
        }, 700);
    }
}

// ===========================
// MILIEU DE COMBAT
// ===========================

function afficherMilieuCombat() {
    console.log("🔥 Milieu du combat !");
    
    // Masquer tout
    document.getElementById('zone-incantation').style.display = 'none';
    document.getElementById('zone-defense').style.display = 'none';
    
    // Créer écran noir de transition
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
    document.getElementById('phase-combat').appendChild(transition);
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    // 1. Tour abîmée apparaît (2s)
    setTimeout(() => {
        const tourImg = document.createElement('img');
        tourImg.src = `img/towers/${numeroFormatte}_abime.png`;
        tourImg.style.cssText = `
            width: 500px;
            height: 500px;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(tourImg);
    }, 500);
    
    // 2. Ennemi en colère apparaît par-dessus (4s)
    setTimeout(() => {
        const ennemiImg = document.createElement('img');
        ennemiImg.src = `img/enemies/${numeroFormatte}_colere.png`;
        ennemiImg.style.cssText = `
            position: absolute;
            width: 500px;
            height: 500px;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(ennemiImg);
    }, 2500);
    
    // 3. Dialogue invectif (6s)
    setTimeout(() => {
        const dialogue = document.createElement('div');
        dialogue.textContent = donneesNiveau.dialogues.milieu_combat;
        dialogue.className = 'dialogue-box';
        dialogue.style.cssText = `
            position: absolute;
            bottom: 100px;
            max-width: 700px;
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards;
        `;
        transition.appendChild(dialogue);
    }, 4500);
    
    // 4. Tout disparaît et combat reprend (9s)
    setTimeout(() => {
        transition.style.opacity = '0';
        transition.style.transition = 'opacity 1s';
        
        setTimeout(() => {
            transition.remove();
            
            // Changer le background et continuer (profil reste le même)
            document.getElementById('background-combat').src = `img/backgrounds/${numeroFormatte}_milieu.png`;
            document.getElementById('img-ennemi-etat').src = `img/enemies/${numeroFormatte}_profil.png`;
            
            afficherQuestionDefense();
        }, 1000);
    }, 7500);
}

// ===========================
// VICTOIRE
// ===========================

function afficherPhaseVictoire() {
    console.log("🎉 VICTOIRE !");
    phaseActuelle = 'victoire';
    
    // Masquer tout
    document.getElementById('zone-incantation').style.display = 'none';
    document.getElementById('zone-defense').style.display = 'none';
    
    // Créer écran noir de transition
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
    document.getElementById('phase-combat').appendChild(transition);
    
    const numeroFormatte = String(niveauActuel).padStart(2, '0');
    
    // 1. Tour détruite apparaît (2s)
    setTimeout(() => {
        const tourImg = document.createElement('img');
        tourImg.src = `img/towers/${numeroFormatte}_detruit.png`;
        tourImg.style.cssText = `
            width: 500px;
            height: 500px;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(tourImg);
    }, 500);
    
    // 2. Ennemi vaincu apparaît (4s)
    setTimeout(() => {
        const ennemiImg = document.createElement('img');
        ennemiImg.src = `img/enemies/${numeroFormatte}_vaincu.png`;
        ennemiImg.style.cssText = `
            position: absolute;
            width: 500px;
            height: 500px;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(ennemiImg);
    }, 2500);
    
    // 3. Dialogue défaite (6s)
    setTimeout(() => {
        const dialogue = document.createElement('div');
        dialogue.textContent = donneesNiveau.dialogues.victoire_joueur;
        dialogue.className = 'dialogue-box';
        dialogue.style.cssText = `
            position: absolute;
            bottom: 100px;
            max-width: 700px;
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards;
        `;
        transition.appendChild(dialogue);
    }, 4500);
    
    // 4. Image récompense (8s)
    setTimeout(() => {
        transition.innerHTML = ''; // Vider
        const recompenseImg = document.createElement('img');
        recompenseImg.src = `img/combat/${numeroFormatte}_recompense.png`;
        recompenseImg.style.cssText = `
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        `;
        transition.appendChild(recompenseImg);
        
        // Texte obtention équipement
        const texteEquipement = document.createElement('div');
        texteEquipement.textContent = '🎁 Tu as obtenu de nouveaux équipements !';
        texteEquipement.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.8em;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            color: #FFD700;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 2px 10px rgba(0, 0, 0, 0.9);
            padding: 20px 40px;
            background: rgba(0, 0, 0, 0.8);
            border: 3px solid #FFD700;
            border-radius: 12px;
            opacity: 0;
            animation: fadeIn 0.5s ease-out 0.5s forwards;
            text-align: center;
            max-width: 80%;
        `;
        transition.appendChild(texteEquipement);
        
        // Bouton retour à la carte (apparaît 2s après le texte)
        setTimeout(() => {
            texteEquipement.style.transition = 'opacity 0.5s';
            texteEquipement.style.opacity = '0';
            
            setTimeout(() => {
                texteEquipement.remove();
                
                const btnRetour = document.createElement('button');
                btnRetour.textContent = '🗺️ Retour à la Carte';
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
                    border: 4px solid #6b5638;
                    border-radius: 12px;
                    color: #2d2416;
                    cursor: pointer;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
                    opacity: 0;
                    animation: fadeIn 0.5s ease-out forwards;
                `;
                btnRetour.onclick = () => {
                    // Sauvegarder et retourner à la carte
                    sauvegarderVictoire();
                    window.location.href = 'map.html';
                };
                transition.appendChild(btnRetour);
            }, 500);
        }, 2000);
    }, 7000);
}

function sauvegarderVictoire() {
    const sauvegarde = JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
    
    // Ajouter le niveau aux niveaux complétés
    if (!sauvegarde.niveauxCompletes) sauvegarde.niveauxCompletes = [];
    if (!sauvegarde.niveauxCompletes.includes(niveauActuel)) {
        sauvegarde.niveauxCompletes.push(niveauActuel);
    }
    
    // Passer au niveau suivant
    if (niveauActuel < 21) {
        sauvegarde.niveauActuel = niveauActuel + 1;
    }
    
    // Régénérer les vies
    sauvegarde.viesHero = 3;
    
    localStorage.setItem('conjugoquest_save', JSON.stringify(sauvegarde));
    console.log("💾 Victoire sauvegardée !");
}

// ===========================
// DÉFAITE
// ===========================

function afficherPhaseDefaite() {
    phaseActuelle = 'defaite';
    
    // Utiliser l'image de défaite commune (pas spécifique au niveau)
    document.getElementById('img-hero-defaite').src = `img/combat/hero_defaite.png`;
    
    // Message
    document.getElementById('message-defaite').textContent = donneesNiveau.dialogues.defaite_joueur;
    
    // Afficher
    afficherPhase('phase-defaite');
}

function recommencerCombat() {
    // Réinitialiser l'état
    viesJoueur = 3;
    viesTourActuelles = viesTour;
    combo = 0;
    
    // Remélanger les questions
    melangerQuestions();
    
    // Redémarrer le combat
    demarrerCombat();
}

// ===========================
// NAVIGATION
// ===========================

function retourCarte() {
    window.location.href = 'map.html';
}

// ===========================
// UTILITAIRES
// ===========================

function afficherPhase(phaseId) {
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    document.getElementById(phaseId).classList.add('active');
}

function mettreAJourVies() {
    const coeurs = '❤️'.repeat(viesJoueur) + '🖤'.repeat(3 - viesJoueur);
    document.getElementById('vies-joueur').innerHTML = coeurs;
}

function mettreAJourBarreVieTour() {
    const pourcentage = (viesTourActuelles / viesTour) * 100;
    document.getElementById('vie-tour-actuelle').style.width = pourcentage + '%';
}

function mettreAJourCombo() {
    const comboDiv = document.getElementById('combo-counter');
    if (combo > 0) {
        comboDiv.style.display = 'block';
        document.getElementById('combo-nombre').textContent = combo;
    } else {
        comboDiv.style.display = 'none';
    }
}

function afficherMessage(texte, type) {
    // Créer un message temporaire (toast)
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
    `;
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 2000);
}

// Ajouter l'animation fadeInOut au CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Support de la touche Entrée pour valider
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (phaseActuelle === 'combat' && !enDefense) {
            validerAttaque();
        }
    }
});

// ===========================
// DEBUG SUPPORT
// ===========================

// Écouter les messages de la console debug
window.addEventListener('message', (event) => {
    if (event.data.action === 'skipToMilieu') {
        afficherMilieuCombat();
    } else if (event.data.action === 'skipToVictoire') {
        afficherPhaseVictoire();
    } else if (event.data.action === 'skipToDefaite') {
        afficherPhaseDefaite();
    } else if (event.data.action === 'setViesTour') {
        viesTourActuelles = event.data.value;
        mettreAJourBarreVieTour();
    }
});

// Envoyer logs à la console debug
function debugLog(message, level = 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`);
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'gameLog',
            message: message,
            level: level
        }, '*');
    }
}

// Mode Dieu
if (localStorage.getItem('debug_godmode') === '1') {
    console.log('⚡ MODE DIEU ACTIVÉ');
    // Rendre invincible
    const originalValiderDefense = validerDefense;
    window.validerDefense = function(indexReponse) {
        const bonneReponse = questionActuelle.solution;
        if (indexReponse !== bonneReponse) {
            console.log('🛡️ Mode Dieu: Défense auto-corrigée');
            indexReponse = bonneReponse;
        }
        return originalValiderDefense(indexReponse);
    };
}

// ===========================
// DEBUG - SKIP TO PHASE
// ===========================

// Vérifier paramètres URL pour skip
const urlParams = new URLSearchParams(window.location.search);
const skipTo = urlParams.get('skipTo');

if (skipTo) {
    console.log(`🛠️ DEBUG: Skip vers ${skipTo}`);
    
    // Attendre que tout soit chargé
    setTimeout(() => {
        if (skipTo === 'milieu') {
            afficherMilieuCombat();
        } else if (skipTo === 'victoire') {
            afficherPhaseVictoire();
        } else if (skipTo === 'defaite') {
            afficherPhaseDefaite();
        }
    }, 1000);
}
