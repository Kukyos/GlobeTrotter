import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({});

/**
 * Google Places Autocomplete Service
 * Provides real-time city search using Google Places API
 */

/**
 * Autocomplete city search using Google Places API
 * @param {string} input - Search query
 * @returns {Promise<Array>} Array of city suggestions
 */
export async function autocompleteCities(input) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Use the Place Autocomplete API with city/region bias
    const response = await client.placeAutocomplete({
      params: {
        input: input,
        key: apiKey,
        types: '(cities)', // Restrict to cities
        language: 'en',
      },
      timeout: 3000, // 3 second timeout
    });

    if (response.data.status === 'OK') {
      // Transform the results to our format
      const suggestions = response.data.predictions.map(prediction => {
        // Parse the description to extract city and country
        const parts = prediction.description.split(', ');
        const city = parts[0];
        const country = parts[parts.length - 1];
        
        return {
          placeId: prediction.place_id,
          name: city,
          country: country,
          description: prediction.description,
          types: prediction.types
        };
      });

      return suggestions;
    } else if (response.data.status === 'ZERO_RESULTS') {
      return [];
    } else {
      console.error('Google Places API error:', response.data.status, response.data.error_message);
      throw new Error(`Google Places API error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error in autocompleteCities:', error.message);
    throw error;
  }
}

/**
 * Get detailed place information by place ID
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Detailed place information
 */
export async function getPlaceDetails(placeId) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'address_components',
          'photos',
          'types'
        ],
      },
      timeout: 3000,
    });

    if (response.data.status === 'OK') {
      const place = response.data.result;
      
      // Extract city and country from address components
      let city = '';
      let country = '';
      let continent = '';
      
      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        }
      }

      return {
        placeId: place.place_id,
        name: city || place.name,
        country: country,
        address: place.formatted_address,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })),
        types: place.types
      };
    } else {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error in getPlaceDetails:', error.message);
    throw error;
  }
}

/**
 * Get photo URL from photo reference
 * @param {string} photoReference - Google photo reference
 * @param {number} maxWidth - Maximum width of the photo
 * @returns {string} Photo URL
 */
export function getPhotoUrl(photoReference, maxWidth = 400) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
}
