import BaseApi from './BaseApi';

class WorkScheduleApi extends BaseApi {
  constructor() {
    super('/work-schedule');
  }

  /**
   * Lấy danh sách lịch làm việc có phân trang
   * @param {Object} params - Tham số query
   * @param {number} params.page - Trang hiện tại (bắt đầu từ 1)
   * @param {number} params.size - Số lượng bản ghi mỗi trang
   * @param {string} params.sortBy - Sắp xếp bởi
   * @param {string} params.searchTerm - Tìm kiếm theo
   * @param {string} params.sortDirection - Sắp xếp theo
   * @param {string} params.name - Tên lịch làm việc
   * @param {boolean} params.isActive - Trạng thái hoạt động
   * @param {boolean} params.isDefault - Lịch mặc định
   * @returns {Promise<Object>} - Dữ liệu lịch làm việc
   */
  async getAllSchedules(params = {}) {
    try {
      const { page, size, sortBy, sortDirection, searchTerm, isActive, isDefault } = params;
      const paramMap = {
        page: 'page',
        size: 'size',
        sortBy: 'sortBy',
        sortDirection: 'sortDirection',
        isActive: 'isActive',
        isDefault: 'isDefault'
      };

      const paramsObject = {
        page,
        size,
        sortBy,
        sortDirection,
        isActive,
        isDefault
      };

      const mappedParams = Object.fromEntries(
        Object.entries(paramsObject)
          .filter(([key, value]) => value !== '' && value != null && value !== undefined && paramMap[key])
          .map(([key, value]) => [paramMap[key], value])
      );

      if (searchTerm && typeof searchTerm === 'string') {
        mappedParams['name'] = searchTerm.trim();
      }

      return await this.get('/schedules', mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết lịch làm việc theo ID
   * @param {string|number} scheduleId - ID lịch làm việc
   * @returns {Promise<Object>} - Chi tiết lịch làm việc
   */
  async getScheduleById(scheduleId) {
    try {
      return await this.get(`/schedules/${scheduleId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo lịch làm việc mới
   * @param {Object} scheduleData - Dữ liệu lịch làm việc
   * @returns {Promise<Object>} - Lịch làm việc đã tạo
   */
  async createSchedule(scheduleData) {
    try {
      return await this.post('/schedules', scheduleData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật lịch làm việc
   * @param {string|number} id - ID lịch làm việc
   * @param {Object} scheduleData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Lịch làm việc đã cập nhật
   */
  async updateSchedulebyId(scheduleId, scheduleData) {
    try {
      return await this.put(`/schedules/${scheduleId}`, scheduleData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa lịch làm việc
   * @param {string|number} scheduleId - ID lịch làm việc
   * @returns {Promise<Object>} - response
   */
  async deleteScheduleById(scheduleId) {
    try {
      return await this.delete(`/schedules/${scheduleId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch làm việc hiệu lực cho user
   * @param {string|number} userId - ID của user
   * @returns {Promise<Object>} - response
   */
  async getEffctiveScheduleOfUser(userId) {
    try {
      return await this.get(`/effective-schedule/${userId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gán lịch làm việc cho user
   * @param {string|number} userId - ID của user
   * @param {string|number} scheduleId - ID lịch làm việc
   * @returns {Promise<Object>} - response
   */
  async assignScheduleForUser(userId, scheduleId) {
    try {
      return await this.post(`/assign-schedule-user?userId=${userId}&scheduleId=${scheduleId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gán lịch làm việc cho user
   * @param {string|number} departmentId - ID của department
   * @param {string|number} scheduleId - ID lịch làm việc
   * @returns {Promise<Object>} - response
   */
  async assignScheduleForDept(departmentId, scheduleId) {
    try {
      return await this.post(`/assign-schedule-dept?departmentId=${departmentId}&scheduleId=${scheduleId}`);
    } catch (error) {
      throw error;
    }
  }
}

const workScheduleApi = new WorkScheduleApi();
export default workScheduleApi;
