import { setupDevDatabase } from './setup-dev-db';
import { seedDevDatabase } from './seed-dev-db';

/**
 * Combined development database script
 * Sets up and seeds the database in one operation
 */

async function setupAndSeedDatabase() {
  try {
    console.log('🚀 Starting development database initialization...\n');

    // Setup database
    await setupDevDatabase();
    console.log('');

    // Seed database
    await seedDevDatabase();

    console.log('\n✨ Development environment is ready!');
    console.log('📝 You can now start the development server with: npm run dev');
  } catch (error) {
    console.error('❌ Failed to initialize development database:', error);
    process.exit(1);
  }
}

// This file should only be used as an import
// The actual execution happens through npm scripts calling individual files

export { setupAndSeedDatabase };
