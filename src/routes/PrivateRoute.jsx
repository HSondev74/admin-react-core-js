import { Navigate, Outlet } from 'react-router-dom';

// project imports
import { useAuth } from 'contexts/AuthContext';
import Loader from '../components/Loader';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
