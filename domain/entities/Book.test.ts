import { describe, it, expect } from 'vitest';
import { Book } from './Book.js';
import type { BookProps } from './Book.js';

describe('Book Entity', () => {
  const validBookProps: BookProps = {
    id: '1',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    isbn: '978-0134494166',
    publishedYear: 2017,
    isAvailable: true,
  };

  describe('constructor', () => {
    it('should create a book with valid properties', () => {
      const book = new Book(validBookProps);

      expect(book.id).toBe('1');
      expect(book.title).toBe('Clean Architecture');
      expect(book.author).toBe('Robert C. Martin');
      expect(book.isbn).toBe('978-0134494166');
      expect(book.publishedYear).toBe(2017);
      expect(book.isAvailable).toBe(true);
    });

    it('should throw error for empty title', () => {
      const props = { ...validBookProps, title: '' };

      expect(() => new Book(props)).toThrow('Book title cannot be empty');
    });

    it('should throw error for empty author', () => {
      const props = { ...validBookProps, author: '' };

      expect(() => new Book(props)).toThrow('Book author cannot be empty');
    });

    it('should throw error for invalid published year', () => {
      const props = { ...validBookProps, publishedYear: 999 };

      expect(() => new Book(props)).toThrow('Invalid published year');
    });
  });

  describe('markAsLent', () => {
    it('should mark available book as lent', () => {
      const book = new Book(validBookProps);
      const lentBook = book.markAsLent();

      expect(lentBook.isAvailable).toBe(false);
      expect(book.isAvailable).toBe(true); // Original should remain unchanged
    });

    it('should throw error when trying to lend already lent book', () => {
      const props = { ...validBookProps, isAvailable: false };
      const book = new Book(props);

      expect(() => book.markAsLent()).toThrow('Book is already lent');
    });
  });

  describe('markAsReturned', () => {
    it('should mark lent book as returned', () => {
      const props = { ...validBookProps, isAvailable: false };
      const book = new Book(props);
      const returnedBook = book.markAsReturned();

      expect(returnedBook.isAvailable).toBe(true);
      expect(book.isAvailable).toBe(false); // Original should remain unchanged
    });

    it('should throw error when trying to return available book', () => {
      const book = new Book(validBookProps);

      expect(() => book.markAsReturned()).toThrow('Book is already available');
    });
  });
});
