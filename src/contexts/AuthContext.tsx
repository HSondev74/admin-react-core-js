import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, usersApi } from '../api';

// Define the shape of our user object
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  // Add other user properties as needed
}

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
          
          // Optionally validate the token with the server
          try {
            const freshUserData = await usersApi.getUserInfo();
            if (freshUserData) {
              setUser(freshUserData);
              localStorage.setItem('user', JSON.stringify(freshUserData));
            }
          } catch (err) {
            // If token is invalid, clear auth state
            console.error('Token validation failed:', err);
            await handleLogout();
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.register({ name, email, password });
      // After successful registration, log the user in
      await handleLogin(email, password);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
