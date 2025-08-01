export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    token: string;
  };
}
