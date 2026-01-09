const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
