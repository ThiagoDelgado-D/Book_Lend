# Development Database Scripts

This directory contains scripts for managing the SQLite development database.

## Available Scripts

### Setup & Initialization

- **`npm run dev:db:setup`** - Creates and initializes the development database schema
- **`npm run dev:db:seed`** - Populates the database with sample data
- **`npm run dev:db:init`** - Runs setup + seed in sequence (recommended for first setup)
- **`npm run dev:db:reset`** - Deletes the database and reinitializes it with sample data

### Production

- **`npm run db:seed:prod`** - Seeds the database with production-ready data

## Script Files

- `setup-dev-db.ts` - Database schema creation and synchronization
- `seed-dev-db.ts` - Sample data seeding for development
- `dev-database.ts` - Combined setup and seed utilities
- `seed-production.ts` - Production data seeding

## Database Location

The development database is created at: `database/booklend-dev.sqlite`

## Sample Data

The seed script creates:

- **3 Authors**: Gabriel García Márquez, Isabel Allende, Jorge Luis Borges
- **4 Books**: Classic Latin American literature
- **2 Users**: Admin user and regular user for testing

### Test Credentials

- Admin: `admin@booklend.dev` / `hashedpassword123`
- User: `user@booklend.dev` / `hashedpassword456`

_(Note: In development, passwords are stored as simple hashes for convenience)_

## Quick Start

For a new development environment:

```bash
npm run dev:db:init
npm run dev
```

This will create the database, populate it with sample data, and start the development server.
