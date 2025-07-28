import { beforeEach, describe, expect, test } from 'vitest';
import { DeleteBookRequestModel, deleteBook } from './delete-book';
import { mockBookService } from '../../services/mocks/mock-book-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { BookStatus } from '../../entities';

describe('Delete Book Use Case', () => {
  const SOME_ISBN = 9781234567890;
  const SOME_PAGES = 200;
  const SOME_PUBLICATION_DATE = new Date('2025-01-01');

  let bookService: ReturnType<typeof mockBookService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    bookService = mockBookService();
    cryptoService = mockCryptoService();
  });

  test('should delete book successfully when book exists', async () => {
    const bookId = await cryptoService.generateUUID();
    const existingBook = {
      id: bookId,
      title: 'Test Book',
      ISBN: SOME_ISBN,
      pages: SOME_PAGES,
      publicationDate: SOME_PUBLICATION_DATE,
      publisher: 'Test Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 0,
      isPopular: false,
      entryDate: new Date('2020-01-01'),
    };

    await bookService.save(existingBook);

    const deleteRequest: DeleteBookRequestModel = {
      bookId,
    };

    const result = await deleteBook({ bookService }, deleteRequest);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Book deleted successfully');
  });

  test('should fail when book does not exist', async () => {
    const nonExistentId = await cryptoService.generateUUID();

    const deleteRequest: DeleteBookRequestModel = {
      bookId: nonExistentId,
    };

    const result = await deleteBook({ bookService }, deleteRequest);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Book not found');
  });
});
