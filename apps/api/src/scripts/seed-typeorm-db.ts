import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { initializeDatabase, AppDataSource } from '../config/data-source.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { BookRepository } from '../repositories/book.repository.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { UserRole, UserStatus } from '../entities/user.entity.js';
import { BookStatus } from '../entities/book.entity.js';

const cryptoService = new CryptoServiceImplementation();

interface SeedOptions {
  users?: number;
  authors?: number;
  books?: number;
  clearExisting?: boolean;
}

const DEFAULT_OPTIONS: SeedOptions = {
  users: 20,
  authors: 15,
  books: 50,
  clearExisting: false,
};

async function seedDatabase(options: SeedOptions = DEFAULT_OPTIONS) {
  console.log('🌱 Starting comprehensive database seeding...\n');

  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection established!\n');

    const userRepository = new UserRepository();
    const authorRepository = new AuthorRepository();
    const bookRepository = new BookRepository();

    // Clear existing data if requested
    if (options.clearExisting) {
      console.log('🗑️  Clearing existing data...');
      await clearExistingData();
      console.log('✅ Existing data cleared!\n');
    }

    // Seed admin and test users
    console.log('👑 Creating admin and test users...');
    const adminUsers = await seedAdminUsers(userRepository);
    console.log(`✅ Created ${adminUsers.length} admin/test users\n`);

    // Seed regular users
    console.log('👥 Creating regular users...');
    const regularUsers = await seedRegularUsers(userRepository, options.users || 20);
    console.log(`✅ Created ${regularUsers.length} regular users\n`);

    // Seed authors
    console.log('✍️  Creating authors...');
    const authors = await seedAuthors(authorRepository, options.authors || 15);
    console.log(`✅ Created ${authors.length} authors\n`);

    // Seed books
    console.log('📚 Creating books...');
    const books = await seedBooks(bookRepository, authors, options.books || 50);
    console.log(`✅ Created ${books.length} books\n`);

    // Display final statistics
    await displayStatistics(userRepository, authorRepository, bookRepository);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Database connection closed.');
    }
  }
}

async function clearExistingData() {
  // Note: In production, you might want to be more careful about this
  // For now, we'll just truncate tables in the right order to avoid FK constraints
  await AppDataSource.query('DELETE FROM books');
  await AppDataSource.query('DELETE FROM email_verification_tokens');
  await AppDataSource.query('DELETE FROM authors');
  await AppDataSource.query('DELETE FROM users');
}

async function seedAdminUsers(userRepository: UserRepository) {
  const adminUsers = [];

  // Main admin user
  const adminEmail = 'admin@booklend.com';
  const existingAdmin = await userRepository.findByEmail(adminEmail);

  if (!existingAdmin) {
    const adminId = await cryptoService.generateUUID();
    const adminPasswordHash = await cryptoService.hashPassword('Admin@123');

    const admin = await userRepository.create({
      id: adminId,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: 1,
    });

    adminUsers.push(admin);
    console.log(`  ✓ Admin user created: ${adminEmail} / Admin@123`);
  } else {
    console.log(`  → Admin user already exists: ${adminEmail}`);
  }

  // Test user
  const testEmail = 'test@booklend.com';
  const existingTest = await userRepository.findByEmail(testEmail);

  if (!existingTest) {
    const testId = await cryptoService.generateUUID();
    const testPasswordHash = await cryptoService.hashPassword('Test@123');

    const testUser = await userRepository.create({
      id: testId,
      email: testEmail,
      passwordHash: testPasswordHash,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: 1,
    });

    adminUsers.push(testUser);
    console.log(`  ✓ Test user created: ${testEmail} / Test@123`);
  } else {
    console.log(`  → Test user already exists: ${testEmail}`);
  }

  return adminUsers;
}

