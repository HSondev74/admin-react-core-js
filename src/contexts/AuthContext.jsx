import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import authApi from '../infrastructure/api/http/auth';
import usersApi from '../infrastructure/api/http/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          setIsAuthenticated(true);

          // Fetch current user info if token exists
          try {
            const userData = await usersApi.getUserInfo();
            if (userData) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
            // If we can't get user data but have a token, still consider authenticated
            // but use cached user data if available
            const cachedUserData = localStorage.getItem('user');
            if (cachedUserData) {
              setUser(JSON.parse(cachedUserData));
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError(err.message || 'Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login(credentials);

      // Extract user data and token from response
      const { token, ...userData } = response;

      // Store in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setIsAuthenticated(true);
      setUser(userData);

      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.register(userData);
      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call logout API
      await authApi.logout();

      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Logout failed');
      console.error('Logout error:', err);

      // Even if API call fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.changePassword(passwordData);
      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Password change failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        changePassword,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
