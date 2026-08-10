/* ============================================
   SYNTAXIA V3 - COCKPIT INTERACTIONS
   ============================================ */

// Effets visuels et animations du cockpit
const CockpitEffects = {
    init() {
        this.createStarField();
        this.addHotspotEffects();
    },
    
    // Créer un champ d'étoiles
    createStarField() {
        const cockpit = document.querySelector('.cockpit-container');
        if (!cockpit) return;
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.3};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: twinkle ${Math.random() * 3 + 2}s infinite;
                pointer-events: none;
                z-index: 1;
            `;
            cockpit.appendChild(star);
        }
        
        // Ajouter l'animation CSS
        if (!document.getElementById('cockpit-animations')) {
            const style = document.createElement('style');
            style.id = 'cockpit-animations';
            style.textContent = `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Ajouter des effets aux hotspots
    addHotspotEffects() {
        const hotspots = document.querySelectorAll('.hotspot');
        
        hotspots.forEach(hotspot => {
            // Son au survol
            hotspot.addEventListener('mouseenter', () => {
                if (!hotspot.classList.contains('locked')) {
                    SoundEffects.playHover();
                }
            });
            
            // Son au clic
            hotspot.addEventListener('click', () => {
                if (!hotspot.classList.contains('locked')) {
                    SoundEffects.playClick();
                }
            });
        });
    }
};

// Effets sonores synthétiques
const SoundEffects = {
    context: null,
    
    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.context = new AudioContext();
        }
    },
    
    playHover() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + 0.1);
    },
    
    playClick() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.frequency.value = 1200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + 0.05);
    },
    
    playSuccess() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.frequency.setValueAtTime(523, this.context.currentTime);
        osc.frequency.setValueAtTime(659, this.context.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, this.context.currentTime + 0.2);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.15, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + 0.3);
    },
    
    playError() {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0.15, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + 0.2);
    }
};

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    // Échap pour retour cockpit
    if (e.key === 'Escape') {
        if (!document.getElementById('game-screen').classList.contains('hidden')) {
            if (confirm('Abandonner cette phase ?')) {
                GameState.returnToCockpit();
            }
        } else if (!document.getElementById('briefing-screen').classList.contains('hidden')) {
            GameState.closeBriefing();
        }
    }
    
    // Entrée pour skip intro
    if (e.key === 'Enter' && !document.getElementById('intro-cinematic').classList.contains('hidden')) {
        GameState.skipIntro();
    }
});

// Initialiser les effets
document.addEventListener('DOMContentLoaded', () => {
    SoundEffects.init();
    setTimeout(() => {
        CockpitEffects.init();
    }, 1000);
});
