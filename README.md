# BookLend - Library Management System

A modern library management system built with **Clean Architecture** principles using TypeScript, monorepo structure, and comprehensive testing.

## Architecture

This project follows Clean Architecture principles with a **complete Domain Layer** implementation that serves as the foundation for business logic.

### Current Implementation Status

✅ **Domain Layer - COMPLETE**

- **`entities/`** - Business entities with validation and behavior
- **`services/`** - Domain service interfaces with mock implementations
- **`use-cases/`** - Complete application logic and use cases
- **`types/`** - Domain-specific type definitions
- **`utils/`** - Utility functions and authorization helpers
- **`validations/`** - Comprehensive validation system

**Next: Infrastructure & Application Layers**

## Tech Stack

- **TypeScript** - Primary language with strict typing
- **Yarn Workspaces** - Monorepo management
- **Vitest** - Testing framework with coverage reporting
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance
- **lint-staged** - Pre-commit hooks

## Available Scripts

### Root Level

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Run tests across all packages
yarn test

# Linting
yarn lint
yarn lint:fix

# Formatting
yarn format
yarn format:check

# Type checking
yarn type-check

# Complete verification (linting + formatting + types + build + tests)
yarn verify
```

### Package Level

Each package has its own scripts that can be run individually:

```bash
git clone https://github.com/ThiagoDelgado-D/Book_Lend
cd booklend
```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the server:**
   ```bash
   yarn dev
   ```

API will be available at `http://localhost:3000`

## Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← Web UI, Mobile App
├─────────────────────────────────────┤
│         Application Layer           │  ← Controllers, Routes, Middleware
├─────────────────────────────────────┤
│         Infrastructure Layer        │  ← Database, External Services
├─────────────────────────────────────┤
│            Domain Layer             │  ← Business Logic (Core)
└─────────────────────────────────────┘
```

### Implemented Layers

- **Domain**: Entities, use cases, services (100% complete)
- **Infrastructure**: TypeORM, MySQL, external services (80% complete)
- **Application**: REST controllers, auth middleware (60% complete)
- **Presentation**: Web frontend (10% complete)

## Project Structure

## Project Structure

```
BookLend/
│   └── apps/
|        └── web             # Web Frontend App
|        └── api             # Rest API
├── packages/
│   ├── domain/              # Domain Layer (Core Business Logic)
│   ├── api-types/           # Shared API Types
├── docs/                    # Detailed Documentation
```

## Tech Stack

### Backend

- **TypeScript** - Primary language
- **Node.js + Express** - Server and web framework
- **TypeORM** - Database ORM
- **SQlite** - Primary database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Frontend

- **React 18** - UI framework
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Navigation

### DevTools

- **Yarn Workspaces** - Monorepo management
- **Vitest** - Testing framework
- **ESLint + Prettier** - Linting and formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit hooks

## Key Features

### Authentication System

- Email verification registration
- Secure login with JWT
- User roles (User/Admin)
- Role-based authorization

### Book Management

- Complete book CRUD
- Search by title, ISBN, author
- Book states (Available, Borrowed, Reserved)
- Categorization and tagging

### Author Management

- Author CRUD (admin only)
- Complete biographical information
- Search by name and nationality

### User Management

- Complete user profiles
- Account states (Active, Suspended)
- Configurable loan limits

## Testing

```bash
# Run all tests
yarn test

# Tests with coverage
yarn test:coverage

# Tests in watch mode
yarn test:watch

# Tests for specific workspace
yarn workspace domain test
```

### Current Coverage

- **Domain Layer**: 95%+ coverage
- **Infrastructure**: 80%+ coverage
- **Application**: 70%+ coverage

## API Endpoints

### Authentication

```http
POST /api/auth/send-verification     # Send email verification
POST /api/auth/verify-email          # Verify email token
POST /api/auth/register              # Complete registration
POST /api/auth/login                 # Login
```

### Books

```http
GET    /api/books                    # List books
GET    /api/books/:id               # Get book by ID
GET    /api/books/search            # Search books
POST   /api/books                   # Create book (admin)
PUT    /api/books/:id              # Update book (admin)
DELETE /api/books/:id              # Delete book (admin)
```

### Authors

```http
GET    /api/authors                 # List authors
GET    /api/authors/:id            # Get author by ID
POST   /api/authors                # Create author (admin)
PUT    /api/authors/:id           # Update author (admin)
DELETE /api/authors/:id           # Delete author (admin)
```

## Available Scripts

### Development

```bash
yarn dev              # Start in development mode
yarn build            # Build for production
yarn start            # Start built application
```

### Code Quality

```bash
yarn lint             # Run linting
yarn lint:fix         # Auto-fix linting issues
yarn format           # Format code
yarn type-check       # Check TypeScript types
yarn verify           # Complete verification
```

### Database

```bash
yarn workspace api db:migrate       # Run migrations
yarn workspace api db:seed         # Populate with test data
yarn workspace api db:reset        # Complete DB reset
```

## Configuration

### Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_URL=http://localhost:5173
```

### Local Development

1. **MySQL with Docker:**

   ```bash
   docker run --name booklend-mysql \
     -e MYSQL_ROOT_PASSWORD=password \
     -e MYSQL_DATABASE=booklend \
     -p 3306:3306 -d mysql:8.0
   ```

2. **Test data:**
   ```bash
   yarn workspace api db:seed
   ```

## Roadmap 2025

### Phase 2:

- [ ] 📱 Optimized mobile API
- [ ] 🔔 Notification system
- [ ] 📊 Reports and statistics

### Phase 3:

- [ ] 💰 Fine system
- [ ] 📅 Advanced reservation system
- [ ] 🔍 Enhanced search with filters

### Phase 4:

- [ ] 🏢 Multi-tenant (multiple libraries)
- [ ] 🌐 Internationalization (i18n)
- [ ] ⚡ Performance optimizations

## Contributing

1. **Fork the project**
2. **Create feature branch:** `git checkout -b feature/new-functionality`
3. **Commit changes:** `git commit -m 'feat: add new functionality'`
4. **Push to branch:** `git push origin feature/new-functionality`
5. **Open Pull Request**

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting changes
- `refactor:` Code refactoring
- `test:` Add or modify tests
- `chore:` Maintenance tasks

## License

This project is under the MIT License. See [LICENSE](LICENSE) for more details.

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/ThiagoDelgado-D/Book_Lend/issues)

---

⭐ **Give it a star if you find this project useful!**
