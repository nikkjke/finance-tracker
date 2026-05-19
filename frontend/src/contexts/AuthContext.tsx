import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import { STORAGE_KEYS } from '../types';
import {
  loginUser,
  registerUser,
  logoutUser,
  restoreSession,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password: string, termsAccepted: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount (validates JWT expiry)
  useEffect(() => {
    const savedUser = restoreSession();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = true) => {
    const result = await loginUser(email, password, rememberMe);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, termsAccepted: boolean) => {
    const result = await registerUser(name, email, password, termsAccepted);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      const storage = sessionStorage.getItem(STORAGE_KEYS.JWT_TOKEN) ? sessionStorage : localStorage;
      // Persist the updated user info locally (token remains unchanged)
      try {
        storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      } catch {
        console.warn('Failed to persist updated user');
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