async function seedRegularUsers(userRepository: UserRepository, count: number) {
  const users = [];
  let created = 0;
  let attempts = 0;
  const maxAttempts = count * 3; // Prevent infinite loops

  while (created < count && attempts < maxAttempts) {
    attempts++;

    const email = faker.internet.email().toLowerCase();
    const existingUser = await userRepository.findByEmail(email);

    if (!existingUser) {
      const userId = await cryptoService.generateUUID();
      const passwordHash = await cryptoService.hashPassword('User@123');

      const user = await userRepository.create({
        id: userId,
        email,
        passwordHash,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement([
          UserRole.USER,
          UserRole.USER,
          UserRole.USER,
          UserRole.ADMIN,
        ]), // 75% users, 25% admins
        status: faker.helpers.arrayElement([
          UserStatus.ACTIVE,
          UserStatus.ACTIVE,
          UserStatus.ACTIVE,
          UserStatus.PENDING_VERIFICATION,
        ]), // 75% active, 25% pending
        emailVerified: faker.helpers.arrayElement([1, 1, 1, 0]), // 75% verified
      });

      users.push(user);
      created++;

      if (created % 5 === 0) {
        console.log(`  → Created ${created}/${count} users...`);
      }
    }
  }

  return users;
}

async function seedAuthors(authorRepository: AuthorRepository, count: number) {
  const authors = [];
  let created = 0;
  let attempts = 0;
  const maxAttempts = count * 3;

  // First, create some famous real authors
  const famousAuthors = [
    {
      firstName: 'Robert',
      lastName: 'Martin',
      birthDate: new Date('1952-12-05'),
      biography:
        'American software engineer and instructor, known as "Uncle Bob". Author of Clean Code and Clean Architecture.',
    },
    {
      firstName: 'Eric',
      lastName: 'Evans',
      birthDate: new Date('1962-01-01'),
      biography: 'American software engineer and author, known for Domain-Driven Design.',
    },
    {
      firstName: 'Martin',
      lastName: 'Fowler',
      birthDate: new Date('1963-12-18'),
      biography:
        'British software engineer, author and international public speaker on software development.',
    },
    {
      firstName: 'Kent',
      lastName: 'Beck',
      birthDate: new Date('1961-03-31'),
      biography:
        'American software engineer and creator of Extreme Programming and Test-Driven Development.',
    },
    {
      firstName: 'Gang',
      lastName: 'of Four',
      birthDate: new Date('1970-01-01'),
      biography: 'The collective name for the authors of the seminal book "Design Patterns".',
    },
  ];

  // Create famous authors first
  for (const authorData of famousAuthors) {
    const existing = await authorRepository.findByName(authorData.firstName, authorData.lastName);
    if (!existing) {
      const authorId = await cryptoService.generateUUID();
      const author = await authorRepository.create({
        id: authorId,
        ...authorData,
      });
      authors.push(author);
      created++;
      console.log(`  ✓ Famous author created: ${author.firstName} ${author.lastName}`);
    } else {
      authors.push(existing);
      console.log(`  → Famous author exists: ${existing.firstName} ${existing.lastName}`);
    }
  }

  // Create additional random authors
  while (created < count && attempts < maxAttempts) {
    attempts++;

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const existing = await authorRepository.findByName(firstName, lastName);

    if (!existing) {
      const authorId = await cryptoService.generateUUID();

      const author = await authorRepository.create({
        id: authorId,
        firstName,
        lastName,
        birthDate: faker.date.birthdate({ min: 1920, max: 1990, mode: 'year' }),
        deathDate: faker.helpers.maybe(
          () =>
            faker.date.between({
              from: new Date('1990-01-01'),
              to: new Date(),
            }),
          { probability: 0.1 }
        ), // 10% chance of death date
        biography: faker.helpers.maybe(() => faker.lorem.paragraphs(2), { probability: 0.7 }), // 70% have biography
      });

      authors.push(author);
      created++;

      if (created % 5 === 0) {
        console.log(`  → Created ${created}/${count} authors...`);
      }
    }
  }

  return authors;
}

