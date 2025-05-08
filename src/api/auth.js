import BaseApi from './BaseApi';

/**
 * Class quản lý các API liên quan đến xác thực người dùng
 */
class AuthApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/auth');
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
      const response = await this.post('/login', credentials);

      // Lưu token vào localStorage
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

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
      const token = this.getToken();

      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await this.post('/logout');

      // Xóa dữ liệu xác thực
      localStorage.removeItem('token');
      localStorage.removeItem('user');

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
      return await this.post('/users/register', userData, { baseURL: import.meta.env.VITE_API_BASE_URL });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa
   * @returns {boolean} - True nếu người dùng đã đăng nhập
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Lấy token xác thực hiện tại
   * @returns {string|null} - Token hiện tại hoặc null nếu chưa đăng nhập
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

// Export instance của AuthApi
const authApi = new AuthApi();
export default authApi;
