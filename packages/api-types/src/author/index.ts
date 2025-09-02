import { Author } from 'app-domain';
import { ApiResponse } from '../response';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthorResponse extends ApiResponse<Author> {}

export interface AuthorsListResponse extends ApiResponse<Author[]> {
  total?: number;
}
