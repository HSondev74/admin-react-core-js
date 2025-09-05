import BaseApi from './BaseApi';

class DepartmentApi extends BaseApi {
  constructor() {
    super('/departments');
  }

  /**
   * @returns {Promise<Object>} - Dữ liệu phòng ban
   */
  async getAllDepartmentTree() {
    try {
      const response = await this.get('/tree');
      return response.data;
    } catch (error) {
      console.error('Department API error:', error);
      throw error;
    }
  }

  /**
   * @param {Object} formData - Dữ liệu page, size, sortBy, searchTerm, sortDirection, keyword, parentId
   * @returns {Promise<Object>} -Dữ liệu phòng ban
   */
  async getAllDepartmentAndSearch(formData) {
    try {
      const response = await this.post('/search', formData);
      return response.data;
    } catch (error) {
      console.error('Department API error:', error);
      throw error;
    }
  }

  /**
   * Thêm mới phòng ban
   * @param {*} formData - Dữ liệu gửi lên như name, code, parentId
   * @returns {Promise<Object>} - Dữ liệu phòng ban
   */
  async addNewDepartment(formData) {
    try {
      const response = await this.post('', formData);
      return response.data;
    } catch (error) {
      console.error('Department API error:', error);
      throw error;
    }
  }

  /**
   * Xóa phòng ban
   * @param {*} id - ID phòng ban
   * @returns {Promise<Object>} - Dữ liệu phòng ban
   */
  async deleteDepartment(id) {
    try {
      const response = await this.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Department API error:', error);
      throw error;
    }
  }

  /**
   * Cập nhật phòng ban
   * @param {*} id - ID phòng ban
   * @param {*} formData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Dữ liệu phòng ban
   */
  async updateDepartment(id, formData) {
    try {
      const response = await this.put(`/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Department API error:', error);
      throw error;
    }
  }
}

const departmentApi = new DepartmentApi();
export default departmentApi;
