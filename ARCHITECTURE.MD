# BookLend - Architecture Documentation

This document explains the architectural decisions, patterns, and complete structure of the BookLend library management system.

## Clean Architecture Overview

BookLend follows **Clean Architecture** principles, ensuring business logic independence from external concerns like databases, frameworks, or UI.

### Architecture Layers Status

```
┌─────────────────────────────────────┐
│              Infrastructure         │  ← Future: Databases, APIs, etc.
├─────────────────────────────────────┤
│              Application            │  ← Future: Controllers, DTOs
├─────────────────────────────────────┤
│              Domain                 │  ← ✅ COMPLETE IMPLEMENTATION
│  ┌─────────────┬─────────────────┐  │
│  │  Entities   │   Use Cases     │  │
│  ├─────────────┼─────────────────┤  │
│  │  Services   │   Validations   │  │
│  ├─────────────┼─────────────────┤  │
│  │    Types    │     Utils       │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## Domain Layer Structure - Complete Implementation

The Domain layer is now fully implemented and serves as the foundation of our system.

### Entities (`/entities`) ✅

Business objects that encapsulate business rules and data with complete validation.

```typescript
// Hierarchical entity structure
Entity (Base)
├── id: UUID
└── Person (Base)
    ├── firstName, lastName
    ├── email?, phoneNumber?
    └── Concrete Entities:
        ├── User (with role-based access & secure field filtering)
        ├── Author (with biographical data & popularity tracking)
        └── [Future: Borrower, Librarian]

Book (Independent entity)
├── Core book data (title, ISBN, pages, etc.)
├── Status management (Available, Borrowed, Reserved, etc.)
├── Popularity tracking
└── Business rules validation
```

**Key Features:**

- **Secure Field Filtering**: User entity prevents password leakage
- **Status Management**: Book and User entities track states
- **Business Rules**: Built-in validation and constraints
- **Type Safety**: Strong TypeScript typing throughout

### Services (`/services`) ✅

Complete interfaces for external dependencies with full mock implementations.

```typescript
// Service interfaces (contracts only)
AuthService         → User authentication & data operations
UserService         → User management operations
BookService         → Book management operations
AuthorService       → Author management operations
EmailVerification   → Token management & email delivery
CryptoService      → Password hashing & token generation

// Mock implementations (/services/mocks/)
MockAuthService         → In-memory user operations
MockUserService         → User management simulation
MockBookService         → Book operations simulation
MockAuthorService       → Author operations simulation
MockEmailVerification   → Email token simulation
MockCryptoService      → Crypto operations simulation
```

**Key Features:**

- **Complete Mock Suite**: All services have functional mock implementations
- **Contract-Based Design**: Infrastructure layer will implement these interfaces
- **Test-Friendly**: Mocks enable fast, isolated unit testing
- **Dependency Inversion**: Domain depends on abstractions, not concretions

### Use Cases (`/use-cases`) ✅

Complete application-specific business rules that orchestrate entities and services.

```
/auth/ (Email-First Authentication Flow)
├── send-email-verification.ts    → Start registration with email verification
├── verify-email-token.ts         → Validate email verification tokens
└── complete-registration.ts      → Finish user registration with form data

/book/ (Complete Book Management)
├── add-book.ts                   → Create new book with validation
├── update-book.ts                → Modify existing book information
├── delete-book.ts                → Remove book from system
├── get-book-by-id.ts            → Retrieve specific book
└── get-popular-books.ts         → Get books marked as popular

/author/ (Admin-Controlled Author Management)
├── add-author.ts                 → Create author (admin only)
├── update-author.ts              → Modify author information (admin only)
└── delete-author.ts              → Remove author (admin only)
```

**Key Features:**

- **Complete Workflows**: End-to-end business processes implemented
- **Role-Based Authorization**: Admin-only operations properly protected
- **Comprehensive Validation**: Input validation and business rule enforcement
- **Error Handling**: Detailed success/failure responses with clear messages

### Types (`/types`) ✅

Domain-specific type definitions ensuring type safety.

```typescript
UUID = `${string}-${string}-${string}-${string}-${string}`;
Email = `${string}@${string}.${string}`;

