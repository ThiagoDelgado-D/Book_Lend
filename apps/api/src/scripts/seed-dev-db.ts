#!/usr/bin/env tsx

import { DataSource } from 'typeorm';
import { join } from 'path';
import { BookEntity, BookStatus } from '../entities/book.entity';
import { AuthorEntity } from '../entities/author.entity';
import { UserEntity, UserRole, UserStatus } from '../entities/user.entity';
import { randomUUID } from 'crypto';

/**
 * Development database seeding script
 * Populates SQLite database with sample data for development
 */

const devDataSource = new DataSource({
  type: 'better-sqlite3',
  database: join(process.cwd(), 'database', 'booklend-dev.sqlite'),
  entities: [BookEntity, AuthorEntity, UserEntity],
  synchronize: false,
  logging: true,
});

async function seedDevDatabase() {
  try {
    console.log('🌱 Seeding development database...');

    // Initialize database connection
    await devDataSource.initialize();
    console.log('✅ Database connection established');

    // Get repositories
    const authorRepo = devDataSource.getRepository(AuthorEntity);
    const bookRepo = devDataSource.getRepository(BookEntity);
    const userRepo = devDataSource.getRepository(UserEntity);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await bookRepo.clear();
    await authorRepo.clear();
    await userRepo.clear();

    // Create sample authors
    console.log('👨‍💼 Creating sample authors...');
    const authors = [
      {
        id: randomUUID(),
        firstName: 'Gabriel García',
        lastName: 'Márquez',
        nationality: 'Colombian',
        birthDate: new Date('1927-03-06'),
        isPopular: true,
      },
      {
        id: randomUUID(),
        firstName: 'Isabel',
        lastName: 'Allende',
        nationality: 'Chilean',
        birthDate: new Date('1942-08-02'),
        isPopular: true,
      },
      {
        id: randomUUID(),
        firstName: 'Jorge Luis',
        lastName: 'Borges',
        nationality: 'Argentine',
        birthDate: new Date('1899-08-24'),
        isPopular: true,
      },
    ];

    const savedAuthors = await authorRepo.save(authors);
    console.log(`✅ Created ${savedAuthors.length} authors`);

    if (savedAuthors.length < 3) {
      throw new Error('Failed to create all required authors');
    }

    // Create sample books
    console.log('📚 Creating sample books...');
    const books = [
      {
        id: randomUUID(),
        title: 'Cien años de soledad',
        description: 'Una obra maestra del realismo mágico',
        pages: 471,
        publisher: 'Editorial Sudamericana',
        publishedDate: new Date('1967-06-05'),
        isbn: 9780060883287,
        status: BookStatus.AVAILABLE,
        totalLoans: 15,
        isPopular: true,
        entryDate: new Date(),
        authorId: savedAuthors[0]!.id,
      },
      {
        id: randomUUID(),
        title: 'La casa de los espíritus',
        description: 'Una saga familiar chilena',
        pages: 448,
        publisher: 'Plaza & Janés',
        publishedDate: new Date('1982-10-01'),
        isbn: 9780553273915,
        status: BookStatus.AVAILABLE,
        totalLoans: 8,
        isPopular: false,
        entryDate: new Date(),
        authorId: savedAuthors[1]!.id,
      },
      {
        id: randomUUID(),
        title: 'Ficciones',
        description: 'Colección de cuentos fantásticos',
        pages: 174,
        publisher: 'Sur',
        publishedDate: new Date('1944-01-01'),
        isbn: 9780802130303,
        status: BookStatus.BORROWED,
        totalLoans: 25,
        isPopular: true,
        entryDate: new Date(),
        authorId: savedAuthors[2]!.id,
      },
      {
        id: randomUUID(),
        title: 'El amor en los tiempos del cólera',
        description: 'Una historia de amor que perdura',
        pages: 368,
        publisher: 'Editorial Oveja Negra',
        publishedDate: new Date('1985-03-01'),
        isbn: 9780307389732,
        status: BookStatus.AVAILABLE,
        totalLoans: 12,
        isPopular: true,
        entryDate: new Date(),
        authorId: savedAuthors[0]!.id,
      },
    ];

    const savedBooks = await bookRepo.save(books);
    console.log(`✅ Created ${savedBooks.length} books`);

    // Create sample users
    console.log('👥 Creating sample users...');
    const users = [
      {
        id: randomUUID(),
        email: 'admin@booklend.dev',
        passwordHash: '$2b$10$hashedpassword123', // In real app, this should be properly hashed
        firstName: 'Admin',
        lastName: 'User',
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
        emailVerified: 1,
      },
      {
        id: randomUUID(),
        email: 'user@booklend.dev',
        passwordHash: '$2b$10$hashedpassword456', // In real app, this should be properly hashed
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        emailVerified: 1,
      },
    ];

    const savedUsers = await userRepo.save(users);
    console.log(`✅ Created ${savedUsers.length} users`);

    console.log('🎉 Development database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   📚 Books: ${savedBooks.length}`);
    console.log(`   👨‍💼 Authors: ${savedAuthors.length}`);
    console.log(`   👥 Users: ${savedUsers.length}`);
  } catch (error) {
    console.error('❌ Error seeding development database:', error);
    process.exit(1);
  } finally {
    if (devDataSource.isInitialized) {
      await devDataSource.destroy();
    }
  }
}

// Run seeding if this is the main module
if (process.env.NODE_ENV !== 'test') {
  seedDevDatabase();
}

export { seedDevDatabase };
