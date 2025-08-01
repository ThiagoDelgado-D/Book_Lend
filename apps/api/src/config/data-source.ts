import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { UserEntity } from '../entities/user.entity.js';
import { AuthorEntity } from '../entities/author.entity.js';
import { BookEntity } from '../entities/book.entity.js';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity.js';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.join(process.cwd(), 'data', 'booklend.sqlite'),
  entities: [UserEntity, AuthorEntity, BookEntity, EmailVerificationTokenEntity],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  prepareDatabase: db => {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');
    db.pragma('mmap_size = 268435456');
  },
});

export async function initializeDatabase(): Promise<DataSource> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error during Database initialization:', error);
    throw error;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }
}
