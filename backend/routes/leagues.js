const express = require('express');
const router = express.Router();
const League = require('../models/League');
const UserTeam = require('../models/UserTeam');

// Helper to generate code
const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route   POST /api/leagues
// @desc    Create a new private league
// @access  Public (should be protected)
router.post('/', async (req, res) => {
    const { name, ownerId, matchId } = req.body;

    if (!name || !ownerId || !matchId) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        // Create League
        const code = generateCode();

        // Ensure owner has a team for this match? Not strictly necessary to create, but to join yes.
        // We will just add owner as participant if they have a team, otherwise just owner?
        // Let's assume owner joins later or immediately if team exists.
        // For simplicity, just create league first.

        const league = new League({
            name,
            code,
            owner: ownerId,
            match: matchId,
            participants: [] // Owner joins separately or logic below
        });

        const savedLeague = await league.save();
        res.status(201).json(savedLeague);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/leagues/code/:code
// @desc    Get league info by code (for joining)
// @access  Public
router.get('/code/:code', async (req, res) => {
    try {
        const league = await League.findOne({ code: req.params.code })
            .populate('match', 'teamA teamB date');

        if (!league) return res.status(404).json({ message: 'Invalid League Code' });

        res.json(league);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/leagues/join
// @desc    Join a league by code
// @access  Public
router.post('/join', async (req, res) => {
    const { userId, code, userTeamId } = req.body;

    if (!userId || !code || !userTeamId) {
        return res.status(400).json({ message: 'User, Code, and Team required' });
    }

    try {
        const league = await League.findOne({ code });
        if (!league) return res.status(404).json({ message: 'League not found' });

        // Check if already joined
        const isParticipant = league.participants.find(p => p.user.toString() === userId);
        if (isParticipant) return res.status(400).json({ message: 'Already joined this league' });

        // Validate Team match matches League match
        const team = await UserTeam.findById(userTeamId);
        if (!team || team.match.toString() !== league.match.toString()) {
            return res.status(400).json({ message: 'Team does not belong to the league match' });
        }

        league.participants.push({
            user: userId,
            team: userTeamId
        });

        await league.save();
        res.json(league);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/leagues/user/:userId
// @desc    Get leagues a user is part of
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const leagues = await League.find({
            'participants.user': req.params.userId
        })
            .populate('match', 'teamA teamB date')
            .populate('owner', 'username');

        res.json(leagues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/leagues/:id
// @desc    Get league details with leaderboard
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const league = await League.findById(req.params.id)
            .populate('match')
            .populate('owner', 'username')
            .populate({
                path: 'participants.team',
                populate: { path: 'captain viceCaptain' }
            })
            .populate('participants.user', 'username');

        if (!league) return res.status(404).json({ message: 'League not found' });

        // Sort participants by team points
        const leaderboard = league.participants
            .map(p => ({
                user: p.user.username,
                teamName: p.team.teamName,
                totalPoints: p.team.totalPoints,
                rank: 0, // Calculate below
                userTeamId: p.team._id
            }))
            .sort((a, b) => b.totalPoints - a.totalPoints);

        // Assign ranks
        leaderboard.forEach((item, index) => { item.rank = index + 1; });

        res.json({ league, leaderboard });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
