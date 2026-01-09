import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { buildApiUrl } from '../lib/api';

const Profile = () => {
    const { user, login } = useContext(AuthContext); // Re-login to update context if needed
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const res = await fetch(buildApiUrl(`/api/users/profile/${user.id}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username !== user.username ? username : undefined,
                    password: password || undefined
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Profile Updated Successfully!');
                setPassword('');
                // Ideally update context user here manually or re-fetch
            } else {
                setMessage(data.message || 'Update failed');
            }
        } catch (err) {
            setMessage('Network Error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in py-10">
            <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>

                {message && (
                    <div className={`p-3 rounded mb-4 text-center ${message.includes('Success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email (Cannot Change)</label>
                        <input
                            type="text"
                            disabled
                            value={user?.email}
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">New Password (Leave empty to keep current)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
