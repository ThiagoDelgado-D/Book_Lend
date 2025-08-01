import 'reflect-metadata';
import { initializeDatabase, AppDataSource } from '../config/data-source.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { BookRepository } from '../repositories/book.repository.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { UserRole, UserStatus } from '../entities/user.entity.js';
import { BookStatus } from '../entities/book.entity.js';

const cryptoService = new CryptoServiceImplementation();

async function seedProduction() {
  console.log('🏭 Starting production database seeding...\n');

  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection established!\n');

    const userRepository = new UserRepository();
    const authorRepository = new AuthorRepository();
    const bookRepository = new BookRepository();

    // Create essential admin user
    console.log('👑 Creating admin user...');
    await createAdminUser(userRepository);

    // Create essential authors (famous software engineering authors)
    console.log('✍️ Creating essential authors...');
    const authors = await createEssentialAuthors(authorRepository);

    // Create essential books (classic software engineering books)
    console.log('📚 Creating essential books...');
    await createEssentialBooks(bookRepository, authors);

    // Display final statistics
    const userCount = (await userRepository.findAll()).length;
    const authorCount = (await authorRepository.findAll()).length;
    const bookStats = await bookRepository.getStatistics();

    console.log('\n📊 Production Database Statistics:');
    console.log('─'.repeat(40));
    console.log(`👥 Users: ${userCount}`);
    console.log(`✍️ Authors: ${authorCount}`);
    console.log(`📚 Books: ${bookStats.total} (Available: ${bookStats.available})`);
    console.log('─'.repeat(40));

    console.log('\n🎉 Production database seeding completed successfully!');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@booklend.com');
    console.log('   Password: Admin@BookLend2024');
  } catch (error) {
    console.error('❌ Production seeding failed:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Database connection closed.');
    }
  }
}

async function createAdminUser(userRepository: UserRepository) {
  const adminEmail = 'admin@booklend.com';
  const existingAdmin = await userRepository.findByEmail(adminEmail);

  if (!existingAdmin) {
    const adminId = await cryptoService.generateUUID();
    const adminPasswordHash = await cryptoService.hashPassword('Admin@BookLend2024');

    await userRepository.create({
      id: adminId,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      firstName: 'Library',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: 1,
    });

    console.log('  ✓ Admin user created');
  } else {
    console.log('  → Admin user already exists');
  }
}

async function createEssentialAuthors(authorRepository: AuthorRepository) {
  const essentialAuthors = [
    {
      firstName: 'Robert',
      lastName: 'Martin',
      birthDate: new Date('1952-12-05'),
      biography:
        'American software engineer and instructor, known as "Uncle Bob". He is best known for being one of the authors of the Agile Manifesto and for developing several software design principles including SOLID. Author of Clean Code and Clean Architecture.',
    },
    {
      firstName: 'Eric',
      lastName: 'Evans',
      birthDate: new Date('1962-01-01'),
      biography:
        'American software engineer and author. He is known for his work on domain-driven design and is the author of the book "Domain-Driven Design: Tackling Complexity in the Heart of Software".',
    },
    {
      firstName: 'Martin',
      lastName: 'Fowler',
      birthDate: new Date('1963-12-18'),
      biography:
        'British software engineer, author and international public speaker on software development. He is known for his work on object-oriented analysis and design, UML, patterns, and agile software development methodologies.',
    },
    {
      firstName: 'Kent',
      lastName: 'Beck',
      birthDate: new Date('1961-03-31'),
      biography:
        'American software engineer and creator of Extreme Programming and Test-Driven Development. He is one of the 17 original signatories of the Agile Manifesto.',
    },
    {
      firstName: 'Erich',
      lastName: 'Gamma',
      birthDate: new Date('1961-03-13'),
      biography:
        'Swiss computer scientist and one of the four authors (Gang of Four) of the software engineering textbook, "Design Patterns: Elements of Reusable Object-Oriented Software".',
    },
    {
      firstName: 'Richard',
      lastName: 'Helm',
      birthDate: new Date('1956-01-01'),
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
    },
    {
      firstName: 'Ralph',
      lastName: 'Johnson',
      birthDate: new Date('1955-01-01'),
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
    },
    {
      firstName: 'John',
      lastName: 'Vlissides',
      birthDate: new Date('1961-08-02'),
      deathDate: new Date('2005-11-24'),
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
    },
  ];

  const createdAuthors = [];

  for (const authorData of essentialAuthors) {
    const existing = await authorRepository.findByName(authorData.firstName, authorData.lastName);
    if (!existing) {
      const authorId = await cryptoService.generateUUID();
      const author = await authorRepository.create({
        id: authorId,
        ...authorData,
      });
      createdAuthors.push(author);
      console.log(`  ✓ Author created: ${author.firstName} ${author.lastName}`);
    } else {
      createdAuthors.push(existing);
      console.log(`  → Author exists: ${existing.firstName} ${existing.lastName}`);
    }
  }

  return createdAuthors;
}

