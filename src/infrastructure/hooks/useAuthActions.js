import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, register } from '../store/slices/authSlice';
import { useAuthService } from '../services/authService';
import { persistor } from '../store/store';

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const authService = useAuthService();

  const handleLogin = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleLogout = async () => {
    try {
      const res = await dispatch(logout()).unwrap();
      persistor.purge();
      navigate('/login');
      return res;
    } catch (error) {
      return { success: false, error: error.message || 'Đăng xuất thất bại' };
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
    error
  };
};
