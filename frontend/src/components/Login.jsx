import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold mb-6 text-center title-gradient">Welcome Back</h2>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 py-3 text-lg shadow-lg shadow-primary/20">
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm flex flex-col gap-2">
                    <span>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></span>
                    <Link to="/forgot-password" style={{ color: 'var(--accent)' }} className="hover:underline">Forgot Password?</Link>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                    <p className="text-xs text-gray-500 text-center uppercase tracking-widest">Quick Access (Dev)</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => login('test@example.com', 'password123').then(res => res.success ? navigate('/') : setError(res.message))}
                            className="flex-1 py-3 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                        >
                            User Login
                        </button>
                        <button
                            onClick={() => login('admin@example.com', 'password123').then(res => res.success ? navigate('/admin') : setError(res.message))}
                            className="flex-1 py-3 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-bold border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                        >
                            Admin Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
