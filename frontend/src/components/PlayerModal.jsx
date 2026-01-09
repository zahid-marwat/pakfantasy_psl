import React from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PlayerModal = ({ player, onClose }) => {
    if (!player) return null;

    // Mock History Data (Since backend doesn't have it yet)
    // const historyData = [ ... ]; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="glass-panel w-full max-w-lg rounded-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Image/Banner */}
                <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center text-4xl overflow-hidden shadow-2xl">
                            <span className="text-white">{player.name.charAt(0)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-12 px-6 pb-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">{player.name}</h2>
                            <span className="text-primary font-medium">{player.team}</span> • <span className="text-gray-400">{player.role}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Credits</div>
                            <div className="text-3xl font-bold text-accent">{player.credits}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Season Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">Matches</div>
                            <div className="text-xl font-bold text-white">{player.stats?.matchesPlayed || 0}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">RunScored</div>
                            <div className="text-xl font-bold text-white">{player.stats?.runs || 0}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">Batting Avg</div>
                            <div className="text-xl font-bold text-white">{player.stats?.average?.toFixed(1) || 0}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">Strike Rate</div>
                            <div className="text-xl font-bold text-white">{player.stats?.strikeRate?.toFixed(1) || 0}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">Wickets</div>
                            <div className="text-xl font-bold text-white">{player.stats?.wickets || 0}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl text-center">
                            <div className="text-sm text-gray-400 mb-1">Economy</div>
                            <div className="text-xl font-bold text-white">{player.stats?.economy?.toFixed(1) || 0}</div>
                        </div>
                    </div>

                    {/* Performance Graph - Temporarily disabled due to React 19 compatibility */}
                    {/*
                    <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Performance History</h3>
                    <div className="bg-black/20 p-4 rounded-xl mb-6 h-56 w-full">
                        <div className="flex items-center justify-center h-full text-gray-500">
                             Chart Disabled for Stability
                        </div>
                    </div>
                    */}

                    <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Fantasy</h3>
                    <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-700/40 p-4 rounded-xl flex justify-between items-center border border-emerald-500/20">
                        <span className="font-medium text-emerald-200">Total Fantasy Points</span>
                        <span className="text-2xl font-bold text-emerald-400">{player.stats?.fantasyPoints || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerModal;
