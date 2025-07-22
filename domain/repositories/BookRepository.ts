import type { Book } from '../entities/Book.js';

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  findByIsbn(isbn: string): Promise<Book | null>;
  findAvailableBooks(): Promise<Book[]>;
  save(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: string): Promise<void>;
}
