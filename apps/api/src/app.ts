import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { PORT, CLIENT_URL } from './constants.js';
import { loadRoutes } from './utils/load-routes.js';

const app: Express = express();

// Middleware
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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BookLend API is running',
    version: '0.0.1',
    timestamp: new Date().toISOString(),
  });
});

// Basic API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', loadRoutes());

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BookLend API listening on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
