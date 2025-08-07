import { Request, Response } from 'express';
import { AuthorServiceImpl, UserServiceImpl } from '../services';
import { Author, createAuthor, deleteAuthor, updateAuthor, UUID } from 'app-domain';
import { CryptoServiceImplementation } from '../services/crypto-service';
import { asyncHandler, createDomainError } from '../middlewares/error-handler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AuthorsListResponse, ApiResponseFactory, AuthorResponse } from '../types/api-response';

const authorService = new AuthorServiceImpl();
const authService = new UserServiceImpl();
const cryptoService = new CryptoServiceImplementation();

export const authorController = {
  getAllAuthors: asyncHandler(async (req: Request, res: Response) => {
    const authors = await authorService.findAll();

    const response: AuthorsListResponse = ApiResponseFactory.authorsListSuccess(
      authors,
      'Authors retrieved successfully'
    );

    res.json(response);
  }),
  getAuthorById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(ApiResponseFactory.error('Author ID is required'));
    }

    const author = await authorService.findById(id as UUID);

    if (!author) {
      return res.status(404).json(ApiResponseFactory.error('Author not found'));
    }

    const response: AuthorResponse = ApiResponseFactory.authorSuccess(
      author,
      'Author retrieved successfully'
    );

    return res.json(response);
  }),
  searchAuthors: asyncHandler(async (req: Request, res: Response) => {
    const { query, nationality } = req.query;

    if (!query && !nationality) {
      return res
        .status(400)
        .json(ApiResponseFactory.error('Search query (q) or nationality is required'));
    }

    let authors: Author[] = [];
    if (query && typeof query === 'string') {
      authors = await authorService.findByName(query);
    } else if (nationality && typeof nationality === 'string') {
      authors = await authorService.findByNationality(nationality);
    }

    const response: AuthorsListResponse = ApiResponseFactory.authorsListSuccess(
      authors,
      'Authors search completed successfully'
    );

    return res.json(response);
  }),
  getPopularAuthors: asyncHandler(async (req: Request, res: Response) => {
    const authors = await authorService.findPopularAuthors();

    const response: AuthorsListResponse = ApiResponseFactory.authorsListSuccess(
      authors,
      'Popular authors retrieved successfully'
    );

    res.json(response);
  }),
  createAuthor: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminUserId = req.user.id;

    const domainResult = await createAuthor(
      {
        authorService,
        authService,
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

    const response: AuthorResponse = ApiResponseFactory.authorSuccess(
      domainResult.author!,
      domainResult.message as string
    );

    return res.status(201).json(response);
  }),
  updateAuthor: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminUserId = req.user?.id;

    if (!adminUserId) {
      return res.status(401).json(ApiResponseFactory.error('Authentication required'));
    }

    const domainResult = await updateAuthor(
      {
        authorService,
        authService,
      },
      {
        adminUserId,
        authorId: id as UUID,
        ...req.body,
      }
    );

    if (!domainResult.success) {
      throw createDomainError(domainResult.message as string);
    }

    const response: AuthorResponse = ApiResponseFactory.authorSuccess(
      domainResult.author!,
      domainResult.message
    );

    return res.json(response);
  }),
  deleteAuthor: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminUserId = req.user?.id;

    if (!adminUserId) {
      return res.status(401).json(ApiResponseFactory.error('Authentication required'));
    }

    if (!id) {
      return res.status(400).json(ApiResponseFactory.error('Author ID is required'));
    }

    const domainResult = await deleteAuthor(
      {
        authorService,
        authService,
      },
      {
        adminUserId,
        authorId: id as UUID,
      }
    );

    if (!domainResult.success) {
      throw createDomainError(domainResult.message as string);
    }

    const response = ApiResponseFactory.deleteSuccess(domainResult.message);
    return res.json(response);
  }),
};
