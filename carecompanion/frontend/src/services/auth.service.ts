import { ApiClient } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { UserProfile, UserRole } from '../types/User';

export const AuthService = {
  async login(email: string, password: string = 'password123', role: UserRole = 'PATIENT'): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const response = await ApiClient.request<{ token: string; role: string; user_id: number; name?: string; email?: string }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: { email, password },
      }
    );

    if (response.success && response.data?.token) {
      ApiClient.setToken(response.data.token);

      const userRole = (response.data.role || role).toUpperCase() as UserRole;
      const userProfile: UserProfile = {
        id: String(response.data.user_id),
        name: response.data.name || email.split('@')[0],
        email: response.data.email || email,
        role: userRole,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: response.message || 'Login successful',
        data: {
          user: userProfile,
          token: response.data.token,
        },
      };
    }

    return {
      success: false,
      message: response.message || 'Invalid email or password.',
    };
  },

  async register(name: string, email: string, password: string = 'password123', role: UserRole = 'PATIENT'): Promise<ApiResponse<{ user_id: number }>> {
    const backendRole = role.toLowerCase();
    const response = await ApiClient.request<{ user_id: number }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: { name, email, password, role: backendRole },
      }
    );

    if (response.success && response.data?.user_id) {
      return {
        success: true,
        message: 'Account created successfully',
        data: {
          user_id: response.data.user_id,
        },
      };
    }

    return {
      success: false,
      message: response.message || 'Registration failed.',
    };
  },

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.AUTH.ME);

    if (response.success && response.data) {
      const u = response.data;
      const userRole = (u.role || 'PATIENT').toUpperCase() as UserRole;
      return {
        success: true,
        message: 'Profile retrieved',
        data: {
          id: String(u.id),
          name: u.name || 'User',
          email: u.email || '',
          role: userRole,
          createdAt: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
      message: 'Failed to retrieve profile',
    };
  },
};
