import type { Express } from 'express';
import { initializeDatabase, closeDatabaseConnection } from './config/data-source.js';

export interface ApplicationDependencies {
  app: Express;
  port: number;
  environment?: string;
}

export interface Application {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function createApplication(dependencies: ApplicationDependencies) {
  const { app, port, environment = 'development' } = dependencies;

  return {
    async start(): Promise<void> {
      try {
        await initializeDatabase();

        app.listen(port, () => {
          console.log(`🚀 BookLend API listening on port ${port}`);
          console.log(`📚 Environment: ${environment}`);
        });
      } catch (error) {
        console.error('Failed to start application:', error);
        throw error;
      }
    },
    async stop(): Promise<void> {
      try {
        console.log('🛑 Shutting down gracefully...');
        await closeDatabaseConnection();
        console.log('✅ Application stopped successfully');
      } catch (error) {
        console.error('Error during shutdown:', error);
        throw error;
      }
    },
  };
}
