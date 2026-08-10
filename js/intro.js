// ===========================
// CONJUGO QUEST - INTRO STYLE ZELDA
// ===========================

console.log("📖 Intro style Zelda chargée !");

// Vérifier que le joueur est connecté
document.addEventListener('DOMContentLoaded', function() {
    const playerName = localStorage.getItem('conjugoquest_player_name');
    if (!playerName) {
        // Rediriger vers l'accueil si non connecté
        window.location.href = 'index.html';
    }
});

// Textes de l'histoire (divisés en sections)
const storyTexts = [
    "Il y a bien longtemps, des êtres maléfiques se sont emparés des richesses lexicales de notre monde...",
    
    "Enfermés dans des tours maudites, ils ont pris possession de tous les temps verbaux, privant ainsi les villageois de leur capacité à parler librement.",
    
    "Sans conjugaison, les mots perdent leur sens, les phrases deviennent muettes, et la langue elle-même s'effondre dans le silence.",
    
    "Les habitants du royaume, désespérés, t'ont appelé à la rescousse... Toi, jeune héros, tu es leur dernier espoir !",
    
    "Armé de ton courage et de ta connaissance de la langue française, tu dois affronter les gardiens des tours et libérer les temps verbaux pour redonner la parole au peuple !"
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let typingSpeed = 40;
let isTyping = false;

// ===========================
// ANIMATION DE TEXTE PROGRESSIF
// ===========================

function typeText() {
    if (currentTextIndex >= storyTexts.length) {
        showTabs();
        return;
    }
    
    const dialogueBox = document.getElementById('dialogue-text');
    const currentText = storyTexts[currentTextIndex];
    
    if (currentCharIndex < currentText.length) {
        isTyping = true;
        dialogueBox.textContent += currentText[currentCharIndex];
        currentCharIndex++;
        setTimeout(typeText, typingSpeed);
    } else {
        isTyping = false;
    }
}

function nextText() {
    if (isTyping) {
        const dialogueBox = document.getElementById('dialogue-text');
        dialogueBox.textContent = storyTexts[currentTextIndex];
        currentCharIndex = storyTexts[currentTextIndex].length;
        isTyping = false;
    } else {
        currentTextIndex++;
        currentCharIndex = 0;
        document.getElementById('dialogue-text').textContent = '';
        
        if (currentTextIndex < storyTexts.length) {
            typeText();
        } else {
            showTabs();
        }
    }
}

// ===========================
// AFFICHAGE DES ONGLETS
// ===========================

function showTabs() {
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.style.animation = 'fadeOut 0.5s ease-out';
    
    setTimeout(() => {
        dialogueBox.style.display = 'none';
        
        const tabsContainer = document.getElementById('tabs-container');
        tabsContainer.style.display = 'flex';
    }, 500);
}

// ===========================
// GESTION DES RÈGLES
// ===========================

function ouvrirRegles() {
    const reglesPanel = document.getElementById('regles-panel');
    const tabsContainer = document.getElementById('tabs-container');
    
    reglesPanel.style.display = 'block';
    tabsContainer.style.display = 'none';
}

function fermerRegles() {
    const reglesPanel = document.getElementById('regles-panel');
    const tabsContainer = document.getElementById('tabs-container');
    
    reglesPanel.style.display = 'none';
    tabsContainer.style.display = 'flex';
}

function commencerAventure() {
    // Charger la sauvegarde existante ou en créer une nouvelle
    const save = JSON.parse(localStorage.getItem('conjugoquest_save') || '{}');
    
    if (!save.niveauActuel) {
        // Nouvelle partie
        const nouvellePartie = {
            niveauActuel: 1,
            niveauxCompletes: [],
            viesHero: 3
        };
        localStorage.setItem('conjugoquest_save', JSON.stringify(nouvellePartie));
        console.log("✅ Nouvelle aventure créée !");
    } else {
        console.log("✅ Progression chargée:", save);
    }
    
    window.location.href = 'map.html';
}

// ===========================
// ÉVÉNEMENTS
// ===========================

document.addEventListener('click', (e) => {
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox.style.display !== 'none') {
        nextText();
    }
});

document.addEventListener('keydown', (e) => {
    const dialogueBox = document.getElementById('dialogue-box');
    if (e.key === 'Enter' && dialogueBox.style.display !== 'none') {
        nextText();
    }
});

// ===========================
// INITIALISATION
// ===========================

window.addEventListener('load', () => {
    setTimeout(() => {
        typeText();
    }, 1000);
});

// Animation de fadeOut pour CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);