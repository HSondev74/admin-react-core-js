import axiosInstance from '../../../app/config/axiosInstance';
import BaseApi from './BaseApi';

/**
 * Class quản lý các API liên quan đến người dùng
 */
class UsersApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/users');
  }

  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Thông tin người dùng đăng ký
   * @returns {Promise<Object>} - Kết quả đăng ký với dữ liệu người dùng
   */
  async register(userData) {
    try {
      return await this.post('', userData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa người dùng theo ID
   * @param {string} userId - ID người dùng cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteUser(userId) {
    try {
      return await this.delete(`/${userId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa người dùng theo danh sách ID
   * @param {Array<number>} userIds - Danh sách ID người dùng cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteUsers(userIds) {
    try {
      return await this.delete('', { ids: userIds });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách người dùng có phân trang
   * @param {number} page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} size - Số lượng bản ghi mỗi trang
   * @param {string} role - Vai trò (tùy chọn)
   * @param {string} status - Trạng thái (tùy chọn)
   * @param {string} dateFrom - Ngày bắt đầu (tùy chọn)
   * @param {string} dateTo - Ngày kết thúc (tùy chọn)
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async getListUser(body = {}) {
    try {
      const { page, size, sortBy, searchTerm, sortDirection, roleIds } = body;

      const paramMap = {
        page: 'page',
        size: 'size',
        sortBy: 'sortBy',
        sortDirection: 'sortDirection'
      };

      // Tạo object chứa các params cần thiết từ body
      const paramsObject = {
        page,
        size,
        sortBy,
        sortDirection
      };

      const mappedParams = Object.fromEntries(
        Object.entries(paramsObject)
          .filter(([key, value]) => value !== '' && value != null && value !== undefined && paramMap[key])
          .map(([key, value]) => [paramMap[key], value])
      );

      // Xử lý searchTerm
      if (searchTerm && typeof searchTerm === 'string') {
        mappedParams['username'] = searchTerm.trim();
      }

      // Xử lý roleIds
      if (Array.isArray(roleIds) && roleIds.length > 0) {
        mappedParams['roleIds'] = roleIds;
      }

      return await this.post(`/search`, mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm người dùng theo ID
   * @param {string} id - ID người dùng
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async findUserById(id) {
    try {
      return await this.get(`/${id}`); // GET /api/users/{id}
    } catch (error) {
      throw error;
    }
  }

  /**
   * Truy vấn thông tin người dùng theo ID
   * @param {number} id - ID người dùng (tùy chọn, sử dụng người dùng hiện tại nếu không cung cấp)
   * @returns {Promise<Object>} - Thông tin người dùng
   */
  async getUserInfo(id) {
    try {
      const params = id ? { id } : {};
      return await this.get('/info', params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm người dùng theo tên đăng nhập hoặc số điện thoại
   * @param {string} searchKey - Tên đăng nhập hoặc số điện thoại cần tìm
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async findUser(searchKey) {
    try {
      return await this.get('/find', { searchKey });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật người dùng
   * @param {number} id - ID người dùng
   * @param {Object} userData - Dữ liệu người dùng cập nhật
   * @returns {Promise<Object>} - Dữ liệu người dùng đã cập nhật
   */
  async updateUser(id, userData) {
    try {
      return await this.put(`/${id}`, userData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mở khóa người dùng theo tên đăng nhập
   * @param {string} username - Tên đăng nhập cần mở khóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async unlockUser(userData) {
    try {
      return await this.post('/unlock', userData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Khóa người dùng theo tên đăng nhập
   * @param {string} userData - Dữ liệu người dùng cần khóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async lockUser(userData) {
    try {
      return await this.post('/lock', userData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đổi mật khẩu cho người dùng
   * @param {Object} passwordData - Dữ liệu đổi mật khẩu
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async changePassword(passwordData) {
    try {
      return await this.put('/change-password', passwordData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * User reset password by email
   * @param {Object} resetData - Dữ liệu reset mật khẩu
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async resetPasswordUser(resetData) {
    try {
      return await this.post('/reset-password-user', resetData);
    } catch (error) {
      throw error;
    }
  }
}

// Export instance của UsersApi
const usersApi = new UsersApi();
export default usersApi;
