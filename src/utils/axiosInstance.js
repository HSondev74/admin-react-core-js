import axios from 'axios';

/**
 * Tạo một instance của axios với cấu hình mặc định
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Thêm interceptor cho request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Nếu có token, thêm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Thêm interceptor cho response
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi response

    // Nếu lỗi 401 Unauthorized, đăng xuất và chuyển hướng đến trang đăng nhập
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Chuyển hướng đến trang đăng nhập
      window.location.href = '/login';
    }

    // Trả về lỗi để xử lý ở các component
    return Promise.reject(error.response?.data || { message: error.message || 'Đã xảy ra lỗi' });
  }
);

export default axiosInstance;
