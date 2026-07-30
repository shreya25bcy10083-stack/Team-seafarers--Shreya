import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { UserProfile, UserRole } from '../types/User';

export const AuthService = {
  async login(email: string, password: string = 'password123', role: UserRole = 'PATIENT'): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const response = await ApiClient.request<{ token: string; role: string; user_id: number }>(
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
        name: email.split('@')[0],
        email,
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

    // Fallback for mock/demo mode
    await mockDelay(400);
    const mockToken = 'mock_jwt_token_12345';
    ApiClient.setToken(mockToken);
    const mockUser: UserProfile = {
      id: 'usr_101',
      name: role === 'PATIENT' ? 'Eleanor Vance' : 'Dr. Sarah Jenkins',
      email,
      role,
      phone: '+1 (555) 234-5678',
      emergencyContactName: 'Robert Vance (Son)',
      emergencyContactPhone: '+1 (555) 987-6543',
      linkedCaregiverId: role === 'PATIENT' ? 'usr_202' : undefined,
      linkedCaregiverName: role === 'PATIENT' ? 'Robert Vance' : undefined,
      linkedPatientIds: role === 'CAREGIVER' ? ['usr_101'] : undefined,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Login successful (Mock Mode)',
      data: {
        user: mockUser,
        token: mockToken,
      },
    };
  },

  async register(name: string, email: string, password: str = 'password123', role: UserRole = 'PATIENT'): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
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
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.PATIENT.PROFILE);

    if (response.success && response.data) {
      const p = response.data;
      return {
        success: true,
        message: 'Profile retrieved',
        data: {
          id: String(p.id),
          name: p.name || 'User',
          email: 'patient@carecompanion.health',
          role: 'PATIENT',
          phone: p.emergency_contact || '',
          emergencyContactPhone: p.emergency_contact,
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
        phone: '+1 (555) 234-5678',
        emergencyContactName: 'Robert Vance (Son)',
        emergencyContactPhone: '+1 (555) 987-6543',
        linkedCaregiverName: 'Robert Vance',
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
