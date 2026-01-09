import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { motion } from 'framer-motion';
import { buildApiUrl } from '../lib/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!user) return;
            try {
                // Get Teams for logged in user
                const teamsRes = await fetch(buildApiUrl(`/api/teams/user/${user.id}`));
                const teamsData = await teamsRes.json();
                setTeams(teamsData);
                // Auto-select the first match if available to show leaderboard immediately
                if (teamsData.length > 0) setSelectedMatchId(teamsData[0].match?._id);
            } catch (err) {
                console.error("Failed to fetch teams", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, [user]);

    const handleSimulate = async (e, matchId) => {
        e.stopPropagation();
        if (!confirm("Simulate Match Results? This will assign random points to players.")) return;

        try {
            const res = await fetch(buildApiUrl(`/api/matches/${matchId}/simulate`), { method: 'POST' });
            const data = await res.json();
            alert(data.message);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Simulation Failed");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in pb-20 pt-6">
            {/* Hero Section */}
            <div className="relative mb-12 p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-emerald-800 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-0"></div>
                {/* Decorative Circles */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent z-0"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-2"
                        >
                            Game On, <span className="text-accent">{user?.username}</span>! 🏏
                        </motion.h1>
                        <p className="text-gray-200 text-lg max-w-xl">
                            The HBL PSL 2026 Season is heating up. manage your fantasy squads, track live points, and dominate the leaderboards.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/create-team" className="group relative px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                <span>+</span> Create New Team
                            </span>
                            <div className="absolute inset-0 bg-gray-100 group-hover:scale-105 transition-transform origin-center"></div>
                        </Link>
                        <Link to="/tournament" className="md:hidden px-6 py-3 bg-black/30 text-white font-medium rounded-xl border border-white/20 hover:bg-black/50 transition-colors">
                            Season Stats
                        </Link>
                    </div>
                </div>
            </div>

            {teams.length === 0 ? (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto border border-white/10"
                >
                    <div className="bg-gradient-to-br from-gray-800 to-black w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-inner">
                        🏏
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Your Trophy Cabinet is Empty</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Don't just watch the match, be part of the action! Create your dream 11 and start scoring points today.
                    </p>
                    <Link to="/create-team" className="btn btn-primary px-8 py-4 text-lg shadow-lg shadow-primary/30">
                        Draft Your First Team
                    </Link>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-10">
                    <div>
                        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm">🏆</span>
                                Your Squads
                            </h2>
                            <span className="text-gray-500 text-sm font-mono">{teams.length} Active Teams</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={team._id}
                                    className={`relative group bg-[#151921] border border-white/5 p-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${selectedMatchId === team.match?._id ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f1218]' : ''}`}
                                    onClick={() => setSelectedMatchId(team.match?._id)}
                                >
                                    {/* Card Header Background */}
                                    <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 group-hover:from-emerald-900 group-hover:to-gray-900 transition-colors relative">
                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                            {team.match ? 'UPCOMING' : 'COMPLETED'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-0 relative">
                                        {/* Team Logo/Icon */}
                                        <div className="-mt-10 mb-4 inline-flex">
                                            <div className="w-20 h-20 rounded-2xl bg-[#1e232d] p-1 shadow-xl border-4 border-[#151921]">
                                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-3xl">
                                                    🛡️
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors">
                                                    {team.teamName || 'My Team'}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                                    {team.match ? `${team.match.teamA} vs ${team.match.teamB}` : 'Match Ended'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Points</div>
                                                <div className="text-3xl font-bold text-white group-hover:text-accent font-mono transition-colors">{team.totalPoints || 0}</div>
                                            </div>
                                        </div>

                                        {/* Key Players */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
                                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-xs border border-yellow-500/30">C</div>
                                                <div className="overflow-hidden">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Captain</div>
                                                    <div className="text-sm font-medium text-white truncate">{team.captain?.name}</div>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
                                                <div className="w-8 h-8 rounded-full bg-gray-500/20 text-gray-400 flex items-center justify-center font-bold text-xs border border-gray-500/30">VC</div>
                                                <div className="overflow-hidden">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Vice</div>
                                                    <div className="text-sm font-medium text-white truncate">{team.viceCaptain?.name}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors border border-white/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMatchId(team.match?._id);
                                                    // Scroll to leaderboard
                                                    document.getElementById('leaderboard-section')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                View Leaderboard
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
                                                onClick={(e) => handleSimulate(e, team.match?._id)}
                                                title="Simulate Match"
                                            >
                                                ⚡
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard Section - Shows when a match is selected */}
                    <div id="leaderboard-section">
                        {selectedMatchId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-1 rounded-3xl overflow-hidden border border-white/10"
                            >
                                <div className="bg-[#1a1f29] p-8 rounded-[20px]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-lg">📊</div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Match Leaderboard</h3>
                                            <p className="text-gray-400 text-sm">Live rankings for the selected match</p>
                                        </div>
                                    </div>
                                    <Leaderboard matchId={selectedMatchId} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
