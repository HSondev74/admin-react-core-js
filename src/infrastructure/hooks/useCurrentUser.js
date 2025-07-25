import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useFetch } from './useApi';
import { fetchUserInfo } from '../store/slices/authSlice';

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  
  const { data: user, error, isLoading, mutate } = useFetch('/users/me');
  
  const refreshUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchUserInfo()).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  }, [dispatch]);
  
  return {
    user,
    error,
    isLoading,
    refreshUser,
    mutate,
  };
};

export default useCurrentUser;
