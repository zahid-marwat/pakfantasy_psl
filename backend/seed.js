const mongoose = require('mongoose');
require('dotenv').config();

const Player = require('./models/Player');
const Match = require('./models/Match');
const User = require('./models/User');

const playersData = [
    // Peshawar Zalmi
    { name: 'Babar Azam', role: 'Batsman', team: 'Peshawar Zalmi', credits: 10.5, stats: { matchesPlayed: 250, runs: 9000, average: 44.5 } },
    { name: 'Saim Ayub', role: 'Batsman', team: 'Peshawar Zalmi', credits: 9.0, stats: { matchesPlayed: 40, runs: 1200, average: 30.0 } },
    { name: 'Mohammad Haris', role: 'Wicketkeeper', team: 'Peshawar Zalmi', credits: 8.5, stats: { matchesPlayed: 35, runs: 900, average: 25.5 } },
    { name: 'Rovman Powell', role: 'Batsman', team: 'Peshawar Zalmi', credits: 9.0, stats: { matchesPlayed: 180, runs: 3500, average: 24.0 } },
    { name: 'Tom Kohler-Cadmore', role: 'Batsman', team: 'Peshawar Zalmi', credits: 8.5, stats: { matchesPlayed: 160, runs: 4000, average: 29.0 } },
    { name: 'Aamer Jamal', role: 'All-Rounder', team: 'Peshawar Zalmi', credits: 8.0, stats: { matchesPlayed: 25, runs: 300, wickets: 35 } },
    { name: 'Luke Wood', role: 'Bowler', team: 'Peshawar Zalmi', credits: 8.5, stats: { matchesPlayed: 140, wickets: 160, average: 24.0 } },
    { name: 'Salman Irshad', role: 'Bowler', team: 'Peshawar Zalmi', credits: 7.5, stats: { matchesPlayed: 40, wickets: 50, average: 26.5 } },
    { name: 'Arif Yaqoob', role: 'Bowler', team: 'Peshawar Zalmi', credits: 7.0, stats: { matchesPlayed: 15, wickets: 25, average: 18.0 } },
    { name: 'Haseebullah Khan', role: 'Wicketkeeper', team: 'Peshawar Zalmi', credits: 7.5, stats: { matchesPlayed: 20, runs: 400, average: 22.0 } },

    // Lahore Qalandars
    { name: 'Shaheen Afridi', role: 'Bowler', team: 'Lahore Qalandars', credits: 10.5, stats: { matchesPlayed: 120, wickets: 180, average: 20.5 } },
    { name: 'Fakhar Zaman', role: 'Batsman', team: 'Lahore Qalandars', credits: 10.0, stats: { matchesPlayed: 180, runs: 5500, average: 31.5 } },
    { name: 'Haris Rauf', role: 'Bowler', team: 'Lahore Qalandars', credits: 9.5, stats: { matchesPlayed: 100, wickets: 140, average: 22.0 } },
    { name: 'Sikandar Raza', role: 'All-Rounder', team: 'Lahore Qalandars', credits: 9.5, stats: { matchesPlayed: 200, runs: 4000, wickets: 100 } },
    { name: 'Abdullah Shafique', role: 'Batsman', team: 'Lahore Qalandars', credits: 8.5, stats: { matchesPlayed: 60, runs: 1500, average: 35.0 } },
    { name: 'Zaman Khan', role: 'Bowler', team: 'Lahore Qalandars', credits: 8.5, stats: { matchesPlayed: 70, wickets: 90, average: 23.5 } },
    { name: 'Rassie van der Dussen', role: 'Batsman', team: 'Lahore Qalandars', credits: 9.0, stats: { matchesPlayed: 150, runs: 4500, average: 36.0 } },
    { name: 'David Wiese', role: 'All-Rounder', team: 'Lahore Qalandars', credits: 8.5, stats: { matchesPlayed: 300, runs: 3000, wickets: 250 } },
    { name: 'Sahibzada Farhan', role: 'Batsman', team: 'Lahore Qalandars', credits: 8.0, stats: { matchesPlayed: 50, runs: 1200, average: 28.0 } },
    { name: 'Jahandad Khan', role: 'All-Rounder', team: 'Lahore Qalandars', credits: 7.0, stats: { matchesPlayed: 10, runs: 150, wickets: 8 } },

    // Islamabad United
    { name: 'Shadab Khan', role: 'All-Rounder', team: 'Islamabad United', credits: 10.0, stats: { matchesPlayed: 150, runs: 2000, wickets: 160 } },
    { name: 'Naseem Shah', role: 'Bowler', team: 'Islamabad United', credits: 9.5, stats: { matchesPlayed: 80, wickets: 90, average: 26.0 } },
    { name: 'Imad Wasim', role: 'All-Rounder', team: 'Islamabad United', credits: 9.0, stats: { matchesPlayed: 160, runs: 1500, wickets: 130 } },
    { name: 'Azam Khan', role: 'Wicketkeeper', team: 'Islamabad United', credits: 8.5, stats: { matchesPlayed: 80, runs: 1800, average: 24.0 } },
    { name: 'Alex Hales', role: 'Batsman', team: 'Islamabad United', credits: 9.5, stats: { matchesPlayed: 350, runs: 11000, average: 30.0 } },
    { name: 'Colin Munro', role: 'Batsman', team: 'Islamabad United', credits: 9.0, stats: { matchesPlayed: 300, runs: 9000, average: 31.0 } },
    { name: 'Faheem Ashraf', role: 'All-Rounder', team: 'Islamabad United', credits: 8.5, stats: { matchesPlayed: 120, runs: 1000, wickets: 110 } },
    { name: 'Agha Salman', role: 'All-Rounder', team: 'Islamabad United', credits: 8.0, stats: { matchesPlayed: 60, runs: 1200, wickets: 40 } },
    { name: 'Rumman Raees', role: 'Bowler', team: 'Islamabad United', credits: 7.5, stats: { matchesPlayed: 90, wickets: 100, average: 25.0 } },
    { name: 'Haider Ali', role: 'Batsman', team: 'Islamabad United', credits: 7.5, stats: { matchesPlayed: 90, runs: 1800, average: 22.0 } },

    // Multan Sultans
    { name: 'Mohammad Rizwan', role: 'Wicketkeeper', team: 'Multan Sultans', credits: 10.5, stats: { matchesPlayed: 200, runs: 6000, average: 42.0 } },
    { name: 'Iftikhar Ahmed', role: 'All-Rounder', team: 'Multan Sultans', credits: 9.5, stats: { matchesPlayed: 190, runs: 4000, wickets: 50, strikeRate: 140.0 } },
    { name: 'Usama Mir', role: 'Bowler', team: 'Multan Sultans', credits: 8.5, stats: { matchesPlayed: 90, wickets: 110, average: 23.0 } },
    { name: 'David Willey', role: 'All-Rounder', team: 'Multan Sultans', credits: 9.0, stats: { matchesPlayed: 250, runs: 2500, wickets: 240 } },
    { name: 'Abbas Afridi', role: 'Bowler', team: 'Multan Sultans', credits: 8.0, stats: { matchesPlayed: 30, wickets: 45, average: 20.0 } },
    { name: 'Reeza Hendricks', role: 'Batsman', team: 'Multan Sultans', credits: 9.0, stats: { matchesPlayed: 200, runs: 5500, average: 35.0 } },
    { name: 'Khushdil Shah', role: 'All-Rounder', team: 'Multan Sultans', credits: 8.0, stats: { matchesPlayed: 100, runs: 1500, wickets: 40 } },
    { name: 'Tayyab Tahir', role: 'Batsman', team: 'Multan Sultans', credits: 7.5, stats: { matchesPlayed: 40, runs: 1000, average: 32.0 } },
    { name: 'Shahnawaz Dahani', role: 'Bowler', team: 'Multan Sultans', credits: 8.0, stats: { matchesPlayed: 50, wickets: 60, average: 24.0 } },
    { name: 'Mohammad Ali', role: 'Bowler', team: 'Multan Sultans', credits: 7.0, stats: { matchesPlayed: 20, wickets: 25, average: 21.0 } },

    // Quetta Gladiators
    { name: 'Rilee Rossouw', role: 'Batsman', team: 'Quetta Gladiators', credits: 9.5, stats: { matchesPlayed: 280, runs: 7000, average: 30.0 } },
    { name: 'Mohammad Amir', role: 'Bowler', team: 'Quetta Gladiators', credits: 9.5, stats: { matchesPlayed: 180, wickets: 250, average: 21.0 } },
    { name: 'Jason Roy', role: 'Batsman', team: 'Quetta Gladiators', credits: 9.5, stats: { matchesPlayed: 320, runs: 9000, average: 28.0 } },
    { name: 'Saud Shakeel', role: 'Batsman', team: 'Quetta Gladiators', credits: 8.5, stats: { matchesPlayed: 50, runs: 1200, average: 29.0 } },
    { name: 'Sarfaraz Ahmed', role: 'Wicketkeeper', team: 'Quetta Gladiators', credits: 8.0, stats: { matchesPlayed: 250, runs: 4000, average: 25.0 } },
    { name: 'Abrar Ahmed', role: 'Bowler', team: 'Quetta Gladiators', credits: 8.5, stats: { matchesPlayed: 40, wickets: 55, average: 20.0 } },
    { name: 'Sherfane Rutherford', role: 'All-Rounder', team: 'Quetta Gladiators', credits: 8.5, stats: { matchesPlayed: 120, runs: 2000, average: 24.0 } },
    { name: 'Mohammad Wasim Jr', role: 'Bowler', team: 'Quetta Gladiators', credits: 8.5, stats: { matchesPlayed: 60, wickets: 80, average: 22.0 } },
    { name: 'Mohammad Hasnain', role: 'Bowler', team: 'Quetta Gladiators', credits: 8.0, stats: { matchesPlayed: 100, wickets: 120, average: 25.0 } },
    { name: 'Omair Yousuf', role: 'Batsman', team: 'Quetta Gladiators', credits: 7.5, stats: { matchesPlayed: 25, runs: 600, average: 28.0 } },

    // Karachi Kings
    { name: 'Shan Masood', role: 'Batsman', team: 'Karachi Kings', credits: 9.0, stats: { matchesPlayed: 140, runs: 3500, average: 28.0 } },
    { name: 'Shoaib Malik', role: 'All-Rounder', team: 'Karachi Kings', credits: 9.0, stats: { matchesPlayed: 450, runs: 11000, wickets: 150 } },
    { name: 'Kieron Pollard', role: 'All-Rounder', team: 'Karachi Kings', credits: 9.5, stats: { matchesPlayed: 600, runs: 12000, wickets: 300 } },
    { name: 'Mohammad Nawaz', role: 'All-Rounder', team: 'Karachi Kings', credits: 8.5, stats: { matchesPlayed: 180, runs: 2000, wickets: 170 } },
    { name: 'Hasan Ali', role: 'Bowler', team: 'Karachi Kings', credits: 9.0, stats: { matchesPlayed: 160, wickets: 220, average: 23.0 } },
    { name: 'Tim Seifert', role: 'Wicketkeeper', team: 'Karachi Kings', credits: 8.5, stats: { matchesPlayed: 180, runs: 4000, average: 27.0 } },
    { name: 'James Vince', role: 'Batsman', team: 'Karachi Kings', credits: 9.0, stats: { matchesPlayed: 320, runs: 9500, average: 30.0 } },
    { name: 'Mir Hamza', role: 'Bowler', team: 'Karachi Kings', credits: 8.0, stats: { matchesPlayed: 50, wickets: 70, average: 22.0 } },
    { name: 'Tabraiz Shamsi', role: 'Bowler', team: 'Karachi Kings', credits: 9.0, stats: { matchesPlayed: 200, wickets: 250, average: 21.0 } },
    { name: 'Muhammad Akhlaq', role: 'Wicketkeeper', team: 'Karachi Kings', credits: 7.0, stats: { matchesPlayed: 30, runs: 600, average: 24.0 } }
];

const matchData = {
    teamA: 'Peshawar Zalmi',
    teamB: 'Lahore Qalandars',
    matchDate: new Date(Date.now() + 86400000), // Tomorrow
    venue: 'Gaddafi Stadium, Lahore',
    status: 'Scheduled'
};

const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123', // In real app, this should be hashed
    role: 'user'
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pakfantasy_psl');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Player.deleteMany({});
        await Match.deleteMany({});
        await User.deleteMany({});
        console.log('Old data cleared');

        // Insert new data
        await Player.insertMany(playersData);
        console.log('pSL Players Seeded');

        await Match.create(matchData);
        console.log('Sample Match Seeded');

        const bcrypt = require('bcryptjs'); // Add this at top if not present, but I will just assume I need to double check imports.

        // ... inside seedDB ...

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        await User.create(userData);
        console.log('Test User Seeded');

        const adminData = {
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        };
        adminData.password = await bcrypt.hash(adminData.password, salt);

        await User.create(adminData);
        console.log('Admin User Seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
