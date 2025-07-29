import { EmailVerificationService } from '../email-verification-service';

interface EmailVerificationToken {
  email: string;
  token: string;
  expiresAt: Date;
}

export interface MockedEmailVerificationService extends EmailVerificationService {
  tokens: EmailVerificationToken[];
  sentEmails: Array<{ email: string; token: string }>;
}

export function mockEmailVerificationService(): MockedEmailVerificationService {
  return {
    tokens: [],
    sentEmails: [],

    async saveEmailVerificationToken(email: string, token: string, expiresAt: Date): Promise<void> {
      this.tokens = this.tokens.filter(t => t.email !== email);
      this.tokens.push({ email, token, expiresAt });
    },

    async findEmailVerificationToken(
      token: string
    ): Promise<{ email: string; expiresAt: Date } | null> {
      const tokenData = this.tokens.find(t => t.token === token);
      if (!tokenData) return null;

      return {
        email: tokenData.email,
        expiresAt: tokenData.expiresAt,
      };
    },

    async deleteEmailVerificationToken(token: string): Promise<void> {
      this.tokens = this.tokens.filter(t => t.token !== token);
    },

    async sendVerificationEmail(email: string, token: string): Promise<void> {
      this.sentEmails.push({ email, token });
    },
  };
}
