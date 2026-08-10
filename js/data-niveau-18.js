const NIVEAU_18_DATA = {
  "niveau": 18,
  "nom": "Subjonctif Imparfait",
  "couleur": "#a855f7",
  "questions": {
    "total": 20,
    "etapes": [
      { "avantMilieu": 10 },
      { "apresMilieu": 10 }
    ]
  },
  "dialogues": {
    "defi": "Bien que tu vinsses me défier, tu n'étais pas prêt pour l'éternité !",
    "milieu_combat": "Il fallait que tu grandisses pour me tenir tête... Tu n'en es pas encore là !",
    "victoire_joueur": "Il eût fallu que je fusse plus vigilant... Tu mérites ta victoire.",
    "defaite_joueur": "Il fallait que tu étudiasses davantage !"
  },
  "attaques": [
    { "id": 1, "incantation": "Il fallait que je {VERBE} ce démon !", "verbe": "vaincre", "personne": "je", "temps": "Subjonctif imparfait", "solution": "vainquisse", "difficulte": "Verbe en -cre" },
    { "id": 2, "incantation": "Bien que tu {VERBE} l'épreuve...", "verbe": "réussir", "personne": "tu", "temps": "Subjonctif imparfait", "solution": "réussisses", "difficulte": "2ème groupe" },
    { "id": 3, "incantation": "Pour que nous {VERBE} à la cour...", "verbe": "venir", "personne": "nous", "temps": "Subjonctif imparfait", "solution": "vinssions", "difficulte": "Venir/tenir" },
    { "id": 4, "incantation": "Avant que vous {VERBE} du royaume...", "verbe": "partir", "personne": "vous", "temps": "Subjonctif imparfait", "solution": "partissiez", "difficulte": "Verbe en -ir" },
    { "id": 5, "incantation": "Quoique ils {VERBE} la foi...", "verbe": "avoir", "personne": "ils", "temps": "Subjonctif imparfait", "solution": "eussent", "difficulte": "Avoir" },
    { "id": 6, "incantation": "Il fallait que je {VERBE} digne !", "verbe": "être", "personne": "je", "temps": "Subjonctif imparfait", "solution": "fusse", "difficulte": "Être" },
    { "id": 7, "incantation": "Bien que tu {VERBE} au combat...", "verbe": "aller", "personne": "tu", "temps": "Subjonctif imparfait", "solution": "allasses", "difficulte": "Aller" },
    { "id": 8, "incantation": "Pour qu'elle {VERBE} la leçon...", "verbe": "comprendre", "personne": "elle", "temps": "Subjonctif imparfait", "solution": "comprît", "difficulte": "Verbe en -endre" },
    { "id": 9, "incantation": "Avant que nous {VERBE} l'impensable...", "verbe": "faire", "personne": "nous", "temps": "Subjonctif imparfait", "solution": "fissions", "difficulte": "Faire" },
    { "id": 10, "incantation": "Quoique vous {VERBE} tout...", "verbe": "pouvoir", "personne": "vous", "temps": "Subjonctif imparfait", "solution": "pussiez", "difficulte": "Pouvoir" },
    { "id": 11, "incantation": "Il fallait que tu {VERBE} la vérité...", "verbe": "savoir", "personne": "tu", "temps": "Subjonctif imparfait", "solution": "susses", "difficulte": "Savoir" },
    { "id": 12, "incantation": "Bien qu'il {VERBE} partir...", "verbe": "vouloir", "personne": "il", "temps": "Subjonctif imparfait", "solution": "voulût", "difficulte": "Vouloir" },
    { "id": 13, "incantation": "Pour que nous {VERBE} la potion...", "verbe": "boire", "personne": "nous", "temps": "Subjonctif imparfait", "solution": "bussions", "difficulte": "Boire" },
    { "id": 14, "incantation": "Avant que vous {VERBE} le grimoire...", "verbe": "lire", "personne": "vous", "temps": "Subjonctif imparfait", "solution": "lussiez", "difficulte": "Lire" },
    { "id": 15, "incantation": "Quoique les mages {VERBE}...", "verbe": "dire", "personne": "ils", "temps": "Subjonctif imparfait", "solution": "dissent", "difficulte": "Dire" },
    { "id": 16, "incantation": "Il fallait que je te {VERBE}...", "verbe": "croire", "personne": "je", "temps": "Subjonctif imparfait", "solution": "crusse", "difficulte": "Croire" },
    { "id": 17, "incantation": "Bien que tu {VERBE} ce sort...", "verbe": "connaître", "personne": "tu", "temps": "Subjonctif imparfait", "solution": "connusses", "difficulte": "Connaître" },
    { "id": 18, "incantation": "Pour qu'elle {VERBE} renaître...", "verbe": "mourir", "personne": "elle", "temps": "Subjonctif imparfait", "solution": "mourût", "difficulte": "Mourir" },
    { "id": 19, "incantation": "Avant que nous {VERBE} la porte...", "verbe": "ouvrir", "personne": "nous", "temps": "Subjonctif imparfait", "solution": "ouvrissions", "difficulte": "Ouvrir" },
    { "id": 20, "incantation": "Quoique vous {VERBE} l'avenir...", "verbe": "voir", "personne": "vous", "temps": "Subjonctif imparfait", "solution": "vissiez", "difficulte": "Voir" }
  ],
  "defenses": [
    { "id": 1, "question": "Quelle est la terminaison de la 3e personne du singulier au subjonctif imparfait ?", "choix": ["-ât, -ît, -ût", "-ait, -it, -ut", "-asse, -isse, -usse", "-a, -i, -u"], "solution": 0 },
    { "id": 2, "question": "Sur quel temps de l'indicatif se forme le subjonctif imparfait ?", "choix": ["Le passé simple (2e pers. sing.)", "L'imparfait", "Le présent", "Le futur simple"], "solution": 0 },
    { "id": 3, "question": "Subjonctif imparfait de 'être' à la 1re personne du singulier :", "choix": ["je sois", "je fusse", "j'étais", "je serais"], "solution": 1 },
    { "id": 4, "question": "Subjonctif imparfait de 'avoir' à la 3e personne du pluriel :", "choix": ["ils avaient", "ils aient", "ils eussent", "ils auraient"], "solution": 2 },
    { "id": 5, "question": "Subjonctif imparfait de 'faire' à la 1re personne du pluriel :", "choix": ["nous fassions", "nous faisions", "nous fissions", "nous ferions"], "solution": 2 },
    { "id": 6, "question": "Subjonctif imparfait de 'pouvoir' à la 2e personne du singulier :", "choix": ["tu puisses", "tu pouvais", "tu pusses", "tu pourrais"], "solution": 2 },
    { "id": 7, "question": "Quelle est la valeur principale du subjonctif imparfait en français moderne ?", "choix": ["Usage littéraire, concordance des temps au passé", "Exprimer un souhait présent", "Parler au futur", "Donner un ordre"], "solution": 0 },
    { "id": 8, "question": "Subjonctif imparfait de 'venir' à la 2e personne du pluriel :", "choix": ["vous veniez", "vous vîntes", "vous vinssiez", "vous viendriez"], "solution": 2 },
    { "id": 9, "question": "Dans 'Il fallait que je ______ (partir)', quelle forme est correcte au subjonctif imparfait ?", "choix": ["parte", "partisse", "partais", "partirais"], "solution": 1 },
    { "id": 10, "question": "Subjonctif imparfait de 'savoir' à la 3e personne du singulier :", "choix": ["il sache", "il savait", "il sût", "il saurait"], "solution": 2 },
    { "id": 11, "question": "Quel est le radical du subjonctif imparfait pour les verbes comme 'tenir' ?", "choix": ["ten-", "tienn-", "tin-", "tiendr-"], "solution": 2 },
    { "id": 12, "question": "Subjonctif imparfait de 'vouloir' à la 1re personne du pluriel :", "choix": ["nous voulions", "nous veuillions", "nous voulussions", "nous voudrions"], "solution": 2 },
    { "id": 13, "question": "À quoi reconnaît-on un subjonctif imparfait ?", "choix": ["Aux terminaisons -sse, -sses, -^t, -ssions, -ssiez, -ssent", "Aux terminaisons -ais, -ais, -ait, -ions, -iez, -aient", "Aux terminaisons -ai, -as, -a, -âmes, -âtes, -èrent", "Au radical de l'infinitif"], "solution": 0 },
    { "id": 14, "question": "Subjonctif imparfait de 'prendre' à la 3e personne du pluriel :", "choix": ["ils prennent", "ils prenaient", "ils prissent", "ils prendraient"], "solution": 2 },
    { "id": 15, "question": "Dans un récit au passé, après 'bien que', on utilise :", "choix": ["le subjonctif présent", "le subjonctif imparfait", "l'indicatif imparfait", "le conditionnel"], "solution": 1 },
    { "id": 16, "question": "Subjonctif imparfait de 'devoir' à la 2e personne du singulier :", "choix": ["tu doives", "tu devais", "tu dusses", "tu devrais"], "solution": 2 },
    { "id": 17, "question": "Quel temps composé correspond au subjonctif imparfait ?", "choix": ["Subjonctif passé", "Subjonctif plus-que-parfait", "Conditionnel passé", "Plus-que-parfait"], "solution": 1 },
    { "id": 18, "question": "Subjonctif imparfait de 'recevoir' à la 1re personne du singulier :", "choix": ["je reçoive", "je recevais", "je reçusse", "je recevrais"], "solution": 2 },
    { "id": 19, "question": "Dans la phrase 'Il eût fallu que tu ______', quel temps est 'eût' ?", "choix": ["Subjonctif imparfait", "Subjonctif plus-que-parfait", "Conditionnel passé", "Passé antérieur"], "solution": 1 },
    { "id": 20, "question": "Subjonctif imparfait de 'craindre' à la 3e personne du singulier :", "choix": ["il craint", "il craignait", "il craignît", "il craindrait"], "solution": 2 }
  ]
};