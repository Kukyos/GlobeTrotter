import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Search, X, LogOut, MapPin, Loader2, Calendar, UserCircle } from 'lucide-react';
import { autocompletePlaces, isPlacesApiConfigured } from '../services/placesService';
import { searchCities } from '../services/supabaseService';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const activateSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const deactivateSearch = () => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle search with Places API or Supabase fallback
  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          // Try Places API first, falls back to Supabase automatically
          const { suggestions } = await autocompletePlaces(searchQuery, { types: ['cities'] });
          setSearchResults(suggestions.map(s => ({
            id: s.placeId,
            name: s.mainText,
            country: s.secondaryText,
            description: s.description
          })));
        } catch (err) {
          // Fallback to direct Supabase search
          const { cities } = await searchCities(searchQuery);
          setSearchResults(cities);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchActive) {
        deactivateSearch();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [searchActive]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchActive && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        deactivateSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchActive]);

  if (!user) return null;

  return (
    <>
      {/* Search Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 z-[80] ${
          searchActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={deactivateSearch}
      />

      {/* Navigation Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-down">
        <div className="glass border border-white/20 rounded-2xl px-4 py-2.5 flex items-center gap-4 shadow-2xl shadow-black/50">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
              GT
            </div>
            <span className="font-heading font-bold text-sm hidden sm:block text-white/90 group-hover:text-white transition-colors">
              GlobeTrotter
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link 
              to="/dashboard" 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/dashboard' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/my-trips" 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/my-trips' || location.pathname.startsWith('/itinerary')
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Trips
            </Link>
            <Link 
              to="/calendar" 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === '/calendar'
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* Search */}
          <div ref={searchContainerRef} className="relative">
            <button
              onClick={activateSearch}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                searchActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:block">Search</span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Link 
              to="/profile"
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                location.pathname === '/profile'
                  ? 'bg-white text-black ring-2 ring-white/50'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105'
              }`}
              title="Profile settings"
            >
              {user.name?.charAt(0).toUpperCase() || user.photoUrl || user.avatar ? (
                user.photoUrl || user.avatar ? (
                  <img 
                    src={user.photoUrl || user.avatar} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )
              ) : (
                <UserCircle className="w-5 h-5" />
              )}
            </Link>
            <button
              onClick={onLogout}
              className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchActive && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] w-full max-w-2xl px-4 animate-fade-in">
          <div className="glass border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            {/* Search Input */}
            <div className="relative p-4 border-b border-white/10">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities, destinations..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="px-4 py-3 flex gap-2 border-b border-white/10 overflow-x-auto">
              {['All', 'Cities', 'Attractions'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedFilter === filter
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
              {!isPlacesApiConfigured() && (
                <span className="px-3 py-1.5 text-xs text-white/30">
                  (Using cached cities)
                </span>
              )}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                </div>
              ) : searchQuery.length > 1 ? (
                searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          navigate(`/create-trip?destination=${encodeURIComponent(result.name || result.description)}`);
                          deactivateSearch();
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all group text-left"
                      >
                        {result.image_url ? (
                          <img 
                            src={result.image_url} 
                            alt={result.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white group-hover:text-white/90">
                            {result.name}
                          </h4>
                          <p className="text-sm text-white/50 truncate">
                            {result.country || result.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-white/50">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-white/40">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Start typing to search destinations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
