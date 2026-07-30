export type UserRole = 'PATIENT' | 'CAREGIVER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  linkedCaregiverId?: string;
  linkedCaregiverName?: string;
  linkedPatientIds?: string[];
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
