import { beforeEach, describe, expect, test } from 'vitest';
import { verifyEmailToken } from './verify-email-token';
import { mockEmailVerificationService } from '../../services/mocks/mock-email-verification-service';

describe('Verify email use case', async () => {
  let emailVerificationService: ReturnType<typeof mockEmailVerificationService>;

  beforeEach(() => {
    emailVerificationService = mockEmailVerificationService();
  });

  test('should return success when token is valid and not expired', async () => {
    const email = 'test@example.com';
    const token = 'valid-token-123';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const result = await verifyEmailToken({ emailVerificationService }, { token });

    expect(result.success).toBe(true);
    expect(result.email).toBe(email);
    expect(result.message).toBe('Token is valid');
  });
  test('should return failure when token does not exist', async () => {
    const nonExistentToken = 'non-existent-token';

    const result = await verifyEmailToken(
      { emailVerificationService },
      { token: nonExistentToken }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid token');
    expect(result.email).toBeUndefined();
  });
  test('should return failure when token is expired', async () => {
    const email = 'test@example.com';
    const token = 'expired-token-123';
    const expiresAt = new Date(Date.now() - 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const result = await verifyEmailToken({ emailVerificationService }, { token });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Token has expired');
    expect(result.email).toBeUndefined();

    const tokenAfterVerification = await emailVerificationService.findEmailVerificationToken(token);
    expect(tokenAfterVerification).toBeNull();
  });
  test('should return failure when token is empty', async () => {
    const result = await verifyEmailToken({ emailVerificationService }, { token: '' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Token is required');
    expect(result.email).toBeUndefined();
  });
  test('should return failure when token is only whitespace', async () => {
    const result = await verifyEmailToken({ emailVerificationService }, { token: '   ' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Token is required');
    expect(result.email).toBeUndefined();
  });
  test('should handle multiple tokens for different emails', async () => {
    const email1 = 'user1@example.com';
    const email2 = 'user2@example.com';
    const token1 = 'token-for-user1';
    const token2 = 'token-for-user2';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email1, token1, expiresAt);
    await emailVerificationService.saveEmailVerificationToken(email2, token2, expiresAt);

    const result1 = await verifyEmailToken({ emailVerificationService }, { token: token1 });

    const result2 = await verifyEmailToken({ emailVerificationService }, { token: token2 });

    expect(result1.success).toBe(true);
    expect(result1.email).toBe(email1);

    expect(result2.success).toBe(true);
    expect(result2.email).toBe(email2);
  });
});
