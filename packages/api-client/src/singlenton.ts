/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from './client.js';
import type { ApiConfig } from './types.js';

let apiInstance: ApiClient | null = null;

export function createApiInstance(config: ApiConfig): ApiClient {
  if (!apiInstance) {
    apiInstance = new ApiClient(config);

    if (typeof window !== 'undefined') {
      (window as any).__api = apiInstance;
    }
  }
  return apiInstance;
}

export function getApiInstance(): ApiClient {
  if (!apiInstance) {
    throw new Error(
      'API client not initialized. Call createApiInstance({ baseURL: "..." }) first in your main.tsx'
    );
  }
  return apiInstance;
}

export function resetApiInstance(): void {
  apiInstance = null;

  if (typeof window !== 'undefined') {
    delete (window as any).__api;
  }
}
