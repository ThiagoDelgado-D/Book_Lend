import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { BookEntity } from '../entities/book.entity.js';
import { AuthorEntity } from '../entities/author.entity.js';
import { UserEntity } from '../entities/user.entity.js';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity.js';

/**
 * Development database setup script
 * Creates and initializes SQLite database for development environment
 */
const createDevDataSource = () =>
  new DataSource({
    type: 'better-sqlite3',
    database: join(process.cwd(), 'data', 'booklend.sqlite'),
    entities: [BookEntity, AuthorEntity, UserEntity, EmailVerificationTokenEntity],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    migrations: [],
    migrationsTableName: 'migrations',
    prepareDatabase: db => {
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
      db.pragma('synchronous = NORMAL');
      db.pragma('temp_store = MEMORY');
      db.pragma('mmap_size = 268435456');
    },
  });

async function setupDevDatabase() {
  let dataSource: DataSource | null = null;

  try {
    console.log('🔄 Setting up development database...');

    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });
    console.log('📁 Data directory ensured');

    dataSource = createDevDataSource();
    await dataSource.initialize();
    console.log('✅ Database connection established');

    await dataSource.synchronize();
    console.log('✅ Database schema synchronized');

    const queryRunner = dataSource.createQueryRunner();
    const tables = await queryRunner.getTables();
    console.log(`✅ Created ${tables.length} tables: ${tables.map(t => t.name).join(', ')}`);
    await queryRunner.release();

    const dbPath = join(process.cwd(), 'data', 'booklend.sqlite');
    console.log('🎉 Development database setup completed successfully!');
    console.log(`📁 Database location: ${dbPath}`);
  } catch (error) {
    console.error('❌ Error setting up development database:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    throw error;
  } finally {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
      console.log('🔒 Database connection closed');
    }
  }
}

setupDevDatabase()
  .then(() => {
    console.log('\n✨ Setup completed! You can now seed the database.');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });

export { setupDevDatabase, createDevDataSource };
