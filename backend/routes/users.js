const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (Dev helper)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set. Falling back to an insecure default.');
}

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later.'
});

router.use(['/login', '/register', '/forgot-password', '/reset-password'], authLimiter);

const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const primaryClientOrigin = clientOrigins[0] || 'http://localhost:5173';

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const sanitizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!sanitizedUsername || !normalizedEmail || !password) {
        return res.status(400).json({ message: 'Please provide a username, email, and password.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) throw Error('User already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: sanitizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: 3600 });

        res.json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// @route   POST /api/users/login
// @desc    Auth user and return token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
        return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) throw Error('User does not exist');

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (Needs auth middleware technically, but passed via ID for now)
router.put('/profile/:id', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/users/forgot-password
// @desc    Simulate sending reset token
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Simulate Token
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
        const resetLink = new URL(`/reset-password/${resetToken}`, primaryClientOrigin).toString();

        // In real app, send email here. For now, return token to frontend for demo.
        console.log(`[SIMULATION] Password Reset Link for ${email}: ${resetLink}`);

        res.json({ message: 'Reset link sent to email (Check Console)', debugToken: resetToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/users/reset-password
// @desc    Reset password using token
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password Reset Successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or Expired Token' });
    }
});

module.exports = router;
