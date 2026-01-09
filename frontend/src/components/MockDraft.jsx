import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PitchView from './PitchView';
import { buildApiUrl } from '../lib/api';

const MockDraft = () => {
    const { user } = useContext(AuthContext);
    const [allPlayers, setAllPlayers] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [myTeam, setMyTeam] = useState([]);
    const [botTeams, setBotTeams] = useState({ bot1: [], bot2: [], bot3: [] });
    const [draftLog, setDraftLog] = useState([]);

    // Draft State
    const [isStarted, setIsStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null); // 'user', 'bot1', 'bot2', 'bot3'
    const [round, setRound] = useState(1);
    const [loading, setLoading] = useState(true);

    const BOT_NAMES = { bot1: 'Lahore Lions', bot2: 'Karachi Kings AI', bot3: 'Peshawar Bot' };
    const ORDER = ['user', 'bot1', 'bot2', 'bot3'];

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (!isStarted) return;
        if (myTeam.length >= 11) {
            finishDraft();
            return;
        }

        if (currentTurn !== 'user') {
            const timer = setTimeout(() => {
                handleBotPick(currentTurn);
            }, 1000); // Bot picks after 1 second
            return () => clearTimeout(timer);
        }
    }, [currentTurn, isStarted]);

    const fetchPlayers = async () => {
        try {
            const res = await fetch(buildApiUrl('/api/players'));
            const data = await res.json();
            setAllPlayers(data);
            setAvailablePlayers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const startDraft = () => {
        setIsStarted(true);
        setCurrentTurn('user');
        setDraftLog(prev => [`Draft Started! You have the first pick.`, ...prev]);
    };

    const handleUserPick = (player) => {
        if (currentTurn !== 'user') return;

        // Add to my team
        setMyTeam([...myTeam, player]);
        removeFromPool(player);
        setDraftLog(prev => [`You picked ${player.name}`, ...prev]);

        // Next Turn
        nextTurn();
    };

    const handleBotPick = (botId) => {
        // Simple Logic: Pick highest credit player available
        // Or better: Pick random high credit to vary it
        const eligible = availablePlayers.slice(0, 10); // Look at top 10 available
        const pick = eligible[Math.floor(Math.random() * eligible.length)];

        if (!pick) return; // Should not happen if enough players

        setBotTeams(prev => ({
            ...prev,
            [botId]: [...prev[botId], pick]
        }));
        removeFromPool(pick);
        setDraftLog(prev => [`${BOT_NAMES[botId]} picked ${pick.name}`, ...prev]);

        nextTurn();
    };

    const removeFromPool = (player) => {
        setAvailablePlayers(prev => prev.filter(p => p._id !== player._id));
    };

    const nextTurn = () => {
        const currentIndex = ORDER.indexOf(currentTurn);
        if (currentIndex === ORDER.length - 1) {
            // End of round, back to start (Snake draft? Let's keep simple linear for now)
            setRound(r => r + 1);
            setCurrentTurn(ORDER[0]);
        } else {
            setCurrentTurn(ORDER[currentIndex + 1]);
        }
    };

    const finishDraft = async () => {
        setIsStarted(false);
        alert("Draft Complete! Saving your team...");

        // Save Team Logic (Simplified for now, similar to Team Builder)
        // Would need to select C/VC first, but let's just save as draft for now
        // Or redirect to a "Finalize Team" page passing the state?
        // For this demo, we'll just show the success message.
    };

    if (loading) return <div className="text-center py-20">Loading Players...</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <div className="glass-panel p-6 rounded-2xl mb-6 flex justify-between items-center sticky-header">
                <div>
                    <h1 className="text-2xl font-bold title-gradient">Mock Draft Simulator</h1>
                    <p className="text-sm text-gray-400">
                        {isStarted ? `Round ${round} • Current Turn: ${currentTurn === 'user' ? 'YOU' : BOT_NAMES[currentTurn]}` : 'Ready to start?'}
                    </p>
                </div>
                {!isStarted && myTeam.length === 0 && (
                    <button onClick={startDraft} className="btn btn-primary px-8 py-3 text-lg">
                        Start Draft
                    </button>
                )}
                {myTeam.length === 11 && (
                    <div className="text-success font-bold">Draft Completed!</div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left: Available Players */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl max-h-[80vh] overflow-y-auto">
                    <h3 className="font-bold mb-4 sticky top-0 p-2 z-10 border-b border-white/10" style={{ backgroundColor: '#0F172A' }}>Available Players ({availablePlayers.length})</h3>
                    <div className="space-y-2">
                        {availablePlayers.map(player => (
                            <div key={player._id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#374151' }}>
                                        {player.role.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{player.name}</div>
                                        <div className="text-xs text-gray-400">{player.team} • {player.credits} Cr</div>
                                    </div>
                                </div>
                                {currentTurn === 'user' && isStarted && (
                                    <button
                                        onClick={() => handleUserPick(player)}
                                        className="btn btn-primary text-xs py-1 px-3"
                                    >
                                        Pick
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: My Team */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 text-accent">Your Team ({myTeam.length}/11)</h3>
                    <div className="space-y-2 mb-4">
                        {myTeam.map(player => (
                            <div key={player._id} className="flex items-center gap-2 text-sm border-b border-white/5 pb-2">
                                <span className="text-green-400">✓</span>
                                <span>{player.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">{player.role}</span>
                            </div>
                        ))}
                        {Array.from({ length: 11 - myTeam.length }).map((_, i) => (
                            <div key={i} className="h-8 border-b border-white/5 border-dashed"></div>
                        ))}
                    </div>

                    {/* Simple Pitch Preview */}
                    {myTeam.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-xs uppercase text-gray-500 mb-2">Live Preview</h4>
                            {/* Mini Pitch View */}
                            <div className="transform scale-75 origin-top-left">
                                <PitchView players={myTeam} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Draft Log & Bot Teams */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Log */}
                    <div className="glass-panel p-6 rounded-2xl flex-1 overflow-auto max-h-[400px]">
                        <h3 className="font-bold mb-4">Draft Log</h3>
                        <div className="space-y-2 text-sm text-gray-400 font-mono">
                            {draftLog.map((log, i) => (
                                <div key={i} className="border-l-2 border-white/20 pl-2">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MockDraft;
