import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.');
}

// Create Supabase client with persistent session (never expires)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'globetrotter-auth',
      flowType: 'pkce',
    },
  }
);

// Type definitions
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  destination: string;
  description: string | null;
  cover_photo: string | null;
  start_date: string;
  end_date: string;
  total_budget: number;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  trip_id: string;
  city_name: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  budget: number;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export interface Activity {
  id: string;
  stop_id: string;
  name: string;
  category: 'food' | 'sightseeing' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other';
  location: string | null;
  scheduled_time: string | null;
  duration_minutes: number | null;
  cost: number;
  notes: string | null;
  is_booked: boolean;
  booking_reference: string | null;
  order_index: number;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  continent: string | null;
  latitude: number | null;
  longitude: number | null;
  cost_index: number;
  popularity: number;
  image_url: string | null;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export default supabase;
