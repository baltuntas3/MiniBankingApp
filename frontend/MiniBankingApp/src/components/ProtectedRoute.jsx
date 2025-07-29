import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authInitialized } = useAuth();
  const location = useLocation();
  
  // Show loading while checking authentication status
  if (!authInitialized) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;