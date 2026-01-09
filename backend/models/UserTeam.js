const mongoose = require('mongoose');

const userTeamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    teamName: {
        type: String,
        default: function () {
            return `Team ${new Date().getTime()}`; // Default name if not provided
        }
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    viceCaptain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    isWicketKeeperSelected: { type: Boolean, default: false }, // Helper for validation if needed usually computed
    isValid: { type: Boolean, default: false } // Flag to mark if team meets criteria (11 players, credits < 100 etc)
}, {
    timestamps: true
});

// Custom validator for player count (optional, can be enforced in API controller too)
userTeamSchema.path('players').validate(function (value) {
    return value.length <= 11;
}, 'UserTeam cannot have more than 11 players');

module.exports = mongoose.model('UserTeam', userTeamSchema);
