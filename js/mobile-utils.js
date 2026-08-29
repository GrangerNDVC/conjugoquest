// ===========================================================
// CONJUGO QUEST — UTILITAIRES MOBILE
// À charger sur toutes les pages, APRÈS les scripts de jeu
// (juste avant </body>, ou en tout début si sans dépendance)
// ===========================================================

(function () {
    // -----------------------------------------------------------
    // 1) Hauteur réelle du viewport
    // Les navigateurs mobiles changent la hauteur visible quand la
    // barre d'adresse apparaît/disparaît : 100vh est donc instable.
    // On calcule --vh en JS et le CSS l'utilise via calc(var(--vh) * 100).
    // -----------------------------------------------------------
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // -----------------------------------------------------------
    // 2) Garder le champ de saisie visible quand le clavier virtuel
    //    s'ouvre (l'API visualViewport détecte le rétrécissement
    //    réel de la zone visible, contrairement à window.resize)
    // -----------------------------------------------------------
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            const champActif = document.activeElement;
            const estChampDeJeu = champActif && (
                champActif.id === 'input-conjugaison' ||
                champActif.id === 'duel-answer'
            );
            if (estChampDeJeu) {
                setTimeout(() => {
                    champActif.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }, 60);
            }
        });
    }

    // -----------------------------------------------------------
    // 3) Empêcher le double-tap zoom sur les boutons de jeu
    //    (utile même avec touch-action: manipulation en CSS, en
    //    complément pour les anciens WebView)
    // -----------------------------------------------------------
    let dernierTouch = 0;
    document.addEventListener('touchend', (e) => {
        const maintenant = Date.now();
        if (maintenant - dernierTouch <= 300) {
            const cible = e.target.closest('button, .reponse-btn, .tab, .level-btn');
            if (cible) e.preventDefault();
        }
        dernierTouch = maintenant;
    }, { passive: false });

    // -----------------------------------------------------------
    // 4) Déclencheur tactile du mode debug
    //    Équivalent mobile du raccourci clavier existant : un appui
    //    long (2,5 s) sur le titre de la carte ouvre une invite,
    //    vérifiée par hachage SHA-256 — échec silencieux, comme
    //    sur desktop, pour ne pas trahir l'existence du mode.
    //
    //    ⚠️ Remplacer DEBUG_HASH par le HASH DÉJÀ UTILISÉ dans
    //    votre déclencheur clavier existant (map.js), pour que les
    //    deux déclencheurs acceptent le même mot de passe.
    // -----------------------------------------------------------
    const DEBUG_HASH = "REMPLACER_PAR_LE_HASH_EXISTANT";

    async function sha256(texte) {
        const buffer = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(texte)
        );
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function armerDeclencheurTactile(selecteur) {
        const element = document.querySelector(selecteur);
        if (!element) return;

        let minuteur = null;
        const demarrer = () => {
            minuteur = setTimeout(demanderMotDePasse, 2500);
        };
        const annuler = () => {
            if (minuteur) clearTimeout(minuteur);
            minuteur = null;
        };

        element.addEventListener('touchstart', demarrer, { passive: true });
        element.addEventListener('touchend', annuler);
        element.addEventListener('touchmove', annuler);
        element.addEventListener('touchcancel', annuler);
    }

    async function demanderMotDePasse() {
        if (DEBUG_HASH === "REMPLACER_PAR_LE_HASH_EXISTANT") {
            console.warn("⚠️ mobile-utils.js : DEBUG_HASH non configuré, déclencheur tactile désactivé.");
            return;
        }
        const saisie = prompt('🔧');
        if (!saisie) return;
        const hash = await sha256(saisie);
        if (hash === DEBUG_HASH) {
            window.location.href = 'map.html?debug=1';
        }
        // Échec : aucun message d'erreur, comportement silencieux volontaire
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Sur map.html : appui long sur le titre "Conjugo Quest - Aventure"
        armerDeclencheurTactile('.ui-top h2');
    });
})();
