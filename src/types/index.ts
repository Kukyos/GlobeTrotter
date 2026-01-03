// ============================================
// GlobeTrotter - Type Definitions
// ============================================
// These types define the core data structures for the application.
// They are designed to be compatible with a relational database schema.

/**
 * User roles for access control
 */
export type UserRole = 'user' | 'admin' | 'guide';

/**
 * User account information
 * Maps to: profiles table in Supabase
 */
export interface User {
  id: string;
  email: string;
  name?: string;  // Display name (can be derived from firstName + lastName)
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
  avatar?: string;  // Alias for photoUrl
  city?: string;
  country?: string;
  bio?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Trip status types
 */
export type TripStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed';

/**
 * Trip/Journey information
 * Maps to: trips table in database
 */
export interface Trip {
  id: string;
  userId: string;
  name: string;
  destination?: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  status: TripStatus;
  isPublic: boolean;
  totalBudget?: number;
  createdAt: string;
  updatedAt?: string;
  stops?: Stop[];
}

/**
 * Stop/Destination within a trip
 * Maps to: stops table in database
 */
export interface Stop {
  id: string;
  tripId: string;
  cityId?: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  order: number;
  budget?: number;
  notes?: string;
}

/**
 * Activity category types
 */
export type ActivityCategory = 
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'adventure'
  | 'shopping'
  | 'entertainment'
  | 'other';

/**
 * Activity within a stop
 * Maps to: activities table in database
 */
export interface Activity {
  id: string;
  stopId: string;
  name: string;
  description?: string;
  category: ActivityCategory;
  cost: number;
  currency: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  imageUrl?: string;
  isBooked: boolean;
}

/**
 * City information for search/discovery
 * Maps to: cities table in database
 */
export interface City {
  id: string;
  name: string;
  country: string;
  continent: string;
  description?: string;
  imageUrl?: string;
  costIndex: number; // 1-5 scale
  popularity: number;
  timezone: string;
}

/**
 * Expense tracking
 * Maps to: expenses table in database
 */
export interface Expense {
  id: string;
  tripId: string;
  activityId?: string;
  category: ActivityCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Form validation error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
