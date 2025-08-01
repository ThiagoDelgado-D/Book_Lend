import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { bookRoutes } from '../routes/book.routes.js';
import { authorRoutes } from '../routes/author.routes.js';
import bookTypeORMRoutes from '../routes/book-typeorm.routes.js';

export const loadRoutes = (): ExpressRouter => {
  const router: ExpressRouter = Router();

  // Register routes
  router.use('/books', bookRoutes);
  router.use('/books-orm', bookTypeORMRoutes); // TypeORM version
  router.use('/authors', authorRoutes);

  return router;
};
