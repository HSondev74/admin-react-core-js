import BaseApi from './BaseApi';

/**
 * Class quản lý các API liên quan đến người dùng
 */
class RolesApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/system/role');
  }

  /**
   * Thêm chức vụ mới
   * @param {Object} roleData - Dữ liệu chức vụ
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
   * Xóa chức vụ theo danh sách ID
   * @param {Array<number>} roleIds - Danh sách ID chức vụ cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteRoles(roleIds) {
    try {
      return await this.delete('/lock', roleIds);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách chức vụ
   * @returns {Promise<Object>} - Dữ liệu chức vụ
   */
  async getListRole() {
    try {
      const response = await this.get(`/list`);
      if (response && response.data) {
        return this.mapRoleData(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  mapRoleData(response) {
    if (response && response.data && Array.isArray(response.data)) {
      const mappedData = response.data.map((item) => ({
        id: item.roleId,
        roleName: item.roleName,
        roleCode: item.roleCode,
        roleDesc: item.roleDesc,
        delFlag: item.delFlag,
        updateBy: item.updateBy,
        createTime: item.createTime,
        updateTime: item.updateTime
      }));
      return { ...response, data: mappedData };
    }
    return response;
  }

  /**
   * Tìm chức vụ theo ID
   * @param {number} id - ID chức vụ
   * @returns {Promise<Object>} - Dữ liệu chức vụ
   */
  async findRoleById(id) {
    try {
      return await this.get(`/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật chức vụ
   * @param {number} id - ID chức vụ
   * @param {Object} roleData - Dữ liệu chức vụ cập nhật
   * @returns {Promise<Object>} - Dữ liệu
   */
  async updateRole(id, roleData) {
    try {
      return await this.put(`/${id}`, roleData);
    } catch (error) {
      throw error;
    }
  }
}

// Export instance của RolesApi
const rolesApi = new RolesApi();
export default rolesApi;
