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
      return await this.post('/register', userData);
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
      return await this.delete('', userIds);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm người dùng theo tên đăng nhập
   * @param {string} username - Tên đăng nhập cần tìm
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async findUserByUsername(username) {
    try {
      return await this.get(`/${username}`);
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
  async getListUser(params) {
    try {
      const { page, size, role, status, dateFrom, dateTo, searchTerm } = params;

      const paramMap = {
        page: 'page',
        size: 'size',
        role: 'role',
        status: 'status',
        dateFrom: 'startTime',
        dateTo: 'endTime'
      };

      const mappedParams = Object.fromEntries(
        Object.entries({ page, size, role, status, dateFrom, dateTo })
          .filter(([key, value]) => value !== '' && value != null && value !== undefined && paramMap[key])
          .map(([key, value]) => [paramMap[key], value])
      );

      // Xử lý searchTerm
      if (searchTerm && typeof searchTerm === 'string') {
        const isPhone = /^\d{8,15}$/.test(searchTerm.trim()); // ví dụ: chuỗi số từ 8–15 chữ số
        if (isPhone) {
          mappedParams['phone'] = searchTerm.trim();
        } else {
          mappedParams['username'] = searchTerm.trim();
        }
      }

      const queryString = new URLSearchParams(mappedParams).toString();

      return await this.get(`/all?${queryString}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm người dùng theo ID
   * @param {number} id - ID người dùng
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async findUserById(id) {
    try {
      return await this.get(`/user-detail/${id}`);
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
   * Cập nhật thông tin người dùng
   * @param {number} id - ID người dùng
   * @param {Object} userData - Dữ liệu người dùng cập nhật
   * @returns {Promise<Object>} - Dữ liệu người dùng đã cập nhật
   */
  async updateUserInfo(id, userData) {
    try {
      return await this.put(`/user-info/${id}`, userData);
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
      return await this.put(`/update/${id}`, userData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mở khóa người dùng theo tên đăng nhập
   * @param {string} username - Tên đăng nhập cần mở khóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async unlockUser(username) {
    try {
      return await this.put(`/unlock/${username}`, {});
    } catch (error) {
      throw error;
    }
  }

  /**
   * Khóa người dùng theo tên đăng nhập
   * @param {string} username - Tên đăng nhập cần khóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async lockUser(username) {
    try {
      return await this.put(`/lock/${username}`, {});
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
}

// Export instance của UsersApi
const usersApi = new UsersApi();
export default usersApi;
