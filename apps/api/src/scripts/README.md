# BookLend API - Database Management

This directory contains scripts for managing the SQLite database in both development and production environments.

## Prerequisites

- Node.js 18+
- Yarn package manager
- SQLite3 (via better-sqlite3)

## Database Scripts

### Development Environment

#### Setup & Initialization

- **`yarn workspace booklend-api db:setup`** - Creates and initializes the development database schema
- **`yarn workspace booklend-api db:seed`** - Populates the database with sample development data
- **`yarn workspace booklend-api db:debug`** - Runs database diagnostics and connection tests
- **`yarn workspace booklend-api db:reset`** - Deletes and recreates the database with fresh sample data

#### Quick Start Commands

- **`yarn workspace booklend-api db:init`** - Complete setup (schema + seed) for new environments
- **`yarn workspace booklend-api dev`** - Start development server after database setup

#### Production Environment

- **`yarn workspace booklend-api db:seed:prod`** - Seeds database with production-ready essential data
- **`yarn workspace booklend-api migration:generate`** - Generate new migration from entity changes
- **`yarn workspace booklend-api migration:run`** - Run pending migrations
- **`yarn workspace booklend-api migration:revert`** - Revert last migration

## Database Migrations

### Migration Management

- **Location**: `./src/migrations/*.ts`
- **Auto-generation**: Based on entity changes
- **Environment**: Disabled in development (uses synchronize), enabled in production

### Migration Commands

```bash
# Generate migration from entity changes
yarn workspace booklend-api migration:generate --name=DescriptiveName

# Run pending migrations
yarn workspace booklend-api migration:run

# Revert last migration
yarn workspace booklend-api migration:revert

# Show migration status
yarn workspace booklend-api migration:show
```

### Development vs Production

- **Development**: Uses `synchronize: true` for automatic schema updates
- **Production**: Uses migrations for controlled schema changes

## Script Files Overview

| File                 | Purpose                                            | Environment |
| -------------------- | -------------------------------------------------- | ----------- |
| `setup-dev-db.ts`    | Database schema creation and synchronization       | Development |
| `seed-dev-db.ts`     | Sample data seeding with test users and books      | Development |
| `seed-production.ts` | Essential production data (admin user, core books) | Production  |
| `debug-db.ts`        | Database diagnostics and troubleshooting           | Development |
| `reset-dev-db.ts`    | Complete database reset utility                    | Development |

## Database Configuration

### File Locations

- **Database File**: `./data/booklend.sqlite` (from project root)
- **Migrations**: `./src/migrations/*.ts`
- **Backup Location**: Automatically managed by SQLite WAL mode

### Data Source Configuration

The database uses a centralized `AppDataSource` configuration:

- **Type**: better-sqlite3
- **Synchronize**: Enabled in development only
- **Logging**: Enabled in development only
- **Migrations**: Auto-loaded from migrations directory

### SQLite Optimizations

Applied via `prepareDatabase` hook:

```javascript
journal_mode = WAL        // Better concurrency and performance
foreign_keys = ON         // Enforces referential integrity
synchronous = NORMAL      // Balanced durability/performance
temp_store = MEMORY       // Faster temporary operations
mmap_size = 256MB         // Memory-mapped I/O optimization
```

## Sample Data

### Development Environment

The development seed creates:

#### Admin User

- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Book Limit**: 10 books
- **Status**: Active

#### Test User

- **Email**: `user@test.com`
- **Password**: `user123`
- **Role**: Regular User
- **Book Limit**: 3 books (default for users)
- **Status**: Active

#### Sample Data

- **Authors**: 15 randomly generated with realistic biographical data
  - Includes birth/death dates, nationalities, biographies
  - Mixed popular and non-popular authors for testing
- **Books**: 30 randomly generated linked to authors
  - Publication dates from 1950-2024
  - Various genres, page counts, and publishers
  - All books start as AVAILABLE status
- **Additional Users**: 4 more random users for testing user management

### Production Environment

The production seed includes:

#### Admin User

- **Email**: `admin@booklend.com`
- **Password**: `Admin@BookLend2024`
- **Role**: Administrator
- **Book Limit**: 100 books

> ⚠️ **Security Warning**: Change the default admin password immediately after first login!

#### Essential Software Engineering Authors

- **Robert Martin** (Uncle Bob) - Clean Code series author
- **Eric Evans** - Domain-Driven Design author
- **Martin Fowler** - Refactoring, Enterprise Patterns author
- **Kent Beck** - Test-Driven Development, XP creator
- **Gang of Four** - Design Patterns authors (Gamma, Helm, Johnson, Vlissides)

#### Essential Programming Books

- Clean Code: A Handbook of Agile Software Craftsmanship
- Clean Architecture: A Craftsman's Guide to Software Structure and Design
- Domain-Driven Design: Tackling Complexity in the Heart of Software
- Refactoring: Improving the Design of Existing Code
- Test Driven Development: By Example
- Design Patterns: Elements of Reusable Object-Oriented Software
- Extreme Programming Explained: Embrace Change
- The Clean Coder: A Code of Conduct for Professional Programmers

All books are seeded with:

- Real ISBN numbers and publication data
- Proper author attribution and metadata
- AVAILABLE status ready for lending
- Accurate page counts and publisher information

### Author Management (Admin Only)

- **Required Fields**: firstName, lastName, biography, nationality, birthDate
- **Validation**: Birth/death date consistency, email format validation
- **Business Logic**: Popular author flagging, nationality-based searches

