/* ===========================================================
   MODÈLE DE REFONTE — NIVEAU 1 (Présent de l'Indicatif)
   ===========================================================
   Changements par rapport à l'original, à reproduire sur les
   20 autres niveaux :

   1) "viesTour": 8  → AJOUTÉ.
      C'est CE champ qui pilote la longueur du combat dans
      combat.js (`viesTour = donneesNiveau.viesTour || 20`),
      pas le bloc "questions.etapes" (qui n'est en fait jamais
      lu par le moteur). Avec viesTour=8, un combat demande
      8 attaques réussies (+ jusqu'à 8 défenses), soit environ
      16 échanges au lieu de ~40 avec la valeur par défaut (20).
      → Pour les niveaux BOSS, gardez une valeur plus haute
        (14-16) car l'élève arrive avec de l'élan.

   2) Chaque question d'attaque a maintenant un champ "indice".
      Il reprend l'ancien champ "difficulte" mais reformulé en
      phrase d'aide compréhensible par un élève (pas juste une
      étiquette grammaticale). À afficher via un bouton 💡
      optionnel dans combat.js (voir le patch fourni à côté).

   3) Les questions de défense qui demandaient une DÉFINITION
      pure ("Quel présent exprime...") ont été réécrites pour
      donner l'exemple ET les définitions des catégories dans
      l'énoncé : l'élève raisonne à partir d'un cas concret,
      il ne restitue plus un cours appris par cœur.
      Les questions de pure orthographe/conjugaison (formes
      verbales) sont conservées telles quelles : c'est le cœur
      de compétence visé, pas du par-cœur de définition.
   =========================================================== */

