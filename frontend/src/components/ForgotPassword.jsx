import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../lib/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch(buildApiUrl('/api/users/forgot-password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
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
                <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password?</h1>
                <p className="text-gray-400 text-center mb-6 text-sm">Enter your email to receive a reset link.</p>

                {message && (
                    <div className="p-3 bg-green-500/20 text-green-400 rounded mb-4 text-center">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 bg-red-500/20 text-red-400 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-sm text-gray-400 hover:text-white">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
