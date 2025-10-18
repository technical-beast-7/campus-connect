import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'faculty' | 'authority')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { state } = useAuth();

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role-based access
  if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-gray-600 mb-4">Access denied</p>
          <p className="text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;