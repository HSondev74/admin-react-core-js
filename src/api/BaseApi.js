import axiosInstance from '../utils/axiosInstance';

/**
 * Class cơ sở cho các API
 */
class BaseApi {
  /**
   * Constructor
   * @param {string} baseEndpoint - Endpoint cơ sở cho API
   */
  constructor(baseEndpoint = '') {
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Tạo URL đầy đủ
   * @param {string} endpoint - Endpoint cần tạo URL
   * @returns {string} - URL đầy đủ
   */
  createUrl(endpoint = '') {
    return `${this.baseEndpoint}${endpoint}`;
  }

  /**
   * Gửi request GET
   * @param {string} endpoint - Endpoint
   * @param {Object} params - Tham số query
   * @param {Object} config - Cấu hình bổ sung
   * @returns {Promise<any>} - Kết quả trả về
   */
  async get(endpoint = '', params = {}, config = {}) {
    try {
      return await axiosInstance.get(this.createUrl(endpoint), {
        params,
        ...config
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi request POST
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Dữ liệu gửi đi
   * @param {Object} config - Cấu hình bổ sung
   * @returns {Promise<any>} - Kết quả trả về
   */
  async post(endpoint = '', data = {}, config = {}) {
    try {
      return await axiosInstance.post(this.createUrl(endpoint), data, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi request PUT
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Dữ liệu gửi đi
   * @param {Object} config - Cấu hình bổ sung
   * @returns {Promise<any>} - Kết quả trả về
   */
  async put(endpoint = '', data = {}, config = {}) {
    try {
      return await axiosInstance.put(this.createUrl(endpoint), data, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi request DELETE
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Dữ liệu gửi đi
   * @param {Object} config - Cấu hình bổ sung
   * @returns {Promise<any>} - Kết quả trả về
   */
  async delete(endpoint = '', data = {}, config = {}) {
    try {
      return await axiosInstance.delete(this.createUrl(endpoint), {
        data,
        ...config
      });
    } catch (error) {
      throw error;
    }
  }
}

export default BaseApi;
