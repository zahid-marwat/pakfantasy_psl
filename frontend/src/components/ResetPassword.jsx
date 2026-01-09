import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buildApiUrl } from '../lib/api';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch(buildApiUrl('/api/users/reset-password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in py-20">
            <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

                {message && (
                    <div className="p-3 bg-green-500/20 text-green-400 rounded mb-4 text-center">
                        {message}
                        <div className="mt-2">
                            <Link to="/login" className="underline font-bold">Login Now</Link>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="p-3 bg-red-500/20 text-red-400 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-primary outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3"
                        >
                            {isLoading ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
