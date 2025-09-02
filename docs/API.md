# BookLend API Server

REST API for the BookLend library management system, built with Express.js, TypeORM and SQLite.

## Quick Start

```bash
yarn install
```

### Environment Variables

The `.env` file is already configured with default values:

```
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Development

### Starting the API

From the project root:

```bash
yarn api:dev
```

Or directly in the API folder:

```bash
cd apps/api
yarn dev
```

### Testing Endpoints

#### Main Health Check

```bash
curl http://localhost:3001
```

Expected response:

```json
{
  "message": "BookLend API is running",
  "version": "0.0.1",
  "timestamp": "2025-08-01T00:20:00.000Z"
}
```

#### API Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-08-01T00:20:00.000Z"
}
```

#### Book Endpoints

**Get all books:**

```bash
curl http://localhost:3001/api/books
```

**Get popular books:**

```bash
curl http://localhost:3001/api/books/popular
```

#### Author Endpoints

**Get all authors:**

```bash
curl http://localhost:3001/api/authors
```

**Create author (demo):**

```bash
curl -X POST http://localhost:3001/api/authors
```

## Available Scripts

- `yarn dev` - Runs the API in development mode with hot reload
- `yarn build` - Compiles TypeScript code
- `yarn start` - Runs the compiled API
- `yarn test` - Runs tests
- `yarn type-check` - Verifies TypeScript types

## Project Structure

```
apps/api/
├── src/
│   ├── application.ts       # Main application file
│   ├── express-app.ts       # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── constants.ts        # Constants and configuration
│   ├── config/            # Database and other configurations
│   ├── controllers/       # API controllers
│   ├── middlewares/       # Express middlewares
│   ├── routes/           # Route definitions
│   ├── services/         # Service implementations
│   ├── entities/         # TypeORM entities
│   ├── container/        # Dependency injection
│   ├── scripts/          # Database management scripts
│   └── utils/           # Utility functions
├── data/                 # SQLite database files
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # Build configuration
└── README.md           # This file
```

## Domain Integration

The API uses a clean domain exports system that allows importing any functionality in an organized way:

```typescript
import {
  // ============= ENTITIES =============
  Book,
  Author,
  User,
  BookStatus,

  // ============= USE CASES =============
  getPopularBooks,
  createAuthor,
  updateAuthor,
  deleteAuthor,

  // ============= SERVICES =============
  BookService,
  AuthorService,
  UserService,

  // ============= MOCK SERVICES =============
  mockBookService,
  mockAuthorService,
  mockUserService,

  // ============= TYPES =============
  UUID,
  Email,

  // ============= UTILS =============
  trimOrNull,
  authorization,

  // ============= VALIDATIONS =============
  validateAndNormalizeEmail,
  validateBirthDeathDates,
} from 'app-domain';
```

### Benefits of Clean Exports System:

- ✅ **Single import** for all domain functionality
- ✅ **Clear organization** by categories
- ✅ **Complete IntelliSense** in IDE
- ✅ **Easy maintenance** - no more manual one-by-one exports
- ✅ **Scalability** - automatically includes new functionalities

## Next Steps

1. ✅ ~~Integrate with domain (`app-domain`)~~ - **COMPLETED**
2. ✅ ~~Add controllers and routes~~ - **COMPLETED**
3. ✅ ~~Implement authentication middlewares~~ - **COMPLETED**
4. ✅ ~~Add database integration~~ - **COMPLETED**
5. Add comprehensive unit tests
6. Implement email service integration
7. Add API documentation with Swagger
8. Implement book lending/returning functionality
9. Add notification system
10. Implement advanced search and filtering
