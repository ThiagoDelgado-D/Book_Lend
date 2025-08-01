import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { bookController } from '../controllers/book.controller.js';

const router: ExpressRouter = Router();

router.get('/', bookController.getAllBooks);

router.get('/popular', bookController.getPopularBooks);

export { router as bookRoutes };
