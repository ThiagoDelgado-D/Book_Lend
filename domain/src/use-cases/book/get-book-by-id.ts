import { Book } from '../../entities';
import { BookService } from '../../services/book-service';
import { UUID } from '../../types/uuid';

export interface GetBookByIdDependencies {
  bookService: BookService;
}

export interface GetBookByIdRequestModel {
  bookId: UUID;
}

export interface GetBookByIdResponseModel {
  success: boolean;
  message: string;
  book?: Book;
}

export const getBookById = async (
  { bookService }: GetBookByIdDependencies,
  request: GetBookByIdRequestModel
): Promise<GetBookByIdResponseModel> => {
  const book = await bookService.findById(request.bookId);

  if (!book) {
    return {
      success: false,
      message: 'Book not found',
    };
  }

  return {
    success: true,
    message: 'Book retrieved successfully',
    book,
  };
};
