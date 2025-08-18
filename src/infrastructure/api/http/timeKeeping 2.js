import BaseApi from './BaseApi';

class TimeKeepingApi extends BaseApi {
  constructor() {
    super('/timekeeping');
  }

  /**
   * Lấy danh sách dữ liệu timekeeping
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async getAllTimekeeping() {
    try {
      return await this.get('/export-data');
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

const timeKeepingApi = new TimeKeepingApi();
export default timeKeepingApi;
