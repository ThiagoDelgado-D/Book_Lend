import { Request, Response } from 'express';
import { getPopularBooks, mockBookService, Book, BookStatus } from 'app-domain';

const mockBooks: Book[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Clean Architecture',
    ISBN: 9780134494166,
    pages: 432,
    publicationDate: new Date('2017-09-20'),
    publisher: 'Prentice Hall',
    status: BookStatus.AVAILABLE,
    totalLoans: 25,
    isPopular: true,
    entryDate: new Date('2024-01-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Domain-Driven Design',
    ISBN: 9780321125217,
    pages: 560,
    publicationDate: new Date('2003-08-22'),
    publisher: 'Addison-Wesley',
    status: BookStatus.AVAILABLE,
    totalLoans: 18,
    isPopular: true,
    entryDate: new Date('2024-01-20'),
  },
  {
    id: '4f773898-5550-490f-940d-8421f4777737',
    title: 'The Pragmatic Programmer',
    ISBN: 9780201616224,
    pages: 352,
    publicationDate: new Date('1999-10-30'),
    publisher: 'Addison-Wesley',
    status: BookStatus.BORROWED,
    totalLoans: 32,
    isPopular: false,
    entryDate: new Date('2024-02-01'),
  },
];

const bookService = mockBookService(mockBooks);

export const bookController = {
  async getPopularBooks(req: Request, res: Response) {
    try {
      const result = await getPopularBooks({ bookService });

      res.json({
        success: result.success,
        data: result.books,
        message: result.message,
        total: result.total,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Internal server error',
        },
        timestamp: new Date().toISOString(),
      });
    }
  },

  async getAllBooks(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: bookService.books,
        message: 'All books retrieved successfully',
        total: bookService.books.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Internal server error',
        },
        timestamp: new Date().toISOString(),
      });
    }
  },
};
