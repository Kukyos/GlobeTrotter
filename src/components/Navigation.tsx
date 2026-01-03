import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Search } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user && !['/login', '/register'].includes(location.pathname)) return null;
  if (!user) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-auto">
      <div 
        className={`pill-nav-transition glass border border-white/20 rounded-full overflow-hidden flex items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
          isExpanded ? 'px-6 py-3 gap-6' : 'p-2'
        }`}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-100'}`}
        >
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg">
            GT
          </div>
          {isExpanded && <span className="font-heading font-bold text-lg glow-text">GlobeTrotter</span>}
        </button>

        {isExpanded && (
          <div className="flex items-center gap-6 border-l border-white/10 pl-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/my-trips" 
              className={`text-sm font-medium transition-colors ${location.pathname === '/my-trips' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              Trips
            </Link>
            
            {/* Search Button - Will trigger overlay for Member C */}
            <button
              className="text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-2"
              onClick={() => {
                // TODO: Member C - Open search overlay with 0.8 opacity
                console.log('Search clicked - Member C to implement overlay');
              }}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <Link 
              to="/profile" 
              className={`text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              Profile
            </Link>
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'text-white' : 'text-white/50 hover:text-white'}`}
              >
                Admin
              </Link>
            )}
            <button
              onClick={onLogout}
              className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      {!isExpanded && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] uppercase tracking-widest text-white/20 animate-subtle-glow whitespace-nowrap">
          Click to expand
        </div>
      )}
    </div>
  );
};

export default Navigation;
