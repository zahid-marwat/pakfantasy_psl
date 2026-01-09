require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

mongoose.set('strictQuery', true);

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pakfantasy_psl')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
    origin: clientOrigins.length ? clientOrigins : true,
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(globalLimiter);


// Routes
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');
const userTeamRoutes = require('./routes/userTeams');
const userRoutes = require('./routes/users');

app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', userTeamRoutes);
app.use('/api/users', userRoutes);
const leagueRoutes = require('./routes/leagues');
app.use('/api/leagues', leagueRoutes);
const tournamentRoutes = require('./routes/tournaments');
app.use('/api/tournaments', tournamentRoutes);

app.get('/', (req, res) => {
    res.send('PakFantasyPSL Backend is running!');
});

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: clientOrigins.length ? clientOrigins : '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    // Global Chat Event
    socket.on('global_chat_message', (data) => {
        io.emit('global_chat_receive', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
