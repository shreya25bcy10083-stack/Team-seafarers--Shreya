import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';

// Standard mock delay helper for Phase 2 parallel client development
export const mockDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiClient {
  private static token: string | null = null;

  static setToken(token: string | null) {
    ApiClient.token = token;
  }

  static getToken(): string | null {
    return ApiClient.token;
  }

  // Simulated request wrapper adhering to API rules
  static async request<T>(endpoint: string, options: { method?: string; data?: any } = {}): Promise<ApiResponse<T>> {
    // In production integration, this uses Axios.
    // For Phase 2 frontend parallel construction, returns standardized API responses.
    await mockDelay();
    return {
      success: true,
      message: 'Request successful',
      data: {} as T,
    };
  }
}
