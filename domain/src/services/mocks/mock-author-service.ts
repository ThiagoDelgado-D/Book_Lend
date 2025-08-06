import { UUID } from 'crypto';
import { Author } from '../../entities';
import { AuthorService } from '../author-service';

export interface MockedAuthorService extends AuthorService {
  authors: Author[];
}
export function mockAuthorService(authors: Author[] = []): MockedAuthorService {
  return {
    authors: [...authors],

    async findById(id: UUID): Promise<Author | null> {
      const author = this.authors.find(author => author.id === id);
      return author ? author : null;
    },
    async findByName(name: string): Promise<Author[]> {
      const authors = this.authors.filter(
        author => author.firstName.toLowerCase() === name.toLowerCase()
      );
      return authors;
    },
    async findByNationality(nationality: string): Promise<Author[]> {
      return this.authors.filter(
        author => author.nationality.toLowerCase() === nationality.toLowerCase()
      );
    },

    async findPopularAuthors(): Promise<Author[]> {
      return this.authors.filter(author => author.isPopular);
    },

    async findAll(): Promise<Author[]> {
      return this.authors;
    },

    async save(author: Author): Promise<Author> {
      const index = this.authors.findIndex(a => a.id === author.id);
      if (index !== -1) {
        this.authors[index] = author;
      } else {
        this.authors.push(author);
      }
      return author;
    },

    async delete(id: UUID): Promise<void> {
      this.authors = this.authors.filter(author => author.id !== id);
    },
  };
}
