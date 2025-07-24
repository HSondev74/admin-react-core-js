import { AxiosRequestConfig } from 'axios';
import axiosInstance from '@/utils/axiosInstance';

/**
 * Base class for API services
 */
class BaseApi {
  private baseEndpoint: string;

  /**
   * Constructor
   * @param baseEndpoint - Base endpoint for the API
   */
  constructor(baseEndpoint: string = '') {
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Create full URL
   * @param endpoint - Endpoint to create URL for
   * @returns Full URL
   */
  protected createUrl(endpoint: string = ''): string {
    return `${this.baseEndpoint}${endpoint}`;
  }

  /**
   * Send GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param config - Additional axios config
   * @returns Promise with response data
   */
  protected async get<T = any>(
    endpoint: string = '',
    params: object = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await axiosInstance.get<T>(this.createUrl(endpoint), {
      params,
      ...config,
    });
    return response.data;
  }

  /**
   * Send POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   * @returns Promise with response data
   */
  protected async post<T = any>(
    endpoint: string = '',
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await axiosInstance.post<T>(
      this.createUrl(endpoint),
      data,
      config
    );
    return response.data;
  }

  /**
   * Send PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   * @returns Promise with response data
   */
  protected async put<T = any>(
    endpoint: string = '',
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await axiosInstance.put<T>(
      this.createUrl(endpoint),
      data,
      config
    );
    return response.data;
  }

  /**
   * Send DELETE request
   * @param endpoint - API endpoint
   * @param config - Additional axios config
   * @returns Promise with response data
   */
  protected async delete<T = any>(
    endpoint: string = '',
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await axiosInstance.delete<T>(
      this.createUrl(endpoint),
      config
    );
    return response.data;
  }
}

export default BaseApi;
