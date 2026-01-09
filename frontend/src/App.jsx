import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'
import TeamBuilder from './components/TeamBuilder';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import LeagueDashboard from './components/LeagueDashboard';
import LeagueDetails from './components/LeagueDetails';
import MockDraft from './components/MockDraft';
import TournamentView from './components/TournamentView';
import MatchCenter from './components/MatchCenter';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ChatWidget from './components/ChatWidget';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="app-header container">
      <div className="flex items-center gap-6">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>PakFantasy PSL</Link>
        {user && (
          <>
            <Link to="/leagues" className="text-gray-300 hover:text-white font-medium">Leagues</Link>
            <Link to="/tournament" className="text-gray-300 hover:text-white font-medium">Season</Link>
            <Link to="/draft" className="text-gray-300 hover:text-white font-medium">Draft Simulator</Link>
          </>
        )}
      </div>
      <div className="user-profile flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300">Welcome, <Link to="/profile" className="hover:text-white underline decoration-dotted">{user.username}</Link></span>
            <button onClick={logout} className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/30">Logout</button>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-primary-glow flex items-center justify-center font-bold text-white uppercase cursor-pointer hover:ring-2 ring-offset-2 ring-primary ring-offset-bg-deep transition-all">
                {user.username.charAt(0)}
              </div>
            </Link>
          </>
        ) : (
          <Link to="/login" className="text-primary hover:text-white">Login</Link>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="app-gradient" aria-hidden="true"></div>
          <div className="app-glow" aria-hidden="true"></div>
          <div className="app-noise" aria-hidden="true"></div>
          <div className="app-shell">
            <Header />
            <main className="app-main">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/leagues" element={
                  <ProtectedRoute>
                    <LeagueDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/draft" element={
                  <ProtectedRoute>
                    <MockDraft />
                  </ProtectedRoute>
                } />

                <Route path="/tournament" element={
                  <ProtectedRoute>
                    <TournamentView />
                  </ProtectedRoute>
                } />

                <Route path="/match-center/:id" element={
                  <ProtectedRoute>
                    <MatchCenter />
                  </ProtectedRoute>
                } />

                <Route path="/leagues/:id" element={
                  <ProtectedRoute>
                    <LeagueDetails />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/create-team" element={
                  <ProtectedRoute>
                    <TeamBuilder />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
          <ChatWidget />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
