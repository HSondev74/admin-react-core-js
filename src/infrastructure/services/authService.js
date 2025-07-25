import { useMutation } from '../hooks/useApi';

export const useAuthService = () => {
  const loginMutation = useMutation('post');
  const registerMutation = useMutation('post');
  const logoutMutation = useMutation('post');
  const refreshTokenMutation = useMutation('post');

  const login = async (credentials) => {
    return await loginMutation('/auth/login', credentials);
  };

  const register = async (userData) => {
    return await registerMutation('/auth/register', userData);
  };

  const logout = async () => {
    try {
      await logoutMutation('/auth/logout');
    } finally {
      // Clear local storage on logout regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    
    const { data, error } = await refreshTokenMutation('/auth/refresh-token', { refreshToken });
    
    if (data?.accessToken) {
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    }
    
    throw new Error(error || 'Failed to refresh token');
  };

  return {
    login,
    register,
    logout,
    refreshToken,
  };
};
