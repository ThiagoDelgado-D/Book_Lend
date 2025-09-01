import { Book } from 'app-domain';
import { ApiResponse } from '../response';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BookResponse extends ApiResponse<Book> {}
export interface BooksListResponse extends ApiResponse<Book[]> {
  total?: number;
}
