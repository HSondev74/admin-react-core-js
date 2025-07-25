import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, register } from '../store/slices/authSlice';
import { useAuthService } from '../services/authService';

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const authService = useAuthService();

  const handleLogin = async (credentials) => {
    try {
      const { data, error } = await authService.login(credentials);
      
      if (error) {
        return { success: false, error };
      }
      
      const result = await dispatch(login(data)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      await dispatch(logout()).unwrap();
      navigate('/login');
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      navigate('/login');
      return { success: true };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { data, error } = await authService.register(userData);
      
      if (error) {
        return { success: false, error };
      }
      
      const result = await dispatch(register(data)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    loading,
    error,
  };
};
