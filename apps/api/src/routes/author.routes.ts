import { Router, type Router as ExpressRouter } from 'express';
import { authorController } from '../controllers/author.controller.js';
import {
  authenticateToken,
  requireAdmin,
  authRateLimit,
  adminRateLimit,
} from '../middlewares/auth.middleware.js';

const router: ExpressRouter = Router();

router.use(authRateLimit);

router.get('/', authorController.getAllAuthors);
router.get('/popular', authorController.getPopularAuthors);
router.get('/search', authorController.searchAuthors);
router.get('/:id', authorController.getAuthorById);

router.post('/', adminRateLimit, authenticateToken, requireAdmin, authorController.createAuthor);
router.put('/:id', adminRateLimit, authenticateToken, requireAdmin, authorController.updateAuthor);

router.delete(
  '/:id',
  adminRateLimit,
  authenticateToken,
  requireAdmin,
  authorController.deleteAuthor
);

export { router as authorRoutes };
