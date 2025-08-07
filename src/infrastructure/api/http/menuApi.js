import BaseApi from './BaseApi';

class MenuApi extends BaseApi {
  constructor() {
    super('/menus');
  }

  async getMenuTree() {
    console.log('Calling menu API...');
    try {
      const response = await this.get('/tree/all');
      console.log('Menu API response:', response);
      return response.data;
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }
}

const menuApi = new MenuApi();
export default menuApi;