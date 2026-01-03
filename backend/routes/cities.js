import express from 'express';
import { pool } from '../config/database.js';
import { getPhotosByCity, getRandomCityPhoto, triggerDownload } from '../services/unsplashService.js';
import { autocompleteCities, getPlaceDetails } from '../services/googlePlacesService.js';

const router = express.Router();

// GET /autocomplete - Google Places Autocomplete for city search
router.get('/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: [],
        source: 'none'
      });
    }

    try {
      // Try Google Places API first
      const suggestions = await autocompleteCities(query);
      
      return res.json({
        success: true,
        data: suggestions,
        source: 'google'
      });
    } catch (googleError) {
      console.error('Google Places API failed, falling back to database:', googleError.message);
      
      // Fallback to local database
      const [cities] = await pool.query(
        'SELECT * FROM cities WHERE name LIKE ? OR country LIKE ? ORDER BY popularity DESC, name ASC LIMIT 10',
        [`%${query}%`, `%${query}%`]
      );
      
      const fallbackSuggestions = cities.map(city => ({
        placeId: city.id,
        name: city.name,
        country: city.country,
        description: `${city.name}, ${city.country}`,
        source: 'database'
      }));
      
      return res.json({
        success: true,
        data: fallbackSuggestions,
        source: 'database_fallback'
      });
    }
  } catch (error) {
    console.error('Error in autocomplete endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching cities',
      error: error.message
    });
  }
});

// GET /place/:placeId - Get detailed place information from Google
router.get('/place/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const placeDetails = await getPlaceDetails(placeId);
    
    res.json({
      success: true,
      data: placeDetails
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching place details',
      error: error.message
    });
  }
});

// GET / - List all cities
router.get('/', async (req, res) => {
  try {
    const [cities] = await pool.query('SELECT * FROM cities ORDER BY name');
    
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
});

// GET /search - Search cities with optional photo integration
router.get('/search', async (req, res) => {
  try {
    const { query, continent, includePhotos } = req.query;
    
    let sql = 'SELECT * FROM cities WHERE 1=1';
    const params = [];
    
    if (query) {
      sql += ' AND (name LIKE ? OR country LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }
    
    if (continent) {
      sql += ' AND continent = ?';
      params.push(continent);
    }
    
    sql += ' ORDER BY name';
    
    const [cities] = await pool.query(sql, params);
    
    // If includePhotos is requested, fetch photos for each city
    if (includePhotos === 'true' && cities.length > 0) {
      const citiesWithPhotos = await Promise.all(
        cities.map(async (city) => {
          try {
            const photo = await getRandomCityPhoto(city.name);
            return { ...city, photo };
          } catch (error) {
            console.error(`Error fetching photo for ${city.name}:`, error);
            return { ...city, photo: null };
          }
        })
      );
      
      return res.json({
        success: true,
        data: citiesWithPhotos
      });
    }
    
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching cities',
      error: error.message
    });
  }
});

// GET /:id - Get city by ID with Unsplash photos
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [cities] = await pool.query('SELECT * FROM cities WHERE id = ?', [id]);
    
    if (cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    const city = cities[0];
    
    // Fetch photos from Unsplash
    try {
      const photos = await getPhotosByCity(city.name, 5);
      city.photos = photos;
    } catch (error) {
      console.error(`Error fetching photos for ${city.name}:`, error);
      city.photos = [];
    }
    
    res.json({
      success: true,
      data: city
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching city',
      error: error.message
    });
  }
});

export default router;
