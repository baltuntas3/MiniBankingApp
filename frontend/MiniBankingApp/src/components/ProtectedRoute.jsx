import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  return isAuthenticated ? children : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;