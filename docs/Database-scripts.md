# BookLend API - Database Management Scripts

This directory contains scripts for managing the SQLite database in both development and production environments.

## Prerequisites

- Node.js 18+
- Yarn package manager
- SQLite3 (via better-sqlite3)

## Database Scripts

### Development Environment

#### Setup & Initialization

- **`yarn db:setup`** - Creates and initializes the development database schema
- **`yarn db:seed`** - Populates the database with sample development data
- **`yarn db:debug`** - Runs database diagnostics and connection tests
- **`yarn db:reset`** - Deletes and recreates the database with fresh sample data

#### Quick Start Commands

- **`yarn db:init`** - Complete setup (schema + seed) for new environments
- **`yarn dev`** - Start development server after database setup

### Production Environment

- **`yarn db:prod:seed`** - Seeds database with production-ready essential data

## Database Configuration

### File Locations

- **Database File**: `./data/booklend.sqlite` (from project root)
- **Data Directory**: Auto-created if it doesn't exist
- **Backup Location**: Automatically managed by SQLite WAL mode

### Data Source Configuration

The database uses a centralized `AppDataSource` configuration:

- **Type**: better-sqlite3
- **Synchronize**: Enabled in development only
- **Logging**: Enabled in development only
- **Entities**: Auto-loaded (User, Author, Book, EmailVerificationToken)

### SQLite Optimizations

Applied via `prepareDatabase` hook for better performance:

```javascript
journal_mode = WAL        // Better concurrency and performance
foreign_keys = ON         // Enforces referential integrity
synchronous = NORMAL      // Balanced durability/performance
temp_store = MEMORY       // Faster temporary operations
mmap_size = 256MB         // Memory-mapped I/O optimization
```

## Sample Data

### Development Environment (`seed-dev-db.ts`)

The development seed creates:

#### Test Users

**Admin User:**

- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Book Limit**: 10 books
- **Status**: Active

**Regular User:**

- **Email**: `user@test.com`
- **Password**: `user123`
- **Role**: Regular User
- **Book Limit**: 3 books (default for users)
- **Status**: Active

**Additional Users:**

- **Count**: 4 random users
- **Purpose**: Testing user management functionality
- **Book Limits**: 2-5 books (randomized)
- **Status**: All active and verified

#### Sample Authors

- **Count**: 15 randomly generated authors
- **Data**: Realistic biographical information including:
  - Birth/death dates (1920-1990 birth years)
  - Nationalities from around the world
  - Generated biographies (2 paragraphs each)
  - Mixed popular and non-popular authors for testing
  - Email addresses (60% have emails)
  - Phone numbers (40% have phone numbers)

#### Sample Books

- **Count**: 30 randomly generated books
- **Features**:
  - Linked to the generated authors
  - Publication dates from 1950-2024
  - Various page counts (100-800 pages)
  - Random publishers using company names
  - All books start as AVAILABLE status
  - Total loans tracking for popularity algorithms

### Production Environment (`seed-production.ts`)

The production seed includes essential data for a working library system:

#### Admin User

- **Email**: `admin@booklend.com`
- **Password**: `Admin@BookLend2024`
- **Role**: Administrator
- **Book Limit**: 100 books

> ⚠️ **Security Warning**: Change the default admin password immediately after first login!

#### Essential Software Engineering Authors

The system includes foundational authors in software engineering:

- **Robert Martin** (Uncle Bob) - Clean Code series author
- **Eric Evans** - Domain-Driven Design author
- **Martin Fowler** - Refactoring, Enterprise Patterns author
- **Kent Beck** - Test-Driven Development, XP creator
- **Gang of Four** - Design Patterns authors:
  - Erich Gamma
  - Richard Helm
  - Ralph Johnson
  - John Vlissides

#### Essential Programming Books

Core books for any software engineering library:

- **Clean Code: A Handbook of Agile Software Craftsmanship** (2008)
- **Clean Architecture: A Craftsman's Guide to Software Structure and Design** (2017)
- **Domain-Driven Design: Tackling Complexity in the Heart of Software** (2003)
- **Refactoring: Improving the Design of Existing Code** (1999)
- **Test Driven Development: By Example** (2002)
- **Design Patterns: Elements of Reusable Object-Oriented Software** (1994)
- **Extreme Programming Explained: Embrace Change** (1999)
- **The Clean Coder: A Code of Conduct for Professional Programmers** (2011)

All books include:

- Real ISBN numbers and publication data
- Proper author attribution and metadata
- AVAILABLE status ready for lending
- Accurate page counts and publisher information

## Script Files Overview

| File                 | Purpose                                            | Environment |
| -------------------- | -------------------------------------------------- | ----------- |
| `setup-dev-db.ts`    | Database schema creation and synchronization       | Development |
| `seed-dev-db.ts`     | Sample data seeding with test users and books      | Development |
| `seed-production.ts` | Essential production data (admin user, core books) | Production  |
| `debug-db.ts`        | Database diagnostics and troubleshooting           | Development |
| `reset-dev-db.ts`    | Complete database reset utility                    | Development |

## Usage Examples

### First-Time Setup

```bash
# Clone and install dependencies
git clone https://github.com/ThiagoDelgado-D/Book_Lend
cd apps/api
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
yarn db:prod:seed

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

## Environment Variables

The scripts and application use these environment variables:

```env
NODE_ENV=development          # Controls synchronize vs migrations, logging
DATABASE_URL=<optional>       # Override default database path
JWT_SECRET=<required>         # For user authentication
EMAIL_SERVICE_URL=<optional>  # For email verification service
```

## Domain Integration

### Business Rules & Validation

This database layer integrates with the domain layer (`app-domain` package) which enforces:

#### User Management

- **Role-based Access**: USER (3 book limit) | ADMIN (100 book limit)
- **Status Management**: ACTIVE | INACTIVE | SUSPENDED
- **Email Verification**: Required workflow for new users

#### Author Management

- **Required Fields**: firstName, lastName, biography, nationality, birthDate
- **Validation**: Birth/death date consistency, email format validation
- **Business Logic**: Popular author flagging, nationality-based searches

#### Book Management

- **ISBN Uniqueness**: Enforced across the catalog
- **Status Tracking**: AVAILABLE | BORROWED | RESERVED | MAINTENANCE | LOST
- **Metrics**: Total loans tracking for popularity algorithms
- **Catalog**: Entry date tracking for library management

### Type Safety

- **UUID**: Domain-specific type for all entity IDs
- **Email**: Validated email format with proper regex
- **Enums**: Status and role constraints enforced at type level

## Data Source Features

- **Environment-aware**: Different behaviors for dev/prod
- **SQLite Optimized**: WAL mode, foreign keys, memory optimizations
- **Connection Management**: Centralized initialization and cleanup
- **Domain Integration**: Works seamlessly with domain services and use cases

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
