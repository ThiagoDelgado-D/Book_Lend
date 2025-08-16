/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams, SortParams {
  q?: string;
}

export interface BookFilters extends SearchParams {
  categoryId?: string;
  authorId?: string;
  language?: string;
  minRating?: number;
  isAvailable?: boolean;
  publishedYear?: number;
  tags?: string[];
}

export interface AuthorFilters extends SearchParams {
  nationality?: string;
  birthYear?: number;
  isActive?: boolean;
}

export interface CategoryFilters extends SearchParams {
  isActive?: boolean;
  hasBooks?: boolean;
}

// DTOs para creación/actualización
export interface CreateBookRequest {
  title: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  pages?: number;
  language?: string;
  categoryId: string;
  authorIds: string[];
  tags?: string[];
  imageUrl?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export interface CreateAuthorRequest {
  firstName: string;
  lastName: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  website?: string;
}

export interface UpdateAuthorRequest extends Partial<CreateAuthorRequest> {}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}