### Book Management

- **ISBN Uniqueness**: Enforced across the catalog
- **Status Tracking**: AVAILABLE | BORROWED | RESERVED | MAINTENANCE | LOST
- **Metrics**: Total loans tracking for popularity algorithms
- **Catalog**: Entry date tracking for library management

### Type Safety

- **UUID**: Domain-specific type for all entity IDs
- **Email**: Validated email format with proper regex
- **Enums**: Status and role constraints enforced at type level

## Usage Examples

### First-Time Setup

```bash
# Clone and install dependencies
git clone https://github.com/ThiagoDelgado-D/Book_Lend
cd booklend/packages/api
yarn install

# Initialize development database
yarn db:init

# Start development server
yarn dev
```

### Daily Development Workflow

```bash
# Reset database with fresh data
yarn db:reset

# Run diagnostics if issues occur
yarn db:debug

# Normal development
yarn dev
```

### Production Deployment

```bash
# Set up production database
yarn db:seed:prod

# Verify setup
yarn db:debug
```

## Troubleshooting

### Common Issues

#### Database Connection Errors

1. Run `yarn db:debug` to check database status
2. Ensure `./data` directory exists and is writable
3. Check SQLite installation: `yarn list better-sqlite3`

#### Permission Issues (Windows)

```bash
# Ensure data directory exists
mkdir data
# Run with administrator privileges if needed
```

#### Schema Synchronization Issues

```bash
# Force schema recreation
yarn db:reset
```

### Database Recovery

If the database becomes corrupted:

```bash
# 1. Backup current database (if recoverable)
cp ./data/booklend.sqlite ./data/booklend.backup.sqlite

# 2. Reset database
yarn db:reset

# 3. If needed, restore from backup
# (manual data recovery may be required)
```

### Environment Variables

The scripts and application use these environment variables:

```env
NODE_ENV=development          # Controls synchronize vs migrations, logging
DATABASE_URL=<optional>       # Override default database path
JWT_SECRET=<required>         # For user authentication
EMAIL_SERVICE_URL=<optional>  # For email verification service
```

### Data Source Features

- **Environment-aware**: Different behaviors for dev/prod
- **SQLite Optimized**: WAL mode, foreign keys, memory optimizations
- **Migration Support**: Auto-loaded from migrations directory
- **Connection Management**: Centralized initialization and cleanup
- **Domain Integration**: Works seamlessly with domain services and use cases

## Domain Validation & Business Rules

This API follows **Clean Architecture** principles with clear separation of concerns:

### Domain Layer (`app-domain` package)

- **Entities**: Pure business objects (User, Book, Author, EmailVerificationToken)
- **Use Cases**: Application-specific business rules (auth, book management, author management)
- **Services**: Abstract business logic interfaces
- **Types**: Domain-specific types (UUID, Email)
- **Validations**: Business rule validation (email format, date validation, required fields)

### Infrastructure Layer (API package)

- **Data Source**: TypeORM configuration with SQLite
- **Service Implementations**: Concrete implementations of domain services
- **Database Scripts**: Development and production seeding utilities
- **Entities**: TypeORM decorated entities that map to domain interfaces

### Key Domain Rules

- **User Management**: Role-based access (USER, ADMIN), email verification workflow
- **Author Management**: Admin-only operations, birth/death date validation
- **Book Management**: ISBN uniqueness, status tracking (AVAILABLE, BORROWED, etc.)
- **Security**: Password hashing, secure user filtering, admin authorization

### Entity Relationships & Business Rules

```
User ──┬─── EmailVerificationToken (1:1, expires in 24h)
       ├─── Role: USER (3 book limit) | ADMIN (100 book limit)
       └─── Status: ACTIVE | SUSPENDED | INACTIVE

Author ─── Book (many-to-many, admin-managed)
     ├─── Birth/death date validation
     └─── Popularity flag for recommendations

Book ─── Status: AVAILABLE | BORROWED | RESERVED | MAINTENANCE | LOST
   ├─── ISBN uniqueness constraint
   ├─── Popularity tracking via totalLoans
   └─── Entry date for library catalog management
```

### Use Case Examples

- **Registration Flow**: `sendEmailVerification` → `verifyEmailToken` → `completeRegistration`
- **Author Management**: Admin creates/updates/deletes authors with biography validation
- **Book Catalog**: Add books with ISBN validation, track popularity and availability

## Security Considerations

### Development

- **Type Safety**: Uses domain-specific types (UUID, Email) with TypeScript validation
- **Business Rules**: Enforced at domain layer (password hashing, email verification)
- **Mock Services**: Available for testing without database dependencies
- **Clean Separation**: Domain logic independent of framework/database

### Production

- **Security**: Strong password requirements, secure hashing via CryptoService
- **Authorization**: Role-based access control with admin verification
- **Validation**: Comprehensive input validation (emails, dates, required fields)
- **Data Integrity**: Foreign key constraints, status enums, business rule enforcement

## Contributing

When adding new database scripts:

1. Follow the existing naming convention: `action-environment-db.ts`
2. Include proper error handling and logging
3. Add appropriate package.json scripts
4. Update this README with new commands
5. Test scripts in both development and production modes

## Support

For database-related issues:

1. Run `yarn db:debug` first
2. Check the troubleshooting section above
3. Review TypeORM and better-sqlite3 documentation
4. Create an issue with debug output if needed
