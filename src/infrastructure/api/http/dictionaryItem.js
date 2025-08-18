import BaseApi from './BaseApi';

class DictionaryItem extends BaseApi {
  constructor() {
    super('/dictionary-items');
  }

  /**
   * Lấy danh sách mục từ điển có phân trang và bộ lọc
   * @param {Object} body - Dữ liệu tìm kiếm
   * @param {number} body.page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} body.size - Số lượng bản ghi mỗi trang
   * @param {string} body.sortBy - Sắp xếp bởi
   * @param {string} body.searchTerm - Tìm kiếm theo
   * @param {string} body.sortDirection - Hướng sắp xếp (ASC/DESC)
   * @param {string} body.dictType - Loại từ điển (bắt buộc)
   * @returns {Promise<Object>} - Dữ liệu mục từ điển
   */
  async getAllDictItems(body = {}) {
    try {
      const { page, size, sortBy, searchTerm, sortDirection, dictType } = body;

      if (!dictType) {
        throw new Error('Phải chọn loại từ điển!');
      }

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

      mappedParams['dictType'] = dictType;

      return await this.post(`/search`, mappedParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm mục từ điển theo ID
   * @param {string} id - ID mục từ điển
   * @returns {Promise<Object>} - Dữ liệu mục từ điển
   */
  async findDictItemById(id) {
    try {
      return await this.get(`/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo một mục từ điển
   * @param {Object} roleData - Dữ liệu mục từ điển
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async createDictItem(dictItemData) {
    try {
      return await this.post('', dictItemData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo một mục từ điển
   * @param {Object} roleData - Dữ liệu mục từ điển
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async updateDictItem(dictItemData) {
    try {
      return await this.put('', dictItemData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa một mục từ điển
   * @param {number} id - ID của mục từ điển cần xóa
   * @returns {Promise<Object>} - Kết quả trả về
   */
  async deleteDictItems(ids) {
    try {
      return await this.delete('/batch-delete', ids);
    } catch (error) {
      throw error;
    }
  }
}

const dictionarieItemsApi = new DictionaryItem();
export default dictionarieItemsApi;
