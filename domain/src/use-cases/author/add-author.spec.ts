import { beforeEach, describe, expect, test } from 'vitest';
import { createAuthor, CreateAuthorRequest } from './index';
import { mockAuthorService } from '../../services/mocks/mock-author-service';
import { mockAuthService } from '../../services/mocks/mock-auth-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { UserStatus, UserRole } from '../../entities';
import { Email } from '../../types';

describe('Create Author Use Case', () => {
  let authorService: ReturnType<typeof mockAuthorService>;
  let authService: ReturnType<typeof mockAuthService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    authorService = mockAuthorService();
    authService = mockAuthService();
    cryptoService = mockCryptoService();
  });

  test('should create a new author successfully when data is valid and user is admin', async () => {
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

    const request: CreateAuthorRequest = {
      adminUserId: adminId,
      firstName: 'Gabriel',
      lastName: 'García Márquez',
      email: 'gabo@example.com',
      phoneNumber: '123456789',
      biography: 'Autor colombiano ganador del Nobel.',
      nationality: 'Colombiana',
      birthDate: new Date('1927-03-06'),
    };

    const result = await createAuthor({ authorService, authService, cryptoService }, request);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Author created successfully');
    expect(result.author).toBeDefined();

    const createdAuthor = result.author!;
    expect(createdAuthor.firstName).toBe(request.firstName);
    expect(createdAuthor.lastName).toBe(request.lastName);
    expect(createdAuthor.email).toBe(request.email);
    expect(createdAuthor.phoneNumber).toBe(request.phoneNumber);
    expect(createdAuthor.biography).toBe(request.biography);
    expect(createdAuthor.nationality).toBe(request.nationality);
    expect(createdAuthor.birthDate).toEqual(request.birthDate);
    expect(createdAuthor.deathDate).toBeNull();
    expect(createdAuthor.isPopular).toBe(false);
  });

  test('should fail when admin user is not found', async () => {
    const nonExistentAdminId = await cryptoService.generateUUID();

    const request: CreateAuthorRequest = {
      adminUserId: nonExistentAdminId,
      firstName: 'Isabel',
      lastName: 'Allende',
      biography: 'Escritora chilena',
      nationality: 'Chilena',
      birthDate: new Date('1942-08-02'),
    };

    const result = await createAuthor({ authorService, authService, cryptoService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('User not found');
    expect(result.author).toBeUndefined();
  });
  test('should fail when user is not admin', async () => {
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

    const request: CreateAuthorRequest = {
      adminUserId: userId,
      firstName: 'Mario',
      lastName: 'Vargas Llosa',
      biography: 'Escritor peruano',
      nationality: 'Peruana',
      birthDate: new Date('1936-03-28'),
    };

    const result = await createAuthor({ authorService, authService, cryptoService }, request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Access denied. Admin role required');
    expect(result.author).toBeUndefined();
  });
});
