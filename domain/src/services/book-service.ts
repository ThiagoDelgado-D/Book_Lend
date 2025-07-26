import { Book } from '../entities/book.js';
import { UUID } from '../types/uuid.js';

export interface BookServices {
  findById(id: UUID): Promise<Book | null>;
  findByIsbn(isbn: UUID): Promise<Book | null>;
  findAvailableBooks(): Promise<Book[]>;
  save(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: UUID): Promise<void>;
}
