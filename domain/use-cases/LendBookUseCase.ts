import type { BookRepository } from '../repositories/BookRepository.js';

export interface LendBookRequest {
  bookId: string;
  borrowerId: string;
}

export interface LendBookResponse {
  success: boolean;
  message: string;
}

export class LendBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(request: LendBookRequest): Promise<LendBookResponse> {
    try {
      const book = await this.bookRepository.findById(request.bookId);

      if (!book) {
        return {
          success: false,
          message: 'Book not found',
        };
      }

      if (!book.isAvailable) {
        return {
          success: false,
          message: 'Book is already lent',
        };
      }

      const lentBook = book.markAsLent();
      await this.bookRepository.update(lentBook);

      return {
        success: true,
        message: 'Book lent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
