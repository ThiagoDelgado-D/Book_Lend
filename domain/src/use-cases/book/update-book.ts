import { Book } from '../../entities';
import { BookService } from '../../services/book-service';
import { UUID } from '../../types/uuid';

export interface UpdateBookDependencies {
  bookService: BookService;
}

export interface UpdateBookRequestModel {
  bookId: UUID;
  title?: string;
  ISBN?: number;
  pages?: number;
  publicationDate?: Date;
  publisher?: string;
}

export interface UpdateBookResponseModel {
  success: boolean;
  message: string;
  book?: Book;
}

export const updateBook = async (
  { bookService }: UpdateBookDependencies,
  request: UpdateBookRequestModel
): Promise<UpdateBookResponseModel> => {
  const existingBook = await bookService.findById(request.bookId);

  if (!existingBook) {
    return {
      success: false,
      message: 'Book not found',
    };
  }

  if (request.ISBN && request.ISBN !== existingBook.ISBN) {
    const bookWithSameISBN = await bookService.findByIsbn(request.ISBN.toString());
    if (bookWithSameISBN && bookWithSameISBN.id !== request.bookId) {
      return {
        success: false,
        message: 'Book with this ISBN already exists',
      };
    }
  }

  const updatedBook: Book = {
    ...existingBook,
    title: request.title ?? existingBook.title,
    ISBN: request.ISBN ?? existingBook.ISBN,
    pages: request.pages ?? existingBook.pages,
    publicationDate: request.publicationDate ?? existingBook.publicationDate,
    publisher: request.publisher ?? existingBook.publisher,
  };

  const savedBook = await bookService.save(updatedBook);

  return {
    success: true,
    message: 'Book updated successfully',
    book: savedBook,
  };
};
