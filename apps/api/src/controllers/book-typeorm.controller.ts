import { Request, Response } from 'express';
import { BookEntity, BookStatus } from '../entities/book.entity.js';
import { BookRepository } from '../repositories/book.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { CryptoServiceImplementation } from '../services/crypto-service.js';

// Initialize repositories using our custom repository layer
const bookRepository = new BookRepository();
const authorRepository = new AuthorRepository();
const cryptoService = new CryptoServiceImplementation();

export const bookTypeORMController = {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookRepository.findAll();

      res.json({
        success: true,
        data: books,
        message: 'All books retrieved successfully',
        total: books.length,
        timestamp: new Date().toISOString(),
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Internal server error',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }
  },

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Book ID is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const book = await bookRepository.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        data: book,
        message: 'Book retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
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

      const author = await authorRepository.findById(authorId);
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
        const existingBook = await bookRepository.findByIsbn(isbn);
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
      const newBook = await bookRepository.create({
        id: bookId,
        title,
        description,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        isbn,
        status: BookStatus.AVAILABLE,
        author: author,
      });

      return res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
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
      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Book ID is required',
          },
          timestamp: new Date().toISOString(),
        });
      }
      const { title, description, publishedDate, isbn, authorId, status } = req.body;

      const existingBook = await bookRepository.findById(id);
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
        const author = await authorRepository.findById(authorId);
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
        const bookWithIsbn = await bookRepository.findByIsbn(isbn);
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
      const updatedBook = await bookRepository.findById(id);

      return res.json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
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
      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Book ID is required',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const exists = await bookRepository.findById(id);
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
        return res.json({
          success: true,
          message: 'Book deleted successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to delete book',
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      return res.status(500).json({
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
      const books = await bookRepository.findAvailable();

      return res.json({
        success: true,
        data: books,
        message: 'Available books retrieved successfully',
        total: books.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
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

      const books = await bookRepository.searchBooks(q);

      return res.json({
        success: true,
        data: books,
        message: 'Books search completed successfully',
        total: books.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
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

      return res.json({
        success: true,
        data: statistics,
        message: 'Book statistics retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Internal server error',
        },
        timestamp: new Date().toISOString(),
      });
    }
  },
};
