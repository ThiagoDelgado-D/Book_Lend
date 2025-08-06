import { Request, Response } from 'express';
import {
  sendEmailVerification,
  verifyEmailToken,
  completeRegistration,
  UserStatus,
} from 'app-domain';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { UserServiceImpl } from '../services/user.service.js';
import { EmailVerificationServiceImpl } from '../services/email-verification.service.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { asyncHandler, createDomainError } from '../middlewares/error-handler.js';
import jwt from 'jsonwebtoken';

const authService = new UserServiceImpl();
const emailVerificationService = new EmailVerificationServiceImpl();
const cryptoService = new CryptoServiceImplementation();

export const authController = {
  sendEmailVerification: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw createDomainError('Email is required');
    }

    const result = await sendEmailVerification(
      {
        authService,
        emailVerificationService,
        cryptoService,
      },
      { email }
    );

    if (!result.success) {
      throw createDomainError(result.message);
    }

    res.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  }),
  verifyEmailToken: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
      throw createDomainError('Token is required');
    }
    const result = await verifyEmailToken({ emailVerificationService }, { token });

    if (!result.success) {
      throw createDomainError(result.message);
    }
    res.json({
      success: true,
      email: result.email,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  }),
  completeRegistration: asyncHandler(async (req: Request, res: Response) => {
    const { token, firstName, lastName, phoneNumber, password } = req.body;

    if (!token || !firstName || !lastName || !password) {
      throw createDomainError('Token, firstName, lastName, and password are required');
    }
    const result = await completeRegistration(
      {
        authService,
        emailVerificationService,
        cryptoService,
      },
      {
        token,
        firstName,
        lastName,
        phoneNumber,
        password,
      }
    );
    if (!result.success) {
      throw createDomainError(result.message);
    }
    res.status(201).json({
      success: true,
      data: result.user,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  }),
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createDomainError('Email and password are required');
    }

    const user = await authService.findByEmail(email);

    if (!user) {
      throw createDomainError('Invalid email or password');
    }

    if (!user.enabled || user.status !== UserStatus.ACTIVE) {
      throw createDomainError('Account is not active');
    }

    const isValidPassword = await cryptoService.comparePassword(password, user.hashedPassword);

    if (!isValidPassword) {
      throw createDomainError('Invalid email or password');
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw createDomainError('Server configuration error');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: '24h',
        algorithm: 'HS256',
      }
    );
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          bookLimit: user.bookLimit,
          registrationDate: user.registrationDate,
        },
      },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    });
  }),
  refreshToken: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    const currentUser = await authService.findById(user.id);

    if (!currentUser || !currentUser.enabled || currentUser.status !== UserStatus.ACTIVE) {
      throw createDomainError('User not found or inactive');
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw createDomainError('Server configuration error');
    }

    const newToken = jwt.sign(
      {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
      },
      jwtSecret,
      {
        expiresIn: '24h',
        algorithm: 'HS256',
      }
    );

    res.json({
      success: true,
      data: { token: newToken },
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString(),
    });
  }),
  getProfile: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;

    const user = await authService.findById(userId);
    if (!user) {
      throw createDomainError('User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        bookLimit: user.bookLimit,
        registrationDate: user.registrationDate,
        status: user.status,
        enabled: user.enabled,
      },
      message: 'Profile retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  }),
};
