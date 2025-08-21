import BaseApi from './BaseApi';

/**
 * Class quản lý các API liên quan đến timekeeping
 */
class TimeKeepingApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/timekeeping');
  }

  /**
   * Lấy danh sách dữ liệu timekeeping với search và filter
   * @param {Object} body - Dữ liệu tìm kiếm và filter
   * @param {number} body.page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} body.size - Số lượng bản ghi mỗi trang
   * @param {string} body.name - Tìm kiếm theo tên nhân viên
   * @param {string} body.departmentName - Tìm kiếm theo tên phòng ban
   * @param {string} body.workDateFrom - Lọc từ ngày (YYYY-MM-DD)
   * @param {string} body.workDateTo - Lọc đến ngày (YYYY-MM-DD)
   * @param {string} body.period - Lọc theo ca làm việc
   * @param {string} body.checkType - Lọc theo loại chấm công (CHECK_IN/CHECK_OUT)
   * @param {string} body.status - Lọc theo trạng thái
   * @param {string} body.source - Lọc theo nguồn
   * @param {string} body.deviceCode - Lọc theo mã thiết bị
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async getAllTimekeeping(body = {}) {
    try {
      const { page, size, name, departmentName, workDateFrom, workDateTo, period, checkType, status, source, deviceCode } = body;

      const paramMap = {
        name: 'name',
        departmentName: 'departmentName',
        workDateFrom: 'workDateFrom',
        workDateTo: 'workDateTo',
        period: 'period',
        checkType: 'checkType',
        status: 'status',
        source: 'source',
        deviceCode: 'deviceCode'
      };

      // Tạo object chứa các params cần thiết từ body
      const paramsObject = {
        name,
        departmentName,
        workDateFrom,
        workDateTo,
        period,
        checkType,
        status,
        source,
        deviceCode
      };

      const mappedParams = Object.fromEntries(
        Object.entries(paramsObject)
          .filter(([key, value]) => {
            // Lọc các giá trị hợp lệ
            if (value === '' || value == null || value === undefined) return false;
            // Đối với string, trim và kiểm tra không rỗng
            if (typeof value === 'string' && value.trim() === '') return false;
            // Kiểm tra key có trong paramMap
            return paramMap[key];
          })
          .map(([key, value]) => [paramMap[key], typeof value === 'string' ? value.trim() : value])
      );

      return await this.post('/export-data', mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thực hiện Check-out (Legacy - Không sử dụng hệ thống lịch)
   * @param {Object} reqBody - Dữ liệu check-out
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async checkoutLegacy(reqBody) {
    try {
      return await this.post('/legacy/check-out', reqBody);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thực hiện Check-in (Legacy - Không sử dụng hệ thống lịch)
   * @param {Object} reqBody - Dữ liệu check-in
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async checkinLegacy(reqBody) {
    try {
      return await this.post('/legacy/check-in', reqBody);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thực hiện Check-out với hệ thống lịch làm việc mới
   * @param {Object} reqBody - Dữ liệu check-out
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async checkout(reqBody) {
    try {
      return await this.post('/check-out', reqBody);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thực hiện Check-in với hệ thống lịch làm việc mới
   * @param {Object} reqBody - Dữ liệu check-in
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async checkin(reqBody) {
    try {
      return await this.post('/check-in', reqBody);
    } catch (error) {
      throw error;
    }
  }
}

// Export instance của TimeKeepingApi
const timeKeepingApi = new TimeKeepingApi();
export default timeKeepingApi;
