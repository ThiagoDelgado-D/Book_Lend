import 'reflect-metadata';
import { initializeDatabase, closeDatabaseConnection } from '../config/data-source.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { UserServiceImpl } from '../services/user.service.js';
import { AuthorServiceImpl } from '../services/author.service.js';
import { BookServiceImpl } from '../services/book.service.js';
import {
  type User,
  type Author,
  type Book,
  BookStatus,
  UserRole,
  UserStatus,
  validateAndNormalizeEmail,
} from 'app-domain';

const cryptoService = new CryptoServiceImplementation();

async function seedProduction() {
  console.log('🏭 Starting production database seeding...\n');

  try {
    await initializeDatabase();
    console.log('✅ Database connection established!\n');

    const userService = new UserServiceImpl();
    const authorService = new AuthorServiceImpl();
    const bookService = new BookServiceImpl();

    console.log('👑 Creating admin user...');
    await createAdminUser(userService);

    console.log('✍️ Creating essential authors...');
    const authors = await createEssentialAuthors(authorService);

    console.log('📚 Creating essential books...');
    await createEssentialBooks(bookService, authors);

    const users = await userService.findAll();
    const allAuthors = await authorService.findAll();
    const books = await bookService.findAll();
    const availableBooks = books.filter(book => book.status === BookStatus.AVAILABLE).length;

    console.log('\n📊 Production Database Statistics:');
    console.log('─'.repeat(50));
    console.log(`👥 Users: ${users.length}`);
    console.log(`✍️ Authors: ${allAuthors.length}`);
    console.log(`📚 Books: ${books.length} (Available: ${availableBooks})`);
    console.log('─'.repeat(50));

    console.log('\n🎉 Production database seeding completed successfully!');
    console.log('📋 Admin credentials:');
    console.log('   Email: admin@booklend.com');
    console.log('   Password: Admin@BookLend2024');
    console.log('\n⚠️  Please change the admin password after first login!');
  } catch (error) {
    console.error('❌ Production seeding failed:', error);
    throw error;
  } finally {
    await closeDatabaseConnection();
    console.log('🔒 Database connection closed.');
  }
}

async function createAdminUser(userService: UserServiceImpl) {
  const adminEmail = 'admin@booklend.com';
  const existingAdmin = await userService.findByEmail(adminEmail);

  if (!existingAdmin) {
    const adminId = await cryptoService.generateUUID();
    const adminPasswordHash = await cryptoService.hashPassword('Admin@BookLend2024');

    const adminUser: User = {
      id: adminId,
      email: adminEmail,
      firstName: 'Library',
      lastName: 'Administrator',
      phoneNumber: null,
      hashedPassword: adminPasswordHash,
      status: UserStatus.ACTIVE,
      enabled: true,
      bookLimit: 10,
      registrationDate: new Date(),
      role: UserRole.ADMIN,
    };

    await userService.save(adminUser);
    console.log('  ✓ Admin user created');
  } else {
    console.log('  → Admin user already exists');
  }
}

async function createEssentialAuthors(authorService: AuthorServiceImpl): Promise<Author[]> {
  const essentialAuthorsData = [
    {
      firstName: 'Robert',
      lastName: 'Martin',
      email: 'contact@cleancoder.com',
      birthDate: new Date('1952-12-05'),
      nationality: 'American',
      biography:
        'American software engineer and instructor, known as "Uncle Bob". He is best known for being one of the authors of the Agile Manifesto and for developing several software design principles including SOLID. Author of Clean Code and Clean Architecture.',
      isPopular: true,
    },
    {
      firstName: 'Eric',
      lastName: 'Evans',
      birthDate: new Date('1962-01-01'),
      nationality: 'American',
      biography:
        'American software engineer and author. He is known for his work on domain-driven design and is the author of the book "Domain-Driven Design: Tackling Complexity in the Heart of Software".',
      isPopular: true,
    },
    {
      firstName: 'Martin',
      lastName: 'Fowler',
      email: 'martin@martinfowler.com',
      birthDate: new Date('1963-12-18'),
      nationality: 'British',
      biography:
        'British software engineer, author and international public speaker on software development. Chief Scientist at ThoughtWorks. Known for his work on object-oriented analysis and design, UML, patterns, and agile software development methodologies.',
      isPopular: true,
    },
    {
      firstName: 'Kent',
      lastName: 'Beck',
      birthDate: new Date('1961-03-31'),
      nationality: 'American',
      biography:
        'American software engineer and creator of Extreme Programming and Test-Driven Development. He is one of the 17 original signatories of the Agile Manifesto.',
      isPopular: true,
    },
    {
      firstName: 'Erich',
      lastName: 'Gamma',
      birthDate: new Date('1961-03-13'),
      nationality: 'Swiss',
      biography:
        'Swiss computer scientist and one of the four authors (Gang of Four) of the software engineering textbook, "Design Patterns: Elements of Reusable Object-Oriented Software".',
      isPopular: true,
    },
    {
      firstName: 'Richard',
      lastName: 'Helm',
      birthDate: new Date('1956-01-01'),
      nationality: 'American',
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
      isPopular: false,
    },
    {
      firstName: 'Ralph',
      lastName: 'Johnson',
      birthDate: new Date('1955-01-01'),
      nationality: 'American',
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
      isPopular: false,
    },
    {
      firstName: 'John',
      lastName: 'Vlissides',
      birthDate: new Date('1961-08-02'),
      deathDate: new Date('2005-11-24'),
      nationality: 'American',
      biography:
        'American computer scientist and one of the Gang of Four authors of the Design Patterns book.',
      isPopular: false,
    },
  ];

  const createdAuthors: Author[] = [];

  for (const authorData of essentialAuthorsData) {
    const existingAuthors = await authorService.findByName(
      `${authorData.firstName} ${authorData.lastName}`
    );
    const existing = existingAuthors.find(
      a => a.firstName === authorData.firstName && a.lastName === authorData.lastName
    );

    if (!existing) {
      const authorId = await cryptoService.generateUUID();
      const author: Author = {
        id: authorId,
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        email: validateAndNormalizeEmail(authorData.email),
        phoneNumber: null,
        birthDate: authorData.birthDate,
        deathDate: authorData.deathDate || null,
        nationality: authorData.nationality,
        biography: authorData.biography,
        isPopular: authorData.isPopular,
      };

      const savedAuthor = await authorService.save(author);
      createdAuthors.push(savedAuthor);
      console.log(`  ✓ Author created: ${author.firstName} ${author.lastName}`);
    } else {
      createdAuthors.push(existing);
      console.log(`  → Author exists: ${existing.firstName} ${existing.lastName}`);
    }
  }

  return createdAuthors;
}

