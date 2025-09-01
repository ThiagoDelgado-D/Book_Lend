import 'dotenv/config';
import { NODE_ENV, PORT } from './constants.js';
import { createApplication } from './application.js';
import { createExpressApp } from './express-app.js';

async function main() {
  try {
    const app = createExpressApp({
      enableLogging: NODE_ENV !== 'test',
      enableCompression: true,
    });

    const application = createApplication({
      app,
      port: PORT,
      environment: NODE_ENV || 'development',
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Graceful shutdown...`);
      try {
        await application.stop();
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    await application.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
