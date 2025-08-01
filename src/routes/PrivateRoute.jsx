import { Navigate, Outlet } from 'react-router-dom';

// project imports
import Loader from '../presentation/components/Loader';
import { useAuth } from '../infrastructure/hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute;
