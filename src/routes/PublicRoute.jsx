import { Navigate, Outlet } from 'react-router-dom';

// project imports
import Loader from '../presentation/components/Loader';
import { useAuth } from '../infrastructure/hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard/default" replace /> : <Outlet />;
};

export default PublicRoute;
