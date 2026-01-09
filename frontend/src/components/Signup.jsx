import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(username, email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold mb-6 text-center title-gradient">Create Account</h2>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Username</label>
                        <input
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 py-3 text-lg shadow-lg shadow-primary/20">
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
