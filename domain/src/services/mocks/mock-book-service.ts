import { Book } from '../../entities';
import { BookService } from '../book-service';
import { UUID } from '../../types/uuid';
import { BookStatus } from '../../entities';

export interface MockedBookService extends BookService {
  books: Book[];
}

export function mockBookService(books: Book[] = []): MockedBookService {
  return {
    books: [...books],

    async findById(id: UUID): Promise<Book | null> {
      const book = this.books.find(book => book.id === id);
      return book ?? null;
    },

    async findByTitle(title: string): Promise<Book[]> {
      return this.books.filter(book => book.title.toLowerCase() === title.toLowerCase());
    },

    async findByIsbn(isbn: string): Promise<Book | null> {
      const book = this.books.find(book => String(book.ISBN) === isbn);
      return book ?? null;
    },

    async findByStatus(status: BookStatus): Promise<Book[]> {
      return this.books.filter(book => book.status === status);
    },

    async findPopularBooks(): Promise<Book[]> {
      return this.books.filter(book => book.isPopular);
    },

    async save(book: Book): Promise<Book> {
      const index = this.books.findIndex(b => b.id === book.id);
      if (index !== -1) {
        this.books[index] = book;
      } else {
        this.books.push(book);
      }
      return book;
    },

    async delete(id: UUID): Promise<void> {
      this.books = this.books.filter(book => book.id !== id);
    },
  };
}
