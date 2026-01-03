import { supabase, Profile, Trip, Stop } from '../lib/supabase';
import type { User } from '../types';

/**
 * Timeout helper for Supabase operations
 */
const DEFAULT_TIMEOUT = 10000; // 10 seconds

function withTimeout<T>(promise: Promise<T>, ms: number = DEFAULT_TIMEOUT): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  ]);
}

/**
 * Authentication Service using Supabase
 */

// Sign up with email and password
export async function signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await withTimeout(supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    }));

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Failed to create user' };
    }

    // Get the profile (with shorter timeout, non-critical)
    const { data: profile } = await withTimeout(supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single(), 5000).catch(() => ({ data: null }));

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.name || name,
      role: profile?.role || 'user',
    };

    return { user, error: null };
  } catch (err: any) {
    if (err.message === 'Request timeout') {
      return { user: null, error: 'Connection timeout. Please try again.' };
    }
    return { user: null, error: 'An unexpected error occurred' };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await withTimeout(supabase.auth.signInWithPassword({
      email,
      password,
    }));

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Failed to sign in' };
    }

    // Get the profile (with shorter timeout)
    const { data: profile } = await withTimeout(supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single(), 5000).catch(() => ({ data: null }));

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.name || email.split('@')[0],
      role: profile?.role || 'user',
    };

    return { user, error: null };
  } catch (err: any) {
    if (err.message === 'Request timeout') {
      return { user: null, error: 'Connection timeout. Please try again.' };
    }
    return { user: null, error: 'An unexpected error occurred' };
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

// Get current session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session } } = await withTimeout(
      supabase.auth.getSession(),
      5000 // Shorter timeout for session check
    );
    
    if (!session?.user) {
      return null;
    }

    // Profile fetch is non-critical, use short timeout with fallback
    const { data: profile } = await withTimeout(supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single(), 3000).catch(() => ({ data: null }));

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.name || session.user.email?.split('@')[0] || 'User',
      role: profile?.role || 'user',
    };
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}

// Update profile
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Trips Service
 */

// Get all trips for current user
export async function getTrips(): Promise<{ trips: Trip[]; error: string | null }> {
  try {
    const { data: { user } } = await withTimeout(supabase.auth.getUser(), 5000);
    if (!user) {
      return { trips: [], error: 'Not authenticated' };
    }

    const { data, error } = await withTimeout(supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false }));

    if (error) {
      return { trips: [], error: error.message };
    }

    return { trips: data || [], error: null };
  } catch (err: any) {
    if (err.message === 'Request timeout') {
      return { trips: [], error: 'Connection timeout' };
    }
    return { trips: [], error: 'An unexpected error occurred' };
  }
}

// Get single trip
export async function getTrip(tripId: string): Promise<{ trip: Trip | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error) {
      return { trip: null, error: error.message };
    }

    return { trip: data, error: null };
  } catch (err) {
    return { trip: null, error: 'An unexpected error occurred' };
  }
}

// Create trip
export async function createTrip(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Promise<{ trip: Trip | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single();

    if (error) {
      return { trip: null, error: error.message };
    }

    return { trip: data, error: null };
  } catch (err) {
    return { trip: null, error: 'An unexpected error occurred' };
  }
}

// Update trip
export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

// Delete trip
export async function deleteTrip(tripId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Stops Service
 */

// Get stops for a trip
export async function getStops(tripId: string): Promise<{ stops: Stop[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true });

    if (error) {
      return { stops: [], error: error.message };
    }

    return { stops: data || [], error: null };
  } catch (err) {
    return { stops: [], error: 'An unexpected error occurred' };
  }
}

// Create stop
export async function createStop(stop: Omit<Stop, 'id' | 'created_at'>): Promise<{ stop: Stop | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('stops')
      .insert(stop)
      .select()
      .single();

    if (error) {
      return { stop: null, error: error.message };
    }

    return { stop: data, error: null };
  } catch (err) {
    return { stop: null, error: 'An unexpected error occurred' };
  }
}

// Update stop
export async function updateStop(stopId: string, updates: Partial<Stop>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('stops')
      .update(updates)
      .eq('id', stopId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

// Delete stop
export async function deleteStop(stopId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('stops')
      .delete()
      .eq('id', stopId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Cities Service (for autocomplete)
 */

export async function searchCities(query: string): Promise<{ cities: any[]; error: string | null }> {
  try {
    if (!query || query.length < 2) {
      return { cities: [], error: null };
    }
    
    const { data, error } = await withTimeout(supabase
      .from('cities')
      .select('*')
      .or(`name.ilike.%${query}%,country.ilike.%${query}%`)
      .order('popularity', { ascending: false })
      .limit(10), 5000);

    if (error) {
      return { cities: [], error: error.message };
    }

    return { cities: data || [], error: null };
  } catch (err: any) {
    // Return empty array on timeout - don't block UI
    return { cities: [], error: null };
  }
}

// Get all cities (for browse/explore)
export async function getAllCities(): Promise<{ cities: any[]; error: string | null }> {
  try {
    const { data, error } = await withTimeout(supabase
      .from('cities')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(100), 8000);

    if (error) {
      return { cities: [], error: error.message };
    }

    return { cities: data || [], error: null };
  } catch (err: any) {
    return { cities: [], error: null };
  }
}

/**
 * Chat History Service
 */

export async function getChatHistory(): Promise<{ messages: any[]; error: string | null }> {
  try {
    const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
    if (!user) {
      return { messages: [], error: null }; // Graceful fallback - just start fresh
    }

    const { data, error } = await withTimeout(supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50), 5000);

    if (error) {
      return { messages: [], error: null }; // Graceful fallback
    }

    return { messages: data || [], error: null };
  } catch (err) {
    // On timeout, just return empty - chat can still work
    return { messages: [], error: null };
  }
}

export async function saveChatMessage(role: 'user' | 'assistant', content: string): Promise<{ error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        role,
        content,
      });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

export async function clearChatHistory(): Promise<{ error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}
