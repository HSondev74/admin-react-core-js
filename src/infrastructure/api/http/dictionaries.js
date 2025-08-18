import BaseApi from './BaseApi';

class DictionariesApi extends BaseApi {
  constructor() {
    super('/dictionaries');
  }

  /**
   * Lấy danh sách người dùng có phân trang
   * @param {Object} body - Dữ liệu tìm kiếm
   * @param {number} body.page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} body.size - Số lượng bản ghi mỗi trang
   * @param {string} body.sortBy - Sắp xếp bởi
   * @param {string} body.searchTerm - Tìm kiếm theo
   * @param {string} body.sortDirection - Sắp xếp theo
   * @returns {Promise<Object>} - Dữ liệu người dùng
   */
  async getAllDicts(body = {}) {
    try {
      const { page, size, sortBy, searchTerm, sortDirection } = body;

      const paramMap = {
        page: 'page',
        size: 'size',
        sortBy: 'sortBy',
        sortDirection: 'sortDirection'
      };

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

      if (searchTerm && typeof searchTerm === 'string') {
        mappedParams['name'] = searchTerm.trim();
      }

      return await this.post(`/search`, mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm từ điển theo ID
   * @param {string} id - ID từ điển
   * @returns {Promise<Object>} - Dữ liệu từ điển
   */
  async findDictById(id) {
    try {
      return await this.get(`/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo một từ điển
   * @param {Object} roleData - Dữ liệu từ điển
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async createDict(dictData) {
    try {
      return await this.post('', dictData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo một từ điển
   * @param {Object} roleData - Dữ liệu từ điển
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async updateDict(dictData) {
    try {
      return await this.put('', dictData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa một từ điển
   * @param {number} id - ID của từ điển cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteDicts(ids) {
    try {
      return await this.delete('/batch-delete', ids);
    } catch (error) {
      throw error;
    }
  }
}

const dictionariesApi = new DictionariesApi();
export default dictionariesApi;
