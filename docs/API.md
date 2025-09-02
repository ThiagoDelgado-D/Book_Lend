# BookLend API Server

REST API for the BookLend library management system, built with Express.js, TypeORM and SQLite.

## Quick Start

```bash
# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env

# Setup database and seed data
yarn db:setup

# Start in development
yarn dev
```

API will be available at `http://localhost:3000`

## API Architecture

```
src/
├── controllers/        # REST controllers
├── routes/            # Route definitions
├── middlewares/       # Custom middleware
├── services/          # Domain service implementations
├── entities/          # TypeORM entities
├── config/           # Configuration (DB, JWT, etc.)
├── scripts/          # Database management scripts
├── utils/            # API utilities
└── container/        # Dependency injection
```

## Available Endpoints

### Authentication `/api/auth`

| Method | Endpoint             | Description             | Auth |
| ------ | -------------------- | ----------------------- | ---- |
| `POST` | `/send-verification` | Send email verification | ❌   |
| `POST` | `/verify-email`      | Verify email token      | ❌   |
| `POST` | `/register`          | Complete registration   | ❌   |
| `POST` | `/login`             | Login                   | ❌   |
| `POST` | `/refresh`           | Refresh JWT token       | ❌   |
| `GET`  | `/profile`           | Get user profile        | ✅   |

### Books `/api/books`

| Method   | Endpoint   | Description     | Auth | Role  |
| -------- | ---------- | --------------- | ---- | ----- |
| `GET`    | `/`        | List all books  | ❌   | -     |
| `GET`    | `/popular` | Popular books   | ❌   | -     |
| `GET`    | `/search`  | Search books    | ❌   | -     |
| `GET`    | `/:id`     | Get book by ID  | ❌   | -     |
| `POST`   | `/`        | Create new book | ✅   | Admin |
| `PUT`    | `/:id`     | Update book     | ✅   | Admin |
| `DELETE` | `/:id`     | Delete book     | ✅   | Admin |

### Authors `/api/authors`

| Method   | Endpoint  | Description      | Auth | Role  |
| -------- | --------- | ---------------- | ---- | ----- |
| `GET`    | `/`       | List authors     | ❌   | -     |
| `GET`    | `/search` | Search authors   | ❌   | -     |
| `GET`    | `/:id`    | Get author by ID | ❌   | -     |
| `POST`   | `/`       | Create author    | ✅   | Admin |
| `PUT`    | `/:id`    | Update author    | ✅   | Admin |
| `DELETE` | `/:id`    | Delete author    | ✅   | Admin |

## Configuration

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d

# Client
CLIENT_URL=http://localhost:5173

# Database (SQLite - automatically managed)
# Database file will be created at: ./data/booklend.sqlite
```

### Database Management

BookLend uses SQLite with better-sqlite3 for development and production. The database is automatically managed through custom scripts.

#### Database Setup Commands

```bash
# Complete database initialization (setup + seed)
yarn db:init

# Individual commands
yarn db:setup          # Create database schema
yarn db:seed           # Populate with development data
yarn db:debug          # Run database diagnostics
yarn db:reset          # Delete and recreate database

# Production seeding
yarn db:seed:prod      # Seed with production-ready data
```

#### Database File Location

- **Development**: `./data/booklend.sqlite`
- **Production**: `./data/booklend.sqlite`
- **Backups**: Automatically managed by SQLite WAL mode

#### SQLite Optimizations

The database is configured with performance optimizations:

```javascript
journal_mode = WAL        // Better concurrency
foreign_keys = ON         // Referential integrity
synchronous = NORMAL      // Balanced performance
temp_store = MEMORY       // Faster operations
mmap_size = 256MB         // Memory-mapped I/O
```

## Usage Examples

### User Registration

```bash
# 1. Send email verification
curl -X POST http://localhost:3000/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# 2. Verify token (from email link)
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "token-from-email"}'

# 3. Complete registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-from-email",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Book (Admin)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "title": "Don Quixote",
    "description": "The adventures of Don Quixote",
    "pages": 863,
    "isbn": 9788491050285,
    "publishedDate": "2024-01-15",
    "authorId": "author-uuid"
  }'
```

### Search Books

```bash
# By title
curl "http://localhost:3000/api/books/search?title=quixote"

# By status
curl "http://localhost:3000/api/books/search?status=available"

# Popular books
curl "http://localhost:3000/api/books/popular"
```

## Authentication & Authorization

### JWT Token

```typescript
// Authorization header required for protected endpoints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Auth Middleware

- **`authenticateToken`** - Validates JWT token
- **`requireAdmin`** - Requires admin role
- **Rate Limiting** - Protection against spam

### User Roles