// Strong typing prevents invalid data at compile time
```

### Utils (`/utils`) ✅

Utility functions and cross-cutting concerns.

```typescript
// Authorization utilities
verifyAdminRole() → Role-based access control

// String manipulation utilities
trimOrNull() → Clean string input or return null
trimOrDefault() → Clean string input or use default value
```

### Validations (`/validations`) ✅

Comprehensive validation system for all domain operations.

```
/dates/
└── date-validator.ts           → Birth/death date consistency validation

/emails/
└── email-validator.ts          → Email format validation & normalization

field-validator.ts              → Required field validation with custom messages
```

**Key Features:**

- **Reusable Validators**: Consistent validation across all use cases
- **Type-Safe Validation**: Leverages TypeScript for compile-time checking
- **Custom Error Messages**: Clear, user-friendly validation messages
- **Input Normalization**: Automatic trimming and formatting

## Data Flow Examples

### Complete Authentication Flow

```
1. Send Email Verification
   User submits email
   ↓
   sendEmailVerification (Use Case)
   ├── AuthService.findByEmail() → Check if email exists
   ├── CryptoService.generateRandomToken() → Create verification token
   ├── EmailVerificationService.saveToken() → Store token with expiration
   └── EmailVerificationService.sendEmail() → Send verification email

2. Verify Email Token
   User clicks email link
   ↓
   verifyEmailToken (Use Case)
   ├── EmailVerificationService.findToken() → Retrieve token data
   ├── Validate expiration
   └── Return email associated with valid token

3. Complete Registration
   User submits registration form
   ↓
   completeRegistration (Use Case)
   ├── EmailVerificationService.findToken() → Verify token still valid
   ├── AuthService.findByEmail() → Ensure email not already registered
   ├── CryptoService.hashPassword() → Secure password storage
   ├── AuthService.save(User) → Create user account
   └── EmailVerificationService.deleteToken() → Clean up verification token
```

### Book Management Flow

```
1. Add Book (Admin Operation)
   Admin submits book data
   ↓
   addBook (Use Case)
   ├── BookService.findByIsbn() → Check ISBN uniqueness
   ├── CryptoService.generateUUID() → Create book ID
   ├── Book entity creation with business rules
   └── BookService.save() → Persist book

2. Update Book
   Request to modify book
   ↓
   updateBook (Use Case)
   ├── BookService.findById() → Verify book exists
   ├── BookService.findByIsbn() → Check ISBN conflicts (if changing)
   ├── Merge changes with existing data
   └── BookService.save() → Update book

3. Get Popular Books
   Request for popular books
   ↓
   getPopularBooks (Use Case)
   └── BookService.findPopularBooks() → Return books marked as popular
```

### Author Management Flow (Admin-Only)

```
1. Create Author (Admin Required)
   Admin submits author data
   ↓
   createAuthor (Use Case)
   ├── verifyAdminRole() → Ensure user has admin privileges
   ├── validateRequiredFields() → Check mandatory fields
   ├── validateBirthDeathDates() → Ensure date consistency
   ├── validateAndNormalizeEmail() → Clean email format
   └── AuthorService.save() → Create author

2. Update Author (Admin Required)
   Admin modifies author
   ↓
   updateAuthor (Use Case)
   ├── verifyAdminRole() → Admin authorization check
   ├── AuthorService.findById() → Verify author exists
   ├── Validation of updated fields
   └── AuthorService.save() → Update author

3. Delete Author (Admin Required)
   Admin removes author
   ↓
   deleteAuthor (Use Case)
   ├── verifyAdminRole() → Admin authorization check
   ├── AuthorService.findById() → Verify author exists
   └── AuthorService.delete() → Remove author
