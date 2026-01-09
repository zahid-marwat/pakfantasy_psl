import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildApiUrl } from '../lib/api';

const LeagueDashboard = () => {
    const { user } = useContext(AuthContext);
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // list, create, join
    const navigate = useNavigate();

    // Create State
    const [leagueName, setLeagueName] = useState('');
    const [selectedMatch, setSelectedMatch] = useState('');
    const [matches, setMatches] = useState([]);

    // Join State
    const [joinCode, setJoinCode] = useState('');
    const [foundLeague, setFoundLeague] = useState(null);
    const [userTeams, setUserTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        fetchLeagues();
        fetchMatches();
    }, []);

    const fetchLeagues = async () => {
        try {
            const res = await fetch(buildApiUrl(`/api/leagues/user/${user.id}`));
            const data = await res.json();
            setLeagues(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMatches = async () => {
        const res = await fetch(buildApiUrl('/api/matches'));
        const data = await res.json();
        setMatches(data);
        if (data.length > 0) setSelectedMatch(data[0]._id);
    };

    const handleCreateLeague = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(buildApiUrl('/api/leagues'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: leagueName,
                    ownerId: user.id,
                    matchId: selectedMatch
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`League Created! Code: ${data.code}`);
                setView('list');
                fetchLeagues();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const verifyCode = async () => {
        setJoinError('');
        try {
            const res = await fetch(buildApiUrl(`/api/leagues/code/${joinCode}`));
            const data = await res.json();
            if (res.ok) {
                setFoundLeague(data);
                // Fetch User's teams for this match
                const teamsRes = await fetch(buildApiUrl(`/api/teams/user/${user.id}`));
                const teamsData = await teamsRes.json();

                // Filter teams for this match
                const validTeams = teamsData.filter(t => t.match._id === data.match._id);
                setUserTeams(validTeams);

                if (validTeams.length > 0) setSelectedTeamId(validTeams[0]._id);
                else setJoinError("You don't have any teams for this match. Create one first!");

            } else {
                setJoinError(data.message);
                setFoundLeague(null);
            }
        } catch (err) {
            setJoinError("Error verifying code");
        }
    };

    const handleJoinLeague = async () => {
        if (!selectedTeamId) return;
        try {
            const res = await fetch(buildApiUrl('/api/leagues/join'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    code: joinCode,
                    userTeamId: selectedTeamId
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Joined Successfully!");
                setView('list');
                fetchLeagues();
                setFoundLeague(null);
                setJoinCode('');
            } else {
                setJoinError(data.message);
            }
        } catch (err) {
            setJoinError("Error joining league");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container animate-fade-in pb-20 pt-6">

            {/* Hero Section */}
            <div className="relative mb-12 p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-2"
                        >
                            Private Leagues
                        </motion.h1>
                        <p className="text-gray-200 text-lg max-w-xl">
                            Compete with your friends in private groups. Create your own league or join an existing one with a code.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setView('create')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${view === 'create' ? 'bg-white text-blue-900' : 'bg-primary text-white hover:bg-emerald-600'}`}
                        >
                            + Create League
                        </button>
                        <button
                            onClick={() => setView('join')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg border border-white/20 ${view === 'join' ? 'bg-white text-blue-900' : 'bg-black/30 text-white hover:bg-black/50'}`}
                        >
                            Join with Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button for Create/Join Views */}
            {view !== 'list' && (
                <button
                    onClick={() => setView('list')}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to My Leagues
                </button>
            )}

            <AnimatePresence mode="wait">
                {view === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {leagues.length === 0 ? (
                            <div className="col-span-full glass-panel p-10 rounded-3xl text-center">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Leagues Found</h3>
                                <p className="text-gray-400 mb-6">Join a league to start competing with friends!</p>
                            </div>
                        ) : (
                            leagues.map((league, idx) => (
                                <motion.div
                                    key={league._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link to={`/leagues/${league._id}`} className="block group relative bg-[#151921] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                                        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-primary group-hover:to-emerald-500 transition-colors"></div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{league.name}</h3>
                                                <span className="bg-white/5 text-gray-300 px-2 py-1 rounded text-xs font-mono border border-white/10 group-hover:border-primary/30">
                                                    {league.code}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs text-white border border-white/10">
                                                    {league.match?.teamA?.charAt(0)}
                                                </div>
                                                <span className="text-gray-500 text-xs font-bold">VS</span>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs text-white border border-white/10">
                                                    {league.match?.teamB?.charAt(0)}
                                                </div>
                                                <span className="text-gray-400 text-sm ml-2">{league.match?.teamA} vs {league.match?.teamB}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                    <span>{league.participants.length} Players</span>
                                                </div>
                                                {league.owner._id === user.id && (
                                                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/20">Owner</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}

                {view === 'create' && (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel p-8 rounded-2xl max-w-lg mx-auto border border-white/10 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create New League</h2>
                        <form onSubmit={handleCreateLeague} className="flex flex-col gap-6">
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block font-medium">League Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                    placeholder="e.g. Champions Trophy"
                                    value={leagueName}
                                    onChange={e => setLeagueName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block font-medium">Select Match</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-black/40 transition-colors"
                                        value={selectedMatch}
                                        onChange={e => setSelectedMatch(e.target.value)}
                                    >
                                        {matches.map(m => (
                                            <option key={m._id} value={m._id} className="bg-slate-900">
                                                {m.teamA} vs {m.teamB} - {new Date(m.matchDate).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-2 py-4 text-lg font-bold shadow-lg shadow-primary/20">
                                Create League Now
                            </button>
                        </form>
                    </motion.div>
                )}

                {view === 'join' && (
                    <motion.div
                        key="join"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel p-8 rounded-2xl max-w-lg mx-auto border border-white/10 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-2 text-center text-white">Join League</h2>
                        <p className="text-center text-gray-400 mb-8">Enter the unique code shared by your friend</p>

                        {!foundLeague ? (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm mb-2 block font-medium">League Code</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary uppercase font-mono tracking-[0.2em] text-center text-xl placeholder:tracking-normal placeholder:text-gray-600"
                                            value={joinCode}
                                            onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                            placeholder="XYZ123"
                                            maxLength={6}
                                        />
                                        <button onClick={verifyCode} className="btn btn-primary px-6 rounded-xl font-bold">Verify</button>
                                    </div>
                                </div>
                                {joinError && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{joinError}</p>}
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-6 rounded-2xl mb-8 text-center border border-blue-500/30">
                                    <h3 className="text-2xl font-bold text-white mb-2">{foundLeague.name}</h3>
                                    <div className="inline-block bg-black/30 px-3 py-1 rounded-full text-sm text-blue-300 border border-blue-500/20">
                                        {foundLeague.match.teamA} vs {foundLeague.match.teamB}
                                    </div>
                                </div>

                                {joinError && <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-2 rounded-lg">{joinError}</p>}

                                {userTeams.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        <label className="text-gray-400 text-sm block font-medium">Select your Team for this match:</label>
                                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                                            {userTeams.map(team => (
                                                <div
                                                    key={team._id}
                                                    onClick={() => setSelectedTeamId(team._id)}
                                                    className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${selectedTeamId === team._id ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-black/20 hover:bg-black/40'}`}
                                                >
                                                    <span className="font-bold text-white">{team.teamName}</span>
                                                    <span className="text-sm font-bold text-emerald-400">{team.totalPoints} pts</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={handleJoinLeague} className="btn btn-primary mt-6 py-4 text-lg font-bold shadow-lg shadow-primary/20">
                                            Confirm & Join
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <p className="text-red-300 mb-4 font-medium">⚠️ No eligible team found for this match.</p>
                                        <Link to="/create-team" className="btn btn-primary inline-flex">Create Team First</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeagueDashboard;
