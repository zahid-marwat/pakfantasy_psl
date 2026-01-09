import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';
import PitchView from './PitchView';
import { buildApiUrl } from '../lib/api';

const TeamBuilder = () => {
    const { user } = useContext(AuthContext);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [totalCredits, setTotalCredits] = useState(0);

    // New State for C/VC and Submission
    const [step, setStep] = useState(1); // 1: Select Players, 2: Select C/VC
    const [captain, setCaptain] = useState(null);
    const [viceCaptain, setViceCaptain] = useState(null);
    const [matchId, setMatchId] = useState(null);
    const [matchInfo, setMatchInfo] = useState(null);
    const [showPitch, setShowPitch] = useState(false);

    // Modal State
    const [viewingPlayer, setViewingPlayer] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playersRes, matchesRes] = await Promise.all([
                    fetch(buildApiUrl('/api/players')),
                    fetch(buildApiUrl('/api/matches'))
                ]);

                const playersData = await playersRes.json();
                const matchesData = await matchesRes.json();

                setPlayers(playersData);
                if (matchesData.length > 0) {
                    setMatchId(matchesData[0]._id);
                    setMatchInfo(`${matchesData[0].teamA} vs ${matchesData[0].teamB}`);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error loading initial data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Selection Logic
    const togglePlayer = (player) => {
        if (step !== 1) return; // Prevent selection in step 2

        const isAlreadySelected = selectedPlayers.find(p => p._id === player._id);

        if (isAlreadySelected) {
            const updated = selectedPlayers.filter(p => p._id !== player._id);
            setSelectedPlayers(updated);
            setTotalCredits(totalCredits - player.credits);
        } else {
            if (selectedPlayers.length >= 11) {
                alert("You can only select 11 players!");
                return;
            }
            if (totalCredits + player.credits > 100) {
                alert("Not enough credits!");
                return;
            }
            setSelectedPlayers([...selectedPlayers, player]);
            setTotalCredits(totalCredits + player.credits);
        }
    };

    const handleRoleSelect = (player, role) => {
        if (role === 'C') {
            if (viceCaptain?._id === player._id) setViceCaptain(null);
            setCaptain(player);
        } else if (role === 'VC') {
            if (captain?._id === player._id) setCaptain(null);
            setViceCaptain(player);
        }
    };

    const handleSubmit = async () => {
        if (!captain || !viceCaptain) {
            alert("Please select both Captain and Vice-Captain");
            return;
        }

        const payload = {
            userId: user.id,
            matchId,
            players: selectedPlayers.map(p => p._id),
            captainId: captain._id,
            viceCaptainId: viceCaptain._id,
            teamName: `My Team ${new Date().toLocaleTimeString()}`
        };

        try {
            const res = await fetch(buildApiUrl('/api/teams'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Team Saved Successfully!");
                // Reset or Redirect
                setStep(1);
                setSelectedPlayers([]);
                setTotalCredits(0);
                setCaptain(null);
                setViceCaptain(null);
            } else {
                alert(data.message || "Error saving team");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to connect to server");
        }
    };

    // Rendering Helper
    const filteredPlayers = filter === 'All'
        ? players
        : players.filter(p => p.role === filter);

    const playerCount = selectedPlayers.length;

    return (
        <div className="container animate-fade-in">
            {/* Header Dashboard */}
            <div className="glass-panel p-6 rounded-2xl mb-8 sticky-header">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl" style={{
                            background: 'linear-gradient(to right, white, #9CA3AF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {step === 1 ? 'Create Your Team' : 'Choose Captain & VC'}
                        </h2>
                        <p className="text-sm text-gray-400">Match: {matchInfo || 'Loading...'}</p>
                    </div>

                    <div className="flex gap-6 items-center">
                        {step === 1 && (
                            <>
                                <div className="text-center">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Players</div>
                                    <div className={`text-2xl font-bold ${playerCount === 11 ? 'text-success' : 'text-white'}`}>
                                        {playerCount}/11
                                    </div>
                                </div>

                                <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }}></div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Credits Left</div>
                                    <div className={`text-2xl font-bold ${100 - totalCredits < 0 ? 'text-danger' : 'text-accent'}`}>
                                        {100 - totalCredits}
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 1 ? (
                            <button
                                className="btn btn-primary"
                                disabled={playerCount !== 11}
                                onClick={() => setStep(2)}
                            >
                                Next
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button className="btn" onClick={() => setStep(1)}>Back</button>
                                <button
                                    className={`btn ${captain && viceCaptain ? 'btn-success' : ''}`}
                                    disabled={!captain || !viceCaptain}
                                    onClick={handleSubmit}
                                >
                                    Save Team
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters (Only for Step 1) */}
                {step === 1 && (
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                        {['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilter(role)}
                                className={`filter-btn ${filter === role ? 'active' : ''}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading players data...</div>
            ) : (
                <>
                    {step === 1 ? (
                        // Step 1: Player Selection Grid
                        <div className="player-grid">
                            {filteredPlayers.map(player => (
                                <PlayerCard
                                    key={player._id}
                                    player={player}
                                    onSelect={togglePlayer}
                                    isSelected={!!selectedPlayers.find(p => p._id === player._id)}
                                    onInfo={setViewingPlayer}
                                />
                            ))}
                        </div>
                    ) : (
                        // Step 2: Captain / VC Selection List + Pitch View
                        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="space-y-4 pb-20">

                            {/* View Toggle */}
                            <div className="flex justify-center gap-4 mb-6">
                                <button
                                    onClick={() => setShowPitch(false)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!showPitch ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                >
                                    List View
                                </button>
                                <button
                                    onClick={() => setShowPitch(true)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${showPitch ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                >
                                    Pitch View
                                </button>
                            </div>

                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }} className="p-4 rounded-lg mb-6 text-sm text-gray-300 border">
                                <span className="font-bold">Tip:</span> Captain gets 2x points, Vice-Captain gets 1.5x points.
                            </div>

                            {showPitch ? (
                                <PitchView
                                    players={selectedPlayers}
                                    captainId={captain?._id}
                                    viceCaptainId={viceCaptain?._id}
                                />
                            ) : (
                                selectedPlayers.map(player => (
                                    <div key={player._id} className="glass-panel p-4 rounded-xl flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                                        <div className="flex items-center gap-4">
                                            <div className="avatar-circle shrink-0" style={{ width: '3rem', height: '3rem' }}>
                                                {player.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{player.name}</h3>
                                                <span className="text-xs text-gray-400">{player.role}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleRoleSelect(player, 'C')}
                                                className={`round-btn ${captain?._id === player._id ? 'active-c' : ''}`}
                                            >
                                                C
                                            </button>
                                            <button
                                                onClick={() => handleRoleSelect(player, 'VC')}
                                                className={`round-btn ${viceCaptain?._id === player._id ? 'active-vc' : ''}`}
                                            >
                                                VC
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Player Details Modal */}
            <PlayerModal
                player={viewingPlayer}
                onClose={() => setViewingPlayer(null)}
            />
        </div>
    );
};

export default TeamBuilder;
