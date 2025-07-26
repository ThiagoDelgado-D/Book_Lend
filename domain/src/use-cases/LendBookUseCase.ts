import { BookStatus } from '../entities';
import { BookServices } from '../services/book-service';
import { UUID } from '../types/uuid';

export interface LendBookRequestModel {
  bookId: UUID;
  borrowerId: UUID;
}

export interface LendBookResponseModel {
  success: boolean;
  message: string;
}

export interface LendBookDependencies {
  bookServices: BookServices;
}

export type LendBookUseCase = (
  deps: LendBookDependencies
) => (request: LendBookRequestModel) => Promise<LendBookResponseModel>;

export const lendBook: LendBookUseCase =
  ({ bookServices: bookRepository }) =>
  async request => {
    try {
      const book = await bookRepository.findById(request.bookId);

      if (!book) {
        return {
          success: false,
          message: 'Book not found',
        };
      }

      if (book.status !== BookStatus.AVAILABLE) {
        return {
          success: false,
          message: 'Book is already lent',
        };
      }

      const lentBook = { ...book, status: BookStatus.BORROWED };
      await bookRepository.update(lentBook);

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
  };
