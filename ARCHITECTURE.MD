# BookLend - Architecture Documentation

This document explains the architectural decisions, patterns, and structure of the BookLend library management system.

## Clean Architecture Overview

BookLend follows **Clean Architecture** principles, ensuring business logic independence from external concerns like databases, frameworks, or UI.

### Architecture Layers

```
┌─────────────────────────────────────┐
│              Infrastructure         │  ← Future: Databases, APIs, etc.
├─────────────────────────────────────┤
│              Application            │  ← Future: Controllers, DTOs
├─────────────────────────────────────┤
│              Domain                 │  ← Current Implementation
│  ┌─────────────┬─────────────────┐  │
│  │  Entities   │   Use Cases     │  │
│  ├─────────────┼─────────────────┤  │
│  │  Services   │     Types       │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## Domain Layer Structure

The Domain layer is the heart of our system, containing all business logic and rules.

### Entities (`/entities`)

Business objects that encapsulate business rules and data.

```typescript
// Pure business entities with validation and behavior
User {
  - Core user data
  - Security field filtering
  - Status management
}

Book {
  - Library item data
  - Status tracking (available, borrowed, etc.)
  - Popularity metrics
}

Author {
  - Author information
  - Biographical data
  - Popularity tracking
}
```

### Services (`/services`)

Interfaces for external dependencies that the domain needs.

```typescript
// Domain service interfaces (contracts)
AuthService         → User data operations
EmailVerification   → Token management & email sending
CryptoService      → Password hashing & token generation
BookService        → Book data operations
UserService        → User data operations
```

**Key Principle:** These are interfaces only. Implementations live in infrastructure layer (future).

### Use Cases (`/use-cases`)

Application-specific business rules that orchestrate entities and services.

```
/auth/
├── initiate-email-verification.ts  → Start registration process
├── verify-email-token.ts          → Validate email tokens
└── complete-registration.ts       → Finish user registration

/book/
├── add-book.ts                    → Add new books
├── get-book-by-id.ts             → Retrieve specific book
├── update-book.ts                → Modify book information
└── get-popular-books.ts          → Get popular books

/user/
└── [Future user management use cases]
```

### Types (`/types`)

Domain-specific type definitions that ensure type safety.

```typescript
UUID = `${string}-${string}-${string}-${string}-${string}`;
Email = `${string}@${string}.${string}`;
```

## Data Flow

### Authentication Flow Example

```
1. User submits email
   ↓
2. initiateEmailVerification (Use Case)
   ├── AuthService.findByEmail()
   ├── CryptoService.generateRandomToken()
   ├── EmailVerificationService.saveToken()
   └── EmailVerificationService.sendEmail()
   ↓
3. User clicks email link
   ↓
4. verifyEmailToken (Use Case)
   ├── EmailVerificationService.findToken()
   └── Validate expiration
   ↓
5. User submits registration form
   ↓
6. completeRegistration (Use Case)
   ├── EmailVerificationService.findToken()
   ├── CryptoService.hashPassword()
   ├── AuthService.save(User)
   └── EmailVerificationService.deleteToken()
```

## Testing Strategy

### Mock Services Pattern

Each service interface has a corresponding mock implementation for testing:

```
/services/mocks/
├── mock-auth-service.ts
├── mock-email-verification-service.ts
├── mock-crypto-service.ts
├── mock-book-service.ts
└── mock-user-service.ts
```

**Benefits:**

- Fast, isolated unit tests
- No external dependencies
- Predictable test data
- Easy to set up test scenarios

### Test Structure

```typescript
describe('Use Case Tests', () => {
  let services: MockServices;

  beforeEach(() => {
    services = createMockServices();
  });

  test('happy path', async () => {
    // Arrange: Set up test data
    // Act: Execute use case
    // Assert: Verify results
  });
});
```

## Security Patterns

### Secure Field Filtering

User entity implements secure field filtering to prevent password leakage:

```typescript
type UserSecureFields = 'hashedPassword';
type SecureUser = Omit<User, UserSecureFields>;

function filterSecureProperties(user: User): SecureUser {
  // Returns user without sensitive fields
}
```

### Token Management

- **Email verification tokens**: Short-lived, single-use
- **Password reset tokens**: Time-limited, email-bound

## Design Principles

### 1. Dependency Inversion

Domain layer depends on abstractions (interfaces), not concretions:

```typescript
// ✅ Good: Depends on interface
function useCase(authService: AuthService) {
  return authService.findByEmail(email);
}

// ❌ Bad: Depends on concrete implementation
function useCase(dbConnection: PostgresConnection) {
  return dbConnection.query('SELECT...');
}
```

### 2. Single Responsibility

Each use case has one reason to change:

```typescript
// ✅ Good: Single responsibility
initiateEmailVerification → Only handles email verification start
completeRegistration → Only handles user creation

