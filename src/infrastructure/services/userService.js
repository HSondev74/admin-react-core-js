import apiClient from '../api/apiClient';

/**
 * Service for user-related API calls
 */
const userService = {
  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update the current user's profile
   * @param {Object} userData - The updated user data
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },

  /**
   * Change the current user's password
   * @param {Object} passwordData - Current and new password
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success/error response
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },

  /**
   * Get a list of users (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of users
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  /**
   * Get a user by ID (admin only)
   * @param {string} userId - The ID of the user to fetch
   * @returns {Promise<Object>} User data
   */
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update a user (admin only)
   * @param {string} userId - The ID of the user to update
   * @param {Object} userData - The updated user data
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete a user (admin only)
   * @param {string} userId - The ID of the user to delete
   * @returns {Promise<Object>} Success/error response
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;
