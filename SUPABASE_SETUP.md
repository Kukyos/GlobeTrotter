# Supabase Setup Guide for GlobeTrotter

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project Name**: GlobeTrotter
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for setup

## Step 2: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://kpywgbvpngihshckqhwg.supabase.co`
   - **anon/public key**: `sb_publishable_eegsNSrXg46dVjs15IGW7A_z3dxs-5w`

## Step 3: Run the SQL Schema

Go to **SQL Editor** in Supabase and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE public.trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  cover_photo TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stops table (cities within a trip)
CREATE TABLE public.stops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stop_id UUID REFERENCES public.stops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('food', 'sightseeing', 'transport', 'accommodation', 'entertainment', 'shopping', 'other')),
  location TEXT,
  scheduled_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_reference TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities lookup table (for autocomplete fallback)
CREATE TABLE public.cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  cost_index INTEGER DEFAULT 3 CHECK (cost_index BETWEEN 1 AND 5),
  popularity INTEGER DEFAULT 50,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history for the AI chatbot
CREATE TABLE public.chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_stops_trip_id ON public.stops(trip_id);
CREATE INDEX idx_activities_stop_id ON public.activities(stop_id);
CREATE INDEX idx_cities_name ON public.cities(name);
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- Stops policies
CREATE POLICY "Users can manage stops for their trips"
  ON public.stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = stops.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Activities policies
CREATE POLICY "Users can manage activities for their stops"
  ON public.activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stops
      JOIN public.trips ON trips.id = stops.trip_id
      WHERE stops.id = activities.stop_id
      AND trips.user_id = auth.uid()
    )
  );

-- Cities are readable by everyone
CREATE POLICY "Cities are publicly readable"
  ON public.cities FOR SELECT
  TO authenticated
  USING (TRUE);

-- Chat history policies
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed popular cities
INSERT INTO public.cities (name, country, continent, latitude, longitude, cost_index, popularity, image_url) VALUES
  ('Tokyo', 'Japan', 'Asia', 35.6762, 139.6503, 4, 95, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'),
  ('Paris', 'France', 'Europe', 48.8566, 2.3522, 5, 98, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'),
  ('New York', 'USA', 'North America', 40.7128, -74.0060, 5, 97, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'),
  ('London', 'UK', 'Europe', 51.5074, -0.1278, 5, 96, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800'),
  ('Barcelona', 'Spain', 'Europe', 41.3851, 2.1734, 3, 92, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800'),
  ('Bali', 'Indonesia', 'Asia', -8.3405, 115.0920, 2, 90, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'),
  ('Dubai', 'UAE', 'Asia', 25.2048, 55.2708, 4, 89, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'),
  ('Rome', 'Italy', 'Europe', 41.9028, 12.4964, 4, 94, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'),
  ('Sydney', 'Australia', 'Oceania', -33.8688, 151.2093, 4, 88, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'),
  ('Lisbon', 'Portugal', 'Europe', 38.7223, -9.1393, 2, 85, 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800'),
  ('Bangkok', 'Thailand', 'Asia', 13.7563, 100.5018, 1, 87, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800'),
  ('Amsterdam', 'Netherlands', 'Europe', 52.3676, 4.9041, 4, 86, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800'),
  ('Santorini', 'Greece', 'Europe', 36.3932, 25.4615, 4, 84, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'),
  ('Kyoto', 'Japan', 'Asia', 35.0116, 135.7681, 4, 83, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'),
  ('Reykjavik', 'Iceland', 'Europe', 64.1466, -21.9426, 5, 75, 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=800'),
  ('Cape Town', 'South Africa', 'Africa', -33.9249, 18.4241, 2, 80, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800'),
  ('Marrakech', 'Morocco', 'Africa', 31.6295, -7.9811, 2, 78, 'https://images.unsplash.com/photo-1597212720158-c0e50f6e7fda?w=800'),
  ('Singapore', 'Singapore', 'Asia', 1.3521, 103.8198, 4, 91, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800'),
  ('Vienna', 'Austria', 'Europe', 48.2082, 16.3738, 4, 82, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800'),
  ('Prague', 'Czech Republic', 'Europe', 50.0755, 14.4378, 2, 81, 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800');
```

## Step 4: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider (should be on by default)
3. Optionally enable Google, GitHub, etc.
4. Go to **Authentication** → **URL Configuration**
5. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`
6. Add redirect URLs:
   - `https://your-app.vercel.app/*`
   - `http://localhost:3000/*` (for local dev)

## Step 5: Environment Variables

### For Local Development (.env)
Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GROQ_API_KEY=your-groq-api-key
```

### For Vercel Deployment
Add these in Vercel → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_GROQ_API_KEY` | Your Groq API key |

## Step 6: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite
5. Add environment variables
6. Deploy!

## Troubleshooting

### Auth not working?
- Check your Site URL in Supabase matches your deployment URL
- Ensure redirect URLs are configured correctly
- Check browser console for specific errors

### Database errors?
- Verify RLS policies are correct
- Check that the trigger for new users is working
- Look at Supabase logs in the dashboard

### CORS issues?
- Add your deployment domain to Supabase's allowed origins
- Settings → API → Additional API Configurations