async function createEssentialBooks(bookRepository: BookRepository, authors: any[]) {
  const essentialBooks = [
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description:
        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      publishedDate: new Date('2008-08-01'),
      isbn: '9780132350884',
      authorName: 'Robert Martin',
    },
    {
      title: "Clean Architecture: A Craftsman's Guide to Software Structure and Design",
      description:
        'Building upon the success of best-sellers The Clean Coder and Clean Code, legendary software craftsman Robert C. Martin (Uncle Bob) reveals those rules and helps you apply them.',
      publishedDate: new Date('2017-09-20'),
      isbn: '9780134494166',
      authorName: 'Robert Martin',
    },
    {
      title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
      description:
        'The software development community widely acknowledges that domain modeling is central to software design. Through domain modeling, software developers are able to express rich functionality and translate it into software implementation.',
      publishedDate: new Date('2003-08-22'),
      isbn: '9780321125217',
      authorName: 'Eric Evans',
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      description:
        'Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.',
      publishedDate: new Date('1999-07-08'),
      isbn: '9780201485677',
      authorName: 'Martin Fowler',
    },
    {
      title: 'Test Driven Development: By Example',
      description:
        'Quite simply, test-driven development is meant to eliminate fear in application development. While some fear is healthy (often viewed as a conscience that tells programmers to "be careful!"), the author believes that byproducts of fear include tentative, grumpy, and uncommunicative programmers.',
      publishedDate: new Date('2002-11-18'),
      isbn: '9780321146533',
      authorName: 'Kent Beck',
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      description:
        'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
      publishedDate: new Date('1994-10-21'),
      isbn: '9780201633610',
      authorName: 'Erich Gamma', // We'll use the first author from Gang of Four
      additionalAuthors: ['Richard Helm', 'Ralph Johnson', 'John Vlissides'],
    },
    {
      title: 'Extreme Programming Explained: Embrace Change',
      description:
        'Accountability. Transparency. Responsibility. These are not words that are often applied to software development. In this completely revised introduction to Extreme Programming (XP), Kent Beck describes how to improve your software development.',
      publishedDate: new Date('1999-10-05'),
      isbn: '9780201616415',
      authorName: 'Kent Beck',
    },
    {
      title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
      description:
        'In The Clean Coder, legendary software expert Robert C. Martin introduces the disciplines, techniques, tools, and practices of true software craftsmanship.',
      publishedDate: new Date('2011-05-23'),
      isbn: '9780137081073',
      authorName: 'Robert Martin',
    },
  ];

  for (const bookData of essentialBooks) {
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
        await bookRepository.create({
          id: bookId,
          title: bookData.title,
          description: bookData.description,
          publishedDate: bookData.publishedDate,
          isbn: bookData.isbn,
          status: BookStatus.AVAILABLE, // All books available in production
          author,
        });

        console.log(`  ✓ Book created: ${bookData.title}`);
      } else {
        console.log(`  ⚠️  Author not found for book: ${bookData.title} (${bookData.authorName})`);
      }
    } else {
      console.log(`  → Book exists: ${existingBook.title}`);
    }
  }
}

// Run production seeder if this file is executed directly
if (process.argv[1] && process.argv[1].includes('seed-production.ts')) {
  seedProduction()
    .then(() => {
      console.log('\n✨ Production seeding completed! Your BookLend system is ready for use.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Production seeding failed:', error);
      process.exit(1);
    });
}

export { seedProduction };
