#!/usr/bin/env tsx

import { DataSource } from 'typeorm';
import { join } from 'path';
import { BookEntity } from '../entities/book.entity';
import { AuthorEntity } from '../entities/author.entity';
import { UserEntity } from '../entities/user.entity';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity';

/**
 * Development database setup script
 * Creates and initializes SQLite database for development environment
 */

const devDataSource = new DataSource({
  type: 'better-sqlite3',
  database: join(process.cwd(), 'database', 'booklend-dev.sqlite'),
  entities: [BookEntity, AuthorEntity, UserEntity, EmailVerificationTokenEntity],
  synchronize: true,
  logging: true,
  migrations: [],
  migrationsTableName: 'migrations',
});

async function setupDevDatabase() {
  try {
    console.log('🔄 Setting up development database...');

    // Initialize database connection
    await devDataSource.initialize();
    console.log('✅ Database connection established');

    // Run synchronization (creates tables)
    await devDataSource.synchronize();
    console.log('✅ Database schema synchronized');

    console.log('🎉 Development database setup completed successfully!');
    console.log(`📁 Database location: ${devDataSource.options.database}`);
  } catch (error) {
    console.error('❌ Error setting up development database:', error);
    process.exit(1);
  } finally {
    if (devDataSource.isInitialized) {
      await devDataSource.destroy();
    }
  }
}

// Run setup if this is the main module
if (process.env.NODE_ENV !== 'test') {
  setupDevDatabase();
}

export { setupDevDatabase, devDataSource };
