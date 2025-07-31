import { AuthService, EmailVerificationService, CryptoService } from '../../services';

export interface SendEmailVerificationDependencies {
  authService: AuthService;
  emailVerificationService: EmailVerificationService;
  cryptoService: CryptoService;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface SendEmailVerificationResponse {
  success: boolean;
  message: string;
}

export const sendEmailVerification = async (
  { authService, emailVerificationService, cryptoService }: SendEmailVerificationDependencies,
  request: SendEmailVerificationRequest
): Promise<SendEmailVerificationResponse> => {
  if (!request.email || request.email.trim() === '') {
    return {
      success: false,
      message: 'Email is required',
    };
  }
  const existingUser = await authService.findByEmail(request.email);
  if (existingUser) {
    return {
      success: false,
      message: 'Email already registered',
    };
  }

  const token = await cryptoService.generateRandomToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await emailVerificationService.saveEmailVerificationToken(request.email, token, expiresAt);
  await emailVerificationService.sendVerificationEmail(request.email, token);
  return {
    success: true,
    message: 'Verification email sent successfully',
  };
};
