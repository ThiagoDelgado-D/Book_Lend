import { beforeEach, describe, expect, test } from 'vitest';
import { completeRegistration } from './complete-registration';
import { mockAuthService } from '../../services/mocks/mock-auth-service';
import { mockEmailVerificationService } from '../../services/mocks/mock-email-verification-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { User, UserRole, UserStatus } from '../../entities';
import { Email } from '../../types/email';

describe('Complete Registration Use Case', () => {
  let authService: ReturnType<typeof mockAuthService>;
  let emailVerificationService: ReturnType<typeof mockEmailVerificationService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authService = mockAuthService();
    emailVerificationService = mockEmailVerificationService();
    cryptoService = mockCryptoService();
  });

  test('should complete registration successfully with valid token', async () => {
    const email = 'newuser@example.com';
    const token = 'valid-token-123';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      password: 'securePassword123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe('Registration completed successfully');
    expect(result.user).toBeDefined();

    const createdUser = result.user!;
    expect(createdUser.email).toBe(email);
    expect(createdUser.firstName).toBe('John');
    expect(createdUser.lastName).toBe('Doe');
    expect(createdUser.phoneNumber).toBe('+1234567890');
    expect(createdUser.status).toBe(UserStatus.ACTIVE);
    expect(createdUser.enabled).toBe(true);
    expect(createdUser.bookLimit).toBe(3);
    expect(createdUser.registrationDate).toBeInstanceOf(Date);

    expect('hashedPassword' in createdUser).toBe(false);

    expect(authService.users).toHaveLength(1);
    expect(authService.users[0].hashedPassword).toBe('[HASHED]securePassword123');

    const tokenAfterRegistration = await emailVerificationService.findEmailVerificationToken(token);
    expect(tokenAfterRegistration).toBeNull();
  });

  test('should complete registration successfully without phone number', async () => {
    const email = 'user@example.com';
    const token = 'valid-token-456';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'anotherPassword456',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(true);
    expect(result.user?.phoneNumber).toBeNull();
  });

  test('should fail when token does not exist', async () => {
    const registrationRequest = {
      token: 'non-existent-token',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid token');
    expect(result.user).toBeUndefined();
    expect(authService.users).toHaveLength(0);
  });

  test('should fail when token is expired', async () => {
    const email = 'expired@example.com';
    const token = 'expired-token-123';
    const expiresAt = new Date(Date.now() - 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Token has expired');
    expect(result.user).toBeUndefined();
    expect(authService.users).toHaveLength(0);

    const tokenAfterAttempt = await emailVerificationService.findEmailVerificationToken(token);
    expect(tokenAfterAttempt).toBeNull();
  });

  test('should fail when email is already registered', async () => {
    const email: Email = 'existing@example.com';
    const token = 'valid-token-789';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const userId = await cryptoService.generateUUID();

    const existingUser: User = {
      id: userId,
      email,
      firstName: 'Existing',
      lastName: 'User',
      phoneNumber: null,
      hashedPassword: '[HASHED]existingPassword',
      status: UserStatus.ACTIVE,
      enabled: true,
      bookLimit: 3,
      registrationDate: new Date(),
      role: UserRole.USER,
    };

    await authService.save(existingUser);
    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: 'New',
      lastName: 'User',
      password: 'newPassword123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email already registered');
    expect(result.user).toBeUndefined();

    expect(authService.users).toHaveLength(1);
    expect(authService.users[0].firstName).toBe('Existing');
  });

  test('should fail when required fields are missing', async () => {
    const email = 'test@example.com';
    const token = 'valid-token-abc';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    let result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      { token: '', firstName: 'John', lastName: 'Doe', password: 'password123' }
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe('Token is required');

    result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      { token, firstName: '', lastName: 'Doe', password: 'password123' }
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe('First name is required');

    result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      { token, firstName: 'John', lastName: '', password: 'password123' }
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe('Last name is required');

    result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      { token, firstName: 'John', lastName: 'Doe', password: '' }
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe('Password is required');

    expect(authService.users).toHaveLength(0);
  });

  test('should trim whitespace from input fields', async () => {
    const email = 'trim@example.com';
    const token = 'trim-token-123';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: '  John  ',
      lastName: '  Doe  ',
      phoneNumber: '  +1234567890  ',
      password: 'password123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(true);
    expect(result.user?.firstName).toBe('John');
    expect(result.user?.lastName).toBe('Doe');
    expect(result.user?.phoneNumber).toBe('+1234567890');
  });

  test('should handle empty phoneNumber by setting it to null', async () => {
    const email = 'phone@example.com';
    const token = 'phone-token-123';
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await emailVerificationService.saveEmailVerificationToken(email, token, expiresAt);

    const registrationRequest = {
      token,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '   ',
      password: 'password123',
    };

    const result = await completeRegistration(
      { authService, emailVerificationService, cryptoService },
      registrationRequest
    );

    expect(result.success).toBe(true);
    expect(result.user?.phoneNumber).toBeNull();
  });
});
