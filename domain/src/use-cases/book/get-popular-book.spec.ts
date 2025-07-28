import { beforeEach, describe, expect, test } from 'vitest';
import { getPopularBooks } from './get-popular-books';
import { mockBookService } from '../../services/mocks/mock-book-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { BookStatus } from '../../entities';

describe('Get Popular Books Use Case', () => {
  const SOME_ISBN = 9781234567890;
  const ANOTHER_ISBN = 9780987654321;
  const SOME_PAGES = 300;
  const SOME_PUBLICATION_DATE = new Date('2025-01-01');

  let bookService: ReturnType<typeof mockBookService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  beforeEach(() => {
    bookService = mockBookService();
    cryptoService = mockCryptoService();
  });

  test('should return popular books successfully when they exist', async () => {
    const bookId1 = await cryptoService.generateUUID();
    const bookId2 = await cryptoService.generateUUID();

    const popularBook1 = {
      id: bookId1,
      title: 'Popular Book 1',
      ISBN: SOME_ISBN,
      pages: SOME_PAGES,
      publicationDate: SOME_PUBLICATION_DATE,
      publisher: 'Publisher 1',
      status: BookStatus.AVAILABLE,
      totalLoans: 10,
      isPopular: true,
      entryDate: new Date('2020-01-01'),
    };

    const popularBook2 = {
      id: bookId2,
      title: 'Popular Book 2',
      ISBN: ANOTHER_ISBN,
      pages: 250,
      publicationDate: new Date('2021-01-01'),
      publisher: 'Publisher 2',
      status: BookStatus.BORROWED,
      totalLoans: 15,
      isPopular: true,
      entryDate: new Date('2021-01-01'),
    };

    await bookService.save(popularBook1);
    await bookService.save(popularBook2);

    const result = await getPopularBooks({ bookService });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Popular books retrieved successfully');
    expect(result.books).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.books[0].isPopular).toBe(true);
    expect(result.books[1].isPopular).toBe(true);
  });

  test('should return empty array with appropriate message when no popular books found', async () => {
    const result = await getPopularBooks({ bookService });

    expect(result.success).toBe(true);
    expect(result.message).toBe('No popular books found');
    expect(result.books).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
