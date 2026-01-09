const express = require('express');
const router = express.Router();
const UserTeam = require('../models/UserTeam');
const Match = require('../models/Match');
const Player = require('../models/Player');

// @route   POST /api/teams
// @desc    Create a user team for a match
// @access  Public (should be Protected)
router.post('/', async (req, res) => {
    const { userId, matchId, players, captainId, viceCaptainId, teamName } = req.body;

    // Basic Validation
    if (!players || players.length !== 11) {
        return res.status(400).json({ message: 'Team must have exactly 11 players' });
    }

    try {
        const userTeam = new UserTeam({
            user: userId,
            match: matchId,
            players: players,
            captain: captainId,
            viceCaptain: viceCaptainId,
            teamName: teamName
        });

        const savedTeam = await userTeam.save();
        res.status(201).json(savedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   GET /api/teams/match/:matchId/user/:userId
// @desc    Get user's team for a specific match
// @access  Public
router.get('/match/:matchId/user/:userId', async (req, res) => {
    try {
        const team = await UserTeam.findOne({
            match: req.params.matchId,
            user: req.params.userId
        })
            .populate('players')
            .populate('captain')
            .populate('viceCaptain');

        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/teams/user/:userId
// @desc    Get all teams for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const teams = await UserTeam.find({ user: req.params.userId })
            .populate('match')
            .populate('captain')
            .populate('viceCaptain')
            .sort({ createdAt: -1 });

        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
