// ===========================
// CHROMAKEY - SUPPRESSION FOND BLEU
// ===========================

console.log("🎨 Module ChromaKey chargé");

/**
 * Supprime le fond bleu d'une image et retourne un canvas transparent
 */
function supprimerFondBleu(imageElement, tolerance = 40) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    
    // Dessiner l'image originale
    ctx.drawImage(imageElement, 0, 0);
    
    // Récupérer les pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Parcourir chaque pixel
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Détecter les différentes nuances de bleu
        const estBleuFonce = (b > 80 && b > r + 20 && b > g + 20); // Bleu foncé #3A5968
        const estBleuMoyen = (b > 140 && b > r + 30 && b > g + 10); // Bleu moyen #4A8DB5
        const estBleuClair = (b > 180 && r > 150 && g > 200); // Bleu clair #A8D5E2
        
        // Si c'est un bleu de fond, rendre transparent
        if (estBleuFonce || estBleuMoyen || estBleuClair) {
            data[i + 3] = 0; // Alpha = 0 (transparent)
        }
    }
    
    // Appliquer les modifications
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
}

/**
 * Applique la suppression du fond bleu à une image dans le DOM
 */
function appliquerChromakey(imageElement) {
    // Attendre que l'image soit chargée
    if (!imageElement.complete) {
        imageElement.addEventListener('load', () => {
            appliquerChromakey(imageElement);
        });
        return;
    }
    
    // Supprimer le fond bleu
    const canvas = supprimerFondBleu(imageElement);
    
    // Remplacer l'image par le canvas
    imageElement.src = canvas.toDataURL('image/png');
}

// ===========================
// AUTO-APPLICATION AU CHARGEMENT
// ===========================

window.addEventListener('load', () => {
    // Appliquer automatiquement au héros chibi
    const heroChibi = document.getElementById('hero-chibi');
    if (heroChibi) {
        console.log("🎨 Application du chromakey au héros chibi...");
        appliquerChromakey(heroChibi);
    }
});
