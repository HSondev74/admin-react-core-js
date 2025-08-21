import BaseApi from './BaseApi';

/**
 * Class quản lý các API liên quan đến vai trò (roles)
 */
class RolesApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/roles');
  }

  /**
   * Lấy danh sách tất cả các vai trò
   * @param {Object} body - Dữ liệu tìm kiếm
   * @param {number} body.page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} body.size - Số lượng bản ghi mỗi trang
   * @param {string} body.sortBy - Sắp xếp bởi
   * @param {string} body.searchTerm - Tìm kiếm theo
   * @param {string} body.sortDirection - Sắp xếp theo
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async getAllRoles(body = {}) {
    try {
      const { page, size, sortBy, searchTerm, sortDirection, code, name, description, dateFrom, dateTo } = body;

      const paramMap = {
        page: 'page',
        size: 'size',
        sortBy: 'sortBy',
        sortDirection: 'sortDirection',
        code: 'code',
        name: 'name',
        description: 'description',
        dateFrom: 'dateFrom',
        dateTo: 'dateTo'
      };

      // Tạo object chứa các params cần thiết từ body
      const paramsObject = {
        page,
        size,
        sortBy,
        sortDirection,
        code,
        name,
        description,
        dateFrom,
        dateTo
      };

      const mappedParams = Object.fromEntries(
        Object.entries(paramsObject)
          .filter(([key, value]) => value !== '' && value != null && value !== undefined && paramMap[key])
          .map(([key, value]) => [paramMap[key], value])
      );

      // Xử lý searchTerm (fallback cho search chung)
      if (searchTerm && typeof searchTerm === 'string') {
        mappedParams['name'] = searchTerm.trim();
      }

      return await this.post(`/search`, mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết của một vai trò
   * @param {number} id - ID của vai trò
   * @returns {Promise<Object>} - Thông tin vai trò
   */
  async getRoleById(id) {
    try {
      return await this.get(`/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo một vai trò mới
   * @param {Object} roleData - Dữ liệu vai trò mới
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async createRole(roleData) {
    try {
      return await this.post('', roleData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật một vai trò đã có
   * @param {Object} roleData - Dữ liệu vai trò cập nhật
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async updateRole(roleData) {
    try {
      return await this.put('', roleData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa một vai trò
   * @param {number} id - ID của vai trò cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteRoles(itemToDelete) {
    try {
      return await this.delete('', itemToDelete);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm và phân trang các vai trò
   * @param {Object} searchParams - Tham số tìm kiếm và phân trang
   * @returns {Promise<Object>} - Kết quả tìm kiếm
   */
  async searchRoles(searchParams) {
    try {
      return await this.post('/search', searchParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách các quyền của một vai trò
   * @param {number} roleId - ID của vai trò
   * @returns {Promise<Object>} - Danh sách quyền
   */
  async getRolePermissions(roleId) {
    try {
      return await this.get(`/${roleId}/permissions`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách các menu của một vai trò
   * @param {number} roleId - ID của vai trò
   * @returns {Promise<Object>} - Danh sách menu
   */
  async getRoleMenus(roleId) {
    try {
      return await this.get(`/${roleId}/menus`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gán quyền cho một vai trò
   * @param {Object} permissionData - Dữ liệu gán quyền
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async assignPermissions(permissionData) {
    try {
      return await this.post('/assign-permissions', permissionData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gán menu cho một vai trò
   * @param {Object} menuData - Dữ liệu gán menu
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async assignMenus(menuData) {
    try {
      return await this.post('/assign-menus', menuData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gán role cho nhiều users
   * @param {Object} reqBody - Dữ liệu gán role
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async assignRoleToUsers(reqBody) {
    try {
      return await this.post('/assign-role-to-users', reqBody);
    } catch (error) {
      throw error;
    }
  }
}

// Export instance của RolesApi
const rolesApi = new RolesApi();
export default rolesApi;
