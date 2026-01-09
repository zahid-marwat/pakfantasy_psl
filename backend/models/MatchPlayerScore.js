const mongoose = require('mongoose');

const matchPlayerScoreSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    points: { type: Number, default: 0 } // Calculated Points for this match
}, {
    timestamps: true
});

// Compound index to ensure a player has only one score entry per match
matchPlayerScoreSchema.index({ match: 1, player: 1 }, { unique: true });

module.exports = mongoose.model('MatchPlayerScore', matchPlayerScoreSchema);
