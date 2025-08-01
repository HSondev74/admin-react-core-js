import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from './useApi';
import { fetchUserInfo } from '../store/slices/authSlice';
import { useApiError } from './useApiError';
import userService from '../services/userService';

/**
 * Custom hook to manage the current user's data
 * @returns {Object} - User data and related functions
 */
export const useUser = () => {
  const dispatch = useDispatch();
  const { handleError } = useApiError();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  // Fetch user data using SWR
  const { data: user, error, mutate } = useFetch('/users/me');
  
  /**
   * Refresh the current user's data
   */
  const refreshUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchUserInfo()).unwrap();
      return result;
    } catch (error) {
      handleError(error, 'Failed to refresh user data');
      throw error;
    }
  }, [dispatch, handleError]);
  
  /**
   * Update the current user's profile
   * @param {Object} userData - The updated user data
   */
  const updateProfile = useCallback(async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      
      // Update the local cache
      await mutate(updatedUser, false);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: handleError(error, 'Failed to update profile') };
    }
  }, [handleError, mutate]);
  
  /**
   * Change the current user's password
   * @param {Object} passwordData - Current and new password
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      await userService.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error, 'Failed to change password') };
    }
  }, [handleError]);
  
  return {
    // Current user from Redux store (always up-to-date with auth state)
    currentUser,
    
    // User data from SWR (may be more up-to-date)
    user: user || currentUser,
    
    // Loading and error states
    isLoading: !error && !user,
    error,
    
    // Functions
    refreshUser,
    updateProfile,
    changePassword,
    
    // SWR mutate function for manual cache updates
    mutateUser: mutate,
  };
};

export default useUser;
