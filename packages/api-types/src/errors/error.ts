/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}
