import api from './api';
import { User, ApiResponse } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Authentication service functions
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      
      if (response.data.success && response.data.data) {
        // Store token and user in localStorage
        localStorage.setItem('globetrotter_token', response.data.data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      
      if (response.data.success && response.data.data) {
        // Store token and user in localStorage
        localStorage.setItem('globetrotter_token', response.data.data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user',
      };
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('globetrotter_token');
  },

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const user = localStorage.getItem('globetrotter_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
