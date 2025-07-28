import { beforeEach, describe, expect, test } from 'vitest';
import { AddBookRequestModel, addBook } from './add-book';
import { mockBookService } from '../../services/mocks/mock-book-service';
import { mockCryptoService } from '../../services/mocks/mock-crypto-service';
import { BookStatus } from '../../entities';

describe('Save Book Use Case', async () => {
  const SOME_ISBN = 9781234567890;
  const SOME_PAGES = 300;
  const SOME_PUBLICATION_DATE = new Date('2025-01-01');

  let bookService: ReturnType<typeof mockBookService>;
  let cryptoService: ReturnType<typeof mockCryptoService>;

  const saveBookPayload: AddBookRequestModel = {
    title: 'Test Book Title',
    ISBN: SOME_ISBN,
    pages: SOME_PAGES,
    publicationDate: SOME_PUBLICATION_DATE,
    publisher: 'Test Publisher',
  };

  beforeEach(() => {
    bookService = mockBookService();
    cryptoService = mockCryptoService();
  });

  test('should create a new book successfully when ISBN does not exist', async () => {
    const result = await addBook({ bookService, cryptoService }, saveBookPayload);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Book created successfully');
    expect(result.book).toBeDefined();

    const createdBook = result.book!;

    expect(createdBook.title).toBe(saveBookPayload.title);
    expect(createdBook.ISBN).toBe(saveBookPayload.ISBN);
    expect(createdBook.pages).toBe(saveBookPayload.pages);
    expect(createdBook.publicationDate).toEqual(saveBookPayload.publicationDate);
    expect(createdBook.publisher).toBe(saveBookPayload.publisher);
    expect(createdBook.status).toBe(BookStatus.AVAILABLE);
    expect(createdBook.totalLoans).toBe(0);
    expect(createdBook.isPopular).toBe(false);
    expect(createdBook.entryDate).toBeInstanceOf(Date);
  });
  test('should fail when ISBN is null', async () => {
    const payload: AddBookRequestModel = {
      ...saveBookPayload,
      ISBN: null as unknown as number,
    };

    const result = await addBook({ bookService, cryptoService }, payload);

    expect(result.success).toBe(false);
    expect(result.message).toBe('ISBN is required');
    expect(result.book).toBeUndefined();
  });
  test('should fail when ISBN is undefined', async () => {
    const payload: AddBookRequestModel = {
      ...saveBookPayload,
      ISBN: undefined as unknown as number,
    };

    const result = await addBook({ bookService, cryptoService }, payload);

    expect(result.success).toBe(false);
    expect(result.message).toBe('ISBN is required');
    expect(result.book).toBeUndefined();
  });
});
