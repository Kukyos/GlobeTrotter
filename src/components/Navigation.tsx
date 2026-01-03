import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Search, X, LogOut, MapPin, Loader2, Calendar, UserCircle, DollarSign, Users, Sparkles } from 'lucide-react';
import { autocompletePlaces, isPlacesApiConfigured } from '../services/placesService';
import { searchCities, getAllCities } from '../services/supabaseService';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

interface CityResult {
  id: string;
  name: string;
  country: string;
  continent?: string;
  image_url?: string;
  cost_index?: number;
  popularity?: number;
  description?: string;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [allCities, setAllCities] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load all cities when search opens
  useEffect(() => {
    if (searchActive && allCities.length === 0) {
      loadAllCities();
    }
  }, [searchActive]);

  const loadAllCities = async () => {
    setIsSearching(true);
    try {
      const { cities } = await getAllCities();
      setAllCities(cities);
      if (!searchQuery) {
        setSearchResults(cities);
      }
    } catch (err) {
      console.error('Failed to load cities:', err);
    }
    setIsSearching(false);
  };

  // Export function to open search from outside
  const openSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // Expose openSearch globally for Dashboard to use
  useEffect(() => {
    (window as any).openGlobeTrotterSearch = openSearch;
    return () => {
      delete (window as any).openGlobeTrotterSearch;
    };
  }, []);

