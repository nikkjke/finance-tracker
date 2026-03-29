import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { STORAGE_KEYS } from '../types';
import {
  loginUser,
  registerUser,
  logoutUser,
  switchUserRole,
  restoreSession,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Keep track of the user who originally logged in so role-switch can restore them
  const originalUserRef = useRef<User | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedUser = restoreSession();
    if (savedUser) {
      setUser(savedUser);
      originalUserRef.current = savedUser;
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      originalUserRef.current = result.user;
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerUser(name, email, password);
    if (result.success && result.user) {
      setUser(result.user);
      originalUserRef.current = result.user;
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = switchUserRole(originalUserRef.current ?? user, role);
      setUser(updatedUser);
    }
  }, [user]);

  const updateUser = useCallback((updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      originalUserRef.current = updatedUser;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
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
        switchRole,
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
