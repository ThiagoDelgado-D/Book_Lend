import 'reflect-metadata';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { PORT, CLIENT_URL } from './constants.js';
import { loadRoutes } from './utils/load-routes.js';
import { initializeDatabase, closeDatabaseConnection } from './config/data-source.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app: Express = express();

app.use(morgan('dev'));
app.use(compression() as any);
app.use(
  cors({
    origin: CLIENT_URL ?? '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
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

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

app.use('/api', loadRoutes());

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 BookLend API listening on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  await closeDatabaseConnection();
  process.exit(0);
});

startServer();

export default app;
