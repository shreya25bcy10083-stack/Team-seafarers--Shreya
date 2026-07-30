import { mockDelay } from './api';
import { ApiResponse } from '../types/API';
import { UserProfile, UserRole } from '../types/User';

export const AuthService = {
  async login(email: string, role: UserRole): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    await mockDelay(600);
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
      message: 'Login successful',
      data: {
        user: mockUser,
        token: 'mock_jwt_token_12345',
      },
    };
  },

  async register(name: string, email: string, role: UserRole): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    await mockDelay(700);
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Account created successfully',
      data: {
        user: newUser,
        token: 'mock_jwt_token_new',
      },
    };
  },

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    await mockDelay(300);
    return {
      success: true,
      message: 'User profile retrieved',
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
};
