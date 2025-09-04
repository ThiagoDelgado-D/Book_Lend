// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ApiEndpoint<TRequest = unknown, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  requiresAuth?: boolean;
}

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
}

export interface ApiCallOptions {
  headers?: Record<string, string>;
  timeout?: number;
}
