import { BookService } from '../../services/book-service';
import { UUID } from '../../types/uuid';

export interface DeleteBookDependencies {
  bookService: BookService;
}

export interface DeleteBookRequestModel {
  bookId: UUID;
}

export interface DeleteBookResponseModel {
  success: boolean;
  message: string;
}

export const deleteBook = async (
  { bookService }: DeleteBookDependencies,
  request: DeleteBookRequestModel
): Promise<DeleteBookResponseModel> => {
  const existingBook = await bookService.findById(request.bookId);

  if (!existingBook) {
    return {
      success: false,
      message: 'Book not found',
    };
  }

  await bookService.delete(request.bookId);

  return {
    success: true,
    message: 'Book deleted successfully',
  };
};
