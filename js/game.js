/* ============================================
   SYNTAXIA V3 - LOGIQUE PRINCIPALE
   ============================================ */

// État global du jeu
const GameState = {
    lives: 5,
    maxLives: 5,
    score: 0,
    combo: 0,
    timeRemaining: 900, // 15 minutes en secondes (5min était trop court)
    currentPhase: 0,
    phasesCompleted: [false, false, false, false, false],
    fragments: ['_', '_', '_', '_', '_'],
    questions: null,
    timerInterval: null,
    
    // Initialisation
    async init() {
        console.log('🚀 Initialisation de SYNTAXIA V3');
        await this.loadQuestions();
        this.setupEventListeners();
        this.startIntro();
    },
    
    // Charger les questions depuis JSON
    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            this.questions = await response.json();
            console.log('✅ Questions chargées', this.questions);
        } catch (error) {
            console.error('❌ Erreur chargement questions:', error);
            alert('Erreur de chargement des données. Vérifiez que questions.json existe.');
        }
    },
    
    // Configuration des événements
    setupEventListeners() {
        // Skip intro
        document.getElementById('skip-intro')?.addEventListener('click', () => {
            this.skipIntro();
        });
        
        // Video intro terminée
        document.getElementById('intro-video')?.addEventListener('ended', () => {
            this.skipIntro();
        });
        
        // Bouton aide
        document.getElementById('btn-help')?.addEventListener('click', () => {
            document.getElementById('help-overlay').classList.remove('hidden');
        });
        
        // Boutons briefing
        document.getElementById('btn-cancel-briefing')?.addEventListener('click', () => {
            this.closeBriefing();
        });
        
        document.getElementById('btn-start-phase')?.addEventListener('click', () => {
            this.startCurrentPhase();
        });
        
        // Bouton abandon
        document.getElementById('btn-abort')?.addEventListener('click', () => {
            if (confirm('Abandonner cette phase ?')) {
                this.returnToCockpit();
            }
        });
    },
    
    // Démarrer l'intro
    startIntro() {
        document.getElementById('intro-cinematic').classList.remove('hidden');
    },
    
    // Passer l'intro
    skipIntro() {
        document.getElementById('intro-cinematic').classList.add('hidden');
        this.showCockpit();
        this.startTimer();
    },
    
    // Afficher le cockpit
    showCockpit() {
        document.getElementById('cockpit-screen').classList.remove('hidden');
        document.getElementById('hud').classList.remove('hidden');
        this.updateHUD();
        this.updateCockpitState();
    },
    
    // Mettre à jour le HUD
    updateHUD() {
        // Vies
        const lifeBars = document.getElementById('life-bars');
        lifeBars.innerHTML = '';
        for (let i = 0; i < this.maxLives; i++) {
            const bar = document.createElement('div');
            bar.className = 'life-bar' + (i < this.lives ? ' active' : '');
            lifeBars.appendChild(bar);
        }
        
        // Score
        document.getElementById('score').textContent = this.score;
        
        // Timer
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timerEl = document.getElementById('timer');
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Timer critique si < 60s
        if (this.timeRemaining < 60) {
            timerEl.classList.add('critical');
        } else {
            timerEl.classList.remove('critical');
        }
    },
    
    // Démarrer le timer
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateHUD();
            
            if (this.timeRemaining <= 0) {
                this.gameOver();
            }
        }, 1000);
    },
    
    // Arrêter le timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    },
    
    // Mettre à jour l'état du cockpit
    updateCockpitState() {
        const hotspots = document.querySelectorAll('.hotspot');
        
        hotspots.forEach((hotspot, index) => {
            const phaseNum = index + 1;
            const isCompleted = this.phasesCompleted[index];
            const isUnlocked = index === 0 || this.phasesCompleted[index - 1];
            
            hotspot.classList.remove('locked', 'completed');
            
            if (isCompleted) {
                hotspot.classList.add('completed');
                hotspot.querySelector('.hotspot-status').textContent = '✓ RÉPARÉ';
                hotspot.onclick = null;
            } else if (isUnlocked) {
                hotspot.querySelector('.hotspot-status').textContent = '🔓 DISPONIBLE';
                hotspot.onclick = () => this.showBriefing(phaseNum);
            } else {
                hotspot.classList.add('locked');
                hotspot.querySelector('.hotspot-status').textContent = '🔒 VERROUILLÉ';
                hotspot.onclick = null;
            }
        });
        
        // Mettre à jour le message décodé
        document.getElementById('decoded-text').textContent = this.fragments.join('  ');
    },
    
    // Afficher le briefing d'une phase
    showBriefing(phaseNum) {
        const phaseKey = `phase${phaseNum}`;
        const phaseData = this.questions[phaseKey];
        const briefingData = this.questions.briefings[phaseKey];
        
        if (!phaseData || !briefingData) return;
        
        this.currentPhase = phaseNum;
        
        document.getElementById('briefing-icon').textContent = phaseData.icon;
        document.getElementById('briefing-title').textContent = phaseData.title;
        document.getElementById('briefing-code').textContent = `PHASE ${phaseNum}`;
        document.getElementById('briefing-context').textContent = briefingData.context;
        document.getElementById('briefing-objective').textContent = briefingData.objective;
        document.getElementById('briefing-warning-text').textContent = briefingData.warning;
        
        document.getElementById('briefing-screen').classList.remove('hidden');
    },
    
    // Fermer le briefing
    closeBriefing() {
        document.getElementById('briefing-screen').classList.add('hidden');
        this.currentPhase = 0;
    },
    
    // Démarrer la phase actuelle
    startCurrentPhase() {
        document.getElementById('briefing-screen').classList.add('hidden');
        document.getElementById('cockpit-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        const phaseKey = `phase${this.currentPhase}`;
        const phaseData = this.questions[phaseKey];
        
        document.getElementById('game-phase-title').textContent = 
            `PHASE ${this.currentPhase} - ${phaseData.title}`;
        
        // Initialiser la phase spécifique via l'objet global PhaseInitializers
        if (window.PhaseInitializers && window.PhaseInitializers[`phase${this.currentPhase}`]) {
            window.PhaseInitializers[`phase${this.currentPhase}`]();
        } else {
            console.error(`Phase ${this.currentPhase} initializer not found`);
        }
    },
    
    // Retour au cockpit
    returnToCockpit() {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('cockpit-screen').classList.remove('hidden');
        this.currentPhase = 0;
    },
    
    // Vérifier une réponse
    checkAnswer(userAnswer, correctAnswer) {
        const isCorrect = this.compareAnswers(userAnswer, correctAnswer);
        
        if (isCorrect) {
            this.handleCorrect();
        } else {
            this.handleIncorrect();
        }
        
        return isCorrect;
    },
    
    // Comparer les réponses
    compareAnswers(userAnswer, correctAnswer) {
        if (Array.isArray(correctAnswer)) {
            if (!Array.isArray(userAnswer)) return false;
            return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());
        }
        return userAnswer === correctAnswer;
    },
    
    // Réponse correcte
    handleCorrect() {
        this.combo++;
        this.score += 100 * this.combo;
        this.showFeedback('correct');
        this.updateHUD();
        
        // Bonus combo
        if (this.combo % 10 === 0 && this.lives < this.maxLives) {
            this.lives++;
            this.showNotification('💚 +1 VIE BONUS !');
        }
    },
    
    // Réponse incorrecte
    handleIncorrect() {
        this.combo = 0;
        this.lives--;
        this.showFeedback('incorrect');
        this.updateHUD();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    },
    
    // Afficher un feedback visuel
    showFeedback(type) {
        const flash = document.getElementById('feedback-flash');
        flash.className = 'feedback-flash ' + type;
        setTimeout(() => {
            flash.className = 'feedback-flash';
        }, 400);
    },
    
    // Notification
    showNotification(message) {
        // TODO: Implémenter système de notifications toast
        console.log('📢', message);
    },
    
    // Compléter une phase
    completePhase(phaseNum) {
        const index = phaseNum - 1;
        this.phasesCompleted[index] = true;
        
        const phaseKey = `phase${phaseNum}`;
        const phaseData = this.questions[phaseKey];
        this.fragments[index] = phaseData.fragment;
        
        this.score += 500;
        this.updateHUD();
        
        // Vérifier victoire
        if (this.phasesCompleted.every(p => p === true)) {
            setTimeout(() => this.victory(), 1500);
        } else {
            setTimeout(() => this.returnToCockpit(), 1500);
        }
    },
    
    // Game Over
    gameOver() {
        this.stopTimer();
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('cockpit-screen').classList.add('hidden');
        document.getElementById('defeat-screen').classList.remove('hidden');
    },
    
    // Victoire
    victory() {
        this.stopTimer();
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('cockpit-screen').classList.add('hidden');
        
        const victoryScreen = document.getElementById('victory-screen');
        victoryScreen.classList.remove('hidden');
        
        const message = this.fragments.join(' ');
        document.getElementById('final-message').textContent = `"${message}"`;
        
        const timeSpent = 300 - this.timeRemaining;
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        document.getElementById('final-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('final-score').textContent = this.score;
    }
};

// Fonction pour fermer l'aide
function closeHelp() {
    document.getElementById('help-overlay').classList.add('hidden');
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    GameState.init();
});
