-- ===========================================
-- GlobeTrotter - Cities & Activities SQL Setup
-- ===========================================
-- Run this in your Supabase SQL Editor to populate
-- the cities table with curated escapes and set up activities

-- ===========================================
-- PART 1: CLEAR EXISTING CITIES (optional)
-- ===========================================
-- Uncomment if you want to start fresh:
-- DELETE FROM cities;

-- ===========================================
-- PART 2: CURATED ESCAPE CITIES
-- ===========================================
-- These are the featured destinations shown on the Dashboard

INSERT INTO cities (name, country, continent, latitude, longitude, cost_index, popularity, image_url) VALUES
-- EUROPE
('Paris', 'France', 'Europe', 48.8566, 2.3522, 4, 100, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
('Rome', 'Italy', 'Europe', 41.9028, 12.4964, 3, 95, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
('Barcelona', 'Spain', 'Europe', 41.3851, 2.1734, 3, 92, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80'),
('Amsterdam', 'Netherlands', 'Europe', 52.3676, 4.9041, 4, 88, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80'),
('London', 'United Kingdom', 'Europe', 51.5074, -0.1278, 5, 98, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'),
('Lisbon', 'Portugal', 'Europe', 38.7223, -9.1393, 2, 85, 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80'),
('Prague', 'Czech Republic', 'Europe', 50.0755, 14.4378, 2, 82, 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80'),
('Vienna', 'Austria', 'Europe', 48.2082, 16.3738, 3, 80, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80'),
('Santorini', 'Greece', 'Europe', 36.3932, 25.4615, 4, 90, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80'),
('Dubrovnik', 'Croatia', 'Europe', 42.6507, 18.0944, 3, 78, 'https://images.unsplash.com/photo-1555990538-1e6c0a10c41d?w=800&q=80'),
('Florence', 'Italy', 'Europe', 43.7696, 11.2558, 3, 87, 'https://images.unsplash.com/photo-1543429258-c5ca3cb49b16?w=800&q=80'),
('Venice', 'Italy', 'Europe', 45.4408, 12.3155, 4, 89, 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80'),
('Munich', 'Germany', 'Europe', 48.1351, 11.5820, 3, 75, 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80'),
('Zurich', 'Switzerland', 'Europe', 47.3769, 8.5417, 5, 72, 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80'),
('Copenhagen', 'Denmark', 'Europe', 55.6761, 12.5683, 4, 76, 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80'),

-- ASIA
('Tokyo', 'Japan', 'Asia', 35.6762, 139.6503, 4, 97, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'),
('Kyoto', 'Japan', 'Asia', 35.0116, 135.7681, 3, 91, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'),
('Bangkok', 'Thailand', 'Asia', 13.7563, 100.5018, 2, 93, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80'),
('Singapore', 'Singapore', 'Asia', 1.3521, 103.8198, 4, 89, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'),
('Bali', 'Indonesia', 'Asia', -8.3405, 115.0920, 2, 94, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'),
('Seoul', 'South Korea', 'Asia', 37.5665, 126.9780, 3, 86, 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80'),
('Hong Kong', 'Hong Kong', 'Asia', 22.3193, 114.1694, 4, 88, 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80'),
('Dubai', 'UAE', 'Asia', 25.2048, 55.2708, 4, 92, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'),
('Maldives', 'Maldives', 'Asia', 3.2028, 73.2207, 5, 85, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'),
('Vietnam', 'Vietnam', 'Asia', 14.0583, 108.2772, 1, 80, 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80'),

-- INDIA (Extended)
('Mumbai', 'India', 'Asia', 19.0760, 72.8777, 2, 85, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80'),
('Delhi', 'India', 'Asia', 28.6139, 77.2090, 2, 88, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'),
('Jaipur', 'India', 'Asia', 26.9124, 75.7873, 1, 82, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80'),
('Goa', 'India', 'Asia', 15.2993, 74.1240, 2, 90, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'),
('Varanasi', 'India', 'Asia', 25.3176, 82.9739, 1, 78, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80'),
('Kerala', 'India', 'Asia', 10.8505, 76.2711, 2, 84, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'),
('Udaipur', 'India', 'Asia', 24.5854, 73.7125, 2, 80, 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80'),
('Agra', 'India', 'Asia', 27.1767, 78.0081, 1, 92, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'),
('Rishikesh', 'India', 'Asia', 30.0869, 78.2676, 1, 75, 'https://images.unsplash.com/photo-1545385569-dd26b1ddf925?w=800&q=80'),
('Manali', 'India', 'Asia', 32.2396, 77.1887, 1, 77, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'),
('Shimla', 'India', 'Asia', 31.1048, 77.1734, 1, 72, 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80'),
('Darjeeling', 'India', 'Asia', 27.0410, 88.2663, 1, 70, 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=800&q=80'),
('Amritsar', 'India', 'Asia', 31.6340, 74.8723, 1, 76, 'https://images.unsplash.com/photo-1518792528501-352f829886dc?w=800&q=80'),
('Kolkata', 'India', 'Asia', 22.5726, 88.3639, 1, 74, 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80'),
('Chennai', 'India', 'Asia', 13.0827, 80.2707, 2, 73, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80'),
('Bangalore', 'India', 'Asia', 12.9716, 77.5946, 2, 79, 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80'),
('Hyderabad', 'India', 'Asia', 17.3850, 78.4867, 2, 77, 'https://images.unsplash.com/photo-1603813507806-0d7c1b4d2cdb?w=800&q=80'),
('Pune', 'India', 'Asia', 18.5204, 73.8567, 2, 71, 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&q=80'),
('Leh Ladakh', 'India', 'Asia', 34.1526, 77.5771, 2, 83, 'https://images.unsplash.com/photo-1589308454676-22bf5c5b5b52?w=800&q=80'),
('Mysore', 'India', 'Asia', 12.2958, 76.6394, 1, 68, 'https://images.unsplash.com/photo-1600100397608-f5e5e3f33c4c?w=800&q=80'),

-- AMERICAS
('New York', 'USA', 'North America', 40.7128, -74.0060, 5, 99, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'),
('Los Angeles', 'USA', 'North America', 34.0522, -118.2437, 4, 90, 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80'),
('San Francisco', 'USA', 'North America', 37.7749, -122.4194, 5, 85, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'),
('Miami', 'USA', 'North America', 25.7617, -80.1918, 4, 88, 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80'),
('Cancun', 'Mexico', 'North America', 21.1619, -86.8515, 3, 87, 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80'),
('Rio de Janeiro', 'Brazil', 'South America', -22.9068, -43.1729, 3, 91, 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80'),
('Buenos Aires', 'Argentina', 'South America', -34.6037, -58.3816, 2, 82, 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80'),
('Machu Picchu', 'Peru', 'South America', -13.1631, -72.5450, 2, 89, 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80'),

-- OCEANIA
('Sydney', 'Australia', 'Oceania', -33.8688, 151.2093, 4, 93, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80'),
('Melbourne', 'Australia', 'Oceania', -37.8136, 144.9631, 4, 85, 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80'),
('Auckland', 'New Zealand', 'Oceania', -36.8509, 174.7645, 4, 78, 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80'),
('Queenstown', 'New Zealand', 'Oceania', -45.0312, 168.6626, 4, 82, 'https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=800&q=80'),
('Fiji', 'Fiji', 'Oceania', -17.7134, 178.0650, 3, 80, 'https://images.unsplash.com/photo-1583844258747-7ea3400d8a4a?w=800&q=80'),

-- AFRICA
('Cape Town', 'South Africa', 'Africa', -33.9249, 18.4241, 2, 86, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'),
('Marrakech', 'Morocco', 'Africa', 31.6295, -7.9811, 2, 84, 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&q=80'),
('Cairo', 'Egypt', 'Africa', 30.0444, 31.2357, 2, 88, 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80'),
('Zanzibar', 'Tanzania', 'Africa', -6.1659, 39.2026, 2, 75, 'https://images.unsplash.com/photo-1565260208893-42dc44f9e5e6?w=800&q=80'),
('Serengeti', 'Tanzania', 'Africa', -2.3333, 34.8333, 4, 80, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80')

ON CONFLICT (name, country) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  popularity = EXCLUDED.popularity,
  cost_index = EXCLUDED.cost_index;

-- ===========================================
-- PART 3: ACTIVITIES TABLE (if not exists)
-- ===========================================

-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'sightseeing', 'transport', 'accommodation', 'entertainment', 'shopping', 'other')),
  location VARCHAR(255),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  is_booked BOOLEAN DEFAULT false,
  booking_reference VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Activities policy: users can only access activities for their own trips
CREATE POLICY IF NOT EXISTS "Users can view their trip activities" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stops s
      JOIN trips t ON s.trip_id = t.id
      WHERE s.id = activities.stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can insert their trip activities" ON activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stops s
      JOIN trips t ON s.trip_id = t.id
      WHERE s.id = activities.stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can update their trip activities" ON activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stops s
      JOIN trips t ON s.trip_id = t.id
      WHERE s.id = activities.stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can delete their trip activities" ON activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stops s
      JOIN trips t ON s.trip_id = t.id
      WHERE s.id = activities.stop_id AND t.user_id = auth.uid()
    )
  );

-- ===========================================
-- PART 4: SAMPLE ACTIVITIES FOR CITIES
-- ===========================================
-- These are template activities that can be suggested to users

CREATE TABLE IF NOT EXISTS activity_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  average_cost DECIMAL(10, 2),
  average_duration_minutes INTEGER,
  image_url TEXT,
  rating DECIMAL(2, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample activity templates for popular cities
INSERT INTO activity_templates (city_name, name, category, description, average_cost, average_duration_minutes, image_url, rating) VALUES
-- Paris
('Paris', 'Eiffel Tower Visit', 'sightseeing', 'Iconic iron tower with stunning city views', 28.00, 120, 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400', 4.7),
('Paris', 'Louvre Museum', 'sightseeing', 'World-famous art museum housing the Mona Lisa', 17.00, 240, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', 4.8),
('Paris', 'Seine River Cruise', 'entertainment', 'Scenic boat ride along the Seine', 15.00, 90, 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400', 4.5),
('Paris', 'Croissant at Café de Flore', 'food', 'Classic Parisian café experience', 12.00, 45, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 4.3),

-- Tokyo
('Tokyo', 'Shibuya Crossing', 'sightseeing', 'World-famous pedestrian scramble', 0.00, 30, 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', 4.5),
('Tokyo', 'TeamLab Borderless', 'entertainment', 'Immersive digital art museum', 32.00, 180, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 4.8),
('Tokyo', 'Tsukiji Outer Market', 'food', 'Fresh sushi and street food paradise', 25.00, 120, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 4.6),
('Tokyo', 'Senso-ji Temple', 'sightseeing', 'Ancient Buddhist temple in Asakusa', 0.00, 90, 'https://images.unsplash.com/photo-1583400057180-e44d1c16cfa0?w=400', 4.7),

-- New York
('New York', 'Statue of Liberty', 'sightseeing', 'Iconic symbol of freedom', 24.00, 240, 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=400', 4.6),
('New York', 'Central Park Walk', 'sightseeing', 'Iconic urban park', 0.00, 120, 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', 4.8),
('New York', 'Broadway Show', 'entertainment', 'World-class theater experience', 150.00, 180, 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400', 4.9),
('New York', 'Pizza at Joe''s', 'food', 'Classic NY slice', 5.00, 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.4),

-- Bali
('Bali', 'Ubud Rice Terraces', 'sightseeing', 'Stunning rice paddy landscapes', 0.00, 180, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', 4.7),
('Bali', 'Tanah Lot Temple', 'sightseeing', 'Sea temple at sunset', 3.00, 120, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', 4.6),
('Bali', 'Balinese Cooking Class', 'food', 'Learn traditional recipes', 45.00, 240, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 4.8),
('Bali', 'Spa & Massage', 'entertainment', 'Traditional Balinese spa', 30.00, 90, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', 4.5),

-- Dubai
('Dubai', 'Burj Khalifa', 'sightseeing', 'World''s tallest building observation deck', 45.00, 120, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', 4.8),
('Dubai', 'Desert Safari', 'entertainment', 'Dune bashing and camp dinner', 80.00, 360, 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400', 4.7),
('Dubai', 'Dubai Mall Shopping', 'shopping', 'World''s largest shopping mall', 0.00, 240, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 4.5),

-- India
('Jaipur', 'Amber Fort', 'sightseeing', 'Magnificent hilltop fort palace', 7.00, 180, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400', 4.8),
('Jaipur', 'Hawa Mahal', 'sightseeing', 'Palace of Winds with 953 windows', 3.00, 60, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', 4.6),
('Agra', 'Taj Mahal Sunrise', 'sightseeing', 'Iconic marble mausoleum at dawn', 15.00, 180, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', 4.9),
('Varanasi', 'Ganga Aarti Ceremony', 'sightseeing', 'Evening prayer ceremony on the Ganges', 0.00, 90, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400', 4.8),
('Goa', 'Beach Hopping', 'sightseeing', 'Explore famous beaches like Baga and Anjuna', 0.00, 360, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', 4.5),
('Kerala', 'Backwater Houseboat', 'entertainment', 'Overnight stay on traditional houseboat', 120.00, 1440, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', 4.7),
('Mumbai', 'Gateway of India', 'sightseeing', 'Iconic arch monument overlooking sea', 0.00, 60, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400', 4.4),
('Mumbai', 'Street Food Tour', 'food', 'Vada pav, pav bhaji, and more', 10.00, 180, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 4.6),
('Delhi', 'Red Fort', 'sightseeing', 'Historic Mughal fort complex', 8.00, 120, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', 4.5),
('Udaipur', 'Lake Palace Boat Ride', 'entertainment', 'Scenic boat ride on Lake Pichola', 12.00, 60, 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400', 4.7)

ON CONFLICT DO NOTHING;

-- ===========================================
-- PART 5: VERIFY SETUP
-- ===========================================

-- Check cities count
SELECT 'Cities count:' as info, COUNT(*) as count FROM cities;

-- Check activity templates count
SELECT 'Activity templates count:' as info, COUNT(*) as count FROM activity_templates;

-- List all cities by continent
SELECT continent, COUNT(*) as cities_count 
FROM cities 
GROUP BY continent 
ORDER BY cities_count DESC;
