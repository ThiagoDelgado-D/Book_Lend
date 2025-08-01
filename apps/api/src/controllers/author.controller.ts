import { Request, Response } from 'express';
import { Author, mockAuthorService } from 'app-domain';

const mockAuthors: Author[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655441001',
    firstName: 'Robert',
    lastName: 'Martin',
    email: 'bob@cleancoder.com',
    phoneNumber: null,
    birthDate: new Date('1952-12-05'),
    deathDate: null,
    nationality: 'American',
    biography: 'Software craftsman, author of Clean Code and Clean Architecture',
    isPopular: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655441002',
    firstName: 'Eric',
    lastName: 'Evans',
    email: 'eric@domainlanguage.com',
    phoneNumber: null,
    birthDate: new Date('1962-08-15'),
    deathDate: null,
    nationality: 'American',
    biography: 'Domain-Driven Design pioneer and consultant',
    isPopular: true,
  },
];

const authorService = mockAuthorService(mockAuthors);

export const authorController = {
  async getAllAuthors(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: authorService.authors,
        message: 'Authors retrieved successfully',
        total: authorService.authors.length,
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

  async createAuthor(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      message:
        'Create author endpoint not implemented yet - this demonstrates clean domain exports!',
      note: 'Available functions: createAuthor, updateAuthor, deleteAuthor',
      timestamp: new Date().toISOString(),
    });
  },
};
