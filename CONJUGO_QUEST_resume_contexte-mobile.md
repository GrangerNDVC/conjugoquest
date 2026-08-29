# CONJUGO QUEST — Résumé de contexte (Adaptation Smartphone)

## Ce qui a été livré dans cette session

Deux fichiers prêts à intégrer, pensés pour se superposer aux CSS/JS existants
sans les réécrire :

- `css/mobile.css` — media queries mobiles (combat, carte, duel), cibles
  tactiles 44px, anti-zoom iOS, safe-area (encoche), cercle magique allégé
  (particules désactivées, taille réduite) pour la performance.
- `js/mobile-utils.js` — hauteur réelle du viewport (`--vh`), maintien du
  champ de saisie visible quand le clavier virtuel s'ouvre (via
  `visualViewport`), et un déclencheur tactile (appui long 2,5s) équivalent
  au raccourci clavier "granger" du mode debug.

## Intégration — FAIT dans cette session

Les 7 pages (`index.html`, `login.html`, `intro.html`, `map.html`,
`combat.html`, `duel.html`, `classements.html`) ont été patchées
automatiquement et sont livrées dans `pages/` :
- `<link rel="stylesheet" href="css/mobile.css">` ajouté avant `</head>`
- `<script src="js/mobile-utils.js"></script>` ajouté avant `</body>`
- `viewport-fit=cover` ajouté à la balise meta viewport existante

➡️ Il suffit d'écraser vos fichiers actuels par ceux du dossier `pages/`
(le reste du contenu de chaque page n'a pas été touché), et de déposer
`css/mobile.css` + `js/mobile-utils.js` dans vos dossiers `css/` et `js/`.

## Action requise avant mise en prod

Dans `js/mobile-utils.js`, remplacer :
```js
const DEBUG_HASH = "REMPLACER_PAR_LE_HASH_EXISTANT";
```
par le hash SHA-256 déjà utilisé dans le déclencheur clavier "granger" de
`map.js`, pour que le déclencheur tactile (appui long sur le titre de la
carte) accepte le même mot de passe. Tant que ce n'est pas fait, le
déclencheur tactile est désactivé (log console uniquement).

## Recommandation viewport (à évaluer)

La balise meta viewport actuelle est :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Elle peut être complétée avec `viewport-fit=cover` pour gérer proprement les
encoches iPhone (déjà exploité par `css/mobile.css` via `env(safe-area-inset-*)`) :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```
⚠️ Ne pas ajouter `maximum-scale=1.0` / `user-scalable=no` : ça bloque le
zoom pour les élèves qui en ont besoin (accessibilité). Le champ de saisie
est déjà réglé à 16px pour éviter le zoom automatique intempestif d'iOS au
focus, sans avoir à désactiver le zoom manuel.

## Prochaines étapes possibles (non traitées ici)

- Tester le rendu réel sur un iPhone (Safari) et un Android (Chrome), surtout
  la zone d'incantation en combat quand le clavier virtuel est ouvert.
- Vérifier le drag/scroll tactile du plateau `map.html` (3200×2800px) — le
  scroll natif devrait suffire mais à confirmer en conditions réelles.
- Envisager un mode "portrait forcé" ou un message d'invite à tourner
  l'écran si le combat est jugé peu lisible en paysage court (un premier
  filet de sécurité est déjà posé dans `mobile.css` via
  `@media (max-height: 420px) and (orientation: landscape)`).
- Porter les mêmes principes sur `duel.html` en conditions réelles de jeu
  (zones déjà adaptées dans `mobile.css`, mais pas testées en duel live).
