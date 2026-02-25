import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';
import type { UserRole } from '../../types';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export default function ProtectedRoute({ children, requiredRole, adminOnly, userOnly }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while session is being restored from localStorage
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center space-y-3">
          <Spinner size={32} />
          <p className="text-sm text-surface-500 dark:text-surface-400">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated users → 401 Unauthorized
  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }

  // If admin tries to access user-only routes → 403 Forbidden
  if (user?.role === 'admin' && userOnly) {
    return <Navigate to="/403" replace />;
  }

  // If regular user tries to access admin-only routes → 403 Forbidden
  if (user?.role === 'user' && adminOnly) {
    return <Navigate to="/403" replace />;
  }

  // If specific role is required and doesn't match → 403 Forbidden
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
