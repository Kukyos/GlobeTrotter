import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, Plus, X, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types';
import { autocompletePlaces, isPlacesApiConfigured } from '@/services/placesService';
import { searchCities, createTrip } from '@/services/supabaseService';
import DatePicker from '@/components/DatePicker';

interface CreateTripProps {
  userId: string;
}

interface CitySearchResult {
  placeId: string;
  name: string;
  country: string;
  description: string;
}

const CreateTrip: React.FC<CreateTripProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Default start date to today
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: today,
    endDate: '',
    description: '',
    destination: searchParams.get('destination') || ''
  });
  
  const [citySuggestions, setCitySuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // If destination came from URL, auto-select it
  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest) {
      setSelectedCity({
        placeId: 'url-param',
        name: dest,
        country: '',
        description: dest
      });
    }
  }, [searchParams]);

  // Handle destination search with debounce
  const handleDestinationSearch = async (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setSearchError(null);
    
    if (value.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      
      try {
        // Try Places API autocomplete first
        const { suggestions, error } = await autocompletePlaces(value, { types: ['cities'] });
        
        if (suggestions.length > 0) {
          setCitySuggestions(suggestions.map(s => ({
            placeId: s.placeId,
            name: s.mainText,
            country: s.secondaryText,
            description: s.description
          })));
          setShowSuggestions(true);
        } else {
          // Fallback to Supabase cities
          const { cities, error: dbError } = await searchCities(value);
          if (cities.length > 0) {
            setCitySuggestions(cities.map((city: any) => ({
              placeId: city.id,
              name: city.name,
              country: city.country,
              description: `${city.name}, ${city.country}`
            })));
            setShowSuggestions(true);
          } else if (!isPlacesApiConfigured()) {
            setSearchError('No cities found. Try a different search term.');
          }
        }
      } catch (error: any) {
        console.error('Search error:', error);
        // Try Supabase fallback
        try {
          const { cities } = await searchCities(value);
          if (cities.length > 0) {
            setCitySuggestions(cities.map((city: any) => ({
              placeId: city.id,
              name: city.name,
              country: city.country,
              description: `${city.name}, ${city.country}`
            })));
            setShowSuggestions(true);
          } else {
            setSearchError('No results found. Try searching for major cities.');
          }
        } catch (fallbackError) {
          setSearchError('Search unavailable. Please try again later.');
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Select a city from suggestions
  const selectCity = (city: CitySearchResult) => {
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, destination: city.description }));
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  // Clear selected city
  const clearCity = () => {
    setSelectedCity(null);
    setFormData(prev => ({ ...prev, destination: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!selectedCity) {
      setSubmitError('Please select a destination from the suggestions');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setSubmitError('Please select travel dates');
      return;
    }

    setLoading(true);
    try {
      // Create the trip via Supabase
      const { trip, error } = await createTrip({
        user_id: userId,
        name: formData.name || `Trip to ${selectedCity.name}`,
        description: formData.description || null,
        start_date: formData.startDate,
        end_date: formData.endDate,
        destination: selectedCity.description,
        cover_photo: null,
        total_budget: 0,
        status: 'draft',
        is_public: false
      });

      if (error) {
        throw new Error(error);
      }
      
      if (trip) {
        // Navigate to itinerary builder
        navigate(`/itinerary/${trip.id}`);
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      setSubmitError(error.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold glow-text tracking-tight">
          Plan a New Trip
        </h1>
        <p className="text-white/50 mt-3 text-lg">
          Start your adventure by setting up the basics
        </p>
      </div>

      {/* Submit Error Alert */}
      {submitError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{submitError}</p>
          <button 
            type="button"
            onClick={() => setSubmitError(null)}
            className="ml-auto text-red-400/50 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Trip Form */}
      <form onSubmit={handleSubmit} className="card space-y-8">
        {/* Trip Name */}
        <div className="space-y-2">
          <label className="input-label flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Trip Name
          </label>
          <input
            name="name"
            required
            placeholder="My Paris Adventure"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
          <p className="text-xs text-white/30">Give your trip a memorable name</p>
        </div>

        {/* Destination Search */}
        <div className="space-y-2">
          <label className="input-label flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Select a Place
            {!isPlacesApiConfigured() && (
              <span className="text-xs text-yellow-500/70 font-normal">(Limited to cached cities)</span>
            )}
          </label>
          <div className="relative">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input
                name="destination"
                required
                placeholder="Search cities... (e.g., Paris, Tokyo, New York)"
                value={formData.destination}
                onChange={(e) => handleDestinationSearch(e.target.value)}
                onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                className={`input-field pl-12 pr-10 ${selectedCity ? 'border-green-500/50' : ''}`}
                autoComplete="off"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 animate-spin" />
              )}
              {selectedCity && !isSearching && (
                <button
                  type="button"
                  onClick={clearCity}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Error */}
            {searchError && (
              <div className="mt-2 flex items-center gap-2 text-yellow-500/80 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Selected City Indicator */}
            {selectedCity && (
              <div className="mt-2 flex items-center gap-2 text-green-500/80 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Selected: {selectedCity.description}</span>
              </div>
            )}

            {/* Dropdown suggestions */}
            {showSuggestions && citySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-20 shadow-2xl max-h-[300px] overflow-y-auto">
                {citySuggestions.map((city, index) => (
                  <button
                    key={`${city.placeId}-${index}`}
                    type="button"
                    className="w-full px-5 py-4 text-left hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                    onClick={() => selectCity(city)}
                  >
                    <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-white/40">{city.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-20 p-4 text-center text-white/50 text-sm">
                Searching...
              </div>
            )}
          </div>
          <p className="text-xs text-white/30">
            Type to search for cities using Google Places autocomplete
          </p>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <DatePicker
              value={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              minDate={today}
              placeholder="Select start date"
            />
          </div>
          
          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <DatePicker
              value={formData.endDate}
              onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
              minDate={formData.startDate || today}
              placeholder="Select end date"
            />
          </div>
        </div>

        {/* Trip Description */}
        <div className="space-y-2">
          <label className="input-label">Trip Description (Optional)</label>
          <textarea
            name="description"
            placeholder="What are you planning? Any special occasions or goals for this trip?"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedCity}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Trip
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="card border-white/5">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Tips for Planning
        </h3>
        <ul className="space-y-2 text-sm text-white/60">
          <li>• Start with flexible dates to find the best deals</li>
          <li>• Consider weather and local events at your destination</li>
          <li>• Book accommodations early for popular destinations</li>
          <li>• Leave room in your itinerary for spontaneous adventures</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateTrip;
