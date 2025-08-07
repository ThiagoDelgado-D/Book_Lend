import { Author } from 'app-domain';
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    stack?: string;
  };
  timestamp?: string;
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

export interface AuthorResponse extends ApiResponse<Author> {}
export interface AuthorsListResponse extends ApiResponse<Author[]> {
  total?: number;
}
export class ApiResponseFactory {
  static success<T>(data: T, message: string = 'Operation successful'): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static successList<T>(
    data: T[],
    message: string = 'Data retrieved successfully',
    includeTotal = true
  ): ApiResponse<T[]> & { total?: number } {
    const response: ApiResponse<T[]> & { total?: number } = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };

    if (includeTotal) {
      response.total = data.length;
    }

    return response;
  }

  static error(message: string, stack?: string): ApiResponse {
    return {
      success: false,
      error: {
        message,
        stack,
      },
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static fromDomainResult<T>(domainResult: {
    success: boolean;
    message: unknown | string;
    data?: T;
  }): ApiResponse<T> {
    if (domainResult.success) {
      return this.success(domainResult.data!, domainResult.message as string);
    } else {
      return this.error(domainResult.message as string);
    }
  }

  static deleteSuccess(message: string = 'Resource deleted successfully'): ApiResponse {
    return {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static authorSuccess(
    author: Author,
    message: string = 'Author operation successful'
  ): AuthorResponse {
    return this.success(author, message);
  }

  static authorsListSuccess(
    authors: Author[],
    message: string = 'Authors retrieved successfully'
  ): AuthorsListResponse {
    return this.successList(authors, message);
  }
}