async function seedBooks(bookRepository: BookRepository, authors: any[], count: number) {
  const books = [];
  let created = 0;
  let attempts = 0;
  const maxAttempts = count * 3;

  // First, create some famous real books
  const famousBooks = [
    {
      title: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship',
      publishedDate: new Date('2008-08-01'),
      isbn: '9780132350884',
      authorName: 'Robert Martin',
    },
    {
      title: 'Clean Architecture',
      description: "A Craftsman's Guide to Software Structure and Design",
      publishedDate: new Date('2017-09-20'),
      isbn: '9780134494166',
      authorName: 'Robert Martin',
    },
    {
      title: 'Domain-Driven Design',
      description: 'Tackling Complexity in the Heart of Software',
      publishedDate: new Date('2003-08-22'),
      isbn: '9780321125217',
      authorName: 'Eric Evans',
    },
    {
      title: 'Refactoring',
      description: 'Improving the Design of Existing Code',
      publishedDate: new Date('1999-07-08'),
      isbn: '9780201485677',
      authorName: 'Martin Fowler',
    },
    {
      title: 'Test Driven Development',
      description: 'By Example',
      publishedDate: new Date('2002-11-18'),
      isbn: '9780321146533',
      authorName: 'Kent Beck',
    },
    {
      title: 'Design Patterns',
      description: 'Elements of Reusable Object-Oriented Software',
      publishedDate: new Date('1994-10-21'),
      isbn: '9780201633610',
      authorName: 'Gang of Four',
    },
  ];

  // Create famous books first
  for (const bookData of famousBooks) {
    const existingBook = await bookRepository.findByIsbn(bookData.isbn);
    if (!existingBook) {
      // Find the author
      const author = authors.find(
        a =>
          `${a.firstName} ${a.lastName}`.includes(bookData.authorName) ||
          bookData.authorName.includes(`${a.firstName} ${a.lastName}`)
      );

      if (author) {
        const bookId = await cryptoService.generateUUID();
        const book = await bookRepository.create({
          id: bookId,
          title: bookData.title,
          description: bookData.description,
          publishedDate: bookData.publishedDate,
          isbn: bookData.isbn,
          status: faker.helpers.arrayElement([
            BookStatus.AVAILABLE,
            BookStatus.AVAILABLE,
            BookStatus.AVAILABLE,
            BookStatus.BORROWED,
          ]), // 75% available, 25% borrowed
          author,
        });

        books.push(book);
        created++;
        console.log(
          `  ✓ Famous book created: ${book.title} by ${author.firstName} ${author.lastName}`
        );
      }
    } else {
      books.push(existingBook);
      console.log(`  → Famous book exists: ${existingBook.title}`);
    }
  }

  // Create additional random books
  const bookCategories = [
    'Software Engineering',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Mobile Development',
    'Game Development',
    'Cybersecurity',
    'Cloud Computing',
    'Database Design',
    'System Architecture',
    'Algorithms',
  ];

  while (created < count && attempts < maxAttempts) {
    attempts++;

    const category = faker.helpers.arrayElement(bookCategories);
    const title = `${faker.hacker.adjective()} ${category}: ${faker.company.buzzPhrase()}`;
    const isbn = `978${faker.string.numeric(10)}`;

    const existingBook = await bookRepository.findByIsbn(isbn);
    if (!existingBook) {
      const randomAuthor = faker.helpers.arrayElement(authors);
      const bookId = await cryptoService.generateUUID();

      const book = await bookRepository.create({
        id: bookId,
        title,
        description: faker.lorem.paragraphs(2),
        publishedDate: faker.date.between({
          from: new Date('1990-01-01'),
          to: new Date(),
        }),
        isbn,
        status: faker.helpers.arrayElement([
          BookStatus.AVAILABLE,
          BookStatus.AVAILABLE,
          BookStatus.AVAILABLE,
          BookStatus.BORROWED,
          BookStatus.MAINTENANCE,
        ]), // 60% available, 30% borrowed, 10% maintenance
        author: randomAuthor,
      });

      books.push(book);
      created++;

      if (created % 10 === 0) {
        console.log(`  → Created ${created}/${count} books...`);
      }
    }
  }

  return books;
}

