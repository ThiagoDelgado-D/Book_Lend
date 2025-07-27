import { Author } from '../entities';
import { UUID } from '../types/uuid';

export interface AuthorService {
  findById(id: UUID): Promise<Author | null>;
  findByName(name: string): Promise<Author[]>;
  findByNationality(nationality: string): Promise<Author[]>;
  findPopularAuthors(): Promise<Author[]>;
  save(author: Author): Promise<Author>;
  delete(id: UUID): Promise<void>;
}
