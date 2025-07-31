import { beforeEach, describe, expect, test } from 'vitest';
import {
  mockAuthService,
  mockEmailVerificationService,
  mockCryptoService,
} from '../../services/mocks';
import { sendEmailVerification } from './send-email-verification';
import { UserStatus } from '../../entities';
import { Email } from '../../types/email';

describe('Send Email Verification Use Case', async () => {
  let authService: ReturnType<typeof mockAuthService>;
  let emailVerificationService: ReturnType<typeof mockEmailVerificationService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authService = mockAuthService();
    emailVerificationService = mockEmailVerificationService();
    cryptoService = mockCryptoService();
  });

  test('should send verification email successfully for new email', async () => {
    const email = 'newuser@example.com';

    const result = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email }
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe('Verification email sent successfully');

    expect(emailVerificationService.tokens).toHaveLength(1);
    expect(emailVerificationService.tokens[0].email).toBe(email);
    expect(emailVerificationService.tokens[0].expiresAt).toBeInstanceOf(Date);

    const tokenExpirationTime = emailVerificationService.tokens[0].expiresAt.getTime();
    const expectedExpirationTime = Date.now() + 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(tokenExpirationTime - expectedExpirationTime);
    expect(timeDifference).toBeLessThan(1000);

    expect(emailVerificationService.sentEmails).toHaveLength(1);
    expect(emailVerificationService.sentEmails[0].email).toBe(email);
    expect(emailVerificationService.sentEmails[0].token).toBe(
      emailVerificationService.tokens[0].token
    );
  });
  test('should fail when email is already registered', async () => {
    const email = 'existing@example.com' as Email;
    const userId = await cryptoService.generateUUID();

    const existingUser = {
      id: userId,
      email,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: null,
      hashedPassword: '[HASHED]password123',
      status: UserStatus.ACTIVE,
      enabled: true,
      bookLimit: 3,
      registrationDate: new Date(),
    };

    await authService.save(existingUser);

    const result = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email already registered');

    expect(emailVerificationService.tokens).toHaveLength(0);

    expect(emailVerificationService.sentEmails).toHaveLength(0);
  });
  test('should fail when email is empty', async () => {
    const result = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email: '' }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email is required');

    expect(emailVerificationService.tokens).toHaveLength(0);
    expect(emailVerificationService.sentEmails).toHaveLength(0);
  });
  test('should fail when email is only whitespace', async () => {
    const result = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email: '   ' }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email is required');

    expect(emailVerificationService.tokens).toHaveLength(0);
    expect(emailVerificationService.sentEmails).toHaveLength(0);
  });
  test('should handle multiple different emails simultaneously', async () => {
    const email1 = 'user1@example.com';
    const email2 = 'user2@example.com';

    const result1 = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email: email1 }
    );

    const result2 = await sendEmailVerification(
      { authService, emailVerificationService, cryptoService },
      { email: email2 }
    );

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    expect(emailVerificationService.tokens).toHaveLength(2);
    expect(emailVerificationService.tokens.find(t => t.email === email1)).toBeDefined();
    expect(emailVerificationService.tokens.find(t => t.email === email2)).toBeDefined();

    expect(emailVerificationService.sentEmails).toHaveLength(2);
    expect(emailVerificationService.sentEmails.find(e => e.email === email1)).toBeDefined();
    expect(emailVerificationService.sentEmails.find(e => e.email === email2)).toBeDefined();
  });
});
