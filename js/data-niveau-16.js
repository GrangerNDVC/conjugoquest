const NIVEAU_16_DATA = {
  "niveau": 16,
  "nom": "Subjonctif Présent",
  "couleur": "#a855f7",
  "viesTour": 8,
  "questions": {
    "total": 30,
    "etapes": [
      { "avantMilieu": 20 },
      { "apresMilieu": 10 }
    ]
  },
  "dialogues": {
    "defi": "Le poison du subjonctif ! Doute et incertitude !",
    "milieu_combat": "Tu maîtrises même le subjonctif ?! Incroyable !",
    "victoire_joueur": "Que tu sois... victorieux... soit...",
    "defaite_joueur": "Il faut que tu étudies davantage !"
  },
  "attaques": [
    // --- VERBES IRRÉGULIERS FONDAMENTAUX ---
    { "id": 1, "incantation": "Il faut que je {VERBE} ce démon !", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif présent", "solution": "vainque", "difficulte": "CRE", "indice": "Verbe en -cre (comme 'vaincre') : garde le C au singulier." },
    { "id": 2, "incantation": "Bien que tu {VERBE} l'épreuve...", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif présent", "solution": "réussisses", "difficulte": "2ème groupe", "indice": "Verbe du 2e groupe (-IR) : n'oublie pas le groupe -iss- qui apparaît au pluriel selon le temps." },
    { "id": 3, "incantation": "Pour que nous {VERBE} à la cour...", "verbe": "venir", "personne": "nous", "temps": "Subjonctif présent", "solution": "venions", "difficulte": "Venir", "indice": "Verbe de la famille de 'venir' : radical particulier à ce temps." },
    { "id": 4, "incantation": "Avant que vous {VERBE} du royaume...", "verbe": "partir", "personne": "vous", "temps": "Subjonctif présent", "solution": "partiez", "difficulte": "Partir", "indice": "Comme 'partir' : utilise l'auxiliaire ÊTRE aux temps composés." },
    { "id": 5, "incantation": "Quoique ils {VERBE} la foi...", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif présent", "solution": "aient", "difficulte": "Avoir", "indice": "Utilise l'auxiliaire AVOIR, pas ÊTRE." },
    { "id": 6, "incantation": "Il faut que je {VERBE} digne !", "verbe": "être", "personne": "je", "temps": "Subjonctif présent", "solution": "sois", "difficulte": "Être", "indice": "Utilise l'auxiliaire ÊTRE, pas AVOIR — pense à l'accord du participe avec le sujet." },
    { "id": 7, "incantation": "Bien que tu {VERBE} au combat...", "verbe": "aller", "personne": "tu", "temps": "Subjonctif présent", "solution": "ailles", "difficulte": "Aller", "indice": "'Aller' est très irrégulier à ce temps : le radical est différent de l'infinitif." },
    { "id": 8, "incantation": "Pour qu'elle {VERBE} la leçon...", "verbe": "comprendre", "personne": "elle", "temps": "Subjonctif présent", "solution": "comprenne", "difficulte": "Prendre", "indice": "Comme 'prendre' : le radical peut doubler le N au pluriel de certains temps." },
    { "id": 9, "incantation": "Avant que nous {VERBE} l'impensable...", "verbe": "faire", "personne": "nous", "temps": "Subjonctif présent", "solution": "fassions", "difficulte": "Faire", "indice": "'Faire' est très irrégulier à ce temps : le radical ne suit pas le modèle habituel." },
    { "id": 10, "incantation": "Quoique vous {VERBE} tout...", "verbe": "pouvoir", "personne": "vous", "temps": "Subjonctif présent", "solution": "puissiez", "difficulte": "Pouvoir", "indice": "'Pouvoir' est irrégulier à ce temps : son radical n'est pas simplement 'pouv-'." },

    // --- NOUVEAUX : VERBES IRRÉGULIERS ---
    { "id": 11, "incantation": "Il est temps que tu {VERBE} la vérité !", "verbe": "savoir", "personne": "tu", "temps": "Subjonctif présent", "solution": "saches", "difficulte": "Savoir", "indice": "'Savoir' est irrégulier : son radical change selon le temps." },
    { "id": 12, "incantation": "Pourvu qu'il {VERBE} nous rejoindre !", "verbe": "vouloir", "personne": "il", "temps": "Subjonctif présent", "solution": "veuille", "difficulte": "Vouloir", "indice": "'Vouloir' est irrégulier : son radical change selon le temps (parfois 'veuill-')." },
    { "id": 13, "incantation": "Bien que nous {VERBE} cette potion...", "verbe": "boire", "personne": "nous", "temps": "Subjonctif présent", "solution": "buvions", "difficulte": "Boire", "indice": "Le radical de 'boire' change entre le singulier et le pluriel." },
    { "id": 14, "incantation": "Avant que vous {VERBE} ce grimoire...", "verbe": "lire", "personne": "vous", "temps": "Subjonctif présent", "solution": "lisiez", "difficulte": "Lire", "indice": "Comme 'lire' : radical 'lis-' au pluriel du présent, radical différent au passé simple." },
    { "id": 15, "incantation": "Quoique les mages {VERBE} l'avenir...", "verbe": "dire", "personne": "ils", "temps": "Subjonctif présent", "solution": "disent", "difficulte": "Dire", "indice": "Ce verbe se conjugue presque comme 'dire', avec une exception possible à la 2e personne du pluriel." },
    { "id": 16, "incantation": "Il faut que je te {VERBE} !", "verbe": "croire", "personne": "je", "temps": "Subjonctif présent", "solution": "croie", "difficulte": "Croire", "indice": "Le Y du radical de 'croire' se garde devant -ons/-ez, mais disparaît ailleurs." },
    { "id": 17, "incantation": "Bien que tu {VERBE} ce sort...", "verbe": "connaître", "personne": "tu", "temps": "Subjonctif présent", "solution": "connaisses", "difficulte": "Connaître", "indice": "Comme 'connaître' : garde l'accent circonflexe sur le i devant un t." },
    { "id": 18, "incantation": "Pour qu'elle {VERBE} renaître...", "verbe": "mourir", "personne": "elle", "temps": "Subjonctif présent", "solution": "meure", "difficulte": "Mourir", "indice": "'Mourir' est très irrégulier : utilise l'auxiliaire ÊTRE et un radical qui double parfois le R." },
    { "id": 19, "incantation": "Avant que nous {VERBE} la porte...", "verbe": "ouvrir", "personne": "nous", "temps": "Subjonctif présent", "solution": "ouvrions", "difficulte": "Ouvrir", "indice": "Comme 'ouvrir' : ce verbe se conjugue comme un 1er groupe, malgré son infinitif en -ir." },
    { "id": 20, "incantation": "Quoique vous {VERBE} l'avenir...", "verbe": "voir", "personne": "vous", "temps": "Subjonctif présent", "solution": "voyiez", "difficulte": "Voir", "indice": "Attention au radical de 'voir', qui change selon le temps (parfois avec un double R)." },

    // --- VERBES EN -GER, -CER, -YER ---
    { "id": 21, "incantation": "Il faut que nous {VERBE} les lois !", "verbe": "changer", "personne": "nous", "temps": "Subjonctif présent", "solution": "changions", "difficulte": "GER", "indice": "Verbe en -ger : ajoute un e devant une terminaison commençant par a ou o, pour garder le son [j]." },
    { "id": 22, "incantation": "Bien que vous {VERBE} le rituel...", "verbe": "commencer", "personne": "vous", "temps": "Subjonctif présent", "solution": "commenciez", "difficulte": "CER", "indice": "Verbe en -cer : le C devient Ç devant a ou o, pour garder le son [s]." },
    { "id": 23, "incantation": "Pour que tu {VERBE} les nuages...", "verbe": "nettoyer", "personne": "tu", "temps": "Subjonctif présent", "solution": "nettoies", "difficulte": "YER", "indice": "Verbe en -oyer/-yer : le Y devient I devant une terminaison à e muet." },
    { "id": 24, "incantation": "Avant qu'il {VERBE} le chemin...", "verbe": "balayer", "personne": "il", "temps": "Subjonctif présent", "solution": "balaye", "difficulte": "AYER", "indice": "Verbe en -ayer : le Y peut se garder ou devenir I selon la forme choisie — les deux existent." },
    { "id": 25, "incantation": "Quoique nous {VERBE} nos forces...", "verbe": "protéger", "personne": "nous", "temps": "Subjonctif présent", "solution": "protégions", "difficulte": "GER", "indice": "Verbe en -ger : ajoute un e devant une terminaison commençant par a ou o, pour garder le son [j]." },

    // --- VERBES EN -DRE ---
    { "id": 26, "incantation": "Il faut que tu {VERBE} au combat !", "verbe": "répondre", "personne": "tu", "temps": "Subjonctif présent", "solution": "répondes", "difficulte": "DRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." },
    { "id": 27, "incantation": "Bien qu'ils {VERBE} la lumière...", "verbe": "répandre", "personne": "ils", "temps": "Subjonctif présent", "solution": "répandent", "difficulte": "DRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." },
    { "id": 28, "incantation": "Pour que nous {VERBE} la tempête...", "verbe": "attendre", "personne": "nous", "temps": "Subjonctif présent", "solution": "attendions", "difficulte": "DRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." },
    { "id": 29, "incantation": "Avant que vous {VERBE} l'épée...", "verbe": "tendre", "personne": "vous", "temps": "Subjonctif présent", "solution": "tendiez", "difficulte": "DRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." },
    { "id": 30, "incantation": "Quoique le vent {VERBE} les arbres...", "verbe": "tordre", "personne": "il", "temps": "Subjonctif présent", "solution": "torde", "difficulte": "DRE", "indice": "Verbe en -dre : le D du radical se garde ; vérifie juste la terminaison de la personne demandée." }
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
    { "id": 26, "question": "Subjonctif de 'acquérir' (tu) :", "choix": ["tu acquiers", "tu acquières", "tu acquerrais", "tu acquisses"], "solution": 1 },
    { "id": 27, "question": "Subjonctif de 'valoir' (il) :", "choix": ["il vaut", "il vaille", "il vaudrait", "il valût"], "solution": 1 },
    { "id": 28, "question": "Subjonctif de 'pleuvoir' (il) :", "choix": ["il pleut", "il pleuve", "il pleuvrait", "il plût"], "solution": 1 },
    { "id": 29, "question": "Subjonctif de 'falloir' (il) :", "choix": ["il faut", "il faille", "il faudrait", "il fallût"], "solution": 1 },
    { "id": 30, "question": "Le subjonctif présent exprime généralement :", "choix": ["Un fait certain", "Un doute/un souhait", "Une action future", "Un ordre direct"], "solution": 1 }
  ]
};