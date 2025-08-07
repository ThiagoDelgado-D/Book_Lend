import { Router, type Router as ExpressRouter } from 'express';
import { bookController } from '../controllers/book.controller.js';
import {
  authenticateToken,
  requireAdmin,
  authRateLimit,
  adminRateLimit,
} from '../middlewares/auth.middleware.js';

const router: ExpressRouter = Router();

router.use(authRateLimit);

router.get('/', bookController.getAllBooks);
router.get('/popular', bookController.getPopularBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBookById);

router.post('/', adminRateLimit, authenticateToken, requireAdmin, bookController.createBook);
router.put('/:id', adminRateLimit, authenticateToken, requireAdmin, bookController.updateBook);
router.delete('/:id', adminRateLimit, authenticateToken, requireAdmin, bookController.deleteBook);

export { router as bookRoutes };
