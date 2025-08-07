import { Request, Response } from 'express';
import { BookServiceImpl } from '../services';
import { Book, deleteBook, updateBook, getPopularBooks, UUID, addBook } from 'app-domain';
import { asyncHandler, createDomainError } from '../middlewares/error-handler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponseFactory, BooksListResponse, BookResponse } from '../types/api-response';
import { CryptoServiceImplementation } from '../services/crypto-service';

const bookService = new BookServiceImpl();
const cryptoService = new CryptoServiceImplementation();

export const bookController = {
  getAllBooks: asyncHandler(async (_req: Request, res: Response) => {
    const books = await bookService.findAll();

    const response: BooksListResponse = ApiResponseFactory.booksListSuccess(
      books,
      'Books retrieved successfully'
    );

    res.json(response);
  }),

  getBookById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(ApiResponseFactory.error('Book ID is required'));
    }

    const book = await bookService.findById(id as UUID);

    if (!book) {
      return res.status(404).json(ApiResponseFactory.error('Book not found'));
    }

    const response: BookResponse = ApiResponseFactory.bookSuccess(
      book,
      'Book retrieved successfully'
    );

    return res.json(response);
  }),

  searchBooks: asyncHandler(async (req: Request, res: Response) => {
    const { title, status } = req.query;

    if (!title && !status) {
      return res.status(400).json(ApiResponseFactory.error('Search title or status is required'));
    }

    let books: Book[] = [];

    if (title && typeof title === 'string') {
      books = await bookService.findByTitle(title);
    } else if (status && typeof status === 'string') {
      books = await bookService.findByStatus(status as any);
    }

    const response: BooksListResponse = ApiResponseFactory.booksListSuccess(
      books,
      'Books search completed successfully'
    );

    return res.json(response);
  }),

  getPopularBooks: asyncHandler(async (_req: Request, res: Response) => {
    const result = await getPopularBooks({ bookService });

    const response: BooksListResponse = ApiResponseFactory.booksListSuccess(
      result.books,
      result.message
    );

    res.json(response);
  }),

  createBook: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminUserId = req.user.id;

    const domainResult = await addBook(
      {
        bookService,
        cryptoService,
      },
      {
        adminUserId,
        ...req.body,
      }
    );

    if (!domainResult.success) {
      throw createDomainError(domainResult.message as string);
    }

    const response: BookResponse = ApiResponseFactory.bookSuccess(
      domainResult.book!,
      domainResult.message
    );

    return res.status(201).json(response);
  }),

  updateBook: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminUserId = req.user?.id;

    if (!adminUserId) {
      return res.status(401).json(ApiResponseFactory.error('Authentication required'));
    }

    const domainResult = await updateBook(
      {
        bookService,
      },
      {
        adminUserId,
        bookId: id as UUID,
        ...req.body,
      }
    );

    if (!domainResult.success) {
      throw createDomainError(domainResult.message as string);
    }

    const response: BookResponse = ApiResponseFactory.bookSuccess(
      domainResult.book!,
      domainResult.message
    );

    return res.json(response);
  }),

  deleteBook: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminUserId = req.user?.id;

    if (!adminUserId) {
      return res.status(401).json(ApiResponseFactory.error('Authentication required'));
    }

    if (!id) {
      return res.status(400).json(ApiResponseFactory.error('Book ID is required'));
    }

    const domainResult = await deleteBook(
      {
        bookService,
      },
      {
        bookId: id as UUID,
      }
    );

    if (!domainResult.success) {
      throw createDomainError(domainResult.message as string);
    }

    const response = ApiResponseFactory.deleteSuccess(domainResult.message);
    return res.json(response);
  }),
};
