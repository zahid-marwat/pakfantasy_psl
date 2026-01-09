import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buildApiUrl } from '../lib/api';

const MatchCenter = () => {
    const { id } = useParams(); // Match ID
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock Data for "Live" experience
    const mockScore = {
        teamAScore: "185/4",
        teamAOver: "20.0",
        teamBScore: "142/6",
        teamBOver: "16.4",
        status: "Live",
        commentary: [
            "16.4: BOOM! Afridi strikes again. Clean bowled.",
            "16.3: Four runs! Smashed through covers.",
            "16.2: Single taken.",
        ]
    };

    useEffect(() => {
        // In a real app, fetch match details from API
        // For now, we simulate fetching match info but use static scores
        // We'll just fetch from the generic match endpoint to get Team names
        fetch(buildApiUrl('/api/matches'))
            .then(res => res.json())
            .then(data => {
                const found = data.find(m => m._id === id);
                setMatch(found);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading Match Center...</div>;
    if (!match) return <div className="text-center py-20 text-red-500">Match not found</div>;

    return (
        <div className="container animate-fade-in pt-8 pb-20">
            {/* Header */}
            <div className="glass-panel p-8 rounded-2xl mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 bg-white/10 rounded-bl-3xl">
                    <span className="text-sm font-mono tracking-widest">MATCH CENTER</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-400 mb-2 uppercase tracking-tight">{match.venue}</h1>
                <div className="text-sm text-gray-500 mb-8">{new Date(match.matchDate).toDateString()}</div>

                <div className="flex justify-center items-center gap-8 md:gap-16">
                    <div className="text-center">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 mx-auto flex items-center justify-center text-3xl font-bold border-4 border-white/10 shadow-2xl mb-4">
                            {match.teamA.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{match.teamA}</h2>
                        <div className="text-3xl font-mono font-bold text-blue-400 mt-2">{mockScore.teamAScore}</div>
                        <div className="text-xs text-gray-500">({mockScore.teamAOver} ov)</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-gray-600">VS</div>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-2 uppercase font-bold tracking-wider animate-pulse">
                            {mockScore.status}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-600 to-green-900 mx-auto flex items-center justify-center text-3xl font-bold border-4 border-white/10 shadow-2xl mb-4">
                            {match.teamB.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{match.teamB}</h2>
                        <div className="text-3xl font-mono font-bold text-green-400 mt-2">{mockScore.teamBScore}</div>
                        <div className="text-xs text-gray-500">({mockScore.teamBOver} ov)</div>
                    </div>
                </div>

                <div className="mt-8 text-lg font-medium text-gray-300">
                    {match.teamB} needs 44 runs in 20 balls
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats / Squads */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Live Scorecard</h3>

                    {/* Mock Scorecard Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="p-3">Batter</th>
                                    <th className="p-3">R</th>
                                    <th className="p-3">B</th>
                                    <th className="p-3">4s</th>
                                    <th className="p-3">6s</th>
                                    <th className="p-3">SR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="p-3 font-bold text-white">Babar Azam *</td>
                                    <td className="p-3">72</td>
                                    <td className="p-3">45</td>
                                    <td className="p-3">8</td>
                                    <td className="p-3">2</td>
                                    <td className="p-3">160.0</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold text-white">Saim Ayub</td>
                                    <td className="p-3">45</td>
                                    <td className="p-3">28</td>
                                    <td className="p-3">6</td>
                                    <td className="p-3">2</td>
                                    <td className="p-3">160.7</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Commentary */}
                <div className="glass-panel p-6 rounded-2xl max-h-[500px] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Ball by Ball</h3>
                    <div className="space-y-4">
                        {mockScore.commentary.map((comm, i) => (
                            <div key={i} className="text-sm text-gray-300 border-l-2 border-primary pl-3">
                                {comm}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link to="/tournament" className="text-gray-400 hover:text-white underline">Back to Tournament</Link>
            </div>
        </div>
    );
};

export default MatchCenter;
