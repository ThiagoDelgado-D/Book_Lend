import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { bookRoutes } from '../routes/book.routes.js';
import { authorRoutes } from '../routes/author.routes.js';
import { authRoutes } from '../routes/auth.routes.js';

export const loadRoutes = (): ExpressRouter => {
  const router: ExpressRouter = Router();

  router.use('/books', bookRoutes);
  router.use('/authors', authorRoutes);
  router.use('/auth', authRoutes);

  return router;
};
