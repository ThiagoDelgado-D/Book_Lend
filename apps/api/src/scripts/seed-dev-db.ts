import 'reflect-metadata';
import { initializeDatabase, closeDatabaseConnection } from '../config/data-source.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { UserRole } from '../entities/user.entity.js';
import { UserServiceImpl } from '../services/user.service.js';
import { AuthorServiceImpl } from '../services/author.service.js';
import { BookServiceImpl } from '../services/book.service.js';
import {
  type User,
  type Author,
  type Book,
  UserStatus,
  validateAndNormalizeEmail,
  BookStatus,
} from 'app-domain';
import { faker } from '@faker-js/faker';
import { fileURLToPath } from 'url';

const cryptoService = new CryptoServiceImplementation();

const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1];

async function seedDevDatabase() {
  console.log('🛠️ Starting development database seeding...\n');

  try {
    await initializeDatabase();
    console.log('✅ Database connection established!\n');

    const userService = new UserServiceImpl();
    const authorService = new AuthorServiceImpl();
    const bookService = new BookServiceImpl();

    console.log('👑 Creating admin user...');
    await createDevAdminUser(userService);

    console.log('👥 Creating test users...');
    await createTestUsers(userService, 5);

    console.log('✍️ Creating authors...');
    const authors = await createTestAuthors(authorService, 15);

    console.log('📚 Creating books...');
    await createTestBooks(bookService, authors, 30);

    const users = await userService.findAll();
    const allAuthors = await authorService.findAll();
    const books = await bookService.findAll();

    console.log('\n📊 Development Database Statistics:');
    console.log('─'.repeat(40));
    console.log(`👥 Users: ${users.length} (1 Admin, ${users.length - 1} Regular)`);
    console.log(`✍️ Authors: ${allAuthors.length}`);
    console.log(`📚 Books: ${books.length}`);
    console.log('─'.repeat(40));

    console.log('\n🎉 Development database seeding completed!');
    console.log('📋 Test credentials:');
    console.log('   Admin - Email: admin@test.com | Password: admin123');
    console.log('   User  - Email: user@test.com  | Password: user123');
  } catch (error) {
    console.error('❌ Development seeding failed:', error);
    throw error;
  } finally {
    await closeDatabaseConnection();
    console.log('🔒 Database connection closed.');
  }
}

async function createDevAdminUser(userService: UserServiceImpl) {
  const adminId = await cryptoService.generateUUID();
  const adminPasswordHash = await cryptoService.hashPassword('admin123');

  const adminUser: User = {
    id: adminId,
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'Test',
    phoneNumber: '+1-555-0100',
    hashedPassword: adminPasswordHash,
    status: UserStatus.ACTIVE,
    enabled: true,
    bookLimit: 10,
    registrationDate: new Date(),
    role: UserRole.ADMIN,
  };

  await userService.save(adminUser);
  console.log('  ✓ Admin user created (admin@test.com / admin123)');
}

async function createTestUsers(userService: UserServiceImpl, count: number) {
  const userId = await cryptoService.generateUUID();
  const userPasswordHash = await cryptoService.hashPassword('user123');

  const testUser: User = {
    id: userId,
    email: 'user@test.com',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+1-555-0101',
    hashedPassword: userPasswordHash,
    status: UserStatus.ACTIVE,
    enabled: true,
    bookLimit: 3,
    registrationDate: new Date(),
    role: UserRole.USER,
  };

  await userService.save(testUser);
  console.log('  ✓ Test user created (user@test.com / user123)');

  for (let i = 0; i < count - 1; i++) {
    const id = await cryptoService.generateUUID();
    const password = await cryptoService.hashPassword('password123');

    const user: User = {
      id,
      email: validateAndNormalizeEmail(faker.internet.email()),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: Math.random() > 0.3 ? faker.phone.number() : null,
      hashedPassword: password,
      status: UserStatus.ACTIVE,
      enabled: true,
      bookLimit: faker.number.int({ min: 2, max: 5 }),
      registrationDate: faker.date.recent({ days: 90 }),
      role: UserRole.USER,
    };

    await userService.save(user);
  }

  console.log(`  ✓ ${count} random users created`);
}

async function createTestAuthors(
  authorService: AuthorServiceImpl,
  count: number
): Promise<Author[]> {
  const authors: Author[] = [];

  for (let i = 0; i < count; i++) {
    const id = await cryptoService.generateUUID();
    const birthDate = faker.date.birthdate({ min: 1920, max: 1990, mode: 'year' });
    const deathDate =
      Math.random() > 0.8 ? faker.date.between({ from: birthDate, to: new Date() }) : null;

    const author: Author = {
      id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: validateAndNormalizeEmail(Math.random() > 0.4 ? faker.internet.email() : null),
      phoneNumber: Math.random() > 0.6 ? faker.phone.number() : null,
      biography: faker.lorem.paragraphs(2),
      nationality: faker.location.country(),
      birthDate,
      deathDate,
      isPopular: true,
    };

    const savedAuthor = await authorService.save(author);
    authors.push(savedAuthor);
  }

  console.log(`  ✓ ${count} authors created`);
  return authors;
}

async function createTestBooks(bookService: BookServiceImpl, authors: Author[], count: number) {
  for (let i = 0; i < count; i++) {
    const id = await cryptoService.generateUUID();

    const book: Book = {
      id,
      title: faker.lorem.words({ min: 2, max: 6 }),
      ISBN: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
      pages: faker.number.int({ min: 100, max: 800 }),
      publicationDate: faker.date.between({ from: '1950-01-01', to: '2024-01-01' }),
      publisher: faker.company.name(),
      status: BookStatus.AVAILABLE,
      totalLoans: faker.number.int({ min: 0, max: 50 }),
      isPopular: true,
      entryDate: faker.date.recent({ days: 365 }),
    };

    await bookService.save(book);
  }

  console.log(`  ✓ ${count} books created`);
}

if (currentFilePath === executedFilePath) {
  seedDevDatabase()
    .then(() => {
      console.log('\n✨ Development seeding completed! Ready for testing.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Development seeding failed:', error);
      process.exit(1);
    });
}

export { seedDevDatabase };
