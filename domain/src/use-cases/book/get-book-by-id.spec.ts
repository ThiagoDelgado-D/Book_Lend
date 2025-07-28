import { beforeEach, describe, expect, test } from 'vitest';
import { getBookById } from './get-book-by-id';
import { mockBookService } from '../../services/mocks/mock-book-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { BookStatus } from '../../entities';

describe('Get Book By ID Use Case', () => {
  let bookService: ReturnType<typeof mockBookService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    bookService = mockBookService();
    cryptoService = mockCryptoService();
  });

  test('should return the book when it exists', async () => {
    const bookId = await cryptoService.generateUUID();

    const mockBook = {
      id: bookId,
      title: 'Existing Book',
      ISBN: 9781234567890,
      pages: 200,
      publicationDate: new Date('2023-01-01'),
      publisher: 'Some Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 2,
      isPopular: true,
      entryDate: new Date('2023-01-01'),
    };

    await bookService.save(mockBook);

    const result = await getBookById({ bookService }, { bookId });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Book retrieved successfully');
    expect(result.book).toBeDefined();

    if (result.book) {
      expect(result.book.id).toBe(bookId);
      expect(result.book.title).toBe(mockBook.title);
      expect(result.book.ISBN).toBe(mockBook.ISBN);
    }
  });

  test('should return failure when book does not exist', async () => {
    const nonExistentId = await cryptoService.generateUUID();

    const result = await getBookById({ bookService }, { bookId: nonExistentId });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Book not found');
    expect(result.book).toBeUndefined();
  });
});
