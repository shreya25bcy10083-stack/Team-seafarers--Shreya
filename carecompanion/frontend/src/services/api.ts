import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';

// Standard mock delay helper for fallback/testing
export const mockDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiClient {
  private static token: string | null = null;
  private static useMockFallback: boolean = true;

  static setToken(token: string | null) {
    ApiClient.token = token;
  }

  static getToken(): string | null {
    return ApiClient.token;
  }

  static setMockFallback(enabled: boolean) {
    ApiClient.useMockFallback = enabled;
  }

  /**
   * Primary HTTP request wrapper connecting frontend services to FastAPI backend.
   */
  static async request<T>(
    endpoint: string,
    options: { method?: string; body?: any; isFormData?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {};

    if (!options.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (ApiClient.token) {
      headers['Authorization'] = `Bearer ${ApiClient.token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.isFormData
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: json.message || `Server returned error ${response.status}`,
          data: json.data || ({} as T),
          errors: json.errors,
        };
      }

      return {
        success: json.success ?? true,
        message: json.message || 'Request successful',
        data: json.data !== undefined ? json.data : (json as unknown as T),
      };
    } catch (error: any) {
      console.log(`[ApiClient] Live API call to ${url} failed or offline:`, error?.message);
      // Fallback response for offline / dev mock mode
      return {
        success: false,
        message: 'Unable to reach backend server. Operating in offline/mock fallback.',
        data: {} as T,
      };
    }
  }
}
