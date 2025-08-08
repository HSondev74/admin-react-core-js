import BaseApi from './BaseApi';

class MenuApi extends BaseApi {
  constructor() {
    super('/menus');
  }

  async getMenuTree() {
    try {
      const response = await this.get('/me/tree');
      return response.data;
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }
}

const menuApi = new MenuApi();
export default menuApi;
