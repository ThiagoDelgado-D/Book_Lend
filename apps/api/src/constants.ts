export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
export const DB_NAME = process.env.DB_NAME || 'booklend';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
