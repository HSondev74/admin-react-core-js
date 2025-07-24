import BaseApi from './BaseApi';
import { ApiResponse, PaginatedResponse, PaginationParams, User } from './types';

// Define specific types for the users API
export interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  // Add other filter parameters as needed
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  // Add other updateable fields as needed
}

/**
 * Class for handling user-related API calls
 */
class UsersApi extends BaseApi {
  constructor() {
    super('/users');
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with the created user data
   */
  async register(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>('/register', userData);
  }

  /**
   * Get current user's profile
   * @returns Promise with the user's profile data
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>('/me');
  }

  /**
   * Get user by ID
   * @param userId - ID of the user to fetch
   * @returns Promise with the user data
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>(`/${userId}`);
  }

  /**
   * Get all users with pagination
   * @param filters - Filter and pagination parameters
   * @returns Promise with paginated user data
   */
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.get<ApiResponse<PaginatedResponse<User>>>('/', { params: filters });
  }

  /**
   * Update user by ID
   * @param userId - ID of the user to update
   * @param userData - Data to update
   * @returns Promise with the updated user data
   */
  async updateUser(userId: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    return this.put<ApiResponse<User>>(`/${userId}`, userData);
  }

  /**
   * Delete users by IDs
   * @param userIds - Array of user IDs to delete
   * @returns Promise with the deletion result
   */
  async deleteUsers(userIds: string[]): Promise<ApiResponse<{ count: number }>> {
    return this.delete<ApiResponse<{ count: number }>>('/', {
      data: { ids: userIds },
    });
  }

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with the result
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/change-password', {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Request password reset
   * @param email - User's email address
   * @returns Promise with the result
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/request-password-reset', { email });
  }

  /**
   * Reset password with token
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Promise with the result
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/reset-password', {
      token,
      newPassword,
    });
  }
}

// Export an instance of UsersApi
const usersApi = new UsersApi();
export default usersApi;
