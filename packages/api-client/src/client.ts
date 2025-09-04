import { EndpointKey, API_ENDPOINTS } from './endpoints.js';
import type { ApiConfig, ApiCallOptions, ApiEndpoint } from './types.js';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL.replace(/\/+$/, '');
    this.timeout = config.timeout || 10000;
  }

  // Token management
  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  async call(
    endpoint: EndpointKey,
    payload?: Record<string, unknown>,
    options: ApiCallOptions = {}
  ): Promise<unknown> {
    const endpointConfig = API_ENDPOINTS[endpoint];

    if (!endpointConfig) {
      throw new Error(`Endpoint "${endpoint}" not found`);
    }

    return this.makeRequest(endpointConfig, payload, options);
  }

  private async makeRequest<T>(
    endpoint: ApiEndpoint,
    payload?: Record<string, unknown>,
    options: ApiCallOptions = {}
  ): Promise<T> {
    const { method, path, requiresAuth } = endpoint;

    let url = this.baseURL + this.interpolatePath(path, payload);

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(options.timeout || this.timeout),
    };

    if (requiresAuth && this.token) {
      (requestInit.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    if (method === 'GET' && payload) {
      const searchParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    } else if (payload && method !== 'GET') {
      requestInit.body = JSON.stringify(payload);
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${method} ${url}`, payload);
      }

      const response = await fetch(url, requestInit);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${method} ${url}`, data);
      }

      // Auto-set token for login endpoints
      if (path === '/auth/login' && data.success && data.data?.token) {
        this.setToken(data.data.token);
      }

      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${method} ${url}`, error);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(error instanceof Error ? error.message : 'Network error', 0);
    }
  }

  private interpolatePath(path: string, payload: Record<string, unknown>): string {
    if (!payload) return path;

    return path.replace(/\{(\w+)\}/g, (match, key) => {
      const value = payload[key];
      if (value != null) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete payload[key];
        return encodeURIComponent(String(value));
      }
      return match;
    });
  }
}
