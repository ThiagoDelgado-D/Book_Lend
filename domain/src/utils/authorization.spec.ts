import { beforeEach, describe, expect, test } from 'vitest';
import { verifyAdminRole } from './authorization';
import { mockAuthService } from '../services/mocks/mock-auth-service';
import { mockCryptoService } from '../services/mocks/mock-crypto-service';
import { UserStatus, UserRole } from '../entities';
import { Email } from '../types/email';

describe('Authorization Utils', () => {
  let authService: ReturnType<typeof mockAuthService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authService = mockAuthService();
    cryptoService = mockCryptoService();
  });

  describe('verifyAdminRole', () => {
    test('should return success for admin user', async () => {
      const adminId = await cryptoService.generateUUID();
      const adminUser = {
        id: adminId,
        email: 'admin@example.com' as Email,
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: null,
        hashedPassword: '[HASHED]adminpass',
        status: UserStatus.ACTIVE,
        enabled: true,
        bookLimit: 10,
        registrationDate: new Date(),
        role: UserRole.ADMIN,
      };

      await authService.save(adminUser);

      const result = await verifyAdminRole(authService, adminId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Authorization successful');
    });

    test('should return failure for regular user', async () => {
      const userId = await cryptoService.generateUUID();
      const regularUser = {
        id: userId,
        email: 'user@example.com' as Email,
        firstName: 'Regular',
        lastName: 'User',
        phoneNumber: null,
        hashedPassword: '[HASHED]userpass',
        status: UserStatus.ACTIVE,
        enabled: true,
        bookLimit: 3,
        registrationDate: new Date(),
        role: UserRole.USER,
      };

      await authService.save(regularUser);

      const result = await verifyAdminRole(authService, userId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Access denied. Admin role required');
    });

    test('should return failure for non-existent user', async () => {
      const nonExistentId = await cryptoService.generateUUID();

      const result = await verifyAdminRole(authService, nonExistentId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    });

    test('should handle disabled admin user', async () => {
      const adminId = await cryptoService.generateUUID();
      const disabledAdmin = {
        id: adminId,
        email: 'disabled-admin@example.com' as Email,
        firstName: 'Disabled',
        lastName: 'Admin',
        phoneNumber: null,
        hashedPassword: '[HASHED]adminpass',
        status: UserStatus.SUSPENDED,
        enabled: false,
        bookLimit: 10,
        registrationDate: new Date(),
        role: UserRole.ADMIN,
      };

      await authService.save(disabledAdmin);

      const result = await verifyAdminRole(authService, adminId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Authorization successful');
    });
  });
});
