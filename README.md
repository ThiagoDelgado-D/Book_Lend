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
# Run in domain package
yarn workspace domain test
yarn workspace domain build
yarn workspace domain lint
```

## Getting Started

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Set up Husky:**

   ```bash
   yarn prepare
   ```

3. **Run tests:**

   ```bash
   yarn test
   ```

4. **Build the project:**

   ```bash
   yarn build
   ```

## Project Structure

```
BookLend/
├── domain/                           # Domain Layer Package (COMPLETE)
│   ├── src/
│   │   ├── entities/                 # Business entities
│   │   │   ├── base-entities/        # Base entity interfaces
│   │   │   │   ├── entity.ts         # Base entity with ID
│   │   │   │   └── person.ts         # Person base interface
│   │   │   ├── user.ts               # User entity with secure filtering
│   │   │   ├── book.ts               # Book entity with status management
│   │   │   └── author.ts             # Author entity
│   │   ├── services/                 # Domain service interfaces
│   │   │   ├── auth-service.ts       # User authentication operations
│   │   │   ├── user-service.ts       # User management operations
│   │   │   ├── book-service.ts       # Book management operations
│   │   │   ├── author-service.ts     # Author management operations
│   │   │   ├── email-verification-service.ts # Email verification
│   │   │   ├── crypto-service.ts     # Cryptographic operations
│   │   │   └── mocks/                # Mock implementations for testing
│   │   │       ├── mock-auth-service.ts
│   │   │       ├── mock-user-service.ts
│   │   │       ├── mock-book-service.ts
│   │   │       ├── mock-author-service.ts
│   │   │       ├── mock-email-verification-service.ts
│   │   │       └── mock-crypto-service.ts
│   │   ├── use-cases/                # Application use cases
│   │   │   ├── auth/                 # Authentication workflows
│   │   │   │   ├── send-email-verification.ts
│   │   │   │   ├── verify-email-token.ts
│   │   │   │   └── complete-registration.ts
│   │   │   ├── book/                 # Book management workflows
│   │   │   │   ├── add-book.ts
│   │   │   │   ├── update-book.ts
│   │   │   │   ├── delete-book.ts
│   │   │   │   ├── get-book-by-id.ts
│   │   │   │   └── get-popular-books.ts
│   │   │   └── author/               # Author management workflows
│   │   │       ├── add-author.ts
│   │   │       ├── update-author.ts
│   │   │       └── delete-author.ts
│   │   ├── types/                    # Domain-specific types
│   │   │   ├── uuid.ts               # UUID type definition
│   │   │   └── email.ts              # Email type definition
│   │   ├── utils/                    # Utility functions
│   │   │   ├── authorization.ts      # Role-based authorization
│   │   │   └── trim-or-null.ts       # String manipulation utilities
│   │   └── validations/              # Validation system
│   │       ├── dates/                # Date validation
│   │       │   └── date-validator.ts
│   │       ├── emails/               # Email validation
│   │       │   └── email-validator.ts
│   │       └── field-validator.ts    # Required field validation
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.lib.json
│   └── vitest.config.ts
├── package.json                      # Root package configuration
├── tsconfig.json                     # TypeScript configuration
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
└── README.md                         # This file
```

## Features Implemented ✅

### Complete Authentication System

- **Email-first registration workflow** with token verification
- **Secure password handling** with hashing
- **Token-based email verification** with expiration
- **User management** with secure field filtering
- **Role-based authorization** (User/Admin)

### Comprehensive User Management

- **User CRUD operations** with status management
- **Admin role verification** for privileged operations
- **Secure user data handling** with password filtering
- **User status tracking** (Active, Suspended, Inactive)

### Book Management System

- **Complete book CRUD operations**
- **ISBN validation** and duplicate prevention
- **Book status management** (Available, Borrowed, Reserved, etc.)
- **Popular books tracking** and retrieval
- **Book search** by ID, title, ISBN, and status

### Author Management System

- **Author CRUD operations** with admin authorization
- **Comprehensive author information** (biography, nationality, dates)
- **Author search** by name, nationality, and popularity
- **Birth/death date validation**
- **Author popularity tracking**

### Domain Services & Mock Implementations

- **Complete service interfaces** for all domain operations
- **Full mock implementations** for isolated testing
- **Cryptographic services** for hashing and token generation
- **Email verification services** with token management

### Robust Validation System

- **Email format validation** with normalization
- **Date validation** (birth/death date consistency)
- **Required field validation** with customizable messages
- **Input sanitization** and trimming utilities

### Authorization & Security

- **Role-based access control** (Admin/User roles)
- **Secure password handling** with hashing
- **Token-based verification** with expiration
- **Secure field filtering** to prevent data leakage

## Testing Strategy ✅

### Comprehensive Test Coverage

- **Unit tests** for all entities, use cases, and utilities
- **Mock-based testing** for isolated domain logic testing
- **Integration testing** for complete workflows
- **Test coverage reporting** with Vitest

### Test Structure

```typescript
describe('Use Case Tests', () => {
  let services: MockServices;

  beforeEach(() => {
    services = createMockServices();
  });

  test('should handle happy path scenario', async () => {
    // Given: Test data setup
    // When: Execute use case
    // Then: Verify expected results
  });

  test('should handle error scenarios', async () => {
    // Test validation failures, business rule violations, etc.
  });
});
```

## Development Tools & Quality Assurance

### Git Hooks & Code Quality

- **pre-commit**: Runs linting, formatting, and type checking on staged files
- **commit-msg**: Validates commit messages follow Conventional Commits format
- **pre-push**: Complete verification before pushing

### Commit Format

Required Conventional Commits format: `type(scope): description`

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`

## Next Steps - Infrastructure & Application Layers

### Immediate Priorities

1. **Infrastructure Layer Implementation**
   - Database implementations (PostgreSQL)
   - Email service integrations (SendGrid/AWS SES)
   - Caching layer (Redis)
   - Real cryptographic service implementations

2. **Application Layer Development**
   - RESTful API controllers and routes
   - Request/response DTOs and validation
   - Authentication middleware and JWT handling
   - Authorization middleware and guards

3. **Error Handling System**
   - Domain-specific error types and hierarchy
   - Error mapping to HTTP responses
   - Global error handling middleware

### Long-term Goals

4. **Web Application Frontend**
5. **Event-Driven Architecture**
6. **Microservices Migration Strategy**
7. **DevOps & Deployment Pipeline**

## Architecture Benefits

1. **Business Logic Protection** - Core domain logic is isolated and testable
2. **High Testability** - Complete mock implementations enable fast, isolated tests
3. **Flexibility** - Easy to swap implementations without changing business logic
4. **Maintainability** - Clear separation of concerns and well-defined boundaries
5. **Scalability** - Foundation ready for additional features and layers
6. **Type Safety** - Comprehensive TypeScript typing throughout the domain

## Contributing

1. Follow established code conventions and Clean Architecture principles
2. Write comprehensive tests for new functionality
3. Ensure all quality checks pass before committing
4. Maintain separation of concerns between layers
5. Update documentation for significant changes

## License

MIT License - see LICENSE file for details
