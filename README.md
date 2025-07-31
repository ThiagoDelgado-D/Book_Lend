# BookLend - Library Management System

A modern library management system built with **Clean Architecture** principles using TypeScript, monorepo structure, and modern development tools.

## 🏗️ Architecture

This project follows Clean Architecture principles with a simplified structure focused on the **Domain Layer** as the foundation for business logic.

### Current Implementation

- **`domain/`** - Domain Layer Package
  - **`entities/`** - Business entities and domain rules
  - **`services/`** - Domain service interfaces
  - **`use-cases/`** - Application logic and use cases
  - **`types/`** - Domain-specific type definitions

## Tech Stack

- **TypeScript** - Primary language
- **Yarn Workspaces** - Monorepo management
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
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

## Development Tools

### Git Hooks & Quality Assurance

The project includes comprehensive Git hooks to ensure code quality:

- **pre-commit**: Runs linting, formatting, and type checking on staged files
- **commit-msg**: Validates commit messages follow Conventional Commits format
- **pre-push**: Complete verification before pushing:
  - `yarn install --frozen-lockfile`
  - `yarn lint:check`
  - `yarn format:check`
  - `yarn type-check`
  - `yarn build`
  - `yarn test`

### Commit Format

Required Conventional Commits format:

```
type(scope): description
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`

**Examples:**

- `feat: add user authentication flow`
- `fix(domain): handle null user response`
- `test: add unit tests for auth services`

## Project Structure

```
BookLend/
├── domain/                    # Domain Layer Package
│   ├── src/
│   │   ├── entities/         # Business entities
│   │   │   ├── user.ts       # User entity with secure fields
│   │   │   ├── book.ts       # Book entity with status management
│   │   │   └── author.ts     # Author entity
│   │   ├── services/         # Domain service interfaces
│   │   │   ├── auth-service.ts
│   │   │   ├── email-verification-service.ts
│   │   │   ├── crypto-service.ts
│   │   │   └── mocks/        # Mock implementations for testing
│   │   ├── use-cases/        # Application use cases
│   │   │   ├── auth/         # Authentication flow
│   │   │   │   ├── initiate-email-verification.ts
│   │   │   │   ├── verify-email-token.ts
│   │   │   │   └── complete-registration.ts
│   │   │   ├── book/         # Book management
│   │   │   └── user/         # User management
│   │   └── types/            # Domain types
│   │       ├── uuid.ts
│   │       └── email.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── package.json              # Root package configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
└── README.md               # This file
```

## Features Implemented

### Authentication System

- **Email-first registration flow**
- **Token-based email verification**
- **Secure password handling**
- **User management with secure field filtering**

### Domain Services

- **AuthService** - User data operations
- **EmailVerificationService** - Token management and email delivery
- **CryptoService** - Password hashing and token generation

### Business Entities

- **User** - With secure field filtering and status management
- **Book** - With status tracking and popularity metrics
- **Author** - With biographical information

## Testing

Comprehensive testing setup with Vitest:

- **Unit tests** for all domain entities
- **Use case tests** with mock services
- **Integration tests** for complete flows
- **Code coverage** reporting

## Next Steps

### Immediate Priorities

1. **Error Handling System**
   - Implement comprehensive error management across all layers
   - Create domain-specific error types with HTTP mapping
   - Add global error middleware and standardized error responses

2. **Security Infrastructure**
   - JWT-based authentication and session management
   - Role-based access control (RBAC) with granular permissions
   - Input validation, sanitization, and rate limiting
   - Field-level encryption for sensitive data
   - Comprehensive audit logging and compliance reporting

3. **Infrastructure Layer**
   - Database implementations (PostgreSQL with connection pooling)
   - Email service integrations (SendGrid, AWS SES)
   - Caching layer (Redis) for sessions and frequently accessed data
   - Monitoring and observability (structured logging, metrics, tracing)

### Long-term Goals

4. **API Layer** - RESTful endpoints with OpenAPI documentation
5. **Web Application** - Modern frontend interface with authentication
6. **Event-Driven Architecture** - Domain events and event sourcing
7. **Microservices Migration** - Service decomposition as system grows
8. **DevOps & Deployment** - CI/CD pipeline with automated testing and deployment

## Contributing

1. Follow established code conventions
2. Write tests for new functionality
3. Ensure all checks pass before committing
4. Maintain separation of concerns between layers
5. Update documentation for significant changes

## License

MIT License - see LICENSE file for details