async function displayStatistics(
  userRepository: UserRepository,
  authorRepository: AuthorRepository,
  bookRepository: BookRepository
) {
  console.log('📊 Final Database Statistics:');
  console.log('─'.repeat(40));

  const userStats = await getUserStatistics(userRepository);
  const authorStats = await getAuthorStatistics(authorRepository);
  const bookStats = await bookRepository.getStatistics();

  console.log(`👥 Users:`);
  console.log(`   Total: ${userStats.total}`);
  console.log(`   Admins: ${userStats.admins}`);
  console.log(`   Regular Users: ${userStats.users}`);
  console.log(`   Active: ${userStats.active}`);
  console.log(`   Pending: ${userStats.pending}`);

  console.log(`\n✍️  Authors:`);
  console.log(`   Total: ${authorStats.total}`);
  console.log(`   With Biography: ${authorStats.withBiography}`);
  console.log(`   Living: ${authorStats.living}`);
  console.log(`   Deceased: ${authorStats.deceased}`);

  console.log(`\n📚 Books:`);
  console.log(`   Total: ${bookStats.total}`);
  console.log(`   Available: ${bookStats.available}`);
  console.log(`   Borrowed: ${bookStats.borrowed}`);
  console.log(`   Maintenance: ${bookStats.maintenance}`);

  console.log('─'.repeat(40));
}

async function getUserStatistics(userRepository: UserRepository) {
  const allUsers = await userRepository.findAll();

  return {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === UserRole.ADMIN).length,
    users: allUsers.filter(u => u.role === UserRole.USER).length,
    active: allUsers.filter(u => u.status === UserStatus.ACTIVE).length,
    pending: allUsers.filter(u => u.status === UserStatus.PENDING_VERIFICATION).length,
  };
}

async function getAuthorStatistics(authorRepository: AuthorRepository) {
  const allAuthors = await authorRepository.findAll();

  return {
    total: allAuthors.length,
    withBiography: allAuthors.filter(a => a.biography).length,
    living: allAuthors.filter(a => !a.deathDate).length,
    deceased: allAuthors.filter(a => a.deathDate).length,
  };
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const options: SeedOptions = { ...DEFAULT_OPTIONS };

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--users':
        options.users = parseInt(args[++i]) || DEFAULT_OPTIONS.users;
        break;
      case '--authors':
        options.authors = parseInt(args[++i]) || DEFAULT_OPTIONS.authors;
        break;
      case '--books':
        options.books = parseInt(args[++i]) || DEFAULT_OPTIONS.books;
        break;
      case '--clear':
        options.clearExisting = true;
        break;
      case '--help':
        console.log(`
BookLend Database Seeder

Usage: tsx src/scripts/seed-typeorm-db.ts [options]

Options:
  --users <number>     Number of regular users to create (default: ${DEFAULT_OPTIONS.users})
  --authors <number>   Number of authors to create (default: ${DEFAULT_OPTIONS.authors})
  --books <number>     Number of books to create (default: ${DEFAULT_OPTIONS.books})
  --clear             Clear existing data before seeding
  --help              Show this help message

Examples:
  tsx src/scripts/seed-typeorm-db.ts
  tsx src/scripts/seed-typeorm-db.ts --users 50 --books 100
  tsx src/scripts/seed-typeorm-db.ts --clear --users 10 --authors 5 --books 20
        `);
        process.exit(0);
    }
  }

  console.log('🌱 BookLend Database Seeder');
  console.log(`📝 Configuration:`);
  console.log(`   Users: ${options.users}`);
  console.log(`   Authors: ${options.authors}`);
  console.log(`   Books: ${options.books}`);
  console.log(`   Clear existing: ${options.clearExisting ? '✅' : '❌'}`);
  console.log('');

  await seedDatabase(options);
}

// Run seeder if this file is executed directly
if (process.argv[1] && process.argv[1].includes('seed-typeorm-db.ts')) {
  main()
    .then(() => {
      console.log('\n✨ Database seeding completed! You can now start your API server.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
