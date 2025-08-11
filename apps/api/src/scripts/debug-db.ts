import 'reflect-metadata';
import { join } from 'path';
import { promises as fs } from 'fs';
import { BookEntity } from '../entities/book.entity.js';
import { AuthorEntity } from '../entities/author.entity.js';
import { UserEntity } from '../entities/user.entity.js';
import { EmailVerificationTokenEntity } from '../entities/email-verification-token.entity.js';
import { fileURLToPath } from 'url';

async function debugDatabase() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const executedFilePath = process.argv[1];
  console.log('🔍 Debugging database setup...\n');

  try {
    console.log('📁 Current working directory:', process.cwd());

    const dataDir = join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
      console.log('✅ Data directory exists:', dataDir);
    } catch {
      console.log('❌ Data directory does not exist:', dataDir);
      console.log('📁 Creating data directory...');
      await fs.mkdir(dataDir, { recursive: true });
      console.log('✅ Data directory created');
    }

    const dbPath = join(process.cwd(), 'data', 'booklend.sqlite');
    try {
      await fs.access(dbPath);
      const stats = await fs.stat(dbPath);
      console.log('✅ Database file exists:', dbPath);
      console.log('📊 Database size:', stats.size, 'bytes');
    } catch {
      console.log('❌ Database file does not exist:', dbPath);
    }

    console.log('\n🏗️ Checking entities...');
    const entities = [BookEntity, AuthorEntity, UserEntity, EmailVerificationTokenEntity];
    entities.forEach((entity, index) => {
      console.log(`${index + 1}. ${entity.name}:`, entity);
    });

    console.log('\n🌍 Environment variables:');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('DATABASE_URL:', process.env.DATABASE_URL || 'not set');

    console.log('\n🔗 Testing basic SQLite connection...');
    try {
      const Database = await import('better-sqlite3');
      const db = Database.default(dbPath);
      console.log('✅ SQLite connection successful');

      try {
        const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log(
          '📋 Existing tables:',
          result.length > 0 ? result.map((r: any) => r.name) : 'none'
        );
      } catch (queryError) {
        console.log('❌ Query failed:', queryError);
      }

      db.close();
      console.log('🔒 SQLite connection closed');
    } catch (sqliteError) {
      console.error('❌ SQLite connection failed:', sqliteError);
    }
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }

  if (currentFilePath === executedFilePath) {
    debugDatabase()
      .then(() => {
        console.log('\n🎉 Debug completed!');
        process.exit(0);
      })
      .catch(error => {
        console.error('💥 Debug failed:', error);
        process.exit(1);
      });
  }
}

export { debugDatabase };
