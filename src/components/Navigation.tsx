  import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Search, X } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    setSearchHovered(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchActive) {
        deactivateSearch();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [searchActive]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchActive && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        deactivateSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchActive]);

  if (!user && !['/login', '/register'].includes(location.pathname)) return null;
  if (!user) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-[80] ${
          searchActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!searchActive}
      />

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-auto">
        <div 
          className={`pill-nav-transition glass border border-white/20 rounded-full overflow-visible flex items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 ${
            isExpanded ? 'px-6 py-3 gap-6' : 'p-2'
          }`}
        >
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg">
              GT
            </div>
            {isExpanded && <span className="font-heading font-bold text-lg glow-text">GlobeTrotter</span>}
          </button>

          {isExpanded && (
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <div className={`flex items-center gap-6 transition-opacity duration-500 ${searchActive ? 'opacity-50' : 'opacity-100'}`}>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                  Dashboard
                </Link>
                <Link to="/my-trips" className={`text-sm font-medium transition-colors ${location.pathname === '/my-trips' ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                  Trips
                </Link>
              </div>
            
              <div 
                ref={searchContainerRef}
                className="search-container-progressive relative"
                onMouseEnter={() => !searchActive && setSearchHovered(true)}
                onMouseLeave={() => !searchActive && setSearchHovered(false)}
              >
                <div 
                  className={`relative flex items-center transition-all duration-500 ease-out ${
                    searchActive ? 'w-[600px]' : searchHovered ? 'w-[450px]' : 'w-[140px]'
                  }`}
                >
                  {!searchActive && (
                    <button
                      onClick={activateSearch}
                      className={`absolute inset-0 flex items-center gap-2 px-4 text-sm font-medium transition-all duration-300 ${
                        searchHovered ? 'text-white/70 cursor-pointer' : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      <Search className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap transition-opacity duration-300">Search</span>
                    </button>
                  )}

                  <div 
                    className={`w-full transition-all duration-500 ${
                      searchActive ? 'opacity-100' : searchHovered ? 'opacity-60 pointer-events-none' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cities, trips, activities..."
                        onClick={activateSearch}
                        className={`w-full bg-white/10 border border-white/30 rounded-full pl-11 pr-12 py-2.5 text-sm text-white placeholder-white/50 transition-all duration-300 ${
                          searchActive ? 'focus:outline-none focus:border-white/60 focus:bg-white/15 cursor-text' : 'cursor-pointer'
                        }`}
                      />
                      {searchQuery && searchActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery('');
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-6 transition-opacity duration-500 ${searchActive ? 'opacity-50' : 'opacity-100'}`}>
                <Link to="/profile" className={`text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={`text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                    Admin
                  </Link>
                )}
                <button onClick={onLogout} className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        
        {!isExpanded && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] uppercase tracking-widest text-white/20 animate-subtle-glow whitespace-nowrap">
            Click to expand
          </div>
        )}
      </div>

      {searchActive && searchQuery && (
        <div className="fixed top-[120px] left-0 right-0 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-w-[1400px] mx-auto px-8 mb-6">
            <div className="flex items-center gap-3 justify-center">
              {['All', 'Cities', 'Trips', 'Activities'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedFilter === filter
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-8 pb-20">
            <div className="masonry-grid">
              {[
                { type: 'City', title: 'Tokyo, Japan', desc: 'Bustling metropolis with ancient temples', img: true },
                { type: 'Trip', title: 'Summer Adventure 2026', desc: '14 days across Southeast Asia', img: false },
                { type: 'Activity', title: 'Temple Visit', desc: 'Historic Senso-ji Temple tour', img: true },
                { type: 'City', title: 'Paris, France', desc: 'The city of lights and romance', img: true },
                { type: 'Trip', title: 'European Backpacking', desc: '30 days, 8 countries', img: false },
                { type: 'Activity', title: 'Mountain Hiking', desc: 'Swiss Alps hiking experience', img: true },
                { type: 'City', title: 'New York, USA', desc: 'The city that never sleeps', img: true },
                { type: 'Activity', title: 'Scuba Diving', desc: 'Great Barrier Reef adventure', img: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="masonry-item glass border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {item.img && (
                    <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-xs px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        {item.type}
                      </div>
                    </div>
                  )}
                  <div className={`p-4 ${!item.img && 'pt-6'}`}>
                    {!item.img && (
                      <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2">{item.type}</div>
                    )}
                    <h3 className="font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