```

## Testing Strategy - Complete Implementation

### Mock Services Pattern ✅

Each service interface has a corresponding, fully functional mock implementation:

```
/services/mocks/
├── mock-auth-service.ts        → In-memory user storage and operations
├── mock-user-service.ts        → User management simulation
├── mock-book-service.ts        → Book operations with in-memory storage
├── mock-author-service.ts      → Author operations simulation
├── mock-email-verification-service.ts → Token storage and email simulation
└── mock-crypto-service.ts      → Deterministic crypto operations for testing
```

**Mock Benefits:**

- **Fast Execution**: No I/O operations, pure in-memory testing
- **Deterministic**: Predictable results for consistent testing
- **Isolated**: No external dependencies or side effects
- **Comprehensive**: Full feature coverage matching real implementations

### Test Structure ✅

```typescript
describe('Complete Use Case Tests', () => {
  let authService: MockedAuthService;
  let bookService: MockedBookService;
  let cryptoService: MockedCryptoService;

  beforeEach(() => {
    authService = mockAuthService();
    bookService = mockBookService();
    cryptoService = mockCryptoService();
  });

  test('should handle successful operation', async () => {
    // Given: Set up test data and conditions
    const testData = await setupTestData();

    // When: Execute the use case
    const result = await useCase(services, testData);

    // Then: Verify expected outcomes
    expect(result.success).toBe(true);
    expect(result.data).toMatchExpectedStructure();
  });

  test('should handle validation failures', async () => {
    // Test various failure scenarios
    const invalidData = {
      /* invalid input */
    };
    const result = await useCase(services, invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Expected error message');
  });

  test('should handle business rule violations', async () => {
    // Test business logic edge cases
  });
});
```

## Security Patterns - Complete Implementation

### Secure Field Filtering ✅

User entity implements automatic security field filtering:

```typescript
type UserSecureFields = 'hashedPassword';
type SecureUser = Omit<User, UserSecureFields>;

function filterSecureProperties(user: User): SecureUser {
  // Returns user without sensitive fields like passwords
  // Automatically applied in all use case responses
}
```

### Role-Based Authorization ✅

```typescript
// Authorization utility with comprehensive checks
export const verifyAdminRole = async (
  authService: AuthService,
  userId: UUID
): Promise<AuthorizationResult> => {
  const user = await authService.findById(userId);

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  if (user.role !== UserRole.ADMIN) {
    return { success: false, message: 'Access denied. Admin role required' };
  }

  return { success: true, message: 'Authorization successful' };
};

// Applied in all admin-required operations
const authResult = await verifyAdminRole(authService, request.adminUserId);
if (!authResult.success) {
  return { success: false, message: authResult.message };
}
```

### Token Management ✅

- **Email verification tokens**: Short-lived, single-use, with automatic cleanup
- **Secure token generation**: Cryptographically secure random tokens
- **Automatic expiration**: Time-based token invalidation

### Password Security ✅

```typescript
// Secure password handling
const hashedPassword = await cryptoService.hashPassword(plainPassword);
const isValid = await cryptoService.comparePassword(plainPassword, hashedPassword);

// Passwords never stored in plain text
// Automatic password filtering in responses
```

## Design Principles - Fully Applied

### 1. Dependency Inversion ✅

Domain layer depends only on abstractions (interfaces):

```typescript
// ✅ Good: Use case depends on interface
function completeRegistration(
  services: {
    authService: AuthService; // Interface
    cryptoService: CryptoService; // Interface
    emailService: EmailVerificationService; // Interface
  },
  request: CompleteRegistrationRequest
) {
  // Implementation uses contracts, not concrete classes
}

// ❌ Bad: Would depend on concrete implementation
// function completeRegistration(database: PostgresConnection) { ... }
```

### 2. Single Responsibility ✅

Each use case has one clear purpose:

```typescript
// ✅ Good: Single responsibility
sendEmailVerification    → Only handles sending verification emails
verifyEmailToken        → Only validates tokens
completeRegistration    → Only handles final user creation

// ❌ Bad: Multiple responsibilities
// registerUserWithEmailAndCreateProfile → Does too many things
```

### 3. Separation of Concerns ✅

Clear boundaries between different aspects:

```
Entities     → Business rules, data validation, and state management
Services     → External dependency contracts and interfaces
Use Cases    → Application workflow orchestration and business logic
Types        → Domain-specific type safety and constraints
Validations  → Input validation and business rule enforcement
Utils        → Cross-cutting utilities and helper functions
```

### 4. Complete Testability ✅

All business logic is fully testable without external dependencies:

```typescript
// Easy to test - pure functions with mock dependencies
const result = await completeRegistration(
  {
    authService: mockAuthService(),
    cryptoService: mockCryptoService(),
    emailVerificationService: mockEmailVerificationService(),
  },
  registrationRequest
);

// No databases, no network calls, no file system access
// Fast, reliable, deterministic tests
```

## Future Extensions

### Error Handling System (Next Priority)

Comprehensive error management across all layers:

```
/domain/errors/
├── base/
│   ├── domain-error.ts           # Base domain error class
│   ├── validation-error.ts       # Input validation failures
│   └── business-rule-error.ts    # Business logic violations
├── auth/
│   ├── invalid-credentials-error.ts
│   ├── token-expired-error.ts
│   └── email-already-exists-error.ts
├── book/
│   ├── book-not-found-error.ts
│   ├── book-unavailable-error.ts
│   └── isbn-duplicate-error.ts
└── user/
    ├── user-not-found-error.ts
    ├── user-suspended-error.ts
    └── insufficient-permissions-error.ts
```

**Error Flow Pattern:**

```typescript
// Domain layer throws business errors
throw new EmailAlreadyExistsError(email);

// Application layer maps to HTTP responses
DomainError -> { statusCode: 409, message: "Email already registered", code: "EMAIL_EXISTS" }

// Infrastructure layer handles technical errors
DatabaseError -> { statusCode: 500, message: "Internal server error", code: "DATABASE_ERROR" }
```

### Infrastructure Layer (Implementation Ready)

The domain is now ready for infrastructure implementations:

```
/infrastructure/
├── database/
│   ├── postgres-auth-service.ts      # AuthService implementation
│   ├── postgres-book-service.ts      # BookService implementation
│   ├── postgres-author-service.ts    # AuthorService implementation
│   ├── postgres-user-service.ts      # UserService implementation
│   ├── migrations/                   # Database schema migrations
│   └── connection-pool.ts            # Connection management
├── email/
│   ├── sendgrid-email-service.ts     # EmailVerificationService implementation
│   ├── ses-email-service.ts          # Alternative email implementation
│   └── templates/                    # Email templates
├── crypto/
│   ├── bcrypt-crypto-service.ts      # CryptoService implementation
│   └── jwt-service.ts                # JWT token management
└── cache/
    ├── redis-cache-service.ts        # Caching layer
    └── memory-cache-service.ts       # In-memory caching
```

### Application Layer (Controllers & APIs)

```
/application/
├── api/
│   ├── controllers/
│   │   ├── auth-controller.ts        # Authentication endpoints
│   │   ├── book-controller.ts        # Book management endpoints
│   │   ├── author-controller.ts      # Author management endpoints
│   │   └── user-controller.ts        # User management endpoints
│   ├── middleware/
│   │   ├── authentication.ts         # JWT validation
│   │   ├── authorization.ts          # Role-based access control
│   │   ├── validation.ts             # Request validation
│   │   └── error-handling.ts         # Global error handling
│   ├── routes/                       # Express.js routes
│   └── dto/                          # Data transfer objects
└── web/
    ├── components/                   # Frontend components
    ├── pages/                        # Application pages
    └── guards/                       # Route protection
```

## Current Architecture Benefits

1. **Complete Business Logic Protection**: All core logic is implemented and isolated from technical concerns
2. **Full Testability**: Comprehensive test suite with 100% mock coverage
3. **Ready for Implementation**: Infrastructure layer can be built against stable contracts
4. **Type Safety**: Complete TypeScript coverage ensures compile-time safety
5. **Scalable Foundation**: Easy to add new features without affecting existing code
6. **Team Collaboration**: Different teams can work on different layers independently
7. **Maintainable**: Clear separation makes code easy to understand and modify

## Implementation Statistics

- **Entities**: 3 complete (User, Book, Author) + 2 base entities
- **Services**: 6 interfaces + 6 complete mock implementations
- **Use Cases**: 11 complete workflows across 3 domains
- **Validators**: 3 validation modules with comprehensive coverage
- **Tests**: 100% use case coverage + comprehensive unit tests
- **Type Definitions**: Complete domain-specific type system
- **Authorization**: Role-based access control implemented
- **Security**: Secure field filtering and password handling

The domain layer is now complete and production-ready, serving as a solid foundation for the infrastructure and application layers.

## Additional Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