// ❌ Bad: Multiple responsibilities
registerUserWithEmailAndSendWelcomeEmail → Does too much
```

### 3. Separation of Concerns

Clear boundaries between different aspects:

```
Entities     → Business rules and data
Services     → External dependency contracts
Use Cases    → Application flow orchestration
Types        → Domain-specific type safety
```

### 4. Testability

All business logic is testable without external dependencies:

```typescript
// Easy to test - pure functions with mock dependencies
const result = await completeRegistration(
  { authService: mockAuth, cryptoService: mockCrypto },
  registrationRequest
);
```

## Future Extensions

### Error Handling System

A comprehensive error management system that spans all layers:

```
/domain/
├── errors/
│   ├── base/
│   │   ├── domain-error.ts           # Base domain error class
│   │   ├── validation-error.ts       # Input validation errors
│   │   └── business-rule-error.ts    # Business logic violations
│   ├── auth/
│   │   ├── invalid-credentials-error.ts
│   │   ├── token-expired-error.ts
│   │   └── email-already-exists-error.ts
│   ├── book/
│   │   ├── book-not-found-error.ts
│   │   ├── book-unavailable-error.ts
│   │   └── isbn-duplicate-error.ts
│   └── user/
│       ├── user-not-found-error.ts
│       ├── user-suspended-error.ts
│       └── book-limit-exceeded-error.ts

/application/
├── errors/
│   ├── error-mapper.ts               # Maps domain errors to HTTP responses
│   ├── error-middleware.ts           # Global error handling
│   └── error-responses.ts            # Standardized API error formats

/infrastructure/
├── errors/
│   ├── database-error.ts
│   ├── external-service-error.ts
│   └── network-error.ts
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

### Security Infrastructure

Multi-layered security approach:

```
/security/
├── authentication/
│   ├── jwt-service.ts                # JWT token management
│   ├── session-service.ts            # Session handling
│   ├── password-service.ts           # Password policies and validation
│   └── two-factor-service.ts         # 2FA implementation
├── authorization/
│   ├── permission-service.ts         # Role-based access control
│   ├── resource-guard.ts             # Resource-level permissions
│   └── policy-engine.ts              # Complex authorization rules
├── validation/
│   ├── input-sanitizer.ts            # Input sanitization
│   ├── schema-validator.ts           # Request/response validation
│   └── rate-limiter.ts               # Request rate limiting
├── encryption/
│   ├── data-encryption.ts            # Data at rest encryption
│   ├── field-encryption.ts           # Selective field encryption
│   └── key-management.ts             # Encryption key rotation
└── audit/
    ├── audit-logger.ts               # Security event logging
    ├── activity-tracker.ts           # User activity monitoring
    └── compliance-reporter.ts        # Regulatory compliance
```

**Security Features:**

- **Input Validation**: Schema-based validation with sanitization
- **Rate Limiting**: Per-user and per-endpoint limits
- **JWT Security**: Secure token generation, validation, and rotation
- **Role-Based Access Control**: Granular permissions system
- **Data Protection**: Field-level encryption for sensitive data
- **Audit Trail**: Complete security event logging
- **Session Management**: Secure session handling with expiration
- **Password Security**: Strong password policies and hashing

### Infrastructure Layer

```
/infrastructure/
├── database/
│   ├── postgres-auth-service.ts
│   ├── migrations/
│   ├── connection-pool.ts
│   └── transaction-manager.ts
├── email/
│   ├── sendgrid-email-service.ts
│   ├── ses-email-service.ts
│   └── templates/
├── crypto/
│   ├── bcrypt-crypto-service.ts
│   ├── jwt-crypto-service.ts
│   └── encryption-service.ts
├── cache/
│   ├── redis-cache-service.ts
│   └── memory-cache-service.ts
└── monitoring/
    ├── metrics-collector.ts
    ├── health-checker.ts
    └── alert-manager.ts
```

### Application Layer

```
/application/
├── api/
│   ├── controllers/
│   ├── middleware/
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   ├── validation.ts
│   │   ├── rate-limiting.ts
│   │   └── error-handling.ts
│   ├── routes/
│   └── dto/                          # Data transfer objects
├── web/
│   ├── components/
│   ├── pages/
│   └── guards/                       # Route protection
├── cli/
│   └── commands/
└── events/
    ├── event-bus.ts                  # Domain event handling
    ├── event-handlers/
    └── event-store.ts
```

### Cross-Cutting Concerns

**Observability:**

- **Structured Logging**: JSON logs with correlation IDs and trace context
- **Metrics Collection**: Business and technical metrics (Prometheus/Grafana)
- **Distributed Tracing**: Request tracing across services (Jaeger/Zipkin)
- **Health Monitoring**: Application and dependency health checks
- **Performance Monitoring**: APM integration and alerting

**Data Management:**

- **Caching Strategy**: Multi-level caching (Redis, in-memory, CDN)
- **Database Optimization**: Connection pooling, query optimization, indexing
- **Data Migration**: Versioned database migrations and rollback strategies
- **Backup & Recovery**: Automated backups with point-in-time recovery

**Development & Operations:**

- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Testing Infrastructure**: Integration, E2E, and performance testing
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Environment Management**: Configuration management and secrets handling

## Benefits of This Architecture

1. **Business Logic Protection**: Core logic is isolated from technical concerns
2. **Testability**: Easy to test without external dependencies
3. **Flexibility**: Can swap implementations without changing business logic
4. **Maintainability**: Clear separation makes code easier to understand and modify
5. **Scalability**: Can add new features without affecting existing code
6. **Team Collaboration**: Different teams can work on different layers independently

## Additional Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
