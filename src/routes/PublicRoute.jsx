import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

// project imports
import { useAuth } from 'contexts/AuthContext';
import Loader from '../components/Loader';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard/default" replace /> : <Outlet />;
};

export default PublicRoute;