const NIVEAU_01_DATA = {
  "niveau": 1,
  "nom": "Présent de l'Indicatif",
  "couleur": "#3b82f6",
  "viesTour": 8,
  "questions": {
    "total": 16,
    "etapes": [
      { "avantMilieu": 8 },
      { "apresMilieu": 8 }
    ]
  },
  "dialogues": {
    "defi": "Ahah ! Une petite vermine qui ose me défier ? Voyons si tu maîtrises le présent !",
    "milieu_combat": "Quoi ?! Tu résistes encore ? Je vais redoubler de puissance !",
    "victoire_joueur": "Non... impossible... tu... tu maîtrises vraiment le présent...",
    "defaite_joueur": "Comme prévu ! Retourne étudier, petit apprenti !"
  },
  "attaques": [
    { "id": 1, "incantation": "Par les vents qui {VERBE} sur la plaine !", "verbe": "souffler", "personne": "ils", "solution": "soufflent", "difficulte": "1er groupe", "indice": "Verbe en -ER régulier : aucun piège, applique juste -ent." },
    { "id": 2, "incantation": "Nous {VERBE} les ténèbres loin d'ici !", "verbe": "rejeter", "personne": "nous", "solution": "rejetons", "difficulte": "-ETER simple", "indice": "Pas de doublement du T à 'nous' : le doublement n'a lieu qu'au singulier et à 'ils'." },
    { "id": 3, "incantation": "Je {VERBE} mes ennemis sans trembler !", "verbe": "vaincre", "personne": "je", "solution": "vaincs", "difficulte": "-INCRE", "indice": "Les verbes en -aincre gardent le C au singulier : je vaincs, tu vaincs, il vainc." },
    { "id": 4, "incantation": "Les astres {VERBE} dans la nuit noire !", "verbe": "luire", "personne": "ils", "solution": "luisent", "difficulte": "-UIRE", "indice": "Comme 'conduire', 'cuire' : radical en -uis- devant -ent." },
    { "id": 5, "incantation": "Tu {VERBE} le grimoire interdit !", "verbe": "feuilleter", "personne": "tu", "solution": "feuillettes", "difficulte": "-ETER double", "indice": "Verbe en -eter qui double le T devant un e muet : tu feuillettes." },
    { "id": 6, "incantation": "Vous {VERBE} le sceau du démon !", "verbe": "rompre", "personne": "vous", "solution": "rompez", "difficulte": "-OMPRE", "indice": "Les verbes en -ompre gardent le P à toutes les personnes." },
    { "id": 7, "incantation": "Les dragons {VERBE} un feu sacré !", "verbe": "cracher", "personne": "ils", "solution": "crachent", "difficulte": "Pluriel", "indice": "Verbe en -ER régulier, accord avec 'ils' : -ent." },
    { "id": 8, "incantation": "J' {VERBE} l'impossible sommet !", "verbe": "atteindre", "personne": "je", "solution": "atteins", "difficulte": "-EINDRE", "indice": "Le groupe 'gn' n'apparaît qu'au pluriel ; au singulier c'est -eins : j'atteins." },
    { "id": 9, "incantation": "Nous {VERBE} à la victoire finale !", "verbe": "croire", "personne": "nous", "solution": "croyons", "difficulte": "Y/I", "indice": "Le Y de 'croire' se garde devant -ons/-ez (mais 'je crois' sans Y)." },
    { "id": 10, "incantation": "Elle {VERBE} son pouvoir chaque jour !", "verbe": "accroître", "personne": "elle", "solution": "accroît", "difficulte": "Accent", "indice": "Accroître garde l'accent circonflexe sur le i devant le t : elle accroît." },
    { "id": 11, "incantation": "Les ombres {VERBE} devant ma lumière !", "verbe": "fuir", "personne": "elles", "solution": "fuient", "difficulte": "Fuir", "indice": "Le radical devient 'fui-' devant -ent : elles fuient." },
    { "id": 12, "incantation": "Tu {VERBE} les secrets des anciens !", "verbe": "découvrir", "personne": "tu", "solution": "découvres", "difficulte": "-IR/ER", "indice": "Comme 'ouvrir', 'offrir' : ces verbes en -vrir/-frir se conjuguent comme un 1er groupe." },
    { "id": 13, "incantation": "Je {VERBE} mes forces intérieures !", "verbe": "rassembler", "personne": "je", "solution": "rassemble", "difficulte": "1er groupe", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 14, "incantation": "Les sages {VERBE} ton destin !", "verbe": "prédire", "personne": "ils", "solution": "prédisent", "difficulte": "Dire", "indice": "Prédire se conjugue comme 'dire', sauf à 'vous' (vous prédisez, pas prédites)." },
    { "id": 15, "incantation": "Vous {VERBE} vos armes avec ferveur !", "verbe": "saisir", "personne": "vous", "solution": "saisissez", "difficulte": "2ème groupe", "indice": "Verbe du 2e groupe : radical + -issez au pluriel." },
    { "id": 16, "incantation": "Le cristal {VERBE} sous l'effet du sort !", "verbe": "resplendir", "personne": "il", "solution": "resplendit", "difficulte": "2ème groupe", "indice": "2e groupe, 3e personne du singulier : radical + -it (le -iss- n'apparaît qu'au pluriel)." },
    { "id": 17, "incantation": "Nous {VERBE} les éléments à notre loi !", "verbe": "soumettre", "personne": "nous", "solution": "soumettons", "difficulte": "Mettre", "indice": "Comme 'mettre' : un seul T devant -ons : nous soumettons." },
    { "id": 18, "incantation": "Tu {VERBE} l'avenir dans les runes !", "verbe": "apercevoir", "personne": "tu", "solution": "aperçois", "difficulte": "Cédille", "indice": "Comme 'recevoir' : ç devant o pour garder le son [s] : tu aperçois." },
    { "id": 19, "incantation": "Les héros {VERBE} leurs ennemis !", "verbe": "vaincre", "personne": "ils", "solution": "vainquent", "difficulte": "Vaincre", "indice": "Au pluriel, le C devient QU devant E : ils vainquent." },
    { "id": 20, "incantation": "Je {VERBE} mon courage au fond de moi !", "verbe": "puiser", "personne": "je", "solution": "puise", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 21, "incantation": "L'ennemi {VERBE} ses blessures !", "verbe": "panser", "personne": "il", "solution": "panse", "difficulte": "Homonyme", "indice": "Attention à l'orthographe : 'panser' une plaie (avec A), pas 'penser'." },
    { "id": 22, "incantation": "Nous {VERBE} le mal par la racine !", "verbe": "extraire", "personne": "nous", "solution": "extrayons", "difficulte": "-AIRE", "indice": "Le Y apparaît devant -ons/-ez : nous extrayons." },
    { "id": 23, "incantation": "Tu {VERBE} ton énergie sur la cible !", "verbe": "focaliser", "personne": "tu", "solution": "focalises", "difficulte": "1er groupe", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 24, "incantation": "Les titans {VERBE} la terre entière !", "verbe": "ébranler", "personne": "ils", "solution": "ébranlent", "difficulte": "Pluriel", "indice": "Verbe en -ER régulier, accord avec 'ils' : -ent." },
    { "id": 25, "incantation": "J' {VERBE} une barrière de glace !", "verbe": "ériger", "personne": "je", "solution": "érige", "difficulte": "-GER", "indice": "La terminaison commence déjà par E, pas besoin d'ajouter de E supplémentaire : j'érige." },
    { "id": 26, "incantation": "Le poison {VERBE} tes veines !", "verbe": "corrompre", "personne": "il", "solution": "corrompt", "difficulte": "Rompre", "indice": "Comme 'rompre' : garde le P, ajoute -t à la 3e personne : il corrompt." },
    { "id": 27, "incantation": "Vous {VERBE} une potion de foudre !", "verbe": "distiller", "personne": "vous", "solution": "distillez", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, un seul L : vous distillez." },
    { "id": 28, "incantation": "Nous {VERBE} à ton arrogance !", "verbe": "nuire", "personne": "nous", "solution": "nuisons", "difficulte": "-UIRE", "indice": "Comme 'luire', 'conduire' : radical 'nuis-' + -ons." },
    { "id": 29, "incantation": "Elle {VERBE} la foudre divine !", "verbe": "manier", "personne": "elle", "solution": "manie", "difficulte": "-IER", "indice": "Le I du radical et le E de la terminaison se suivent mais ne fusionnent pas : elle manie." },
    { "id": 30, "incantation": "Ils {VERBE} la lumière sacrée !", "verbe": "répandre", "personne": "ils", "solution": "répandent", "difficulte": "-DRE", "indice": "Verbe en -andre : garde le D, ajoute -ent." },
    { "id": 31, "incantation": "Je {VERBE} le sortilège suprême !", "verbe": "conclure", "personne": "je", "solution": "conclus", "difficulte": "Conclure", "indice": "Comme 'inclure', 'exclure' : radical 'conclu-' + S au singulier." },
    { "id": 32, "incantation": "Tu {VERBE} la force des anciens !", "verbe": "puiser", "personne": "tu", "solution": "puises", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 33, "incantation": "Le mage {VERBE} son bâton magique !", "verbe": "empoigner", "personne": "il", "solution": "empoigne", "difficulte": "-GNER", "indice": "Verbe en -gner régulier : il empoigne." },
    { "id": 34, "incantation": "Nous {VERBE} l'énigme du temps !", "verbe": "résoudre", "personne": "nous", "solution": "résolvons", "difficulte": "Résoudre", "indice": "Résoudre change de radical au pluriel : résolv- + -ons." },
    { "id": 35, "incantation": "Vous {VERBE} la tempête céleste !", "verbe": "invoquer", "personne": "vous", "solution": "invoquez", "difficulte": "-QUER", "indice": "Verbe en -quer régulier, garde le QU : vous invoquez." },
    { "id": 36, "incantation": "Les démons {VERBE} le portail !", "verbe": "assaillir", "personne": "ils", "solution": "assaillent", "difficulte": "Assaillir", "indice": "Malgré son infinitif en -ir, 'assaillir' se conjugue comme un verbe en -er au présent." },
    { "id": 37, "incantation": "Je {VERBE} ma défense magique !", "verbe": "déployer", "personne": "je", "solution": "déploie", "difficulte": "-YER", "indice": "Verbes en -oyer : le Y devient I devant un e muet : je déploie." },
    { "id": 38, "incantation": "Tu {VERBE} à l'appel de la forêt !", "verbe": "répondre", "personne": "tu", "solution": "réponds", "difficulte": "-DRE", "indice": "Verbe en -ondre : garde le D, ajoute -s au singulier." },
    { "id": 39, "incantation": "Elle {VERBE} le fil du destin !", "verbe": "tordre", "personne": "elle", "solution": "tord", "difficulte": "-DRE", "indice": "3e personne du singulier : rien après le D, pas de -t ajouté : elle tord." },
    { "id": 40, "incantation": "Nous {VERBE} le poison mortel !", "verbe": "boire", "personne": "nous", "solution": "buvons", "difficulte": "Boire", "indice": "Boire change de radical au pluriel : buv- + -ons." },
    { "id": 41, "incantation": "Vous {VERBE} la peur de votre cœur !", "verbe": "bannir", "personne": "vous", "solution": "bannissez", "difficulte": "2ème groupe", "indice": "Verbe du 2e groupe : -issez au pluriel." },
    { "id": 42, "incantation": "Ils {VERBE} des prières oubliées !", "verbe": "répéter", "personne": "ils", "solution": "répètent", "difficulte": "Accent", "indice": "Les verbes en é_er changent l'accent aigu en accent grave devant une syllabe muette : ils répètent." },
    { "id": 43, "incantation": "Je {VERBE} le voile de l'illusion !", "verbe": "déchirer", "personne": "je", "solution": "déchire", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 44, "incantation": "Tu {VERBE} au-dessus des nuages !", "verbe": "voler", "personne": "tu", "solution": "voles", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 45, "incantation": "La source {VERBE} une eau pure !", "verbe": "offrir", "personne": "elle", "solution": "offre", "difficulte": "-IR/ER", "indice": "Comme 'ouvrir', 'découvrir' : offrir se conjugue comme un verbe en -er (pas offrit)." },
    { "id": 46, "incantation": "Nous {VERBE} les lois de la physique !", "verbe": "enfreindre", "personne": "nous", "solution": "enfreignons", "difficulte": "-EINDRE", "indice": "Comme 'atteindre' : le groupe 'gn' apparaît au pluriel : nous enfreignons." },
    { "id": 47, "incantation": "Vous {VERBE} un chemin de lumière !", "verbe": "tracer", "personne": "vous", "solution": "tracez", "difficulte": "-CER", "indice": "Verbes en -cer : le C devient Ç devant a/o, mais pas devant e/ez : vous tracez." },
    { "id": 48, "incantation": "Ils {VERBE} le monde de demain !", "verbe": "bâtir", "personne": "ils", "solution": "bâtissent", "difficulte": "2ème groupe", "indice": "Verbe du 2e groupe : -issent au pluriel." },
    { "id": 49, "incantation": "Je {VERBE} mon âme à la justice !", "verbe": "vouer", "personne": "je", "solution": "voue", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." },
    { "id": 50, "incantation": "Tu {VERBE} la puissance de la terre !", "verbe": "canaliser", "personne": "tu", "solution": "canalises", "difficulte": "Régulier", "indice": "Verbe en -ER régulier, aucun piège." }
  ],
  "defenses": [
    { "id": 1, "question": "Comment s'écrit 'Appeler' avec 'Nous' ?", "reponses": ["Nous appelons", "Nous appellons", "Nous apelons", "Nous apèlons"], "solution": 0, "explication": "Un seul L car le son est sourd." },
    { "id": 2, "question": "Quelle est la terminaison de 'Je vaincre' ?", "reponses": ["Vaincs", "Vainct", "Vainc", "Vainques"], "solution": 0, "explication": "Garde le C et ajoute un S." },
    { "id": 3, "question": "Trouvez l'intrus (verbe mal conjugué) :", "reponses": ["Il résout", "Il mout", "Il coud", "Il absout"], "solution": 1, "explication": "On écrit 'Il moud'." },

    { "id": 4, "question": "« L'eau se transforme en glace à 0°C. »\n\n① Présent d'énonciation : le fait a lieu au moment où l'on parle\n② Présent d'habitude : action qui se répète régulièrement\n③ Présent de vérité générale : toujours vrai, sans limite de temps\n④ Présent de narration : rend un fait passé plus vivant\n\nQuel type de présent est utilisé ici ?", "reponses": ["①", "②", "③", "④"], "solution": 2, "explication": "Un fait scientifique toujours vrai = présent de vérité générale." },

    { "id": 5, "question": "Complétez : 'Nous (manger)...'", "reponses": ["mangons", "mangeons", "mangerons", "mangions"], "solution": 1, "explication": "Garde le E pour le son [j]." },
    { "id": 6, "question": "Laquelle est correcte ?", "reponses": ["Tu peints", "Tu peinds", "Tu peins", "Tu paint"], "solution": 2, "explication": "Verbes en -indre : S, S, T." },
    { "id": 7, "question": "Conjugaison de 'Jeter' à 'Ils' :", "reponses": ["Ils jetent", "Ils jettent", "Ils gètent", "Ils jetent"], "solution": 1, "explication": "Double le T." },

    { "id": 8, "question": "« Je pars dans cinq minutes, attends-moi ! »\n\n① Passé récent : l'action vient tout juste de se produire\n② Futur proche : l'action va se produire très bientôt\n③ Présent d'habitude : action répétée\n④ Présent de vérité générale : toujours vrai\n\nQuelle valeur du présent est employée ici ?", "reponses": ["①", "②", "③", "④"], "solution": 1, "explication": "'Dans cinq minutes' annonce une action à venir : futur proche." },

    { "id": 9, "question": "Forme correcte de 'Envoyer' à 'Ils' :", "reponses": ["Ils envoyent", "Ils envoient", "Ils envoit", "Ils envois"], "solution": 1, "explication": "Y devient I." },
    { "id": 10, "question": "Conjuguez 'Nettoyer' avec 'Tu' :", "reponses": ["Tu nettoyes", "Tu nettoies", "Tu nettois", "Tu nettoit"], "solution": 1, "explication": "Y devient I." },
    { "id": 11, "question": "Comment s'écrit 'Savoir' avec 'Je' ?", "reponses": ["Je sais", "Je sait", "Je savy", "Je saux"], "solution": 0, "explication": "Irrégulier." },
    { "id": 12, "question": "Terminaison de 'Nous (Lancer)' :", "reponses": ["lançons", "lancons", "lançont", "lanssons"], "solution": 0, "explication": "Cédille nécessaire." },
    { "id": 13, "question": "Le verbe 'Haïr' au présent (nous) :", "reponses": ["Nous haïssons", "Nous haissons", "Nous haïons", "Nous haissons"], "solution": 0, "explication": "Garde le tréma." },
    { "id": 14, "question": "Conjuguez 'Prendre' à 'Ils' :", "reponses": ["Ils prennent", "Ils prendent", "Ils prendent", "Ils prennet"], "solution": 0, "explication": "Double N." },
    { "id": 15, "question": "Laquelle est fausse ?", "reponses": ["Tu acquiers", "Il acquiert", "Nous acquérons", "Ils acquérissent"], "solution": 3, "explication": "Ils acquièrent." },

    { "id": 16, "question": "« Chaque hiver, les oiseaux migrent vers le sud. »\n\n① Présent d'énonciation : au moment où l'on parle\n② Présent d'habitude : action qui se répète régulièrement\n③ Présent de narration : rend un fait passé plus vivant\n④ Présent de vérité générale : toujours vrai\n\nQuelle valeur du présent est ici la bonne ?", "reponses": ["①", "②", "③", "④"], "solution": 1, "explication": "'Chaque hiver' = répétition régulière → présent d'habitude." },

    { "id": 17, "question": "Conjuguez 'Bouillir' à 'Il' :", "reponses": ["Il bouille", "Il bout", "Il bouillit", "Il boud"], "solution": 1, "explication": "Irrégulier." },
    { "id": 18, "question": "Terminaison de 'Tu (Valoir)' :", "reponses": ["Vales", "Vaux", "Valt", "Vaus"], "solution": 1, "explication": "X à la fin." },
    { "id": 19, "question": "Comment conjuguer 'Asseoir' (nous) ?", "reponses": ["Asseyons", "Assiedons", "Assoyons", "A et C"], "solution": 3, "explication": "Deux formes possibles." },
    { "id": 20, "question": "Complétez : 'Tu (conclure)...'", "reponses": ["conclues", "conclus", "conclut", "conclis"], "solution": 1, "explication": "Finit en S." },

    { "id": 21, "question": "« Il marchait seul dans la nuit. Soudain, une ombre surgit devant lui ! »\n\n① Présent d'énonciation : au moment où l'on parle\n② Présent d'habitude : action répétée\n③ Présent de narration : rend un fait passé plus vivant, comme si on y était\n④ Présent de vérité générale : toujours vrai\n\nLe reste du récit est au passé, mais 'surgit' est au présent. Pourquoi ?", "reponses": ["①", "②", "③", "④"], "solution": 2, "explication": "On bascule sur le présent pour rendre l'action plus vivante dans un récit passé : présent de narration." },

    { "id": 22, "question": "Conjuguez 'Vaincre' à 'Il' :", "reponses": ["Vainct", "Vainc", "Vaincs", "Vainque"], "solution": 1, "explication": "Se finit par C." },

    { "id": 23, "question": "« Tous les matins, je me lève à 7h. »\n\n① Présent d'énonciation\n② Présent d'habitude : action répétée régulièrement\n③ Présent de narration\n④ Présent de vérité générale\n\nQuelle valeur du présent est utilisée ici ?", "reponses": ["①", "②", "③", "④"], "solution": 1, "explication": "'Tous les matins' = répétition → présent d'habitude." },

    { "id": 24, "question": "Laquelle est correcte ?", "reponses": ["Ils croient", "Ils croyent", "Ils croivent", "Ils croye"], "solution": 0, "explication": "Finit en -oient." },
    { "id": 25, "question": "Conjuguez 'Naître' à 'Il' :", "reponses": ["Nait", "Naît", "Nais", "Naite"], "solution": 1, "explication": "Accent sur le I." },
    { "id": 26, "question": "Quelle est la règle pour -GER ?", "reponses": ["E devant O", "Cédille", "Double G", "Rien"], "solution": 0, "explication": "Mangeons, jugeons." },
    { "id": 27, "question": "Conjugaison de 'Coudre' (il) :", "reponses": ["Coud", "Cout", "Couds", "Coude"], "solution": 0, "explication": "Garde le D." },

    { "id": 28, "question": "« Excusez-moi, où se trouve la gare ? — Elle se trouve juste là, je vous accompagne. »\n\n① Présent d'énonciation : le fait a lieu au moment précis où l'on parle\n② Présent d'habitude : action répétée\n③ Présent de narration\n④ Présent de vérité générale\n\nQuelle est la valeur du présent dans cette réponse ?", "reponses": ["①", "②", "③", "④"], "solution": 0, "explication": "L'action se passe exactement au moment de la parole : présent d'énonciation." },

    { "id": 29, "question": "Conjuguez 'Mourir' à 'Ils' :", "reponses": ["Mourent", "Meurent", "Mourirent", "Meurissent"], "solution": 1, "explication": "Ils meurent." },
    { "id": 30, "question": "Verbe 'Pouvoir' à 'Je' :", "reponses": ["Peux", "Puis", "Peu", "A et B"], "solution": 3, "explication": "Puis-je ou Je peux." },
    { "id": 31, "question": "Lequel est au 1er groupe ?", "reponses": ["Aller", "Aimer", "Finir", "Partir"], "solution": 1, "explication": "Aller est irrégulier." },
    { "id": 32, "question": "Conjuguez 'Craindre' (je) :", "reponses": ["Crainds", "Craint", "Crains", "Craing"], "solution": 2, "explication": "-ains." },
    { "id": 33, "question": "La règle pour -ELER :", "reponses": ["L ou è", "Cédille", "Double L", "A et C"], "solution": 3, "explication": "Sauf exceptions." },
    { "id": 34, "question": "Conjuguez 'Vivre' (ils) :", "reponses": ["Vivent", "Vivrent", "Vivent", "Vichissent"], "solution": 0, "explication": "Vivent." },

    { "id": 35, "question": "« La Terre est ronde. »\n\n① Présent d'énonciation\n② Présent d'habitude\n③ Présent de narration\n④ Présent de vérité générale : toujours vrai, indépendant du temps\n\nQuelle valeur du présent est ici la bonne ?", "reponses": ["①", "②", "③", "④"], "solution": 3, "explication": "Un fait toujours vrai = présent de vérité générale." },

    { "id": 36, "question": "Conjugaison 'Voir' (vous) :", "reponses": ["Voyez", "Voiyiez", "Voillez", "Voiez"], "solution": 0, "explication": "Voyez." },
    { "id": 37, "question": "Verbe 'Résoudre' (il) :", "reponses": ["Résoud", "Résout", "Résouds", "Résous"], "solution": 1, "explication": "Finit par T." },
    { "id": 38, "question": "Comment s'écrit 'Haïr' (tu) ?", "reponses": ["Hais", "Haïs", "Hait", "Haï"], "solution": 0, "explication": "Perd le tréma." },
    { "id": 39, "question": "Conjuguez 'Sourire' (nous) :", "reponses": ["Sourissons", "Sourions", "Sourioons", "Sourisons"], "solution": 1, "explication": "Sourions." },
    { "id": 40, "question": "Le verbe 'Devenir' (ils) :", "reponses": ["Devennent", "Deviennent", "Devenent", "Deviennet"], "solution": 1, "explication": "Deviennent." },

    { "id": 41, "question": "« Regarde, il sort à l'instant du magasin ! »\n\n① Présent d'énonciation\n② Présent d'habitude\n③ Présent de narration\n④ Passé récent : action tout juste terminée, présentée au présent\n\nQuelle valeur du présent est ici la bonne ?", "reponses": ["①", "②", "③", "④"], "solution": 3, "explication": "'À l'instant' = action qui vient de se produire → passé récent." },

    { "id": 42, "question": "Conjuguez 'Inclure' (il) :", "reponses": ["Inclue", "Inclut", "Inclus", "Inclis"], "solution": 1, "explication": "Inclut." },
    { "id": 43, "question": "Verbe 'Fuir' (nous) :", "reponses": ["Fuissons", "Fuyons", "Fuions", "Fuient"], "solution": 1, "explication": "Fuyons." },
    { "id": 44, "question": "Conjuguez 'Placer' (nous) :", "reponses": ["Placons", "Plaçons", "Plassons", "Placerons"], "solution": 1, "explication": "Cédille." },
    { "id": 45, "question": "Verbe 'Vouloir' (tu) :", "reponses": ["Voulles", "Veux", "Vouls", "Veut"], "solution": 1, "explication": "Veux." },
    { "id": 46, "question": "Conjugaison 'Joindre' (ils) :", "reponses": ["Joindrent", "Joignent", "Joinent", "Joindant"], "solution": 1, "explication": "Joignent." },
    { "id": 47, "question": "Verbe 'Peindre' (il) :", "reponses": ["Peind", "Peint", "Peinds", "Peing"], "solution": 1, "explication": "Peint." },
    { "id": 48, "question": "Comment s'écrit 'Aller' (je) ?", "reponses": ["Allé", "Vais", "Vas", "Alle"], "solution": 1, "explication": "Irrégulier." },
    { "id": 49, "question": "« Chaque jour, je lis un chapitre avant de dormir. »\n\n① Présent d'énonciation\n② Présent d'habitude : action répétée régulièrement\n③ Présent de narration\n④ Présent de vérité générale\n\nQuelle valeur du présent est ici la bonne ?", "reponses": ["①", "②", "③", "④"], "solution": 1, "explication": "'Chaque jour' = répétition → présent d'habitude." },
    { "id": 50, "question": "Conjuguez 'Offrir' (tu) :", "reponses": ["Offres", "Offris", "Offrit", "Offre"], "solution": 0, "explication": "Comme -ER." }
  ]
};
