// ===========================
// CONJUGO QUEST — SYSTÈME DE SAUVEGARDE UNIFIÉ
// localStorage  = cache session (rapide, hors ligne)
// Firestore     = source de vérité (multi-appareils)
// ===========================

const SaveSystem = {

    SAVE_KEY:           'conjugoquest_save',
    PLAYERS_KEY:        'conjugoquest_players',
    CURRENT_PLAYER_KEY: 'conjugoquest_current_player',
    PLAYER_NAME_KEY:    'conjugoquest_player_name',
    USER_ID_KEY:        'conjugoquest_userId',

    // ===========================
    // LECTURE / ÉCRITURE LOCALE
    // ===========================

    getSave() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            return raw ? JSON.parse(raw) : this.getDefaultSave();
        } catch (e) {
            return this.getDefaultSave();
        }
    },

    getDefaultSave() {
        return { niveauActuel: 1, viesHero: 3, niveauxCompletes: [] };
    },

    save(data) {
        try {
            const current = this.getSave();
            const updated = { ...current, ...data, _savedAt: Date.now() };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(updated));
            console.log('💾 Sauvegarde locale:', updated);
            this._syncToFirestore(updated);
        } catch (e) {
            console.error('❌ SaveSystem.save() échec', e);
        }
    },

    saveVies(vies)  { this.save({ viesHero: vies }); },

    /**
     * Comme save() mais attend que Firestore confirme avant de résoudre.
     * Utiliser avant une redirection importante (victoire, déconnexion).
     */
    async saveAndWait(data) {
        try {
            const current = this.getSave();
            const updated = { ...current, ...data };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(updated));
            console.log('💾 saveAndWait local OK:', updated);
            await this._syncToFirestore(updated);
            console.log('☁️ saveAndWait Firestore confirmé');
            return updated;
        } catch (e) {
            console.error('❌ SaveSystem.saveAndWait() échec', e);
            return this.getSave();
        }
    },

    async completeLevelAndWait(niveau) {
        const save = this.getSave();
        if (!save.niveauxCompletes.includes(niveau)) save.niveauxCompletes.push(niveau);
        if (niveau === save.niveauActuel && niveau < 21) save.niveauActuel = niveau + 1;
        save.viesHero = 3;
        const result = await this.saveAndWait(save);

        // Enregistrer l'historique dans Firestore pour détecter les triches
        const userId = this.getCurrentUserId();
        if (userId && window.FirebaseDB) {
            try {
                await window.FirebaseDB.collection('joueurs').doc(userId)
                    .collection('historique').add({
                        niveau: niveau,
                        completeLe: firebase.firestore.FieldValue.serverTimestamp()
                    });
            } catch(e) { /* silencieux */ }
        }
        return result;
    },
    canContinue()   { return this.getSave().viesHero > 0; },
    resetLives()    { this.save({ viesHero: 3 }); },

    completeLevel(niveau) {
        const save = this.getSave();
        if (!save.niveauxCompletes.includes(niveau)) save.niveauxCompletes.push(niveau);
        if (niveau === save.niveauActuel && niveau < 21) save.niveauActuel = niveau + 1;
        save.viesHero = 3;
        this.save(save);
        console.log('✅ Niveau ' + niveau + ' complété !');
    },

    loseLife() {
        const save = this.getSave();
        save.viesHero = Math.max(0, save.viesHero - 1);
        this.save(save);
        return save.viesHero;
    },

    restartCurrentLevel() {
        const save = this.getSave();
        save.viesHero = 3;
        this.save(save);
        return save.niveauActuel;
    },

    resetAll() {
        if (confirm('⚠️ Recommencer depuis le début ?\nToute la progression sera perdue !')) {
            this.save(this.getDefaultSave());
            return true;
        }
        return false;
    },

    // ===========================
    // IDENTITÉ
    // ===========================

    getCurrentUserId()     { return localStorage.getItem(this.USER_ID_KEY); },
    getCurrentPlayerName() { return localStorage.getItem(this.PLAYER_NAME_KEY); },
    getCurrentPlayerId()   { return localStorage.getItem(this.CURRENT_PLAYER_KEY); },

    getAllPlayers() {
        try {
            return JSON.parse(localStorage.getItem(this.PLAYERS_KEY) || '[]');
        } catch (e) { return []; }
    },

    // ===========================
    // FIRESTORE — CONNEXION PAR PSEUDO UNIQUEMENT
    // Pas de champ "classe" : on identifie le joueur par son pseudo seul
    // ===========================

    async connecterParPseudo(pseudo) {
        if (!window.FirebaseDB) {
            console.warn('⚠️ Firebase non disponible — mode local');
            return this._connecterEnLocal(pseudo);
        }

        try {
            const db = window.FirebaseDB;

            // Chercher uniquement par pseudo (pas de classe)
            const snapshot = await db.collection('joueurs')
                .where('pseudo', '==', pseudo)
                .limit(1)
                .get();

            let userId, progression, isReturning = false;

            if (!snapshot.empty) {
                // ✅ Joueur trouvé → charger sa progression depuis Firestore
                const docSnap = snapshot.docs[0];
                userId      = docSnap.id;
                const data  = docSnap.data();
                progression = (data.progression && data.progression.niveauxCompletes !== undefined)
                    ? data.progression
                    : this.getDefaultSave();

                // Mettre à jour dernière connexion
                await db.collection('joueurs').doc(userId).set(
                    { enLigne: true, derniereConnexion: firebase.firestore.FieldValue.serverTimestamp() },
                    { merge: true }
                );

                console.log('✅ "' + pseudo + '" retrouvé — niveaux:', progression.niveauxCompletes);
                isReturning = true;
            } else {
                // 🆕 Nouveau joueur
                progression = this.getDefaultSave();
                const docRef = await db.collection('joueurs').add({
                    pseudo:            pseudo,
                    progression:       progression,
                    enLigne:           true,
                    creeLe:            firebase.firestore.FieldValue.serverTimestamp(),
                    derniereConnexion: firebase.firestore.FieldValue.serverTimestamp()
                });
                userId = docRef.id;
                console.log('🆕 Nouveau joueur "' + pseudo + '" créé');
            }

            // Comparer avec la version locale : garder la plus récente
            const localSave = this.getSave();
            const localTime  = localSave._savedAt || 0;
            const remoteTime = progression._savedAt || 0;

            if (localSave.niveauxCompletes && localTime > remoteTime) {
                // La version locale est plus récente → on la garde ET on sync vers Firestore
                console.log('📱 Version locale plus récente (' + new Date(localTime).toLocaleTimeString() + ') — on la garde');
                progression = localSave;
                // Remettre à jour Firestore avec la version locale
                setTimeout(() => this._syncToFirestore(localSave), 100);
            } else {
                console.log('☁️ Version Firestore chargée — niveaux:', progression.niveauxCompletes);
            }

            // Les vies sont remises à 3 à chaque nouvelle session (comme Mario)
            // On ne persiste jamais viesHero = 0
            if (!progression.viesHero || progression.viesHero <= 0) {
                progression.viesHero = 3;
            }

            localStorage.setItem(this.USER_ID_KEY,        userId);
            localStorage.setItem(this.PLAYER_NAME_KEY,    pseudo);
            localStorage.setItem(this.CURRENT_PLAYER_KEY, userId);
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(progression));

            return { success: true, userId, progression, isReturning };

        } catch (error) {
            console.error('❌ Erreur Firestore connexion:', error);
            return this._connecterEnLocal(pseudo);
        }
    },

    _connecterEnLocal(pseudo) {
        // Fallback : chercher dans la liste locale
        const players = this.getAllPlayers();
        let player = players.find(p => p.name.toLowerCase() === pseudo.toLowerCase());
        if (!player) {
            player = { id: 'local_' + Date.now(), name: pseudo, save: this.getDefaultSave() };
            players.push(player);
            localStorage.setItem(this.PLAYERS_KEY, JSON.stringify(players));
        }
        const save = player.save || this.getDefaultSave();
        localStorage.setItem(this.USER_ID_KEY,        player.id);
        localStorage.setItem(this.PLAYER_NAME_KEY,    player.name);
        localStorage.setItem(this.CURRENT_PLAYER_KEY, player.id);
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(save));
        console.warn('⚠️ Mode local pour:', pseudo);
        return { success: true, userId: player.id, progression: save, local: true };
    },

    // SET avec merge:true → fonctionne même si le champ n'existait pas encore
    async _syncToFirestore(progression) {
        const userId = this.getCurrentUserId();
        if (!userId || !window.FirebaseDB) return;
        try {
            // Ne jamais persister viesHero <= 0 : on sauvegarde minimum 1
            // pour que la prochaine session recharge avec des vies valides
            const toSync = { ...progression };
            if (!toSync.viesHero || toSync.viesHero <= 0) toSync.viesHero = 3;

            await window.FirebaseDB.collection('joueurs').doc(userId).set(
                { progression: toSync, derniereSync: firebase.firestore.FieldValue.serverTimestamp() },
                { merge: true }
            );
            console.log('☁️ Sync Firestore OK — niveau:', toSync.niveauActuel, '— vies:', toSync.viesHero);
        } catch (e) {
            console.warn('⚠️ Sync Firestore échouée:', e.message);
        }
    },

    async deconnecter() {
        const userId = this.getCurrentUserId();
        if (userId && window.FirebaseDB) {
            try {
                await window.FirebaseDB.collection('joueurs').doc(userId).set(
                    { enLigne: false },
                    { merge: true }
                );
            } catch (e) { /* silencieux */ }
        }
        // On garde SAVE_KEY en local pour pré-remplir le pseudo au prochain login
        localStorage.removeItem(this.USER_ID_KEY);
        localStorage.removeItem(this.CURRENT_PLAYER_KEY);
        // On garde PLAYER_NAME_KEY pour pré-remplir le champ pseudo
    }
};

