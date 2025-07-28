import { Book } from '../../entities';
import { BookService } from '../../services/book-service';

export interface GetPopularBooksDependencies {
  bookService: BookService;
}

export interface GetPopularBooksResponseModel {
  success: boolean;
  message: string;
  books: Book[];
  total: number;
}

export const getPopularBooks = async ({
  bookService,
}: GetPopularBooksDependencies): Promise<GetPopularBooksResponseModel> => {
  const books = await bookService.findPopularBooks();

  return {
    success: true,
    message: books.length > 0 ? 'Popular books retrieved successfully' : 'No popular books found',
    books,
    total: books.length,
  };
};
