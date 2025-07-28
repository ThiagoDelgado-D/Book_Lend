import { beforeEach, describe, expect, test } from 'vitest';
import { UpdateBookRequestModel, updateBook } from './update-book';
import { mockBookService } from '../../services/mocks/mock-book-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { BookStatus } from '../../entities';

describe('Update Book Use Case', () => {
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

  test('should update book successfully when book exists', async () => {
    const bookId = await cryptoService.generateUUID();
    const originalBook = {
      id: bookId,
      title: 'Original Title',
      ISBN: SOME_ISBN,
      pages: 200,
      publicationDate: new Date('2020-01-01'),
      publisher: 'Original Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 5,
      isPopular: false,
      entryDate: new Date('2020-01-01'),
    };

    await bookService.save(originalBook);

    const updateRequest: UpdateBookRequestModel = {
      bookId,
      title: 'Updated Title',
      pages: SOME_PAGES,
    };

    const result = await updateBook({ bookService }, updateRequest);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Book updated successfully');
    expect(result.book).toBeDefined();

    const updatedBook = result.book!;
    expect(updatedBook.title).toBe('Updated Title');
    expect(updatedBook.pages).toBe(SOME_PAGES);
    expect(updatedBook.ISBN).toBe(SOME_ISBN);
    expect(updatedBook.publisher).toBe('Original Publisher');
    expect(updatedBook.status).toBe(BookStatus.AVAILABLE);
    expect(updatedBook.totalLoans).toBe(5);
    expect(updatedBook.isPopular).toBe(false);
  });

  test('should fail when book does not exist', async () => {
    const nonExistentId = await cryptoService.generateUUID();

    const updateRequest: UpdateBookRequestModel = {
      bookId: nonExistentId,
      title: 'Updated Title',
    };

    const result = await updateBook({ bookService }, updateRequest);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Book not found');
    expect(result.book).toBeUndefined();
  });

  test('should fail when trying to update ISBN to an existing one', async () => {
    const bookId = await cryptoService.generateUUID();
    const anotherBookId = await cryptoService.generateUUID();

    const originalBook = {
      id: bookId,
      title: 'Original Book',
      ISBN: SOME_ISBN,
      pages: 200,
      publicationDate: new Date('2020-01-01'),
      publisher: 'Original Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 0,
      isPopular: false,
      entryDate: new Date('2020-01-01'),
    };

    const anotherBook = {
      id: anotherBookId,
      title: 'Another Book',
      ISBN: ANOTHER_ISBN,
      pages: 150,
      publicationDate: new Date('2021-01-01'),
      publisher: 'Another Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 0,
      isPopular: false,
      entryDate: new Date('2021-01-01'),
    };

    await bookService.save(originalBook);
    await bookService.save(anotherBook);

    const updateRequest: UpdateBookRequestModel = {
      bookId,
      ISBN: ANOTHER_ISBN,
    };

    const result = await updateBook({ bookService }, updateRequest);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Book with this ISBN already exists');
    expect(result.book).toBeUndefined();
  });

  test('should allow updating ISBN to the same value', async () => {
    const bookId = await cryptoService.generateUUID();

    const originalBook = {
      id: bookId,
      title: 'Original Title',
      ISBN: SOME_ISBN,
      pages: 200,
      publicationDate: new Date('2020-01-01'),
      publisher: 'Original Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 0,
      isPopular: false,
      entryDate: new Date('2020-01-01'),
    };

    await bookService.save(originalBook);

    const updateRequest: UpdateBookRequestModel = {
      bookId,
      ISBN: SOME_ISBN,
      title: 'Updated Title',
    };

    const result = await updateBook({ bookService }, updateRequest);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Book updated successfully');
    expect(result.book!.ISBN).toBe(SOME_ISBN);
    expect(result.book!.title).toBe('Updated Title');
  });

  test('should preserve unchanged fields when partially updating', async () => {
    const bookId = await cryptoService.generateUUID();

    const originalBook = {
      id: bookId,
      title: 'Original Title',
      ISBN: SOME_ISBN,
      pages: 200,
      publicationDate: SOME_PUBLICATION_DATE,
      publisher: 'Original Publisher',
      status: BookStatus.AVAILABLE,
      totalLoans: 5,
      isPopular: false,
      entryDate: new Date('2020-01-01'),
    };

    await bookService.save(originalBook);

    const updateRequest: UpdateBookRequestModel = {
      bookId,
      title: 'New Title Only',
    };

    const result = await updateBook({ bookService }, updateRequest);

    expect(result.success).toBe(true);

    const updatedBook = result.book!;
    expect(updatedBook.title).toBe('New Title Only');
    expect(updatedBook.ISBN).toBe(SOME_ISBN);
    expect(updatedBook.pages).toBe(200);
    expect(updatedBook.publisher).toBe('Original Publisher');
    expect(updatedBook.status).toBe(BookStatus.AVAILABLE);
    expect(updatedBook.totalLoans).toBe(5);
    expect(updatedBook.isPopular).toBe(false);
    expect(updatedBook.publicationDate).toEqual(SOME_PUBLICATION_DATE);
  });
});
