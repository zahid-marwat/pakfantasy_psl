import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buildApiUrl } from '../lib/api';

const LeagueDetails = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeagueDetails();
    }, [id]);

    const fetchLeagueDetails = async () => {
        try {
            const res = await fetch(buildApiUrl(`/api/leagues/${id}`));
            const data = await res.json();
            if (res.ok) {
                setLeague(data.league);
                setLeaderboard(data.leaderboard);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading League Details...</div>;
    if (!league) return <div className="text-center py-20 text-red-500">League not found</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '1.5rem' }}>
            {/* Header */}
            <div className="glass-panel p-8 rounded-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="text-9xl">🏆</span>
                </div>

                <Link to="/leagues" className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Leagues</Link>

                <h1 className="text-4xl font-bold text-white mb-2">{league.name}</h1>
                <div className="flex items-center gap-4 text-gray-400 mb-6">
                    <span className="bg-white/10 px-3 py-1 rounded text-sm font-mono tracking-wider text-white">Code: {league.code}</span>
                    <span>•</span>
                    <span>{league.match.teamA} vs {league.match.teamB}</span>
                    <span>•</span>
                    <span>Created by {league.owner.username}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-gray-400 text-sm">Participants</div>
                        <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-gray-400 text-sm">Top Score</div>
                        <div className="text-2xl font-bold text-emerald-400">{leaderboard.length > 0 ? leaderboard[0].totalPoints : 0}</div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Standings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-sm">
                                <th className="p-4 font-medium text-center w-16">Rank</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Team Name</th>
                                <th className="p-4 font-medium text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.map((entry, index) => {
                                let rankBadge = <span className="text-gray-400 font-mono font-bold">#{entry.rank}</span>;
                                if (index === 0) rankBadge = <span className="text-2xl">🥇</span>;
                                if (index === 1) rankBadge = <span className="text-2xl">🥈</span>;
                                if (index === 2) rankBadge = <span className="text-2xl">🥉</span>;

                                return (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-center">
                                            {rankBadge}
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {entry.user}
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {entry.teamName}
                                        </td>
                                        <td className="p-4 font-bold text-emerald-400 text-lg text-right">
                                            {entry.totalPoints}
                                        </td>
                                    </tr>
                                );
                            })}
                            {leaderboard.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No participants yet. Share the code <strong>{league.code}</strong> to invite friends!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeagueDetails;
