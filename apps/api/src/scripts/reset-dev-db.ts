import 'reflect-metadata';
import { promises as fs } from 'fs';
import { join } from 'path';
import { setupDevDatabase } from './setup-dev-db.js';
import { seedDevDatabase } from './seed-dev-db.js';

async function resetDevDatabase() {
  console.log('🔄 Resetting development database...\n');

  try {
    const dbPath = join(process.cwd(), 'data', 'booklend.sqlite');

    try {
      await fs.access(dbPath);
      await fs.unlink(dbPath);
      console.log('🗑️  Old database file deleted');
    } catch {
      console.log('📝 No existing database file found (creating fresh)');
    }

    console.log('\n🏗️  Setting up database structure...');
    await setupDevDatabase();

    console.log('\n🌱 Seeding with development data...');
    await seedDevDatabase();

    console.log('\n✨ Database reset completed successfully!');
    console.log('🎯 Your development database is ready for testing.');
    console.log('\n🚀 You can now start the development server with:');
    console.log('   yarn dev  or  npm run dev');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetDevDatabase()
    .then(() => {
      console.log('\n🎉 All done! Happy coding! 🚀');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Reset failed:', error);
      process.exit(1);
    });
}

export { resetDevDatabase };
