const mongoose = require('mongoose');
const Match = require('./models/Match');
const Tournament = require('./models/Tournament');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pakfantasy_psl')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const seedTournament = async () => {
    try {
        // 1. Get existing matches
        const matches = await Match.find();
        if (matches.length === 0) {
            console.log("No matches found. Run general seed first.");
            process.exit();
        }

        // 2. Create Tournament
        const tournament = new Tournament({
            name: "HBL PSL",
            year: 2026,
            status: "Ongoing",
            matches: matches.map(m => m._id)
        });

        await tournament.save();
        console.log("Tournament 'HBL PSL 2026' Created with " + matches.length + " matches.");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTournament();
