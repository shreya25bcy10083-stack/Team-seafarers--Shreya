import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/User';
import { AuthService } from '../services/auth.service';
import { ApiClient } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'carecompanion_token';
const USER_KEY = 'carecompanion_user';

import { storageHelper } from '../utils/storageHelper';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore persistent session if present
    const initAuth = async () => {
      try {
        const storedToken = await storageHelper.getItem(TOKEN_KEY);
        const storedUser = await storageHelper.getItem(USER_KEY);

        if (storedToken && storedUser && storedUser !== 'undefined') {
          const parsedUser: UserProfile = JSON.parse(storedUser);
          if (parsedUser && parsedUser.role) {
            setToken(storedToken);
            setUser(parsedUser);
            ApiClient.setToken(storedToken);
          } else {
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string = 'password123', role: UserRole = 'PATIENT'): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(email, password, role);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        ApiClient.setToken(res.data.token);

        await storageHelper.setItem(TOKEN_KEY, res.data.token);
        await storageHelper.setItem(USER_KEY, JSON.stringify(res.data.user));

        return { success: true, message: res.message || 'Login successful' };
      }
      return { success: false, message: res.message || 'Invalid credentials.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Login failed. Please check your credentials.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    ApiClient.setToken(null);
    await storageHelper.removeItem(TOKEN_KEY);
    await storageHelper.removeItem(USER_KEY);
  };

  const setRole = async (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      await storageHelper.setItem(USER_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
