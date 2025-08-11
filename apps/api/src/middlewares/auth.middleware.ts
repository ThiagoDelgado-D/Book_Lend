import { UUID } from 'app-domain';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

export interface AuthenticatedUser {
  id: UUID;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: { message: 'Too many authentication attempts. Try again later.' },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: { message: 'Too many admin operations. Try again later.' },
    timestamp: new Date().toISOString(),
  },
});

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Access token required' },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(403).json({
      success: false,
      error: { message: 'Invalid or expired token' },
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required' },
      timestamp: new Date().toISOString(),
    });
  }

  if (authReq.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: { message: 'Admin role required' },
      timestamp: new Date().toISOString(),
    });
  }

  return next();
};
