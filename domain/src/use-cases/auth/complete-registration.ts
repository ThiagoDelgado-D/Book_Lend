import { User, UserStatus, filterSecureProperties, SecureUser, UserRole } from '../../entities';
import { AuthService } from '../../services/auth-service';
import { EmailVerificationService } from '../../services/email-verification-service';
import { CryptoService } from '../../services/crypto-service';
import { Email } from '../../types/email';

export interface CompleteRegistrationDependencies {
  authService: AuthService;
  emailVerificationService: EmailVerificationService;
  cryptoService: CryptoService;
}

export interface CompleteRegistrationRequest {
  token: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
}

export interface CompleteRegistrationResponse {
  success: boolean;
  message: string;
  user?: SecureUser;
}

export const completeRegistration = async (
  { authService, emailVerificationService, cryptoService }: CompleteRegistrationDependencies,
  request: CompleteRegistrationRequest
): Promise<CompleteRegistrationResponse> => {
  if (!request.token || request.token.trim() === '') {
    return {
      success: false,
      message: 'Token is required',
    };
  }

  if (!request.firstName || request.firstName.trim() === '') {
    return {
      success: false,
      message: 'First name is required',
    };
  }

  if (!request.lastName || request.lastName.trim() === '') {
    return {
      success: false,
      message: 'Last name is required',
    };
  }

  if (!request.password || request.password.trim() === '') {
    return {
      success: false,
      message: 'Password is required',
    };
  }

  const tokenData = await emailVerificationService.findEmailVerificationToken(request.token);

  if (!tokenData) {
    return {
      success: false,
      message: 'Invalid token',
    };
  }

  if (tokenData.expiresAt < new Date()) {
    await emailVerificationService.deleteEmailVerificationToken(request.token);

    return {
      success: false,
      message: 'Token has expired',
    };
  }

  const existingUser = await authService.findByEmail(tokenData.email);
  if (existingUser) {
    return {
      success: false,
      message: 'Email already registered',
    };
  }

  const userId = await cryptoService.generateUUID();

  const hashedPassword = await cryptoService.hashPassword(request.password);

  const newUser: User = {
    id: userId,
    email: tokenData.email as Email,
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    phoneNumber: request.phoneNumber?.trim() || null,
    hashedPassword,
    status: UserStatus.ACTIVE,
    enabled: true,
    bookLimit: 3,
    registrationDate: new Date(),
    role: UserRole.USER,
  };

  const savedUser = await authService.save(newUser);

  await emailVerificationService.deleteEmailVerificationToken(request.token);

  return {
    success: true,
    message: 'Registration completed successfully',
    user: filterSecureProperties(savedUser),
  };
};
