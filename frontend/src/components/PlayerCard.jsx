import React from 'react';

const PlayerCard = ({ player, onSelect, isSelected, onInfo }) => {
    const { name, role, team, credits, stats, imageUrl } = player;

    // Role Badges
    const getRoleClass = (r) => {
        switch (r) {
            case 'Batsman': return 'role-batsman';
            case 'Bowler': return 'role-bowler';
            case 'All-Rounder': return 'role-all-rounder';
            case 'Wicketkeeper': return 'role-wicketkeeper';
            default: return 'role-batsman';
        }
    };

    return (
        <div
            className={`glass-panel p-4 rounded-xl relative cursor-pointer ${isSelected ? 'card-selected' : ''}`}
            onClick={() => onSelect(player)}
            style={{ transition: 'all 0.2s ease' }}
        >
            <button
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-xs text-gray-300 flex items-center justify-center transition-colors z-20"
                onClick={(e) => { e.stopPropagation(); onInfo(player); }}
                title="View Details"
            >
                i
            </button>
            {/* Selection Overlay */}
            {isSelected && (
                <div className="selection-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}

            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="avatar-circle shrink-0">
                    {imageUrl ? <img src={imageUrl} alt={name} className="avatar-img" /> : name.charAt(0)}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{name}</h3>
                    <div className="flex items-center gap-2 text-xs mb-2">
                        <span className={`role-badge ${getRoleClass(role)}`}>{role}</span>
                        <span className="text-gray-400">{team}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2 border-t">
                        <div className="text-xs text-gray-400">
                            Avg: <span className="text-white font-mono">{stats.average || '-'}</span>
                        </div>
                        <div className="font-bold text-accent">
                            {credits} Cr
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
