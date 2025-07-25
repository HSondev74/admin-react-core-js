import axios from 'axios';
import { getToken, getRefreshToken, setToken } from '../utils/authToken';

// Create axios instance with base URL and headers
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, clear auth data and redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh-token`,
          { refreshToken }
        );
        
        const { accessToken } = response.data;
        
        // Store the new token
        setToken(accessToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, clear auth data and redirect to login
        console.error('Failed to refresh token:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
