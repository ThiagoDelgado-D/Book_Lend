import { beforeEach, describe, expect, test } from 'vitest';
import { mockAuthorService } from '../../services/mocks/mock-author-service';
import { mockAuthService } from '../../services/mocks/mock-auth-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { UserStatus, UserRole } from '../../entities';
import { Email } from '../../types';
import { deleteAuthor, DeleteAuthorRequest } from './index';

describe('Delete Author Use Case', () => {
  let authorService: ReturnType<typeof mockAuthorService>;
  let authService: ReturnType<typeof mockAuthService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authorService = mockAuthorService();
    authService = mockAuthService();
    cryptoService = mockCryptoService();
  });

  test('should delete an author successfully when user is admin and author exists', async () => {
    const adminId = await cryptoService.generateUUID();
    const authorId = await cryptoService.generateUUID();

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

    const author = {
      id: authorId,
      firstName: 'Gabriel',
      lastName: 'García Márquez',
      email: 'gabo@example.com' as Email,
      phoneNumber: '123456789',
      biography: 'Autor colombiano ganador del Nobel.',
      nationality: 'Colombiana',
      birthDate: new Date('1927-03-06'),
      deathDate: null,
      isPopular: false,
    };

    await authService.save(adminUser);
    await authorService.save(author);

    const request: DeleteAuthorRequest = {
      adminUserId: adminId,
      authorId,
    };

    const result = await deleteAuthor({ authorService, authService }, request);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Author deleted successfully');
  });

  test('should fail when admin user is not found', async () => {
    const nonExistentAdminId = await cryptoService.generateUUID();
    const authorId = await cryptoService.generateUUID();

    const request: DeleteAuthorRequest = {
      adminUserId: nonExistentAdminId,
      authorId,
    };

    const result = await deleteAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('User not found');
  });

  test('should fail when user is not admin', async () => {
    const userId = await cryptoService.generateUUID();
    const authorId = await cryptoService.generateUUID();

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

    const request: DeleteAuthorRequest = {
      adminUserId: userId,
      authorId,
    };

    const result = await deleteAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Access denied. Admin role required');
  });

  test('should fail when author does not exist', async () => {
    const adminId = await cryptoService.generateUUID();
    const nonExistentAuthorId = await cryptoService.generateUUID();

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

    const request: DeleteAuthorRequest = {
      adminUserId: adminId,
      authorId: nonExistentAuthorId,
    };

    const result = await deleteAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Author not found');
  });
});
