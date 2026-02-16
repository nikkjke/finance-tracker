import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    // Allow any email/password for demo
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const register = (name: string, email: string, _password: string): boolean => {
    const exists = mockUsers.find((u) => u.email === email);
    if (exists) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
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
