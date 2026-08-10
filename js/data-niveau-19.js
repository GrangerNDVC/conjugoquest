const NIVEAU_19_DATA = {
  "niveau": 19,
  "nom": "BOSS du SUBJONCTIF",
  "couleur": "#a855f7",
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
    { "id": 1, "incantation": "Il faut que je {VERBE} !", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif présent", "solution": "vainque", "difficulte": "CRE" },
    { "id": 2, "incantation": "Bien que tu {VERBE} !", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif présent", "solution": "réussisses", "difficulte": "2ème" },
    { "id": 3, "incantation": "Pour que nous {VERBE} !", "verbe": "venir", "personne": "nous", "temps": "Subjonctif présent", "solution": "venions", "difficulte": "VENIR" },
    { "id": 4, "incantation": "Avant que vous {VERBE} !", "verbe": "partir", "personne": "vous", "temps": "Subjonctif présent", "solution": "partiez", "difficulte": "IR" },
    { "id": 5, "incantation": "Quoique ils {VERBE} !", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif présent", "solution": "aient", "difficulte": "AVOIR" },
    { "id": 6, "incantation": "Il faut que je {VERBE} !", "verbe": "être", "personne": "je", "temps": "Subjonctif présent", "solution": "sois", "difficulte": "ÊTRE" },
    { "id": 7, "incantation": "Bien que tu {VERBE} !", "verbe": "aller", "personne": "tu", "temps": "Subjonctif présent", "solution": "ailles", "difficulte": "ALLER" },
    { "id": 8, "incantation": "Pour qu'elle {VERBE} !", "verbe": "comprendre", "personne": "elle", "temps": "Subjonctif présent", "solution": "comprenne", "difficulte": "ENDRE" },
    { "id": 9, "incantation": "Avant que nous {VERBE} !", "verbe": "faire", "personne": "nous", "temps": "Subjonctif présent", "solution": "fassions", "difficulte": "FAIRE" },
    { "id": 10, "incantation": "Quoique vous {VERBE} !", "verbe": "pouvoir", "personne": "vous", "temps": "Subjonctif présent", "solution": "puissiez", "difficulte": "OUVOIR" },

    // --- NOUVEAUX : AUTRES VERBES IRRÉGULIERS (SUBJONCTIF PRÉSENT) ---
    { "id": 11, "incantation": "Il est temps que tu {VERBE} la vérité !", "verbe": "savoir", "personne": "tu", "temps": "Subjonctif présent", "solution": "saches", "difficulte": "SAVOIR" },
    { "id": 12, "incantation": "Pourvu qu'il {VERBE} nous aider !", "verbe": "vouloir", "personne": "il", "temps": "Subjonctif présent", "solution": "veuille", "difficulte": "VOULOIR" },
    { "id": 13, "incantation": "Bien que nous {VERBE} cette potion...", "verbe": "boire", "personne": "nous", "temps": "Subjonctif présent", "solution": "buvions", "difficulte": "BOIRE" },
    { "id": 14, "incantation": "Avant que vous {VERBE} ce grimoire...", "verbe": "lire", "personne": "vous", "temps": "Subjonctif présent", "solution": "lisiez", "difficulte": "LIRE" },
    { "id": 15, "incantation": "Quoique les prophètes {VERBE} l'avenir...", "verbe": "dire", "personne": "ils", "temps": "Subjonctif présent", "solution": "disent", "difficulte": "DIRE" },
    { "id": 16, "incantation": "Il faut que je te {VERBE} !", "verbe": "croire", "personne": "je", "temps": "Subjonctif présent", "solution": "croie", "difficulte": "CROIRE" },
    { "id": 17, "incantation": "Bien que tu {VERBE} ce sort...", "verbe": "connaître", "personne": "tu", "temps": "Subjonctif présent", "solution": "connaisses", "difficulte": "CONNAÎTRE" },
    { "id": 18, "incantation": "Pour qu'elle {VERBE} renaître...", "verbe": "mourir", "personne": "elle", "temps": "Subjonctif présent", "solution": "meure", "difficulte": "MOURIR" },
    { "id": 19, "incantation": "Avant que nous {VERBE} la porte...", "verbe": "ouvrir", "personne": "nous", "temps": "Subjonctif présent", "solution": "ouvrions", "difficulte": "OUVRIR" },
    { "id": 20, "incantation": "Quoique vous {VERBE} l'avenir...", "verbe": "voir", "personne": "vous", "temps": "Subjonctif présent", "solution": "voyiez", "difficulte": "VOIR" },

    // --- VERBES EN -GER, -CER, -YER ---
    { "id": 21, "incantation": "Il faut que nous {VERBE} les règles !", "verbe": "changer", "personne": "nous", "temps": "Subjonctif présent", "solution": "changions", "difficulte": "GER" },
    { "id": 22, "incantation": "Bien que vous {VERBE} le rituel...", "verbe": "commencer", "personne": "vous", "temps": "Subjonctif présent", "solution": "commenciez", "difficulte": "CER" },
    { "id": 23, "incantation": "Pour que tu {VERBE} les nuages...", "verbe": "nettoyer", "personne": "tu", "temps": "Subjonctif présent", "solution": "nettoies", "difficulte": "YER" },
    { "id": 24, "incantation": "Avant qu'il {VERBE} le chemin...", "verbe": "balayer", "personne": "il", "temps": "Subjonctif présent", "solution": "balaye", "difficulte": "AYER" },
    { "id": 25, "incantation": "Quoique nous {VERBE} nos forces...", "verbe": "protéger", "personne": "nous", "temps": "Subjonctif présent", "solution": "protégions", "difficulte": "GER" },

    // --- SUBJONCTIF PASSÉ (pour le boss final du subjonctif) ---
    { "id": 26, "incantation": "Bien que j'{VERBE} ce monstre...", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif passé", "solution": "aie vaincu", "difficulte": "Passé avoir" },
    { "id": 27, "incantation": "Je doute que tu {VERBE} l'épreuve.", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif passé", "solution": "aies réussi", "difficulte": "Passé avoir" },
    { "id": 28, "incantation": "Pourvu que nous {VERBE} à temps !", "verbe": "venir", "personne": "nous", "temps": "Subjonctif passé", "solution": "soyons venus", "difficulte": "Passé être accord" },
    { "id": 29, "incantation": "Avant que vous {VERBE} du combat...", "verbe": "partir", "personne": "vous", "temps": "Subjonctif passé", "solution": "soyez partis", "difficulte": "Passé être accord" },
    { "id": 30, "incantation": "Quoique ils {VERBE} du courage...", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif passé", "solution": "aient eu", "difficulte": "Passé avoir eu" }
  ],
  "defenses": [
    { "id": 1, "question": "Subjonctif de ÊTRE (je) :", "choix": ["je suis", "je sois", "je serais", "je serai"], "solution": 1 },
    { "id": 2, "question": "Subjonctif de AVOIR (tu) :", "choix": ["tu as", "tu aies", "tu aurais", "tu auras"], "solution": 1 },
    { "id": 3, "question": "Subjonctif de ALLER (il) :", "choix": ["il va", "il aille", "il irait", "il ira"], "solution": 1 },
    { "id": 4, "question": "Subjonctif de FAIRE (nous) :", "choix": ["nous faisons", "nous fassions", "nous ferions", "nous ferons"], "solution": 1 },
    { "id": 5, "question": "Subjonctif de VENIR (vous) :", "choix": ["vous venez", "vous veniez", "vous viendriez", "vous viendrez"], "solution": 1 },
    { "id": 6, "question": "Subjonctif de POUVOIR (ils) :", "choix": ["ils peuvent", "ils puissent", "ils pourraient", "ils pourront"], "solution": 1 },
    { "id": 7, "question": "Subjonctif de SAVOIR (je) :", "choix": ["je sais", "je sache", "je saurais", "je saurai"], "solution": 1 },
    { "id": 8, "question": "Subjonctif de VOULOIR (tu) :", "choix": ["tu veux", "tu veuilles", "tu voudrais", "tu voudras"], "solution": 1 },
    { "id": 9, "question": "Subjonctif de PRENDRE (elle) :", "choix": ["elle prend", "elle prenne", "elle prendrait", "elle prendra"], "solution": 1 },
    { "id": 10, "question": "Subjonctif de VOIR (nous) :", "choix": ["nous voyons", "nous voyions", "nous verrions", "nous verrons"], "solution": 1 },

    // --- NOUVELLES QUESTIONS (SUBJONCTIF) ---
    { "id": 11, "question": "Quel radical pour 'boire' au subjonctif (nous) ?", "choix": ["buv-", "boiv-", "buvons-", "boir-"], "solution": 0 },
    { "id": 12, "question": "Subjonctif de 'croire' (ils) :", "choix": ["ils croient", "ils croivent", "ils croyent", "ils croient"], "solution": 0 },
    { "id": 13, "question": "Quelle conjonction exige le subjonctif ?", "choix": ["parce que", "bien que", "puisque", "car"], "solution": 1 },
    { "id": 14, "question": "Subjonctif de 'mourir' (elle) :", "choix": ["elle meurt", "elle meure", "elle mourait", "elle mourrait"], "solution": 1 },
    { "id": 15, "question": "Subjonctif de 'ouvrir' (nous) :", "choix": ["nous ouvrons", "nous ouvrions", "nous ouvrissons", "nous ouvririons"], "solution": 1 },
    { "id": 16, "question": "Subjonctif de 'recevoir' (ils) :", "choix": ["ils reçoivent", "ils recevoient", "ils reçoivent", "ils recevraient"], "solution": 0 },
    { "id": 17, "question": "Valeur du subjonctif dans 'Je cherche un mage qui sache...' :", "choix": ["Certitude", "Incertitude/Indéfini", "Ordre", "Passé"], "solution": 1 },
    { "id": 18, "question": "Subjonctif de 'devoir' (tu) :", "choix": ["tu dois", "tu doives", "tu devais", "tu devrais"], "solution": 1 },
    { "id": 19, "question": "Subjonctif de 'envoyer' (je) :", "choix": ["j'envoie", "j'envois", "j'envoie", "j'enverrais"], "solution": 0 },
    { "id": 20, "question": "Laquelle est incorrecte ?", "choix": ["que je fasse", "que je puisse", "que je savasse", "que je veuille"], "solution": 2 },
    { "id": 21, "question": "Subjonctif de 'connaître' (tu) :", "choix": ["tu connais", "tu connaisses", "tu connaîtrais", "tu connusses"], "solution": 1 },
    { "id": 22, "question": "Subjonctif de 'peindre' (ils) :", "choix": ["ils peignent", "ils peindent", "ils peingnent", "ils peindraient"], "solution": 0 },
    { "id": 23, "question": "Subjonctif de 'craindre' (nous) :", "choix": ["nous craignons", "nous craignions", "nous craindrions", "nous crinssions"], "solution": 1 },
    { "id": 24, "question": "Subjonctif de 'résoudre' (il) :", "choix": ["il résout", "il résolve", "il résoudrait", "il résolût"], "solution": 1 },
    { "id": 25, "question": "Quelle phrase utilise le subjonctif ?", "choix": ["Je pense qu'il vient.", "Je veux qu'il vienne.", "Je sais qu'il viendra.", "Il dit qu'il viendrait."], "solution": 1 },

    // --- QUESTIONS SUR LE SUBJONCTIF PASSÉ ---
    { "id": 26, "question": "Comment se forme le subjonctif passé ?", "choix": ["Aux. subj. présent + participe passé", "Aux. subj. imparfait + participe passé", "Aux. présent + participe passé", "Verbe au subjonctif présent"], "solution": 0 },
    { "id": 27, "question": "Subjonctif passé de 'être' (je) :", "choix": ["je sois", "j'aie été", "je fusse", "je serais"], "solution": 1 },
    { "id": 28, "question": "Dans 'Bien que tu ______ (partir)', quelle forme est correcte au subjonctif passé ?", "choix": ["partes", "sois parti", "étais parti", "serais parti"], "solution": 1 },
    { "id": 29, "question": "Subjonctif passé de 'venir' (vous) :", "choix": ["vous veniez", "vous soyez venus", "vous vîntes", "vous viendriez"], "solution": 1 },
    { "id": 30, "question": "Quelle est la différence entre 'Je doute qu'il vienne' et 'Je doute qu'il soit venu' ?", "choix": ["Présent vs Passé", "Certain vs Incertain", "Poli vs Impoli", "Futur vs Présent"], "solution": 0 }
  ]
};