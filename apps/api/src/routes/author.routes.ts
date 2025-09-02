import { Router, type Router as ExpressRouter } from 'express';
import { authorController } from '../controllers/author.controller.js';
import {
  authenticateToken,
  requireAdmin,
  authRateLimit,
  adminRateLimit,
} from '../middlewares/auth.middleware.js';
import { getAuthorDependencies } from '../container/index.js';
const router: ExpressRouter = Router();
const controller = authorController(getAuthorDependencies());
router.use(authRateLimit);

router.get('/', controller.getAllAuthors);
router.get('/popular', controller.getPopularAuthors);
router.get('/search', controller.searchAuthors);
router.get('/:id', controller.getAuthorById);

router.post('/', adminRateLimit, authenticateToken, requireAdmin, controller.createAuthor);
router.put('/:id', adminRateLimit, authenticateToken, requireAdmin, controller.updateAuthor);

router.delete('/:id', adminRateLimit, authenticateToken, requireAdmin, controller.deleteAuthor);

export { router as authorRoutes };
