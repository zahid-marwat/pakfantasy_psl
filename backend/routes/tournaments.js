const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const UserTeam = require('../models/UserTeam');

// @route   POST /api/tournaments
// @desc    Create a tournament
router.post('/', async (req, res) => {
    const { name, year } = req.body;
    try {
        const tournament = new Tournament({ name, year });
        const savedTournament = await tournament.save();
        res.status(201).json(savedTournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/tournaments
// @desc    Get all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate('matches');
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/tournaments/:id/matches
// @desc    Add existing matches to tournament
router.post('/:id/matches', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        const { matchIds } = req.body;
        tournament.matches.push(...matchIds);
        await tournament.save();

        res.json(tournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/tournaments/:id/leaderboard
// @desc    Global Season Leaderboard (Sum of all user teams for all matches in tournament)
router.get('/:id/leaderboard', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id).populate('matches');
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        const matchIds = tournament.matches.map(m => m._id);

        // Aggregation Pipeline to sum scores per user
        const leaderboard = await UserTeam.aggregate([
            { $match: { match: { $in: matchIds } } },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$totalPoints' },
                    teamsCount: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 100 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    username: '$userInfo.username',
                    totalScore: 1,
                    teamsCount: 1
                }
            }
        ]);

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
