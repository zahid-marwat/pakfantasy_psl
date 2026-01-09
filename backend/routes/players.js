const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// @route   GET /api/players
// @desc    Get all players
// @access  Public
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/players/:id
// @desc    Get player by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/players
// @desc    Add a player (Admin only usually, but open for dev)
// @access  Public
router.post('/', async (req, res) => {
    const player = new Player({
        name: req.body.name,
        role: req.body.role,
        team: req.body.team,
        credits: req.body.credits,
        stats: req.body.stats,
        imageUrl: req.body.imageUrl
    });

    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
