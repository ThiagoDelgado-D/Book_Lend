import { beforeEach, describe, expect, test } from 'vitest';
import { updateAuthor, UpdateAuthorRequest } from './update-author';
import { mockAuthorService } from '../../services/mocks/mock-author-service';
import { mockAuthService } from '../../services/mocks/mock-auth-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { UserStatus, UserRole } from '../../entities';
import { Email } from '../../types';

describe('Update Author Use Case', () => {
  let authorService: ReturnType<typeof mockAuthorService>;
  let authService: ReturnType<typeof mockAuthService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authorService = mockAuthorService();
    authService = mockAuthService();
    cryptoService = mockCryptoService();
  });

  test('should fail when birthDate is after deathDate', async () => {
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
      registrationDate: new Date('2020-01-01'),
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
      deathDate: new Date('1982-04-17'),
      isPopular: false,
    };

    await authService.save(adminUser);
    await authorService.save(author);

    const request: UpdateAuthorRequest = {
      adminUserId: adminId,
      authorId,
      birthDate: new Date('1990-01-01'),
      deathDate: new Date('1980-01-01'),
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Death date must be after birth date');
    expect(result.author).toBeUndefined();
  });

  test('should update author successfully with valid data', async () => {
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
      registrationDate: new Date('2020-01-01'),
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
      deathDate: new Date('1982-04-17'),
      isPopular: false,
    };

    await authService.save(adminUser);
    await authorService.save(author);

    const request: UpdateAuthorRequest = {
      adminUserId: adminId,
      authorId,
      firstName: 'Gabriel José',
      email: 'gabriel.jose@example.com' as Email,
      birthDate: new Date('1927-03-06'),
      deathDate: new Date('1982-04-17'),
      isPopular: true,
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Author updated successfully');
    expect(result.author).toBeDefined();
    expect(result.author?.firstName).toBe('Gabriel José');
    expect(result.author?.email).toBe('gabriel.jose@example.com');
    expect(result.author?.isPopular).toBe(true);
  });

  test('should fail when admin user is not found', async () => {
    const nonExistentAdminId = await cryptoService.generateUUID();
    const authorId = await cryptoService.generateUUID();

    const request: UpdateAuthorRequest = {
      adminUserId: nonExistentAdminId,
      authorId,
      firstName: 'Gabriel',
      birthDate: new Date('1927-03-06'),
      deathDate: new Date('1982-04-17'),
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('User not found');
    expect(result.author).toBeUndefined();
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
      registrationDate: new Date('2020-01-01'),
      role: UserRole.USER,
    };

    await authService.save(regularUser);

    const request: UpdateAuthorRequest = {
      adminUserId: userId,
      authorId,
      firstName: 'Gabriel',
      birthDate: new Date('1927-03-06'),
      deathDate: new Date('1982-04-17'),
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Access denied. Admin role required');
    expect(result.author).toBeUndefined();
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
      registrationDate: new Date('2020-01-01'),
      role: UserRole.ADMIN,
    };

    await authService.save(adminUser);

    const request: UpdateAuthorRequest = {
      adminUserId: adminId,
      authorId: nonExistentAuthorId,
      firstName: 'Gabriel',
      birthDate: new Date('1927-03-06'),
      deathDate: new Date('1982-04-17'),
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Author not found');
    expect(result.author).toBeUndefined();
  });

  test('should fail when email is invalid', async () => {
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
      registrationDate: new Date('2020-01-01'),
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
      deathDate: new Date('1982-04-17'),
      isPopular: false,
    };

    await authService.save(adminUser);
    await authorService.save(author);

    const request: UpdateAuthorRequest = {
      adminUserId: adminId,
      authorId,
      email: 'invalid-email-format' as Email,
      birthDate: new Date('1927-03-06'),
      deathDate: new Date('1982-04-17'),
    };

    const result = await updateAuthor({ authorService, authService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email format');
    expect(result.author).toBeUndefined();
  });
});
