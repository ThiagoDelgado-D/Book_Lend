/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Author, Book } from 'app-domain';

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

export interface BookResponse extends ApiResponse<Book> {}
export interface BooksListResponse extends ApiResponse<Book[]> {
  total?: number;
}
