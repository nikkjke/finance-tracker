import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export default function ProtectedRoute({ children, requiredRole, adminOnly, userOnly }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Unauthenticated users → 401 Unauthorized
  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }

  // If admin tries to access user routes, redirect to admin panel
  if (user?.role === 'admin' && userOnly) {
    return <Navigate to="/admin" replace />;
  }

  // If regular user tries to access admin routes, redirect to dashboard
  if (user?.role === 'user' && adminOnly) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
