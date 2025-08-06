import { Book, BookStatus } from '../entities';
import { UUID } from '../types/uuid';

export interface BookService {
  findById(id: UUID): Promise<Book | null>;
  findByTitle(title: string): Promise<Book[]>;
  findByIsbn(isbn: string): Promise<Book | null>;
  findByStatus(status: BookStatus): Promise<Book[]>;
  findAll(): Promise<Book[]>;
  findPopularBooks(): Promise<Book[]>;
  save(book: Book): Promise<Book>;
  delete(id: UUID): Promise<void>;
}
