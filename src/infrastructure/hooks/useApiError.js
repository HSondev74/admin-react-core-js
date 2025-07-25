import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

/**
 * Custom hook to handle API errors consistently
 * @returns {Object} - Error handling functions
 */
export const useApiError = () => {
  const dispatch = useDispatch();

  /**
   * Handle API errors and show appropriate messages
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   */
  const handleError = useCallback((error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        defaultMessage;
    
    // Show error notification
    enqueueSnackbar(errorMessage, { variant: 'error' });
    
    // Handle specific error cases
    if (error?.response?.status === 401) {
      // Handle unauthorized access
      // You might want to dispatch a logout action here
    }
    
    return errorMessage;
  }, [dispatch]);

  /**
   * Handle successful API responses
   * @param {any} response - The API response
   * @param {string} successMessage - Success message to show
   */
  const handleSuccess = useCallback((response, successMessage) => {
    if (successMessage) {
      enqueueSnackbar(successMessage, { variant: 'success' });
    }
    return response;
  }, []); 

  return {
    handleError,
    handleSuccess,
  };
};

export default useApiError;
