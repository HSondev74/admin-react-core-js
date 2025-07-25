import { useState, useCallback } from 'react';
import useApiError from './useApiError';

/**
 * Custom hook to handle form submissions with loading and error states
 * @param {Function} submitFn - The async function to call on form submission
 * @param {Object} options - Options for the hook
 * @param {Function} [options.onSuccess] - Callback function called on successful submission
 * @param {Function} [options.onError] - Callback function called on submission error
 * @param {string} [options.successMessage] - Success message to show on success
 * @param {string} [options.errorMessage] - Error message to show on error
 * @returns {Object} - Form submission state and handlers
 */
const useFormSubmit = (submitFn, options = {}) => {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage: defaultErrorMessage
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { handleError, handleSuccess } = useApiError();

  const handleSubmit = useCallback(async (values, formikHelpers) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitFn(values, formikHelpers);
      
      // Handle success
      handleSuccess(result, successMessage);
      
      if (onSuccess) {
        await onSuccess(result, formikHelpers);
      }
      
      return { success: true, data: result };
    } catch (error) {
      // Handle error
      const errorMessage = handleError(error, defaultErrorMessage);
      setSubmitError(errorMessage);
      
      if (onError) {
        await onError(error, formikHelpers);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFn, onSuccess, onError, successMessage, defaultErrorMessage, handleError, handleSuccess]);

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    setSubmitError,
  };
};

export default useFormSubmit;
