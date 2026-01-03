// Pexels API integration for city images
const PEXELS_API_KEY = 'DNgCQsyO13JHvKGl9iexaSzbwGnxpZ4n6KsCMNZ7MyVl0QtvU5kr6bxL';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export async function getPhotosByCity(cityName, perPage = 5) {
  try {
    const query = encodeURIComponent(`${cityName} city landmark`);
    const url = `${PEXELS_API_URL}/search?query=${query}&per_page=${perPage}&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    const images = data.photos.map(photo => ({
      id: photo.id,
      urls: {
        regular: photo.src.large,
        thumb: photo.src.medium
      },
      user: {
        name: photo.photographer,
        links: { html: photo.photographer_url }
      },
      description: `${cityName} photo by ${photo.photographer}`
    }));
    
    console.log(`Fetched ${images.length} Pexels photos for "${cityName}"`);
    return images;
    
  } catch (error) {
    console.error(`Error fetching Pexels photos for ${cityName}:`, error.message);
    return [];
  }
}

export async function getRandomCityPhoto(cityName = 'city') {
  try {
    const query = encodeURIComponent(`${cityName} travel`);
    const url = `${PEXELS_API_URL}/search?query=${query}&per_page=1&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return {
        id: photo.id,
        urls: {
          regular: photo.src.large,
          thumb: photo.src.medium
        },
        user: {
          name: photo.photographer,
          links: { html: photo.photographer_url }
        }
      };
    }
    
    return null;
    
  } catch (error) {
    console.error(`Error fetching random Pexels photo for ${cityName}:`, error.message);
    return null;
  }
}

export function triggerDownload() {
  // Not required for Pexels API
  return Promise.resolve();
}

export default {
  getPhotosByCity,
  getRandomCityPhoto,
  triggerDownload
};
