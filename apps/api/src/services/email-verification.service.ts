import { EmailVerificationService } from 'app-domain';

export class EmailVerificationServiceImpl implements EmailVerificationService {
  private tokens: Map<string, { email: string; expiresAt: Date }> = new Map();
  async saveEmailVerificationToken(email: string, token: string, expiresAt: Date): Promise<void> {
    this.tokens.set(token, { email, expiresAt });
  }
  async findEmailVerificationToken(
    token: string
  ): Promise<{ email: string; expiresAt: Date } | null> {
    const tokenData = this.tokens.get(token);
    return tokenData || null;
  }
  async deleteEmailVerificationToken(token: string): Promise<void> {
    this.tokens.delete(token);
  }
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    console.log(`📧 Email verification sent to: ${email}`);
    console.log(`🔗 Verification link: http://localhost:3000/auth/verify-token/${token}`);
  }
}
