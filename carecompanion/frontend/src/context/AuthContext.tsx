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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore persistent session if present
    const initAuth = async () => {
      try {
        const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
        const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_KEY) : null;

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

  const login = async (email: string, password: str = 'password123', role: UserRole = 'PATIENT'): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(email, password, role);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        ApiClient.setToken(res.data.token);

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        return { success: true, message: res.message || 'Login successful' };
      }
      return { success: false, message: res.message || 'Invalid credentials.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Login failed. Please check your credentials.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    ApiClient.setToken(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }
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
