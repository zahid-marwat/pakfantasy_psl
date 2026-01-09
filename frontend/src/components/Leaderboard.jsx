import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../lib/api';

const Leaderboard = ({ matchId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const res = await fetch(buildApiUrl(`/api/matches/${matchId}/leaderboard`));
            const data = await res.json();
            setLeaderboard(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching leaderboard", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (matchId) {
            fetchLeaderboard();
        }
    }, [matchId]);

    if (loading) return <div className="text-center py-10 text-gray-500">Loading Leaderboard...</div>;

    return (
        <div className="leaderboard-container">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Live Rankings</h3>
                <button onClick={fetchLeaderboard} className="text-sm text-blue-400 hover:text-blue-300">
                    Refresh
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 text-sm">
                            <th className="p-4 font-medium">Rank</th>
                            <th className="p-4 font-medium">Team</th>
                            <th className="p-4 font-medium">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leaderboard.map((team, index) => {
                            let rankBadge = <span className="text-gray-400 font-mono">#{team.rank || index + 1}</span>;

                            if (index === 0) rankBadge = <span className="text-2xl">🥇</span>;
                            if (index === 1) rankBadge = <span className="text-2xl">🥈</span>;
                            if (index === 2) rankBadge = <span className="text-2xl">🥉</span>;

                            return (
                                <tr key={team._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        {rankBadge}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white mb-1">{team.teamName}</div>
                                        <div className="text-xs text-gray-500 flex gap-2">
                                            <span>C: {team.captain?.name}</span>
                                            <span>VC: {team.viceCaptain?.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-emerald-400 text-lg">
                                        {team.totalPoints}
                                    </td>
                                </tr>
                            );
                        })}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">
                                    No rankings yet. Wait for the match to start!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
