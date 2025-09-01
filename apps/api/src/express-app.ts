import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { CLIENT_URL } from './constants.js';
import { loadRoutes } from './utils/load-routes.js';
import { errorHandler } from './middlewares/error-handler.js';

export interface ExpressAppConfig {
  clientUrl?: string;
  enableLogging?: boolean;
  enableCompression?: boolean;
}

export function createExpressApp(config: ExpressAppConfig = {}): Express {
  const { clientUrl = CLIENT_URL ?? '*', enableLogging = true, enableCompression = true } = config;

  const app: Express = express();

  if (enableLogging) {
    app.use(morgan('dev'));
  }

  if (enableCompression) {
    app.use(compression());
  }

  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'BookLend API is running',
      version: '0.0.1',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', loadRoutes());

  app.use(errorHandler);

  return app;
}
