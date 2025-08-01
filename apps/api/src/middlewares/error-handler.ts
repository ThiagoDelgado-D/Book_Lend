import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../constants.js';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (error: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error in development
  if (NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};

export const createError = (message: string, statusCode: number = 500): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
