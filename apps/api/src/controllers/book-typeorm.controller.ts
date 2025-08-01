import { Request, Response } from 'express';
import { BookEntity, BookStatus } from '../entities/book.entity.js';
import { AuthorEntity } from '../entities/author.entity.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';
import { AppDataSource } from '../config/data-source.js';

// Initialize repositories using TypeORM
const bookRepository = AppDataSource.getRepository(BookEntity);
const authorRepository = AppDataSource.getRepository(AuthorEntity);
const cryptoService = new CryptoServiceImplementation();

export const bookTypeORMController = {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookRepository.find();

      res.json({
        success: true,
        data: books,
        message: 'All books retrieved successfully',
        total: books.length,
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

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookRepository.findOne({
        where: { id },
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: book,
        message: 'Book retrieved successfully',
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

  async createBook(req: Request, res: Response) {
    try {
      const { title, description, publishedDate, isbn, authorId } = req.body;

      if (!title || !authorId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Title and authorId are required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const author = await authorRepository.findOne({ where: { id: authorId } });
      if (!author) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Author not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (isbn) {
        const existingBook = await bookRepository.findOne({ where: { isbn } });
        if (existingBook) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'A book with this ISBN already exists',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      const bookId = await cryptoService.generateUUID();
      const bookData = bookRepository.create({
        id: bookId,
        title,
        description,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        isbn,
        status: BookStatus.AVAILABLE,
        authorId,
      });

      const newBook = await bookRepository.save(bookData);

      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully',
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

  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, publishedDate, isbn, authorId, status } = req.body;

      const existingBook = await bookRepository.findOne({
        where: { id },
      });
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (authorId && authorId !== existingBook.authorId) {
        const author = await authorRepository.findOne({ where: { id: authorId } });
        if (!author) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Author not found',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (isbn && isbn !== existingBook.isbn) {
        const bookWithIsbn = await bookRepository.findOne({ where: { isbn } });
        if (bookWithIsbn && bookWithIsbn.id !== id) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'A book with this ISBN already exists',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      const updateData: Partial<BookEntity> = {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(publishedDate && { publishedDate: new Date(publishedDate) }),
        ...(isbn !== undefined && { isbn }),
        ...(status && { status }),
        ...(authorId && { authorId }),
      };

      await bookRepository.update(id, updateData);
      const updatedBook = await bookRepository.findOne({
        where: { id },
      });

      res.json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully',
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

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const exists = await bookRepository.exists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const deleted = await bookRepository.delete(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Book deleted successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            message: 'Failed to delete book',
          },
          timestamp: new Date().toISOString(),
        });
      }
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

  async getAvailableBooks(req: Request, res: Response) {
    try {
      const books = await bookRepository.findAvailableBooks();

      res.json({
        success: true,
        data: books,
        message: 'Available books retrieved successfully',
        total: books.length,
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

  async searchBooks(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Search query is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const books = await bookRepository.search(q);

      res.json({
        success: true,
        data: books,
        message: 'Books search completed successfully',
        total: books.length,
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

  async getBookStatistics(req: Request, res: Response) {
    try {
      const statistics = await bookRepository.getStatistics();

      res.json({
        success: true,
        data: statistics,
        message: 'Book statistics retrieved successfully',
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
