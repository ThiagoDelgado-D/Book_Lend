export interface EmailVerificationService {
  saveEmailVerificationToken(email: string, token: string, expiresAt: Date): Promise<void>;
  findEmailVerificationToken(token: string): Promise<{ email: string; expiresAt: Date } | null>;
  deleteEmailVerificationToken(token: string): Promise<void>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
}
