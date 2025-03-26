import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for admin authentication
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      setIsAuthenticated(adminAuth === 'true');
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Display loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin mb-4 h-12 w-12 mx-auto border-4 border-red-600 dark:border-red-500 rounded-full border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default AdminRouteGuard; 