import React from 'react';
import { motion } from 'framer-motion';

const PitchView = ({ players = [], captainId, viceCaptainId }) => {
    // Categorize players
    const wk = players.filter(p => p.role === 'Wicketkeeper');
    const bat = players.filter(p => p.role === 'Batsman');
    const ar = players.filter(p => p.role === 'All-Rounder');
    const bowl = players.filter(p => p.role === 'Bowler');

    const PlayerIcon = ({ player }) => (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
            style={{ width: '80px' }}
        >
            <div className="relative">
                <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-white shadow-lg"
                    style={{
                        backgroundColor: player.role === 'Wicketkeeper' ? '#D97706' :
                            player.role === 'Batsman' ? '#2563EB' :
                                player.role === 'All-Rounder' ? '#EA580C' : '#16A34A',
                        borderColor: player.role === 'Wicketkeeper' ? '#FBBF24' :
                            player.role === 'Batsman' ? '#60A5FA' :
                                player.role === 'All-Rounder' ? '#FB923C' : '#4ADE80'
                    }}
                >
                    {player.name.charAt(0)}

                    {/* C/VC Badges */}
                    {player._id === captainId && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">C</span>
                    )}
                    {player._id === viceCaptainId && (
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">VC</span>
                    )}
                </div>
            </div>
            <div className="text-white text-[10px] px-2 py-1 rounded mt-1 truncate w-full text-center border border-white/20"
                style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                {player.name.split(' ')[1] || player.name}
            </div>
            <div className="text-[10px] font-bold text-white drop-shadow-md">
                {player.stats?.fantasyPoints || 0} pts
            </div>
        </motion.div>
    );

    return (
        <div className="relative w-full max-w-md mx-auto h-[600px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl mt-8"
            style={{ backgroundColor: '#166534' }}>
            {/* Grass Texture Pattern */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                }}
            ></div>

            {/* Pitch / 30 Yard Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[160px] bg-yellow-100/20 border border-white/40"></div>

            {/* Players Layer */}
            <div className="relative z-10 h-full flex flex-col justify-between py-8 px-4">

                {/* Wicket Keeper */}
                <div className="flex justify-center">
                    {wk.map(p => <PlayerIcon key={p._id} player={p} />)}
                </div>

                {/* Batsmen */}
                <div className="flex justify-center gap-8 -mt-4">
                    {bat.map(p => <PlayerIcon key={p._id} player={p} />)}
                </div>

                {/* All Rounders */}
                <div className="flex justify-center gap-6">
                    {ar.map(p => <PlayerIcon key={p._id} player={p} />)}
                </div>

                {/* Bowlers */}
                <div className="flex justify-center gap-4">
                    {bowl.map(p => <PlayerIcon key={p._id} player={p} />)}
                </div>

            </div>
        </div>
    );
};

export default PitchView;
