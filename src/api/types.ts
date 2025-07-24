// Common API response type
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other user properties as needed
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  // Add other registration fields as needed
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
  tokenType?: string;
}

// Menu related types
export interface MenuItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  url?: string;
  icon?: React.ReactNode;
  breadcrumbs?: boolean;
  children?: MenuItem[];
  // Add other menu item properties as needed
}

// API error type
export interface ApiError extends Error {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

// Generic response types for pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

// Query parameters for paginated requests
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Export all types
export * from './auth';
export * from './users';
// Add other module types as needed
