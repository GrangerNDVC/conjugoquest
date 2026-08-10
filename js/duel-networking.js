// duel-networking.js - Version simplifiée pour debug
const DuelNetwork = {
    rooms: {},
    connection: null,
    
    createRoom(config) {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.rooms[roomCode] = {
            ...config,
            players: [config.player1],
            createdAt: Date.now()
        };
        console.log('📦 Salle créée:', roomCode, config);
        return roomCode;
    },
    
    joinRoom(code, player, callback) {
        if (this.rooms[code]) {
            this.rooms[code].players.push(player);
            callback(this.rooms[code]);
            console.log('🔗 Joueur rejoint:', code, player);
        } else {
            alert('❌ Salle introuvable');
        }
    }
};

window.DuelNetwork = DuelNetwork;