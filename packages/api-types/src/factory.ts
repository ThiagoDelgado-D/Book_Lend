/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Author, Book } from 'app-domain';
import { ApiResponse, PaginatedResponse } from './response';
import {
  DetailedAuthResponse,
  RefreshTokenResponse,
  UserProfileResponse,
  VerifyEmailTokenResponse,
} from './auth/auth';
import { AuthorResponse, AuthorsListResponse } from './author/author';
import { BookResponse, BooksListResponse } from './books/book';

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
    message: string;
    data?: T;
  }): ApiResponse<T> {
    if (domainResult.success) {
      return this.success(domainResult.data as T, domainResult.message);
    } else {
      throw this.error(domainResult.message);
    }
  }

  static deleteSuccess(message = 'Resource deleted successfully'): ApiResponse {
    return {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static detailedAuthSuccess(
    token: string,
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      role: string;
      bookLimit: number;
      registrationDate: Date;
    },
    message = 'Login successful'
  ): DetailedAuthResponse {
    return {
      success: true,
      data: { token, user },
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static refreshTokenSuccess(
    token: string,
    message = 'Token refreshed successfully'
  ): RefreshTokenResponse {
    return {
      success: true,
      data: { token },
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static userProfileSuccess(
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      role: string;
      bookLimit: number;
      registrationDate: Date;
      status: string;
      enabled: boolean;
    },
    message = 'Profile retrieved successfully'
  ): UserProfileResponse {
    return {
      success: true,
      data: user,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static verifyEmailSuccess(
    email: string,
    message = 'Email verified successfully'
  ): VerifyEmailTokenResponse {
    return {
      success: true,
      email,
      message,
      timestamp: new Date().toISOString(),
    };
  }

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
