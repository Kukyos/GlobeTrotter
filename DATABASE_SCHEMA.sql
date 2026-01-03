-- =============================================
-- GlobeTrotter MySQL Database Schema
-- Version: 1.0.0
-- Last Updated: January 3, 2026
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS globetrotter;
USE globetrotter;

-- =============================================
-- USERS TABLE
-- Stores user account information
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    photo_url TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    bio TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CITIES TABLE (Reference/Lookup)
-- Pre-populated city data for search/discovery
-- =============================================
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    continent ENUM('africa', 'asia', 'europe', 'north_america', 'south_america', 'oceania', 'antarctica'),
    description TEXT,
    image_url TEXT,
    cost_index TINYINT CHECK (cost_index BETWEEN 1 AND 5),
    popularity INT DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_country (country),
    INDEX idx_continent (continent),
    INDEX idx_popularity (popularity DESC),
    INDEX idx_cost_index (cost_index),
    FULLTEXT idx_search (name, country, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRIPS TABLE
-- User-created trip plans
-- =============================================
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo TEXT,
    status ENUM('draft', 'upcoming', 'ongoing', 'completed') DEFAULT 'draft',
    is_public BOOLEAN DEFAULT FALSE,
    total_budget DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    share_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_public (is_public),
    INDEX idx_share_token (share_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- STOPS TABLE
-- Cities/destinations within a trip
-- =============================================
CREATE TABLE IF NOT EXISTS stops (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    city_id VARCHAR(36),
    city_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    
    INDEX idx_trip_id (trip_id),
    INDEX idx_city_id (city_id),
    INDEX idx_order (trip_id, order_index),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ACTIVITIES TABLE
-- Activities/events within a stop
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(36) PRIMARY KEY,
    stop_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('sightseeing', 'food', 'transport', 'accommodation', 'adventure', 'shopping', 'entertainment', 'other') NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    activity_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    image_url TEXT,
    is_booked BOOLEAN DEFAULT FALSE,
    booking_reference VARCHAR(100),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    
    INDEX idx_stop_id (stop_id),
    INDEX idx_category (category),
    INDEX idx_date (activity_date),
    INDEX idx_order (stop_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ACTIVITY TEMPLATES TABLE
-- Pre-defined activities for cities (suggestions)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_templates (
    id VARCHAR(36) PRIMARY KEY,
    city_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('sightseeing', 'food', 'transport', 'accommodation', 'adventure', 'shopping', 'entertainment', 'other') NOT NULL,
    average_cost DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    duration_minutes INT,
    image_url TEXT,
    rating DECIMAL(2, 1),
    review_count INT DEFAULT 0,
    popularity INT DEFAULT 0,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    
    INDEX idx_city_id (city_id),
    INDEX idx_category (category),
    INDEX idx_popularity (popularity DESC),
    INDEX idx_rating (rating DESC),
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- COMMUNITY POSTS TABLE
-- User-generated content/trip sharing
-- =============================================
CREATE TABLE IF NOT EXISTS community_posts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_trip_id (trip_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_likes (likes_count DESC),
    INDEX idx_featured (is_featured),
    FULLTEXT idx_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- POST LIKES TABLE
-- Tracks which users liked which posts
-- =============================================
CREATE TABLE IF NOT EXISTS post_likes (
    post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- POST COMMENTS TABLE
-- Comments on community posts
-- =============================================
CREATE TABLE IF NOT EXISTS post_comments (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES post_comments(id) ON DELETE CASCADE,
    
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- USER FOLLOWERS TABLE (Optional - for social features)
-- =============================================
CREATE TABLE IF NOT EXISTS user_followers (
    follower_id VARCHAR(36) NOT NULL,
    following_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAVED CITIES TABLE
-- User's bookmarked/saved cities
-- =============================================
CREATE TABLE IF NOT EXISTS saved_cities (
    user_id VARCHAR(36) NOT NULL,
    city_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, city_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    
    INDEX idx_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SESSION TOKENS TABLE (for auth)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update trip status based on dates
CREATE TRIGGER IF NOT EXISTS update_trip_status_on_insert
BEFORE INSERT ON trips
FOR EACH ROW
BEGIN
    IF NEW.start_date > CURDATE() THEN
        SET NEW.status = 'upcoming';
    ELSEIF NEW.end_date < CURDATE() THEN
        SET NEW.status = 'completed';
    ELSE
        SET NEW.status = 'ongoing';
    END IF;
END;

-- Increment likes count
CREATE TRIGGER IF NOT EXISTS increment_likes_count
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE community_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
END;

-- Decrement likes count
CREATE TRIGGER IF NOT EXISTS decrement_likes_count
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE community_posts 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = OLD.post_id;
END;

-- Increment comments count
CREATE TRIGGER IF NOT EXISTS increment_comments_count
AFTER INSERT ON post_comments
FOR EACH ROW
BEGIN
    UPDATE community_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
END;

-- Decrement comments count
CREATE TRIGGER IF NOT EXISTS decrement_comments_count
AFTER DELETE ON post_comments
FOR EACH ROW
BEGIN
    UPDATE community_posts 
    SET comments_count = GREATEST(comments_count - 1, 0) 
    WHERE id = OLD.post_id;
END;

-- Increment city popularity when added to trip
CREATE TRIGGER IF NOT EXISTS increment_city_popularity
AFTER INSERT ON stops
FOR EACH ROW
BEGIN
    IF NEW.city_id IS NOT NULL THEN
        UPDATE cities 
        SET popularity = popularity + 1 
        WHERE id = NEW.city_id;
    END IF;
END;

-- =============================================
-- SAMPLE DATA - Cities
-- =============================================
INSERT INTO cities (id, name, country, continent, description, cost_index, popularity, timezone) VALUES
(UUID(), 'Paris', 'France', 'europe', 'The City of Light, known for the Eiffel Tower, art museums, and romantic atmosphere.', 4, 15000, 'Europe/Paris'),
(UUID(), 'Tokyo', 'Japan', 'asia', 'A vibrant metropolis blending ultra-modern and traditional, from neon-lit skyscrapers to historic temples.', 4, 12000, 'Asia/Tokyo'),
(UUID(), 'New York', 'United States', 'north_america', 'The city that never sleeps, featuring iconic landmarks like Times Square, Central Park, and the Statue of Liberty.', 5, 18000, 'America/New_York'),
(UUID(), 'London', 'United Kingdom', 'europe', 'A historic city with world-class museums, royal palaces, and diverse cultural attractions.', 5, 14000, 'Europe/London'),
(UUID(), 'Barcelona', 'Spain', 'europe', 'Known for stunning architecture by Gaudí, beautiful beaches, and vibrant nightlife.', 3, 9000, 'Europe/Madrid'),
(UUID(), 'Sydney', 'Australia', 'oceania', 'Famous for its iconic Opera House, Harbour Bridge, and beautiful coastal scenery.', 4, 7500, 'Australia/Sydney'),
(UUID(), 'Dubai', 'United Arab Emirates', 'asia', 'A city of superlatives featuring the tallest building, luxury shopping, and desert adventures.', 4, 11000, 'Asia/Dubai'),
(UUID(), 'Rome', 'Italy', 'europe', 'The Eternal City, home to ancient ruins, Vatican City, and world-renowned cuisine.', 3, 13000, 'Europe/Rome'),
(UUID(), 'Bangkok', 'Thailand', 'asia', 'A city of ornate temples, vibrant street life, and incredible food culture.', 2, 10000, 'Asia/Bangkok'),
(UUID(), 'Amsterdam', 'Netherlands', 'europe', 'Known for its artistic heritage, canal system, narrow houses, and cycling culture.', 4, 8000, 'Europe/Amsterdam');

-- =============================================
-- VIEWS (Optional - for common queries)
-- =============================================

-- User trips summary
CREATE VIEW user_trips_summary AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT t.id) AS total_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'upcoming' THEN t.id END) AS upcoming_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) AS completed_trips,
    SUM(t.total_budget) AS total_budget
FROM users u
LEFT JOIN trips t ON u.id = t.user_id
GROUP BY u.id;

-- Popular cities with activity count
CREATE VIEW popular_cities_view AS
SELECT 
    c.*,
    COUNT(DISTINCT at.id) AS activity_count,
    COUNT(DISTINCT s.id) AS times_visited
FROM cities c
LEFT JOIN activity_templates at ON c.id = at.city_id
LEFT JOIN stops s ON c.id = s.city_id
GROUP BY c.id
ORDER BY c.popularity DESC;

-- =============================================
-- END OF SCHEMA
-- =============================================
