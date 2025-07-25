import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../../presentation/components/Loader';

/**
 * Higher-Order Component to protect routes that require authentication
 * @param {React.Component} Component - The component to protect
 * @param {object} options - Options for the HOC
 * @param {boolean} [options.requireAdmin=false] - Whether admin role is required
 * @returns {React.Component} Protected component
 */
const withAuth = (Component, options = {}) => {
  const { requireAdmin = false } = options;
  
  return function WithAuthWrapper(props) {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: props.location } });
        } else if (requireAdmin && user?.role !== 'admin') {
          // Redirect to home if admin role is required but user is not admin
          navigate('/');
        }
      }
    }, [isAuthenticated, loading, navigate, props.location, requireAdmin, user?.role]);

    if (loading || !isAuthenticated || (requireAdmin && user?.role !== 'admin')) {
      return <Loader />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
