import { Repository } from 'typeorm';
import { BookEntity, BookStatus } from '../entities/book.entity.js';
import { AuthorEntity } from '../entities/author.entity.js';
import { AppDataSource } from '../config/data-source.js';

export interface BookStatistics {
  total: number;
  available: number;
  borrowed: number;
  reserved: number;
  maintenance: number;
  lost: number;
}

export class BookRepository {
  private repository: Repository<BookEntity>;
  private authorRepository: Repository<AuthorEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookEntity);
    this.authorRepository = AppDataSource.getRepository(AuthorEntity);
  }

  async create(bookData: Partial<BookEntity> & { author?: AuthorEntity }): Promise<BookEntity> {
    const { author, ...bookInfo } = bookData;

    const book = this.repository.create(bookInfo);
    if (author) {
      book.authorId = author.id;
    }

    return await this.repository.save(book);
  }

  async findById(id: string): Promise<BookEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByIsbn(isbn: number): Promise<BookEntity | null> {
    return await this.repository.findOne({ where: { isbn } });
  }

  async findByTitle(title: string): Promise<BookEntity[]> {
    return await this.repository
      .createQueryBuilder('book')
      .where('book.title LIKE :title', { title: `%${title}%` })
      .getMany();
  }

  async findByAuthor(authorId: string): Promise<BookEntity[]> {
    return await this.repository.find({ where: { authorId } });
  }

  async findByStatus(status: BookStatus): Promise<BookEntity[]> {
    return await this.repository.find({ where: { status } });
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.repository.find();
  }

  async findPopular(): Promise<BookEntity[]> {
    return await this.repository.find({
      where: { isPopular: true },
      take: 10,
      order: { totalLoans: 'DESC' },
    });
  }

  async findAvailable(): Promise<BookEntity[]> {
    return await this.repository.find({
      where: { status: BookStatus.AVAILABLE },
    });
  }

  async update(id: string, bookData: Partial<BookEntity>): Promise<BookEntity | null> {
    const result = await this.repository.update(id, bookData);
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async updateStatus(id: string, status: BookStatus): Promise<boolean> {
    const result = await this.repository.update(id, { status });
    return result.affected !== 0;
  }

  async incrementLoans(id: string): Promise<boolean> {
    const result = await this.repository
      .createQueryBuilder()
      .update(BookEntity)
      .set({ totalLoans: () => 'totalLoans + 1' })
      .where('id = :id', { id })
      .execute();

    return result.affected !== 0;
  }

  async setPopular(id: string, isPopular: boolean): Promise<boolean> {
    const result = await this.repository.update(id, { isPopular });
    return result.affected !== 0;
  }

  async getStatistics(): Promise<BookStatistics> {
    const total = await this.repository.count();
    const available = await this.repository.count({ where: { status: BookStatus.AVAILABLE } });
    const borrowed = await this.repository.count({ where: { status: BookStatus.BORROWED } });
    const reserved = await this.repository.count({ where: { status: BookStatus.RESERVED } });
    const maintenance = await this.repository.count({ where: { status: BookStatus.MAINTENANCE } });
    const lost = await this.repository.count({ where: { status: BookStatus.LOST } });

    return {
      total,
      available,
      borrowed,
      reserved,
      maintenance,
      lost,
    };
  }

  async findMostBorrowed(limit: number = 10): Promise<BookEntity[]> {
    return await this.repository.find({
      order: { totalLoans: 'DESC' },
      take: limit,
    });
  }

  async searchBooks(searchTerm: string): Promise<BookEntity[]> {
    return await this.repository
      .createQueryBuilder('book')
      .where('book.title LIKE :term OR book.publisher LIKE :term', {
        term: `%${searchTerm}%`,
      })
      .getMany();
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
