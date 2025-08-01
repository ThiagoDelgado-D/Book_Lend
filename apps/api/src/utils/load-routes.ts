import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { bookRoutes } from '../routes/book.routes.js';
import { authorRoutes } from '../routes/author.routes.js';

export const loadRoutes = (): ExpressRouter => {
  const router: ExpressRouter = Router();

  // Register routes
  router.use('/books', bookRoutes);
  router.use('/authors', authorRoutes);

  return router;
};
