/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Author, Book } from 'app-domain';
import {
  ApiResponse,
  PaginatedResponse,
  AuthorResponse,
  AuthorsListResponse,
  BookResponse,
  BooksListResponse,
} from './response';

export class ApiResponseFactory {
  static success<T>(data: T, message = 'Operation successful'): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static successList<T>(
    data: T[],
    message = 'Data retrieved successfully',
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
    message = 'Data retrieved successfully'
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

  static deleteSuccess(message = 'Resource deleted successfully'): ApiResponse {
    return {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  // Métodos específicos por dominio
  static authorSuccess(author: Author, message = 'Author operation successful'): AuthorResponse {
    return this.success(author, message);
  }

  static authorsListSuccess(
    authors: Author[],
    message = 'Authors retrieved successfully'
  ): AuthorsListResponse {
    return this.successList(authors, message);
  }

  static bookSuccess(book: Book, message = 'Book operation successful'): BookResponse {
    return this.success(book, message);
  }

  static booksListSuccess(
    books: Book[],
    message = 'Books retrieved successfully'
  ): BooksListResponse {
    return this.successList(books, message);
  }
}
