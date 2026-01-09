const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'],
        required: true
    },
    team: {
        type: String,
        required: true,
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        min: 0
    },
    stats: {
        matchesPlayed: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        average: { type: Number, default: 0.0 },
        strikeRate: { type: Number, default: 0.0 },
        economy: { type: Number, default: 0.0 },
        fantasyPoints: { type: Number, default: 0 } // Total lifetime points
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
