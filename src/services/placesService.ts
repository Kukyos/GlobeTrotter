/**
 * Google Places API Service
 * 
 * Provides place search, autocomplete, and details functionality
 * with Supabase fallback for cities when API is unavailable
 */

import { searchCities } from './supabaseService';

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = 'https://places.googleapis.com/v1';

// Types
export interface Place {
  id: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  photoUrl?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean;
  websiteUri?: string;
  nationalPhoneNumber?: string;
}

export interface PlaceSearchResult {
  places: Place[];
  error: string | null;
}

export interface AutocompleteResult {
  suggestions: Array<{
    placeId: string;
    mainText: string;
    secondaryText: string;
    description: string;
  }>;
  error: string | null;
}

// Check if Places API is configured
export function isPlacesApiConfigured(): boolean {
  return Boolean(PLACES_API_KEY && PLACES_API_KEY.length > 10);
}

// Track if we've already logged the API error
let placesApiErrorLogged = false;

/**
 * Search for places using Google Places API (New)
 * Falls back to Supabase cities if API unavailable
 */
export async function searchPlaces(
  query: string,
  options: {
    types?: string[];
    locationBias?: { lat: number; lng: number; radius: number };
    maxResults?: number;
  } = {}
): Promise<PlaceSearchResult> {
  if (!query || query.length < 2) {
    return { places: [], error: null };
  }

  // Try Google Places API first
  if (isPlacesApiConfigured()) {
    try {
      const response = await fetch(`${PLACES_BASE_URL}/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.photos,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.websiteUri,places.nationalPhoneNumber'
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: options.maxResults || 10,
          ...(options.types?.length && { includedType: options.types[0] }),
          ...(options.locationBias && {
            locationBias: {
              circle: {
                center: { latitude: options.locationBias.lat, longitude: options.locationBias.lng },
                radius: options.locationBias.radius
              }
            }
          })
        })
      });

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();
      
      const places: Place[] = (data.places || []).map((p: any) => ({
        id: p.id,
        name: p.displayName?.text || '',
        formattedAddress: p.formattedAddress || '',
        location: {
          lat: p.location?.latitude || 0,
          lng: p.location?.longitude || 0
        },
        types: p.types || [],
        photoUrl: p.photos?.[0]?.name ? getPhotoUrl(p.photos[0].name) : undefined,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        priceLevel: p.priceLevel,
        openNow: p.currentOpeningHours?.openNow,
        websiteUri: p.websiteUri,
        nationalPhoneNumber: p.nationalPhoneNumber
      }));

      return { places, error: null };
    } catch (err: any) {
      console.warn('Places API failed, falling back to Supabase:', err.message);
    }
  }

  // Fallback to Supabase cities
  return fallbackToSupabase(query);
}

/**
 * Autocomplete places/cities
 */
export async function autocompletePlaces(
  input: string,
  options: {
    types?: ('cities' | 'address' | 'establishment' | 'geocode')[];
    sessionToken?: string;
  } = {}
): Promise<AutocompleteResult> {
  if (!input || input.length < 2) {
    return { suggestions: [], error: null };
  }

  // Try Google Places Autocomplete
  if (isPlacesApiConfigured()) {
    try {
      const response = await fetch(`${PLACES_BASE_URL}/places:autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': PLACES_API_KEY,
        },
        body: JSON.stringify({
          input,
          includedPrimaryTypes: options.types?.includes('cities') 
            ? ['locality', 'administrative_area_level_1', 'country']
            : options.types || ['locality', 'establishment'],
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (!placesApiErrorLogged) {
          console.warn(`Places API returned ${response.status}: ${errorText}`);
          console.warn('Using Supabase cities fallback. To fix: Enable "Places API (New)" in Google Cloud Console and ensure billing is enabled.');
          placesApiErrorLogged = true;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const suggestions = (data.suggestions || []).map((s: any) => ({
        placeId: s.placePrediction?.placeId || '',
        mainText: s.placePrediction?.structuredFormat?.mainText?.text || '',
        secondaryText: s.placePrediction?.structuredFormat?.secondaryText?.text || '',
        description: s.placePrediction?.text?.text || ''
      }));

      return { suggestions, error: null };
    } catch (err: any) {
      // Silent fallback - already logged above
    }
  }

  // Fallback to Supabase cities
  const { cities } = await searchCities(input);
  return {
    suggestions: cities.map(c => ({
      placeId: c.id,
      mainText: c.name,
      secondaryText: c.country,
      description: `${c.name}, ${c.country}`
    })),
    error: null
  };
}

/**
 * Get place details by ID
 */
export async function getPlaceDetails(placeId: string): Promise<{ place: Place | null; error: string | null }> {
  if (!isPlacesApiConfigured()) {
    return { place: null, error: 'Places API not configured' };
  }

  try {
    const response = await fetch(`${PLACES_BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,types,photos,rating,userRatingCount,priceLevel,currentOpeningHours,websiteUri,nationalPhoneNumber,editorialSummary'
      }
    });

    if (!response.ok) {
      throw new Error(`Place details error: ${response.status}`);
    }

    const p = await response.json();
    
    return {
      place: {
        id: p.id,
        name: p.displayName?.text || '',
        formattedAddress: p.formattedAddress || '',
        location: {
          lat: p.location?.latitude || 0,
          lng: p.location?.longitude || 0
        },
        types: p.types || [],
        photoUrl: p.photos?.[0]?.name ? getPhotoUrl(p.photos[0].name) : undefined,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        priceLevel: p.priceLevel,
        openNow: p.currentOpeningHours?.openNow,
        websiteUri: p.websiteUri,
        nationalPhoneNumber: p.nationalPhoneNumber
      },
      error: null
    };
  } catch (err: any) {
    return { place: null, error: err.message };
  }
}

/**
 * Search for nearby places (restaurants, attractions, etc.)
 */
export async function searchNearby(
  location: { lat: number; lng: number },
  options: {
    types?: string[];
    radius?: number;
    maxResults?: number;
  } = {}
): Promise<PlaceSearchResult> {
  if (!isPlacesApiConfigured()) {
    return { places: [], error: 'Places API not configured' };
  }

  try {
    const response = await fetch(`${PLACES_BASE_URL}/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.photos,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours'
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude: location.lat, longitude: location.lng },
            radius: options.radius || 5000
          }
        },
        includedTypes: options.types || ['restaurant', 'tourist_attraction', 'museum'],
        maxResultCount: options.maxResults || 20
      })
    });

    if (!response.ok) {
      throw new Error(`Nearby search error: ${response.status}`);
    }

    const data = await response.json();
    
    const places: Place[] = (data.places || []).map((p: any) => ({
      id: p.id,
      name: p.displayName?.text || '',
      formattedAddress: p.formattedAddress || '',
      location: {
        lat: p.location?.latitude || 0,
        lng: p.location?.longitude || 0
      },
      types: p.types || [],
      photoUrl: p.photos?.[0]?.name ? getPhotoUrl(p.photos[0].name) : undefined,
      rating: p.rating,
      userRatingCount: p.userRatingCount,
      priceLevel: p.priceLevel,
      openNow: p.currentOpeningHours?.openNow
    }));

    return { places, error: null };
  } catch (err: any) {
    return { places: [], error: err.message };
  }
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(photoName: string, maxWidth: number = 400): string {
  if (!isPlacesApiConfigured()) return '';
  return `${PLACES_BASE_URL}/${photoName}/media?maxWidthPx=${maxWidth}&key=${PLACES_API_KEY}`;
}

/**
 * Fallback to Supabase cities when Places API unavailable
 */
async function fallbackToSupabase(query: string): Promise<PlaceSearchResult> {
  const { cities, error } = await searchCities(query);
  
  const places: Place[] = cities.map(c => ({
    id: c.id,
    name: c.name,
    formattedAddress: `${c.name}, ${c.country}`,
    location: {
      lat: c.latitude || 0,
      lng: c.longitude || 0
    },
    types: ['locality'],
    photoUrl: c.image_url
  }));

  return { places, error };
}

/**
 * Popular place types for search filters
 */
export const PLACE_TYPES = {
  FOOD: ['restaurant', 'cafe', 'bar', 'bakery', 'meal_takeaway'],
  ATTRACTIONS: ['tourist_attraction', 'museum', 'art_gallery', 'amusement_park', 'zoo'],
  NATURE: ['park', 'natural_feature', 'campground', 'hiking_area'],
  SHOPPING: ['shopping_mall', 'store', 'market'],
  NIGHTLIFE: ['night_club', 'bar', 'casino'],
  LODGING: ['hotel', 'lodging', 'resort_hotel'],
  TRANSPORT: ['airport', 'train_station', 'bus_station', 'subway_station']
};
