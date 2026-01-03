import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, Plus, X } from 'lucide-react';
import { Trip } from '@/types';
import api from '@/services/api';

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
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    destination: ''
  });
  
  const [citySuggestions, setCitySuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle destination search with debounce
  const handleDestinationSearch = async (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    
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
      try {
        // Call the autocomplete API
        const response = await api.get(`/cities/autocomplete?query=${encodeURIComponent(value)}`);
        if (response.data.success) {
          setCitySuggestions(response.data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error searching cities:', error);
        // Fallback to local database search
        try {
          const fallbackResponse = await api.get(`/cities/search?query=${encodeURIComponent(value)}`);
          if (fallbackResponse.data.success) {
            const cities = fallbackResponse.data.data.map((city: any) => ({
              placeId: city.id,
              name: city.name,
              country: city.country,
              description: `${city.name}, ${city.country}`
            }));
            setCitySuggestions(cities);
            setShowSuggestions(true);
          }
        } catch (fallbackError) {
          console.error('Fallback search also failed:', fallbackError);
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
    
    if (!selectedCity) {
      alert('Please select a destination from the suggestions');
      return;
    }

    setLoading(true);
    try {
      // Create the trip via API
      const tripData = {
        name: formData.name || `Trip to ${selectedCity.name}`,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        destination: selectedCity.description,
        cityId: selectedCity.placeId
      };

      const response = await api.post('/trips', tripData);
      
      if (response.data.success) {
        const newTrip = response.data.data;
        // Navigate to itinerary builder
        navigate(`/itinerary/${newTrip.id}`);
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      alert(error.response?.data?.message || 'Failed to create trip. Please try again.');
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
                className="input-field pl-12 pr-10"
                autoComplete="off"
              />
              {selectedCity && (
                <button
                  type="button"
                  onClick={clearCity}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

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
            <input
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <input
              name="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="input-field"
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
