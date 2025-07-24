import BaseApi from './BaseApi';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // Add other user properties as needed
  };
}

interface RegisterData extends LoginCredentials {
  name: string;
  // Add other registration fields as needed
}

/**
 * Class for handling authentication related API calls
 */
class AuthApi extends BaseApi {
  /**
   * Constructor
   */
  constructor() {
    super('/auth');
  }

  /**
   * Login with email and password
   * @param credentials - Login credentials
   * @returns Promise with login response
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/login', credentials);

      // Save token to localStorage
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: RegisterData): Promise<{ message: string }> {
    try {
      return await this.post('/register', userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   * @returns Promise with logout response
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.post('/logout');
      // Remove token from localStorage on logout
      localStorage.removeItem('token');
      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns Promise with user profile data
   */
  async getProfile(): Promise<LoginResponse['user']> {
    try {
      const response = await this.get<{ user: LoginResponse['user'] }>('/profile');
      return response.user;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Get authentication token
   * @returns Authentication token or null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

// Export an instance of AuthApi
const authApi = new AuthApi();
export default authApi;
