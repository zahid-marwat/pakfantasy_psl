import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PlayerModal from './PlayerModal';
import { buildApiUrl } from '../lib/api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        // Simple client-side protection
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'players') fetchPlayers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(buildApiUrl('/api/users'));
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const res = await fetch(buildApiUrl('/api/players'));
            const data = await res.json();
            setPlayers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="container animate-fade-in pt-8 pb-20">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 mb-8">Manage users and players</p>

            <div className="flex gap-4 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'users' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('players')}
                    className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'players' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    Players Listing
                </button>
            </div>

            {loading && <div className="text-center py-20 text-gray-400">Loading data...</div>}

            {!loading && activeTab === 'users' && (
                <div className="glass-panel overflow-hidden rounded-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Balance</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{u.username}</td>
                                    <td className="p-4 text-gray-300">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-emerald-400 font-mono">{u.walletBalance || 0}</td>
                                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && activeTab === 'players' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.map(player => (
                        <div key={player._id} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-lg text-white border border-white/10">
                                    {player.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{player.name}</h3>
                                    <p className="text-xs text-gray-400">{player.team} • {player.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPlayer(player)}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded border border-white/10 text-white transition-colors"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedPlayer && (
                <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
            )}
        </div>
    );
};

export default AdminDashboard;