// Exposer SaveSystem de façon sécurisée
// Les méthodes critiques sont wrappées avec une validation anti-triche
const _SaveSystemInternal = SaveSystem;

window.SaveSystem = {
    // Méthodes de lecture (sûres)
    getSave:              () => _SaveSystemInternal.getSave(),
    getCurrentUserId:     () => _SaveSystemInternal.getCurrentUserId(),
    getCurrentPlayerName: () => _SaveSystemInternal.getCurrentPlayerName(),
    getCurrentPlayerId:   () => _SaveSystemInternal.getCurrentPlayerId(),
    canContinue:          () => _SaveSystemInternal.canContinue(),
    getAllPlayers:         () => _SaveSystemInternal.getAllPlayers(),

    // Méthodes de jeu (autorisées)
    saveVies:             (v) => _SaveSystemInternal.saveVies(v),
    loseLife:             () => _SaveSystemInternal.loseLife(),
    restartCurrentLevel:  () => _SaveSystemInternal.restartCurrentLevel(),
    save:                 (d) => _SaveSystemInternal.save(d),
    deconnecter:          () => _SaveSystemInternal.deconnecter(),
    connecterParPseudo:   (p) => _SaveSystemInternal.connecterParPseudo(p),

    // completeLevel : vérifie que le niveau à compléter est bien le niveau actuel
    completeLevel: (niveau) => {
        const save = _SaveSystemInternal.getSave();
        if (niveau !== save.niveauActuel) {
            console.warn('🚫 Tentative de triche détectée — niveau invalide');
            return;
        }
        return _SaveSystemInternal.completeLevel(niveau);
    },
    completeLevelAndWait: async (niveau) => {
        const save = _SaveSystemInternal.getSave();
        if (niveau !== save.niveauActuel) {
            console.warn('🚫 Tentative de triche détectée — niveau invalide');
            return;
        }
        return _SaveSystemInternal.completeLevelAndWait(niveau);
    },
    saveAndWait: (d) => _SaveSystemInternal.saveAndWait(d),
    resetAll:    () => _SaveSystemInternal.resetAll(),
};

// Heartbeat : mettre à jour derniereConnexion toutes les 2 minutes
// pour que les autres joueurs sachent qu'on est connecté
setInterval(() => {
    const userId = SaveSystem.getCurrentUserId();
    if (userId && window.FirebaseDB) {
        window.FirebaseDB.collection('joueurs').doc(userId).update({
            enLigne: true,
            derniereConnexion: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});
    }
}, 2 * 60 * 1000); // toutes les 2 minutes

// Marquer hors ligne quand on ferme/quitte la page
window.addEventListener('beforeunload', () => {
    const userId = SaveSystem.getCurrentUserId();
    if (userId && window.FirebaseDB) {
        try {
            window.FirebaseDB.collection('joueurs').doc(userId).update({ enLigne: false });
        } catch(e) {}
    }
});

console.log('💾 SaveSystem chargé');
