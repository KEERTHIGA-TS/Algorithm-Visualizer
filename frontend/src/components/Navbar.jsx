// frontend/src/components/Navbar.jsx - PROFESSIONAL NAVBAR WITH USER STATS
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useHistoryStore } from '../store/historyStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { stats } = useHistoryStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Algorithm<span className="text-purple-400">Visualizer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <span className="text-sm text-gray-400">
                  {stats.total || 0} visualizations
                </span>
                <button onClick={handleLogout} className="btn-secondary px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary px-4 py-2">Login</Link>
                <Link to="/register" className="btn ml-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link to="/" className="block nav-link">Home</Link>
            <Link to="/categories" className="block nav-link">Categories</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block nav-link">Dashboard</Link>
                <span className="block text-sm text-gray-400 px-2">
                  {stats.total || 0} visualizations
                </span>
                <button onClick={handleLogout} className="block w-full text-left nav-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block nav-link">Login</Link>
                <Link to="/register" className="block btn w-full text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
