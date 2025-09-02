import { Router, type Router as ExpressRouter } from 'express';
import { bookController } from '../controllers/book.controller.js';
import {
  authenticateToken,
  requireAdmin,
  authRateLimit,
  adminRateLimit,
} from '../middlewares/auth.middleware.js';
import { getBookDependencies } from '../container/index.js';

const router: ExpressRouter = Router();
const controller = bookController(getBookDependencies());

router.use(authRateLimit);

router.get('/', controller.getAllBooks);
router.get('/popular', controller.getPopularBooks);
router.get('/search', controller.searchBooks);
router.get('/:id', controller.getBookById);

router.post('/', adminRateLimit, authenticateToken, requireAdmin, controller.createBook);
router.put('/:id', adminRateLimit, authenticateToken, requireAdmin, controller.updateBook);
router.delete('/:id', adminRateLimit, authenticateToken, requireAdmin, controller.deleteBook);

export { router as bookRoutes };
