import axios from 'axios';
import { getToken, getRefreshToken, setToken, clearAuthData } from '../../infrastructure/utils/authToken';
import { enqueueSnackbar } from 'notistack';
import { getCookie, setCookie } from '../utils/cookies';

let reduxStore = null;
let reduxDispatch = null;
export const setReduxStore = (storeInstance) => {
  if (!storeInstance) {
    throw new Error('Redux store instance is required');
  }
  reduxStore = storeInstance;
  reduxDispatch = storeInstance.dispatch;
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache'
  },
  withCredentials: true
});

// Track if a token refresh is in progress
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, {
      params: config.params,
      data: config.data
    });

    // Add auth token to request
    // const token = getToken();
    let token = null;
    if (reduxStore) {
      const { auth } = reduxStore.getState();
      token = auth.token;
    } else {
      token = getCookie('accessToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.headers['X-Request-Timestamp'] = new Date().toISOString();

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[${response.config.method?.toUpperCase()} ${response.status}] ${response.config.url}`, {
      data: response.data
    });

    // Handle custom success messages from API
    if (response.data?.message) {
      enqueueSnackbar(response.data.message, { variant: 'success' });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error
    console.error('Response Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle network errors
    if (!error.response) {
      enqueueSnackbar('Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.', { variant: 'error' });
      return Promise.reject({
        message: 'Lỗi mạng. Vui lòng kiểm tra kết nối internet của bạn.',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;

    // Handle token refresh on 401
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token refresh is in progress, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken = null;
        if (reduxStore) {
          const { auth } = reduxStore.getState();
          refreshToken = auth.refreshToken;
        } else {
          refreshToken = getCookie('refreshToken');
        }

        if (!refreshToken) {
          throw new Error('Không có refresh token');
        }

        // Call refresh token API
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            params: { refreshToken }
          }
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens in Redux store
        if (reduxStore && reduxDispatch) {
          reduxDispatch({
            type: 'auth/refresh-token/fulfilled',
            payload: {
              token: newAccessToken,
              refreshToken: newRefreshToken
            }
          });
        }

        setCookie('accessToken', newAccessToken, { expires: 1 });
        setCookie('refreshToken', newRefreshToken, { expires: 7 });

        // Update auth header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (reduxStore && reduxDispatch) {
          reduxDispatch({ type: 'auth/resetAuthState' });
        }

        // Clear cookies
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('user');

        enqueueSnackbar('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', { variant: 'error' });
        processQueue(refreshError, null);

        window.location.href = '/login?session=expired';

        return Promise.reject({
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          isAuthError: true
        });
      } finally {
        isRefreshing = false;
      }
    }

    // Handle common error statuses
    let errorMessage = data?.message || 'Đã xảy ra lỗi không xác định';

    switch (status) {
      case 400:
        errorMessage = data.message || 'Yêu cầu không hợp lệ';
        break;
      case 403:
        errorMessage = 'Bạn không có quyền thực hiện hành động này';
        enqueueSnackbar(errorMessage, {
          variant: 'error',
          autoHideDuration: 5000
        });
        break;
      case 404:
        errorMessage = 'Không tìm thấy tài nguyên yêu cầu';
        enqueueSnackbar(errorMessage, { variant: 'warning' });
        break;
      case 422:
        // Handle validation errors (return them to the form)
        return Promise.reject({
          ...data,
          isValidationError: true
        });
      case 429:
        errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
        enqueueSnackbar(errorMessage, { variant: 'warning' });
        break;
      case 500:
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        break;
      default:
        enqueueSnackbar(errorMessage, { variant: 'error' });
    }

    // Return a consistent error format
    return Promise.reject({
      status: status || 500,
      message: errorMessage,
      errors: data?.errors,
      code: data?.code,
      timestamp: new Date().toISOString()
    });
  }
);

// Add cancel token helper
axiosInstance.createCancelToken = () => {
  return axios.CancelToken.source();
};

// Add request timeout helper
axiosInstance.setRequestTimeout = (timeout) => {
  axiosInstance.defaults.timeout = timeout;
};

export default axiosInstance;
