import BaseApi from './BaseApi';
import axiosInstance from '../../../app/config/axiosInstance';

class MenuApi extends BaseApi {
  constructor() {
    super('/menus');
  }

  async getAllMenuTree() {
    try {
      const response = await this.get('/tree/all');
      return response.data;
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
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

  async addNewMenuItem(formData) {
    try {
      await this.post('', formData);
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }

  // Get roles to assign to menu items
  async getRoles() {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }

  // Handle delete menu item
  async deleteMenuItem(id) {
    try {
      await this.delete(`/${id}`);
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }

  async updateMenuItem(formData, menuId) {
    try {
      await this.put(`/${menuId}`, formData);
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }

  async deleteRoleFromMenu(menuId, roleId) {
    try {
      await this.delete(`/${menuId}/roles/${roleId}`);
    } catch (error) {
      console.error('Menu API error:', error);
      throw error;
    }
  }
}

const menuApi = new MenuApi();
export default menuApi;
