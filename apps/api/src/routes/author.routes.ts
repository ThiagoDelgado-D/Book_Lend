import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { authorController } from '../controllers/author.controller.js';

const router: ExpressRouter = Router();

// GET /api/authors - Get all authors
router.get('/', authorController.getAllAuthors);

// POST /api/authors - Create new author
router.post('/', authorController.createAuthor);

export { router as authorRoutes };
