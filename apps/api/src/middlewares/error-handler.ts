import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../constants.js';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const getDomainErrorStatusCode = (message: string): number => {
  const errorMappings: Record<number, string[]> = {
    400: [
      'required',
      'invalid email',
      'invalid format',
      'missing',
      'validation failed',
      'birth date',
      'death date',
      'invalid date',
    ],
    401: [
      'authentication required',
      'token required',
      'invalid token',
      'expired token',
      'unauthorized',
    ],
    403: [
      'access denied',
      'admin role required',
      'admin privileges required',
      'forbidden',
      'insufficient permissions',
    ],
    404: ['not found', 'user not found', 'author not found', 'does not exist'],
    409: ['already exists', 'duplicate', 'conflict', 'unique constraint'],
    422: ['validation error', 'invalid data', 'processing failed'],
  };

  const lowerMessage = message.toLowerCase();

  for (const [statusCode, keywords] of Object.entries(errorMappings)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return Number(statusCode);
    }
  }

  return 400;
};

export const errorHandler = (error: ApiError, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  if (!error.statusCode && error.message) {
    statusCode = getDomainErrorStatusCode(error.message);
  }

  if (NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      statusCode,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  } else {
    console.error(`${statusCode} - ${message} - ${req.method} ${req.url} - IP: ${req.ip}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(NODE_ENV === 'development' && {
        stack: error.stack,
        statusCode,
      }),
    },
    timestamp: new Date().toISOString(),
  });
};

export const createError = (message: string, statusCode?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode || getDomainErrorStatusCode(message);
  error.isOperational = true;
  return error;
};

export const createDomainError = (message: string): ApiError => {
  return createError(message, getDomainErrorStatusCode(message));
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
