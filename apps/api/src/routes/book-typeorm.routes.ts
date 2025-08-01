import { Router as ExpressRouter } from 'express';
import { bookTypeORMController } from '../controllers/book-typeorm.controller.js';

const router: ExpressRouter = ExpressRouter();

router.get('/', bookTypeORMController.getAllBooks);
router.get('/available', bookTypeORMController.getAvailableBooks);
router.get('/search', bookTypeORMController.searchBooks);
router.get('/statistics', bookTypeORMController.getBookStatistics);
router.get('/:id', bookTypeORMController.getBookById);
router.post('/', bookTypeORMController.createBook);
router.put('/:id', bookTypeORMController.updateBook);
router.delete('/:id', bookTypeORMController.deleteBook);

export default router;