  const activateSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const deactivateSearch = () => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults(allCities);
    setSelectedFilter('All');
  };

  // Handle search with Places API or Supabase fallback
  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const { suggestions } = await autocompletePlaces(searchQuery, { types: ['cities'] });
          if (suggestions.length > 0) {
            setSearchResults(suggestions.map(s => ({
              id: s.placeId,
              name: s.mainText,
              country: s.secondaryText,
              description: s.description
            })));
          } else {
            const { cities } = await searchCities(searchQuery);
            setSearchResults(cities);
          }
        } catch (err) {
          const { cities } = await searchCities(searchQuery);
          setSearchResults(cities);
        }
        setIsSearching(false);
      } else if (searchQuery.trim().length === 0) {
        setSearchResults(allCities);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery, allCities]);

  // Filter results by category
  const filteredResults = searchResults.filter(city => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Budget' && city.cost_index && city.cost_index <= 2) return true;
    if (selectedFilter === 'Moderate' && city.cost_index && city.cost_index === 3) return true;
    if (selectedFilter === 'Luxury' && city.cost_index && city.cost_index >= 4) return true;
    if (selectedFilter === 'Popular' && city.popularity && city.popularity >= 85) return true;
    if (selectedFilter === 'Hidden Gems' && city.popularity && city.popularity < 80) return true;
    return selectedFilter === 'All';
  });

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

  // Lock body scroll when search is active
  useEffect(() => {
    if (searchActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchActive]);

  const handleCityClick = (city: CityResult) => {
    navigate(`/create-trip?destination=${encodeURIComponent(city.name)}`);
    deactivateSearch();
  };

  const getCostLabel = (index?: number) => {
    if (!index) return '';
    if (index <= 2) return 'Budget';
    if (index === 3) return 'Moderate';
    return 'Luxury';
  };

  const getCostSymbol = (index?: number) => {
    if (!index) return '$';
    return '$'.repeat(Math.min(index, 5));
  };

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

          <div className="w-px h-6 bg-white/10" />

          {/* Search */}
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

          <div className="w-px h-6 bg-white/10" />

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Link 
              to="/profile"
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all overflow-hidden ${
                location.pathname === '/profile'
                  ? 'ring-2 ring-white/50'
                  : 'hover:scale-105'
              }`}
              title="Profile settings"
            >
              {user.photoUrl || user.avatar ? (
                <img 
                  src={user.photoUrl || user.avatar} 
                  alt={user.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
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

      {/* Full-Screen Search Modal with Pinterest Layout */}
      {searchActive && (
        <div className="fixed inset-0 z-[90] pt-24 overflow-hidden">
          {/* Search Header */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 pb-4">
            <div className="max-w-6xl mx-auto px-6">
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities, destinations..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl pl-14 pr-14 py-4 text-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={deactivateSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['All', 'Popular', 'Budget', 'Moderate', 'Luxury', 'Hidden Gems'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedFilter === filter
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                {!isPlacesApiConfigured() && (
                  <span className="px-4 py-2 text-xs text-white/30 flex items-center">
                    (Showing cached cities)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Results - Pinterest Masonry Grid */}
          <div className="h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
            <div className="max-w-6xl mx-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {filteredResults.map((city, idx) => (
                    <div
                      key={city.id || idx}
                      className="break-inside-avoid mb-4"
                      onMouseEnter={() => setHoveredCity(city.id)}
                      onMouseLeave={() => setHoveredCity(null)}
                    >
                      <div
                        onClick={() => handleCityClick(city)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border border-white/10 hover:border-white/30 group ${
                          hoveredCity === city.id ? 'ring-2 ring-white/30 shadow-2xl shadow-white/10' : ''
                        }`}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        {/* City Image */}
                        {city.image_url ? (
                          <div className={`relative transition-all duration-500 ${
                            hoveredCity === city.id ? 'aspect-[3/4]' : 'aspect-[4/5]'
                          }`}>
                            <img 
                              src={city.image_url} 
                              alt={city.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            {/* Basic Info (Always Visible) */}
                            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                              hoveredCity === city.id ? 'opacity-0' : 'opacity-100'
                            }`}>
                              <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                                {city.continent || 'Destination'}
                              </span>
                              <h3 className="text-lg font-bold text-white">{city.name}</h3>
                              <p className="text-sm text-white/60">{city.country}</p>
                            </div>

                            {/* Expanded Info on Hover */}
                            <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm p-5 flex flex-col justify-between transition-all duration-300 ${
                              hoveredCity === city.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}>
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">
                                  {city.continent || 'Destination'}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                                <p className="text-sm text-white/60 mb-4">{city.country}</p>
                                
                                {/* Details */}
                                <div className="space-y-3">
                                  {city.cost_index && (
                                    <div className="flex items-center gap-3">
                                      <DollarSign className="w-4 h-4 text-white/40" />
                                      <div>
                                        <p className="text-xs text-white/50">Price Range</p>
                                        <p className="text-sm font-medium text-white">
                                          {getCostSymbol(city.cost_index)} · {getCostLabel(city.cost_index)}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {city.popularity && (
                                    <div className="flex items-center gap-3">
                                      <Users className="w-4 h-4 text-white/40" />
                                      <div>
                                        <p className="text-xs text-white/50">Popularity</p>
                                        <p className="text-sm font-medium text-white">
                                          {city.popularity >= 90 ? 'Very Popular' : 
                                           city.popularity >= 80 ? 'Popular' : 
                                           city.popularity >= 70 ? 'Growing' : 'Hidden Gem'}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-white/40" />
                                    <div>
                                      <p className="text-xs text-white/50">Perfect for</p>
                                      <p className="text-sm font-medium text-white">
                                        {city.cost_index && city.cost_index >= 4 ? 'Luxury Travel' :
                                         city.cost_index && city.cost_index <= 2 ? 'Budget Adventure' :
                                         'All Travelers'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button className="mt-4 w-full py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors">
                                Plan Trip to {city.name}
                              </button>
                            </div>
                          </div>
                        ) : (
                          // No image fallback
                          <div className="p-5 bg-gradient-to-br from-white/10 to-white/5 min-h-[200px] flex flex-col justify-end">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                              <MapPin className="w-6 h-6 text-white/50" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                              {city.continent || 'Destination'}
                            </span>
                            <h3 className="text-lg font-bold text-white">{city.name}</h3>
                            <p className="text-sm text-white/60">{city.country}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <MapPin className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-white/50 text-lg">
                    {searchQuery ? `No destinations found for "${searchQuery}"` : 'No destinations available'}
                  </p>
                  <p className="text-white/30 text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Navigation;