- **`USER`** - Standard user (read access)
- **`ADMIN`** - Administrator (full CRUD)

## Development Data

### Test Credentials

After running `yarn db:init`, you can use these test accounts:

**Admin Account:**

- Email: `admin@test.com`
- Password: `admin123`
- Role: Administrator
- Book Limit: 10 books

**Regular User Account:**

- Email: `user@test.com`
- Password: `user123`
- Role: User
- Book Limit: 3 books

### Sample Data Generated

The development database includes:

- **1 Admin user** and **1 Test user** with known credentials
- **4 Additional random users** for testing
- **15 Authors** with realistic biographical data
- **30 Books** linked to authors with various metadata

## Production Setup

### Production Database Seeding

```bash
yarn db:seed:prod
```

Creates essential data for production:

**Admin User:**

- Email: `admin@booklend.com`
- Password: `Admin@BookLend2024`
- Role: Administrator

**Essential Authors:**

- Robert Martin (Uncle Bob) - Clean Code series
- Eric Evans - Domain-Driven Design
- Martin Fowler - Refactoring, Enterprise Patterns
- Kent Beck - Test-Driven Development
- Gang of Four - Design Patterns authors

**Essential Books:**

- Clean Code: A Handbook of Agile Software Craftsmanship
- Clean Architecture: A Craftsman's Guide to Software Structure
- Domain-Driven Design: Tackling Complexity in Software
- Refactoring: Improving the Design of Existing Code
- Test Driven Development: By Example
- Design Patterns: Elements of Reusable Object-Oriented Software
- And more programming classics...

**Security Warning:** Change the default admin password immediately after first login!

## Testing

```bash
# Run tests
yarn test

# Tests with coverage
yarn test:coverage

# Tests in watch mode
yarn test:watch

# Integration tests
yarn test:integration
```

### Test Database

Tests use a separate SQLite file to avoid conflicts:

```bash
# .env.test
NODE_ENV=test
DATABASE_PATH=./data/booklend-test.sqlite
```

## Database Troubleshooting

### Diagnostic Commands

```bash
# Check database status and connection
yarn db:debug

# View database file information
ls -la ./data/

# Check SQLite installation
yarn list better-sqlite3
```

### Common Issues

**Database Connection Errors:**

1. Ensure `./data` directory exists and is writable
2. Run `yarn db:debug` to check database status
3. Try `yarn db:reset` to recreate database

**Permission Issues (Windows):**

```bash
# Create data directory manually
mkdir data
# Run with administrator privileges if needed
```

**Schema Synchronization Issues:**

```bash
# Force complete reset
yarn db:reset
```

### Database Recovery

If database becomes corrupted:

```bash
# 1. Backup current database
cp ./data/booklend.sqlite ./data/booklend.backup.sqlite

# 2. Reset database
yarn db:reset

# 3. Restore data manually if needed
```

## Logging & Monitoring

### Development Logs

```bash
# Enable detailed logs
DEBUG=booklend:* yarn dev
```

### Health Check

```bash
# Check API status
curl http://localhost:3000/api/health
```

### Available Metrics

- Request/Response times
- Error rates per endpoint
- Database query performance
- Authentication attempts

## Available Scripts

```bash
# Development
yarn dev              # Server with hot reload
yarn build            # Build for production
yarn start            # Start built server

# Database Management
yarn db:init          # Complete setup (schema + seed)
yarn db:setup         # Create database schema only
yarn db:seed          # Development data seeding
yarn db:seed:prod     # Production data seeding
yarn db:reset         # Complete database reset
yarn db:debug         # Database diagnostics

# Testing
yarn test             # Run tests
yarn test:watch       # Tests in watch mode
yarn test:coverage    # Tests with coverage

# Code Quality
yarn lint             # Check code
yarn lint:fix         # Auto-fix issues
yarn format           # Format code
```

## Performance

### SQLite Optimizations Applied

- **WAL mode** for better concurrency
- **Memory-mapped I/O** for faster access
- **Foreign key constraints** for data integrity
- **Optimized pragmas** for development use

### Typical Benchmarks

- **Auth endpoints**: ~30ms
- **Book CRUD**: ~20ms
- **Search queries**: ~50ms
- **Database queries**: ~5-10ms

### Performance Monitoring

The API includes built-in performance monitoring:

- Request timing middleware
- Database query logging in development
- Error rate tracking
- Memory usage monitoring

## API Documentation

### Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Returns server status, database connection info, and system metrics.

### Swagger Documentation (Planned)

Future versions will include OpenAPI/Swagger documentation at `/api/docs`.

The API server provides a solid foundation for the BookLend library management system with SQLite for simplicity and performance in development environments.
