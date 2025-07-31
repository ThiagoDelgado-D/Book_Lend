import { EmailVerificationService } from '../../services/email-verification-service';

export interface VerifyEmailTokenDependencies {
  emailVerificationService: EmailVerificationService;
}

export interface VerifyEmailTokenRequest {
  token: string;
}

export interface VerifyEmailTokenResponse {
  success: boolean;
  email?: string;
  message: string;
}

export const verifyEmailToken = async (
  { emailVerificationService }: VerifyEmailTokenDependencies,
  request: VerifyEmailTokenRequest
): Promise<VerifyEmailTokenResponse> => {
  if (!request.token || request.token.trim() === '') {
    return {
      success: false,
      message: 'Token is required',
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

  return {
    success: true,
    email: tokenData.email,
    message: 'Token is valid',
  };
};
