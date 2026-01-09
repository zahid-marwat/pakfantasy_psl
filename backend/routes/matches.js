const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// @route   GET /api/matches
// @desc    Get all details of matches
// @access  Public
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const MatchPlayerScore = require('../models/MatchPlayerScore');
const UserTeam = require('../models/UserTeam');
const Player = require('../models/Player');

// @route   POST /api/matches/:matchId/simulate
// @desc    Simulate match scores for players and update leaderboard
// @access  Public (Dev/Admin)
router.post('/:matchId/simulate', async (req, res) => {
    try {
        const { matchId } = req.params;

        // 1. Get all players (in a real app, filtering by match teams would be better)
        const players = await Player.find();

        const bulkOps = [];
        const scoreMap = new Map(); // Map<PlayerId, Points>

        // 2. Generate random stats for each player
        for (const player of players) {
            // Simple random logic for simulation
            // 30% chance to play well, 70% chance minimal
            const playedWell = Math.random() > 0.7;

            let runs = 0;
            let wickets = 0;
            let catches = 0;

            if (player.role === 'Batsman' || player.role === 'Wicketkeeper') {
                runs = playedWell ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 20);
                catches = Math.floor(Math.random() * 3);
            } else if (player.role === 'Bowler') {
                wickets = playedWell ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 1);
                runs = Math.floor(Math.random() * 10);
                catches = Math.floor(Math.random() * 2);
            } else { // All-Rounder
                runs = playedWell ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 15);
                wickets = playedWell ? Math.floor(Math.random() * 3) : 0;
                catches = Math.floor(Math.random() * 2);
            }

            // Calculate Points
            // 1 Run = 1 pt, 1 Wicket = 25 pts, 1 Catch = 8 pts
            const points = (runs * 1) + (wickets * 25) + (catches * 8);
            scoreMap.set(player._id.toString(), points);

            bulkOps.push({
                updateOne: {
                    filter: { match: matchId, player: player._id },
                    update: {
                        match: matchId,
                        player: player._id,
                        runs,
                        wickets,
                        catches,
                        points
                    },
                    upsert: true
                }
            });
        }

        // 3. Save Scores
        await MatchPlayerScore.bulkWrite(bulkOps);

        // 4. Calculate Leaderboard (Update UserTeams)
        const userTeams = await UserTeam.find({ match: matchId });

        for (const team of userTeams) {
            let teamPoints = 0;

            for (const playerId of team.players) { // players is array of ObjectIds
                const pId = playerId.toString();
                let pPoints = scoreMap.get(pId) || 0;

                // Apply Multipliers
                if (team.captain.toString() === pId) {
                    pPoints *= 2;
                } else if (team.viceCaptain.toString() === pId) {
                    pPoints *= 1.5;
                }

                teamPoints += pPoints;
            }

            team.totalPoints = teamPoints;
            await team.save();
        }

        // 5. Update Ranks
        const sortedTeams = await UserTeam.find({ match: matchId }).sort({ totalPoints: -1 });
        for (let i = 0; i < sortedTeams.length; i++) {
            sortedTeams[i].rank = i + 1;
            await sortedTeams[i].save();
        }

        res.json({ message: 'Simulation and Leaderboard calculation complete', totalTeamsUpdated: userTeams.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/matches/:matchId/leaderboard
// @desc    Get leaderboard for a match
// @access  Public
router.get('/:matchId/leaderboard', async (req, res) => {
    try {
        const teams = await UserTeam.find({ match: req.params.matchId })
            .sort({ totalPoints: -1 }) // Highest points first
            .limit(50) // Top 50
            .populate('user', 'username email') // Assuming User model has username, or we just rely on ID/Mock
            .populate('captain', 'name')
            .populate('viceCaptain', 'name');

        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
