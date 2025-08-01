import 'reflect-metadata';
import { initializeDatabase, AppDataSource } from '../config/data-source.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { BookRepository } from '../repositories/book.repository.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { UserRole, UserStatus } from '../entities/user.entity.js';
import { BookStatus } from '../entities/book.entity.js';

const cryptoService = new CryptoServiceImplementation();

async function setupDatabase() {
  console.log('🚀 Starting TypeORM database setup...\n');

  try {
    console.log('📋 Step 1: Initializing database connection...');
    await initializeDatabase();
    console.log('✅ Database connection established!\n');

    console.log('🔄 Step 2: Synchronizing database schema...');
    await AppDataSource.synchronize();
    console.log('✅ Database schema synchronized!\n');

    console.log('🌱 Step 3: Seeding database with sample data...');
    await seedSampleData();
    console.log('✅ Sample data seeded successfully!\n');

    console.log('🎉 TypeORM database setup completed successfully!');
    console.log('Your BookLend API is ready to use with TypeORM and better-sqlite3.');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Database connection closed.');
    }
  }
}

async function seedSampleData() {
  const userRepository = new UserRepository();
  const authorRepository = new AuthorRepository();
  const bookRepository = new BookRepository();

  console.log('👥 Creating sample users...');

  const adminId = await cryptoService.generateUUID();
  const userId = await cryptoService.generateUUID();
  const adminPasswordHash = await cryptoService.hashPassword('admin123');
  const userPasswordHash = await cryptoService.hashPassword('user123');

  const existingAdmin = await userRepository.findByEmail('admin@booklend.com');
  const existingUser = await userRepository.findByEmail('user@booklend.com');

  if (!existingAdmin) {
    await userRepository.create({
      id: adminId,
      email: 'admin@booklend.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: 1,
    });
    console.log('  ✓ Admin user created (admin@booklend.com / admin123)');
  } else {
    console.log('  → Admin user already exists');
  }

  if (!existingUser) {
    await userRepository.create({
      id: userId,
      email: 'user@booklend.com',
      passwordHash: userPasswordHash,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: 1,
    });
    console.log('  ✓ Regular user created (user@booklend.com / user123)');
  } else {
    console.log('  → Regular user already exists');
  }

  console.log('✍️ Creating sample authors...');

  const authors = [
    {
      id: await cryptoService.generateUUID(),
      firstName: 'Robert',
      lastName: 'Martin',
      birthDate: new Date('1952-12-05'),
      biography:
        'American software engineer and instructor. He is best known for being one of the authors of the Agile Manifesto and for developing several software design principles.',
    },
    {
      id: await cryptoService.generateUUID(),
      firstName: 'Eric',
      lastName: 'Evans',
      birthDate: new Date('1962-01-01'),
      biography:
        'American software engineer and author. He is known for his work on domain-driven design and is the author of the book "Domain-Driven Design: Tackling Complexity in the Heart of Software".',
    },
    {
      id: await cryptoService.generateUUID(),
      firstName: 'Martin',
      lastName: 'Fowler',
      birthDate: new Date('1963-12-18'),
      biography:
        'British software engineer, author and international public speaker on software development.',
    },
  ];

  const createdAuthors: any[] = [];
  for (const authorData of authors) {
    const existingAuthor = await authorRepository.findByName(
      authorData.firstName,
      authorData.lastName
    );
    if (!existingAuthor) {
      const author = await authorRepository.create(authorData);
      createdAuthors.push(author);
      console.log(`  ✓ Author created: ${author.firstName} ${author.lastName}`);
    } else {
      createdAuthors.push(existingAuthor);
      console.log(
        `  → Author already exists: ${existingAuthor.firstName} ${existingAuthor.lastName}`
      );
    }
  }

  console.log('📚 Creating sample books...');

  const books = [
    {
      id: await cryptoService.generateUUID(),
      title: 'Clean Architecture',
      description: "A Craftsman's Guide to Software Structure and Design",
      publishedDate: new Date('2017-09-20'),
      isbn: '9780134494166',
      status: BookStatus.AVAILABLE,
      author: createdAuthors[0],
    },
    {
      id: await cryptoService.generateUUID(),
      title: 'Domain-Driven Design',
      description: 'Tackling Complexity in the Heart of Software',
      publishedDate: new Date('2003-08-22'),
      isbn: '9780321125217',
      status: BookStatus.AVAILABLE,
      author: createdAuthors[1],
    },
    {
      id: await cryptoService.generateUUID(),
      title: 'Refactoring',
      description: 'Improving the Design of Existing Code',
      publishedDate: new Date('1999-07-08'),
      isbn: '9780201485677',
      status: BookStatus.BORROWED,
      author: createdAuthors[2],
    },
    {
      id: await cryptoService.generateUUID(),
      title: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship',
      publishedDate: new Date('2008-08-01'),
      isbn: '9780132350884',
      status: BookStatus.AVAILABLE,
      author: createdAuthors[0],
    },
  ];

  for (const bookData of books) {
    const existingBook = await bookRepository.findByIsbn(bookData.isbn);
    if (!existingBook) {
      const book = await bookRepository.create(bookData);
      console.log(
        `  ✓ Book created: ${book.title} by ${book.author.firstName} ${book.author.lastName}`
      );
    } else {
      console.log(`  → Book already exists: ${existingBook.title}`);
    }
  }

  console.log('\n📊 Database Statistics:');
  const userCount = (await userRepository.findAll()).length;
  const authorCount = (await authorRepository.findAll()).length;
  const bookStats = await bookRepository.getStatistics();

  console.log(`  Users: ${userCount}`);
  console.log(`  Authors: ${authorCount}`);
  console.log(
    `  Books: ${bookStats.total} (Available: ${bookStats.available}, Borrowed: ${bookStats.borrowed})`
  );
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => {
      console.log('\n✨ All done! You can now start your API server with TypeORM.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };
