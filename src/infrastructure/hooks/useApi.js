import useSWR from 'swr';
import axiosInstance from '../../app/config/axiosInstance';

// SWR fetcher function
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

/**
 * Custom hook for making GET requests with SWR
 * @param {string} url - The API endpoint
 * @param {object} options - SWR options
 * @returns {object} - { data, error, isLoading, mutate }
 */
export const useFetch = (url, options = {}) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Custom hook for making POST/PUT/DELETE requests
 * @param {string} method - HTTP method (post, put, delete)
 * @returns {Function} - A function to make the request
 */
export const useMutation = (method = 'post') => {
  const makeRequest = async (url, data, config = {}) => {
    try {
      const response = await axiosInstance[method.toLowerCase()](url, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  return makeRequest;
};
