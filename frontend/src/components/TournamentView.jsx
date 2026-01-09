import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../lib/api';

const TournamentView = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('matches'); // matches, leaderboard

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await fetch(buildApiUrl('/api/tournaments'));
            const data = await res.json();
            setTournaments(data);
            if (data.length > 0) {
                // If specific one not selected, select first
                setSelectedTournament(data[0]);
                fetchLeaderboard(data[0]._id);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchLeaderboard = async (tId) => {
        setLoading(true);
        try {
            const res = await fetch(buildApiUrl(`/api/tournaments/${tId}/leaderboard`));
            const data = await res.json();
            setLeaderboard(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTournamentChange = (t) => {
        setSelectedTournament(t);
        fetchLeaderboard(t._id);
    };

    if (loading && tournaments.length === 0) return <div className="text-center py-20">Loading Tournaments...</div>;

    if (tournaments.length === 0) return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl text-gray-400 mb-4">No Active Tournaments</h2>
            <p>Check back later for PSL 2026!</p>
        </div>
    );

    return (
        <div className="container animate-fade-in pb-20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <span className="text-accent text-sm tracking-widest uppercase font-bold">Official League</span>
                    <h1 className="text-4xl font-bold text-white mt-1">{selectedTournament?.name} <span className="text-gray-500">{selectedTournament?.year}</span></h1>
                </div>

                {/* Tournament Switcher */}
                {tournaments.length > 1 && (
                    <div className="flex gap-2">
                        {tournaments.map(t => (
                            <button
                                key={t._id}
                                onClick={() => handleTournamentChange(t)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedTournament?._id === t._id ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {t.year}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('matches')}
                    className={`px-6 py-4 font-bold text-lg border-b-2 transition-colors ${activeTab === 'matches' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Matches & Schedule
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-6 py-4 font-bold text-lg border-b-2 transition-colors ${activeTab === 'leaderboard' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Season Leaderboard
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'matches' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedTournament?.matches?.map(match => (
                        <div key={match._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-white/5 px-3 py-1 rounded-bl-xl text-xs text-gray-400">
                                {new Date(match.matchDate).toLocaleDateString()}
                            </div>

                            <div className="flex justify-between items-center mt-4 mb-6">
                                <div className="text-center flex-1">
                                    <h3 className="text-xl font-bold text-white">{match.teamA}</h3>
                                </div>
                                <div className="text-sm text-gray-500 font-bold px-2">VS</div>
                                <div className="text-center flex-1">
                                    <h3 className="text-xl font-bold text-white">{match.teamB}</h3>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/10 mb-2">
                                    {match.venue}
                                </div>
                                <div className={`text-sm font-bold ${match.status === 'Completed' ? 'text-gray-500' : 'text-green-400'}`}>
                                    {match.status}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link to="/create-team" className="btn btn-primary flex-1 justify-center text-sm">
                                    Create Team
                                </Link>
                                <Link to={`/match-center/${match._id}`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                                    Match Center
                                </Link>
                            </div>
                        </div>
                    ))}
                    {selectedTournament?.matches?.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No matches scheduled yet.
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-panel rounded-2xl overflow-hidden max-w-4xl mx-auto">
                    <div className="p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            🏆 Season Standings
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Global ranking based on accumulated fantasy points across all matches.</p>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4 text-center w-20">Rank</th>
                                <th className="p-4">User</th>
                                <th className="p-4 text-center">Matches Played</th>
                                <th className="p-4 text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.map((user, idx) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-center font-mono font-bold text-gray-500">
                                        {idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : `#${idx + 1}`}
                                    </td>
                                    <td className="p-4 font-bold text-white">
                                        {user.username}
                                    </td>
                                    <td className="p-4 text-center text-gray-400">
                                        {user.teamsCount}
                                    </td>
                                    <td className="p-4 text-right font-bold text-accent text-xl">
                                        {user.totalScore}
                                    </td>
                                </tr>
                            ))}
                            {leaderboard.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-gray-500">
                                        No stats available yet. Start playing matches to appear here!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TournamentView;
