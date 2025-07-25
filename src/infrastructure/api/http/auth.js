import BaseApi from './BaseApi';
import { getCookie, removeCookie } from '../../../app/utils/cookies';

/**
 * Class quản lý các API liên quan đến xác thực người dùng
 */
class AuthApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('');
  }

  /**
   * Đăng nhập với email và mật khẩu
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.email - Email người dùng
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise<Object>} - Kết quả đăng nhập với dữ liệu người dùng và token
   */
  async login(credentials) {
    try {
      const response = await this.post('/auth/login', credentials);
      // Lưu token vào localStorage
      // if (response.data?.accessToken) {
      //   localStorage.setItem('accessToken', response.data?.accessToken);
      // }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng xuất người dùng hiện tại
   * @returns {Promise<Object>} - Kết quả đăng xuất
   */
  async logout() {
    try {
      const response = await this.post('/auth/logout');

      // Xóa dữ liệu xác thực từ cookie
      removeCookie('refreshToken');
      removeCookie('accessToken');
      removeCookie('user');

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Thông tin người dùng đăng ký
   * @returns {Promise<Object>} - Kết quả đăng ký với dữ liệu người dùng
   */
  async register(userData) {
    try {
      // API đăng ký nằm trong /users/register
      return await this.post('/auth/users/register', userData, { baseURL: import.meta.env.VITE_API_BASE_URL });
    } catch (error) {
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = getCookie('refreshToken');
    const response = await this.post('/token/refresh', { refreshToken });
    return response;
  }

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa
   * @returns {boolean} - True nếu người dùng đã đăng nhập
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Lấy token xác thực hiện tại từ cookie
   * @returns {string|null} - Token hiện tại hoặc null nếu chưa đăng nhập
   */
  getToken() {
    return getCookie('accessToken');
  }
}

// Export instance của AuthApi
const authApi = new AuthApi();
export default authApi;
