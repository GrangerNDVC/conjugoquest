const NIVEAU_19_DATA = {
  "niveau": 19,
  "nom": "BOSS du SUBJONCTIF",
  "couleur": "#a855f7",
  "viesTour": 14,
  "questions": {
    "total": 30,
    "etapes": [
      { "avantMilieu": 20 },
      { "apresMilieu": 10 }
    ]
  },
  "dialogues": {
    "defi": "Maîtriseras-tu le doute ultime !",
    "milieu_combat": "Tu me tiens tête, nabot... Attends un peu !",
    "victoire_joueur": "J'admets dignement ma défaite...",
    "defaite_joueur": "Il était temps que tu aies compris ta place, vermisseau !"
  },
  "attaques": [
    // --- LES 10 ORIGINAUX (SUBJONCTIF PRÉSENT) ---
    { "id": 1, "incantation": "Il faut que je {VERBE} !", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif présent", "solution": "vainque", "difficulte": "CRE", "indice": "Verbe en -cre (comme 'vaincre') : garde le C au singulier." },
    { "id": 2, "incantation": "Bien que tu {VERBE} !", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif présent", "solution": "réussisses", "difficulte": "2ème", "indice": "Vérifie le groupe de ce verbe avant d'appliquer la terminaison." },
    { "id": 3, "incantation": "Pour que nous {VERBE} !", "verbe": "venir", "personne": "nous", "temps": "Subjonctif présent", "solution": "venions", "difficulte": "VENIR", "indice": "Verbe de la famille de 'venir' : radical particulier à ce temps." },
    { "id": 4, "incantation": "Avant que vous {VERBE} !", "verbe": "partir", "personne": "vous", "temps": "Subjonctif présent", "solution": "partiez", "difficulte": "IR", "indice": "Passé simple : ce verbe se termine par la voyelle -i- à cette personne." },
    { "id": 5, "incantation": "Quoique ils {VERBE} !", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif présent", "solution": "aient", "difficulte": "AVOIR", "indice": "Utilise l'auxiliaire AVOIR, pas ÊTRE." },
    { "id": 6, "incantation": "Il faut que je {VERBE} !", "verbe": "être", "personne": "je", "temps": "Subjonctif présent", "solution": "sois", "difficulte": "ÊTRE", "indice": "Utilise l'auxiliaire ÊTRE, pas AVOIR — pense à l'accord du participe avec le sujet." },
    { "id": 7, "incantation": "Bien que tu {VERBE} !", "verbe": "aller", "personne": "tu", "temps": "Subjonctif présent", "solution": "ailles", "difficulte": "ALLER", "indice": "'Aller' est très irrégulier à ce temps : le radical est différent de l'infinitif." },
    { "id": 8, "incantation": "Pour qu'elle {VERBE} !", "verbe": "comprendre", "personne": "elle", "temps": "Subjonctif présent", "solution": "comprenne", "difficulte": "ENDRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." },
    { "id": 9, "incantation": "Avant que nous {VERBE} !", "verbe": "faire", "personne": "nous", "temps": "Subjonctif présent", "solution": "fassions", "difficulte": "FAIRE", "indice": "'Faire' est très irrégulier à ce temps : le radical ne suit pas le modèle habituel." },
    { "id": 10, "incantation": "Quoique vous {VERBE} !", "verbe": "pouvoir", "personne": "vous", "temps": "Subjonctif présent", "solution": "puissiez", "difficulte": "OUVOIR", "indice": "Verbe en -ouvoir (comme 'pouvoir') : radical irrégulier à ce temps." },

    // --- NOUVEAUX : AUTRES VERBES IRRÉGULIERS (SUBJONCTIF PRÉSENT) ---
    { "id": 11, "incantation": "Il est temps que tu {VERBE} la vérité !", "verbe": "savoir", "personne": "tu", "temps": "Subjonctif présent", "solution": "saches", "difficulte": "SAVOIR", "indice": "'Savoir' est irrégulier : son radical change selon le temps." },
    { "id": 12, "incantation": "Pourvu qu'il {VERBE} nous aider !", "verbe": "vouloir", "personne": "il", "temps": "Subjonctif présent", "solution": "veuille", "difficulte": "VOULOIR", "indice": "'Vouloir' est irrégulier : son radical change selon le temps (parfois 'veuill-')." },
    { "id": 13, "incantation": "Bien que nous {VERBE} cette potion...", "verbe": "boire", "personne": "nous", "temps": "Subjonctif présent", "solution": "buvions", "difficulte": "BOIRE", "indice": "Le radical de 'boire' change entre le singulier et le pluriel." },
    { "id": 14, "incantation": "Avant que vous {VERBE} ce grimoire...", "verbe": "lire", "personne": "vous", "temps": "Subjonctif présent", "solution": "lisiez", "difficulte": "LIRE", "indice": "Comme 'lire' : radical 'lis-' au pluriel du présent, radical différent au passé simple." },
    { "id": 15, "incantation": "Quoique les prophètes {VERBE} l'avenir...", "verbe": "dire", "personne": "ils", "temps": "Subjonctif présent", "solution": "disent", "difficulte": "DIRE", "indice": "Ce verbe se conjugue presque comme 'dire', avec une exception possible à la 2e personne du pluriel." },
    { "id": 16, "incantation": "Il faut que je te {VERBE} !", "verbe": "croire", "personne": "je", "temps": "Subjonctif présent", "solution": "croie", "difficulte": "CROIRE", "indice": "Le Y du radical de 'croire' se garde devant -ons/-ez, mais disparaît ailleurs." },
    { "id": 17, "incantation": "Bien que tu {VERBE} ce sort...", "verbe": "connaître", "personne": "tu", "temps": "Subjonctif présent", "solution": "connaisses", "difficulte": "CONNAÎTRE", "indice": "Comme 'connaître' : garde l'accent circonflexe sur le i devant un t." },
    { "id": 18, "incantation": "Pour qu'elle {VERBE} renaître...", "verbe": "mourir", "personne": "elle", "temps": "Subjonctif présent", "solution": "meure", "difficulte": "MOURIR", "indice": "'Mourir' est très irrégulier : utilise l'auxiliaire ÊTRE et un radical qui double parfois le R." },
    { "id": 19, "incantation": "Avant que nous {VERBE} la porte...", "verbe": "ouvrir", "personne": "nous", "temps": "Subjonctif présent", "solution": "ouvrions", "difficulte": "OUVRIR", "indice": "Comme 'ouvrir' : ce verbe se conjugue comme un 1er groupe, malgré son infinitif en -ir." },
    { "id": 20, "incantation": "Quoique vous {VERBE} l'avenir...", "verbe": "voir", "personne": "vous", "temps": "Subjonctif présent", "solution": "voyiez", "difficulte": "VOIR", "indice": "Attention au radical de 'voir', qui change selon le temps (parfois avec un double R)." },

    // --- VERBES EN -GER, -CER, -YER ---
    { "id": 21, "incantation": "Il faut que nous {VERBE} les règles !", "verbe": "changer", "personne": "nous", "temps": "Subjonctif présent", "solution": "changions", "difficulte": "GER", "indice": "Verbe en -ger : ajoute un e devant une terminaison commençant par a ou o, pour garder le son [j]." },
    { "id": 22, "incantation": "Bien que vous {VERBE} le rituel...", "verbe": "commencer", "personne": "vous", "temps": "Subjonctif présent", "solution": "commenciez", "difficulte": "CER", "indice": "Verbe en -cer : le C devient Ç devant a ou o, pour garder le son [s]." },
    { "id": 23, "incantation": "Pour que tu {VERBE} les nuages...", "verbe": "nettoyer", "personne": "tu", "temps": "Subjonctif présent", "solution": "nettoies", "difficulte": "YER", "indice": "Verbe en -oyer/-yer : le Y devient I devant une terminaison à e muet." },
    { "id": 24, "incantation": "Avant qu'il {VERBE} le chemin...", "verbe": "balayer", "personne": "il", "temps": "Subjonctif présent", "solution": "balaye", "difficulte": "AYER", "indice": "Verbe en -ayer : le Y peut se garder ou devenir I selon la forme choisie — les deux existent." },
    { "id": 25, "incantation": "Quoique nous {VERBE} nos forces...", "verbe": "protéger", "personne": "nous", "temps": "Subjonctif présent", "solution": "protégions", "difficulte": "GER", "indice": "Verbe en -ger : ajoute un e devant une terminaison commençant par a ou o, pour garder le son [j]." },

    // --- SUBJONCTIF PASSÉ (pour le boss final du subjonctif) ---
    { "id": 26, "incantation": "Bien que j'{VERBE} ce monstre...", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif passé", "solution": "aie vaincu", "difficulte": "Passé avoir", "indice": "Ce temps composé utilise l'auxiliaire AVOIR." },
    { "id": 27, "incantation": "Je doute que tu {VERBE} l'épreuve.", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif passé", "solution": "aies réussi", "difficulte": "Passé avoir", "indice": "Ce temps composé utilise l'auxiliaire AVOIR." },
    { "id": 28, "incantation": "Pourvu que nous {VERBE} à temps !", "verbe": "venir", "personne": "nous", "temps": "Subjonctif passé", "solution": "soyons venus", "difficulte": "Passé être accord", "indice": "Ce temps composé utilise ÊTRE : accorde le participe passé avec le sujet." },
    { "id": 29, "incantation": "Avant que vous {VERBE} du combat...", "verbe": "partir", "personne": "vous", "temps": "Subjonctif passé", "solution": "soyez partis", "difficulte": "Passé être accord", "indice": "Ce temps composé utilise ÊTRE : accorde le participe passé avec le sujet." },
    { "id": 30, "incantation": "Quoique ils {VERBE} du courage...", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif passé", "solution": "aient eu", "difficulte": "Passé avoir eu", "indice": "Ce temps composé utilise AVOIR ; le participe passé de 'avoir' est irrégulier." }
  ],
  "defenses": [
    { "id": 1, "question": "Subjonctif de ÊTRE (je) :", "choix": ["je serai", "je suis", "je serais", "je sois"], "solution": 3 },
    { "id": 2, "question": "Subjonctif de AVOIR (tu) :", "choix": ["tu aurais", "tu auras", "tu aies", "tu as"], "solution": 2 },
    { "id": 3, "question": "Subjonctif de ALLER (il) :", "choix": ["il va", "il aille", "il ira", "il irait"], "solution": 1 },
    { "id": 4, "question": "Subjonctif de FAIRE (nous) :", "choix": ["nous ferions", "nous ferons", "nous faisons", "nous fassions"], "solution": 3 },
    { "id": 5, "question": "Subjonctif de VENIR (vous) :", "choix": ["vous veniez", "vous venez", "vous viendrez", "vous viendriez"], "solution": 0 },
    { "id": 6, "question": "Subjonctif de POUVOIR (ils) :", "choix": ["ils puissent", "ils pourront", "ils pourraient", "ils peuvent"], "solution": 0 },
    { "id": 7, "question": "Subjonctif de SAVOIR (je) :", "choix": ["je saurais", "je sache", "je sais", "je saurai"], "solution": 1 },
    { "id": 8, "question": "Subjonctif de VOULOIR (tu) :", "choix": ["tu voudras", "tu voudrais", "tu veuilles", "tu veux"], "solution": 2 },
    { "id": 9, "question": "Subjonctif de PRENDRE (elle) :", "choix": ["elle prend", "elle prendra", "elle prendrait", "elle prenne"], "solution": 3 },
    { "id": 10, "question": "Subjonctif de VOIR (nous) :", "choix": ["nous voyons", "nous voyions", "nous verrions", "nous verrons"], "solution": 1 },

    // --- NOUVELLES QUESTIONS (SUBJONCTIF) ---
    { "id": 11, "question": "Quel radical pour 'boire' au subjonctif (nous) ?", "choix": ["buv-", "boir-", "buvons-", "boiv-"], "solution": 0 },
    { "id": 12, "question": "Subjonctif de 'croire' (ils) :", "choix": ["ils croyent", "ils croient", "ils crussent", "ils croivent"], "solution": 1 },
    { "id": 13, "question": "Quelle conjonction exige le subjonctif ?", "choix": ["puisque", "parce que", "bien que", "car"], "solution": 2 },
    { "id": 14, "question": "Subjonctif de 'mourir' (elle) :", "choix": ["elle meure", "elle meurt", "elle mourait", "elle mourrait"], "solution": 0 },
    { "id": 15, "question": "Subjonctif de 'ouvrir' (nous) :", "choix": ["nous ouvrons", "nous ouvrions", "nous ouvririons", "nous ouvrissons"], "solution": 1 },
    { "id": 16, "question": "Subjonctif de 'recevoir' (ils) :", "choix": ["ils recevraient", "ils recevaient", "ils reçoivent", "ils recevoient"], "solution": 2 },
    { "id": 17, "question": "Valeur du subjonctif dans 'Je cherche un mage qui sache...' :", "choix": ["Incertitude/Indéfini", "Passé", "Ordre", "Certitude"], "solution": 0 },
    { "id": 18, "question": "Subjonctif de 'devoir' (tu) :", "choix": ["tu dois", "tu devrais", "tu doives", "tu devais"], "solution": 2 },
    { "id": 19, "question": "Subjonctif de 'envoyer' (je) :", "choix": ["j'envoyais", "j'envois", "j'enverrais", "j'envoie"], "solution": 3 },
    { "id": 20, "question": "Laquelle est incorrecte ?", "choix": ["que je veuille", "que je fasse", "que je savasse", "que je puisse"], "solution": 2 },
    { "id": 21, "question": "Subjonctif de 'connaître' (tu) :", "choix": ["tu connaîtrais", "tu connais", "tu connaisses", "tu connusses"], "solution": 2 },
    { "id": 22, "question": "Subjonctif de 'peindre' (ils) :", "choix": ["ils peingnent", "ils peignent", "ils peindraient", "ils peindent"], "solution": 1 },
    { "id": 23, "question": "Subjonctif de 'craindre' (nous) :", "choix": ["nous craignons", "nous crinssions", "nous craindrions", "nous craignions"], "solution": 3 },
    { "id": 24, "question": "Subjonctif de 'résoudre' (il) :", "choix": ["il résoudrait", "il résout", "il résolve", "il résolût"], "solution": 2 },
    { "id": 25, "question": "Quelle phrase utilise le subjonctif ?", "choix": ["Je veux qu'il vienne.", "Je sais qu'il viendra.", "Je pense qu'il vient.", "Il dit qu'il viendrait."], "solution": 0 },

    // --- QUESTIONS SUR LE SUBJONCTIF PASSÉ ---
    { "id": 26, "question": "Comment se forme le subjonctif passé ?", "choix": ["Aux. subj. présent + participe passé", "Aux. subj. imparfait + participe passé", "Verbe au subjonctif présent", "Aux. présent + participe passé"], "solution": 0 },
    { "id": 27, "question": "Subjonctif passé de 'être' (je) :", "choix": ["j'aie été", "je serais", "je sois", "je fusse"], "solution": 0 },
    { "id": 28, "question": "Dans 'Bien que tu ______ (partir)', quelle forme est correcte au subjonctif passé ?", "choix": ["serais parti", "partes", "étais parti", "sois parti"], "solution": 3 },
    { "id": 29, "question": "Subjonctif passé de 'venir' (vous) :", "choix": ["vous soyez venus", "vous veniez", "vous vîntes", "vous viendriez"], "solution": 0 },
    { "id": 30, "question": "Quelle est la différence entre 'Je doute qu'il vienne' et 'Je doute qu'il soit venu' ?", "choix": ["Certain vs Incertain", "Futur vs Présent", "Poli vs Impoli", "Présent vs Passé"], "solution": 3 },
  ]
};