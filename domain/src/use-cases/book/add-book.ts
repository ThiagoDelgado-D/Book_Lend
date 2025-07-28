import { Book, BookStatus } from '../../entities';
import { CryptoService } from '../../services';
import { BookService } from '../../services/book-service';

export interface AddBookDependencies {
  bookService: BookService;
  cryptoService: CryptoService;
}

export interface AddBookRequestModel {
  title: string;
  ISBN: number;
  pages: number;
  publicationDate: Date;
  publisher: string;
}

export interface AddBookRespondeModel {
  success: boolean;
  message: string;
  book?: Book;
}

export const addBook = async (
  { bookService, cryptoService }: AddBookDependencies,
  request: AddBookRequestModel
): Promise<AddBookRespondeModel> => {
  if (request.ISBN === null || request.ISBN === undefined) {
    return {
      success: false,
      message: 'ISBN is required',
    };
  }

  const existingBook = await bookService.findByIsbn(request.ISBN.toString());
  if (existingBook) {
    return {
      success: false,
      message: 'Book with this ISBN already exists',
    };
  }

  const bookId = await cryptoService.generateUUID();
  const newBook: Book = {
    id: bookId,
    title: request.title,
    ISBN: request.ISBN,
    pages: request.pages,
    publicationDate: request.publicationDate,
    publisher: request.publisher,
    status: BookStatus.AVAILABLE,
    totalLoans: 0,
    isPopular: false,
    entryDate: new Date(),
  };

  const savedBook = await bookService.save(newBook);

  return {
    success: true,
    message: 'Book created successfully',
    book: savedBook,
  };
};