async function createEssentialBooks(bookService: BookServiceImpl, authors: Author[]) {
  const essentialBooksData = [
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description:
        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      publishedDate: new Date('2008-08-01'),
      isbn: 9780132350884,
      pages: 464,
      publisher: 'Prentice Hall',
      authorName: 'Robert Martin',
      isPopular: true,
    },
    {
      title: "Clean Architecture: A Craftsman's Guide to Software Structure and Design",
      description:
        'Building upon the success of best-sellers The Clean Coder and Clean Code, legendary software craftsman Robert C. Martin (Uncle Bob) reveals those rules and helps you apply them.',
      publishedDate: new Date('2017-09-20'),
      isbn: 9780134494166,
      pages: 432,
      publisher: 'Prentice Hall',
      authorName: 'Robert Martin',
      isPopular: true,
    },
    {
      title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
      description:
        'The software development community widely acknowledges that domain modeling is central to software design. Through domain modeling, software developers are able to express rich functionality and translate it into software implementation.',
      publishedDate: new Date('2003-08-22'),
      isbn: 9780321125217,
      pages: 560,
      publisher: 'Addison-Wesley Professional',
      authorName: 'Eric Evans',
      isPopular: true,
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      description:
        'Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure.',
      publishedDate: new Date('1999-07-08'),
      isbn: 9780201485677,
      pages: 431,
      publisher: 'Addison-Wesley Professional',
      authorName: 'Martin Fowler',
      isPopular: true,
    },
    {
      title: 'Test Driven Development: By Example',
      description:
        'Quite simply, test-driven development is meant to eliminate fear in application development. While some fear is healthy, the author believes that byproducts of fear include tentative, grumpy, and uncommunicative programmers.',
      publishedDate: new Date('2002-11-18'),
      isbn: 9780321146533,
      pages: 240,
      publisher: 'Addison-Wesley Professional',
      authorName: 'Kent Beck',
      isPopular: true,
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      description:
        'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
      publishedDate: new Date('1994-10-21'),
      isbn: 9780201633610,
      pages: 395,
      publisher: 'Addison-Wesley Professional',
      authorName: 'Erich Gamma',
      isPopular: true,
    },
    {
      title: 'Extreme Programming Explained: Embrace Change',
      description:
        'Accountability. Transparency. Responsibility. These are not words that are often applied to software development. In this completely revised introduction to Extreme Programming (XP), Kent Beck describes how to improve your software development.',
      publishedDate: new Date('1999-10-05'),
      isbn: 9780201616415,
      pages: 190,
      publisher: 'Addison-Wesley Professional',
      authorName: 'Kent Beck',
      isPopular: false,
    },
    {
      title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
      description:
        'In The Clean Coder, legendary software expert Robert C. Martin introduces the disciplines, techniques, tools, and practices of true software craftsmanship.',
      publishedDate: new Date('2011-05-23'),
      isbn: 9780137081073,
      pages: 247,
      publisher: 'Prentice Hall',
      authorName: 'Robert Martin',
      isPopular: false,
    },
  ];

  for (const bookData of essentialBooksData) {
    const existingBook = await bookService.findByIsbn(bookData.isbn.toString());

    if (!existingBook) {
      const author = authors.find(
        a =>
          `${a.firstName} ${a.lastName}` === bookData.authorName ||
          bookData.authorName.includes(`${a.firstName} ${a.lastName}`) ||
          a.lastName === bookData.authorName.split(' ').pop()
      );

      if (author) {
        const bookId = await cryptoService.generateUUID();

        const book: Book = {
          id: bookId,
          title: bookData.title,
          ISBN: bookData.isbn,
          pages: bookData.pages,
          publicationDate: bookData.publishedDate,
          publisher: bookData.publisher,
          status: BookStatus.AVAILABLE,
          totalLoans: 0,
          isPopular: bookData.isPopular,
          entryDate: new Date(),
        };

        await bookService.save(book);
        console.log(`  ✓ Book created: ${bookData.title}`);
      } else {
        console.log(`  ⚠️  Author not found for book: ${bookData.title} (${bookData.authorName})`);
      }
    } else {
      console.log(`  → Book exists: ${existingBook.title}`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedProduction()
    .then(() => {
      console.log('\n✨ Production seeding completed! Your BookLend system is ready for use.');
      console.log('\n🔐 Security Reminder:');
      console.log('   1. Change the default admin password immediately');
      console.log('   2. Set up proper environment variables');
      console.log('   3. Configure email service for production');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Production seeding failed:', error);
      process.exit(1);
    });
}

export { seedProduction };
