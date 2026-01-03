import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const cities = [
  // Europe
  { name: 'Paris', country: 'France', continent: 'europe', latitude: 48.8566, longitude: 2.3522, costIndex: 4, popularity: 100 },
  { name: 'London', country: 'United Kingdom', continent: 'europe', latitude: 51.5074, longitude: -0.1278, costIndex: 5, popularity: 95 },
  { name: 'Rome', country: 'Italy', continent: 'europe', latitude: 41.9028, longitude: 12.4964, costIndex: 3, popularity: 90 },
  { name: 'Barcelona', country: 'Spain', continent: 'europe', latitude: 41.3851, longitude: 2.1734, costIndex: 3, popularity: 85 },
  { name: 'Amsterdam', country: 'Netherlands', continent: 'europe', latitude: 52.3676, longitude: 4.9041, costIndex: 4, popularity: 80 },
  { name: 'Prague', country: 'Czech Republic', continent: 'europe', latitude: 50.0755, longitude: 14.4378, costIndex: 2, popularity: 75 },
  { name: 'Vienna', country: 'Austria', continent: 'europe', latitude: 48.2082, longitude: 16.3738, costIndex: 3, popularity: 70 },
  { name: 'Berlin', country: 'Germany', continent: 'europe', latitude: 52.5200, longitude: 13.4050, costIndex: 3, popularity: 78 },
  { name: 'Lisbon', country: 'Portugal', continent: 'europe', latitude: 38.7223, longitude: -9.1393, costIndex: 2, popularity: 82 },
  { name: 'Athens', country: 'Greece', continent: 'europe', latitude: 37.9838, longitude: 23.7275, costIndex: 2, popularity: 68 },
  { name: 'Budapest', country: 'Hungary', continent: 'europe', latitude: 47.4979, longitude: 19.0402, costIndex: 2, popularity: 72 },
  { name: 'Dublin', country: 'Ireland', continent: 'europe', latitude: 53.3498, longitude: -6.2603, costIndex: 4, popularity: 65 },
  { name: 'Edinburgh', country: 'United Kingdom', continent: 'europe', latitude: 55.9533, longitude: -3.1883, costIndex: 4, popularity: 67 },
  { name: 'Venice', country: 'Italy', continent: 'europe', latitude: 45.4408, longitude: 12.3155, costIndex: 4, popularity: 88 },
  { name: 'Florence', country: 'Italy', continent: 'europe', latitude: 43.7696, longitude: 11.2558, costIndex: 3, popularity: 84 },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', continent: 'asia', latitude: 35.6762, longitude: 139.6503, costIndex: 4, popularity: 92 },
  { name: 'Bangkok', country: 'Thailand', continent: 'asia', latitude: 13.7563, longitude: 100.5018, costIndex: 2, popularity: 89 },
  { name: 'Singapore', country: 'Singapore', continent: 'asia', latitude: 1.3521, longitude: 103.8198, costIndex: 4, popularity: 87 },
  { name: 'Dubai', country: 'United Arab Emirates', continent: 'asia', latitude: 25.2048, longitude: 55.2708, costIndex: 4, popularity: 86 },
  { name: 'Hong Kong', country: 'China', continent: 'asia', latitude: 22.3193, longitude: 114.1694, costIndex: 4, popularity: 85 },
  { name: 'Seoul', country: 'South Korea', continent: 'asia', latitude: 37.5665, longitude: 126.9780, costIndex: 3, popularity: 83 },
  { name: 'Bali', country: 'Indonesia', continent: 'asia', latitude: -8.4095, longitude: 115.1889, costIndex: 2, popularity: 91 },
  { name: 'Kyoto', country: 'Japan', continent: 'asia', latitude: 35.0116, longitude: 135.7681, costIndex: 3, popularity: 86 },
  { name: 'Mumbai', country: 'India', continent: 'asia', latitude: 19.0760, longitude: 72.8777, costIndex: 1, popularity: 74 },
  { name: 'Delhi', country: 'India', continent: 'asia', latitude: 28.7041, longitude: 77.1025, costIndex: 1, popularity: 76 },
  { name: 'Shanghai', country: 'China', continent: 'asia', latitude: 31.2304, longitude: 121.4737, costIndex: 3, popularity: 80 },
  { name: 'Hanoi', country: 'Vietnam', continent: 'asia', latitude: 21.0285, longitude: 105.8542, costIndex: 1, popularity: 73 },
  
  // North America
  { name: 'New York', country: 'United States', continent: 'north_america', latitude: 40.7128, longitude: -74.0060, costIndex: 5, popularity: 98 },
  { name: 'Los Angeles', country: 'United States', continent: 'north_america', latitude: 34.0522, longitude: -118.2437, costIndex: 4, popularity: 88 },
  { name: 'San Francisco', country: 'United States', continent: 'north_america', latitude: 37.7749, longitude: -122.4194, costIndex: 5, popularity: 87 },
  { name: 'Las Vegas', country: 'United States', continent: 'north_america', latitude: 36.1699, longitude: -115.1398, costIndex: 3, popularity: 85 },
  { name: 'Miami', country: 'United States', continent: 'north_america', latitude: 25.7617, longitude: -80.1918, costIndex: 4, popularity: 83 },
  { name: 'Toronto', country: 'Canada', continent: 'north_america', latitude: 43.6532, longitude: -79.3832, costIndex: 4, popularity: 78 },
  { name: 'Vancouver', country: 'Canada', continent: 'north_america', latitude: 49.2827, longitude: -123.1207, costIndex: 4, popularity: 81 },
  { name: 'Mexico City', country: 'Mexico', continent: 'north_america', latitude: 19.4326, longitude: -99.1332, costIndex: 2, popularity: 77 },
  { name: 'Cancun', country: 'Mexico', continent: 'north_america', latitude: 21.1619, longitude: -86.8515, costIndex: 3, popularity: 84 },
  
  // South America
  { name: 'Rio de Janeiro', country: 'Brazil', continent: 'south_america', latitude: -22.9068, longitude: -43.1729, costIndex: 2, popularity: 82 },
  { name: 'Buenos Aires', country: 'Argentina', continent: 'south_america', latitude: -34.6037, longitude: -58.3816, costIndex: 2, popularity: 79 },
  { name: 'Lima', country: 'Peru', continent: 'south_america', latitude: -12.0464, longitude: -77.0428, costIndex: 2, popularity: 71 },
  { name: 'Bogota', country: 'Colombia', continent: 'south_america', latitude: 4.7110, longitude: -74.0721, costIndex: 2, popularity: 68 },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', continent: 'oceania', latitude: -33.8688, longitude: 151.2093, costIndex: 4, popularity: 89 },
  { name: 'Melbourne', country: 'Australia', continent: 'oceania', latitude: -37.8136, longitude: 144.9631, costIndex: 4, popularity: 82 },
  { name: 'Auckland', country: 'New Zealand', continent: 'oceania', latitude: -36.8485, longitude: 174.7633, costIndex: 3, popularity: 75 },
  
  // Africa
  { name: 'Cape Town', country: 'South Africa', continent: 'africa', latitude: -33.9249, longitude: 18.4241, costIndex: 2, popularity: 81 },
  { name: 'Marrakech', country: 'Morocco', continent: 'africa', latitude: 31.6295, longitude: -7.9811, costIndex: 2, popularity: 78 },
  { name: 'Cairo', country: 'Egypt', continent: 'africa', latitude: 30.0444, longitude: 31.2357, costIndex: 2, popularity: 74 },
];

async function seedCities() {
  let connection;
  try {
    console.log('Starting city seeding...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'globetrotter',
      port: parseInt(process.env.DB_PORT || '3306')
    });
    console.log('Connected to database');
    
    await connection.execute('DELETE FROM cities');
    console.log('Cleared existing cities');
    
    const insertQuery = 'INSERT INTO cities (id, name, country, continent, latitude, longitude, cost_index, popularity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    let count = 0;
    for (const city of cities) {
      const cityId = randomUUID();
      await connection.execute(insertQuery, [
        cityId, 
        city.name, 
        city.country, 
        city.continent, 
        city.latitude, 
        city.longitude,
        city.costIndex || 3,
        city.popularity || 50
      ]);
      console.log(`✓ ${city.name}, ${city.country}`);
      count++;
    }
    
    console.log(`\nSuccessfully seeded ${count} cities!`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedCities();
