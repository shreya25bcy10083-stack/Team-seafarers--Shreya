import { ApiClient, mockDelay } from './api';
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

  async register(name: string, email: string, password: string = 'password123', role: UserRole = 'PATIENT'): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const backendRole = role.toLowerCase();
    const response = await ApiClient.request<{ user_id: number }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: { name, email, password, role: backendRole },
      }
    );

    if (response.success && response.data?.user_id) {
      // Auto-login after successful registration
      return this.login(email, password, role);
    }

    // Fallback for mock/demo mode
    await mockDelay(500);
    const mockToken = 'mock_jwt_token_new';
    ApiClient.setToken(mockToken);
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Account created successfully (Mock Mode)',
      data: {
        user: newUser,
        token: mockToken,
      },
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

    // Fallback for mock mode
    await mockDelay(200);
    return {
      success: true,
      message: 'User profile retrieved (Mock Mode)',
      data: {
        id: 'usr_101',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        role: 'PATIENT',
        createdAt: new Date().toISOString(),
      },
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await ApiClient.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    ApiClient.setToken(null);
    return {
      success: true,
      message: 'Logged out successfully',
      data: null,
    };
  },
};
