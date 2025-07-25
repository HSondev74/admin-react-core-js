import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import { fetchUserInfo } from '../store/slices/authSlice';
import axiosInstance from '../../app/config/axiosInstance';

const fetcher = async (url) => {
  const response = await axiosInstance.get(url);
  
  if (!response.data) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = response.data;
    error.status = response.status;
    throw error;
  }
  
  return response.data;
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};

export const useApi = (url) => {
  const { data, error, isLoading, mutate } = useSWR(
    url ? [url, localStorage.getItem('token')] : null,
    ([url]) => fetcher(url),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
