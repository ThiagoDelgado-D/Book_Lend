import { Repository } from 'typeorm';
import { BookService, Book, BookStatus, UUID } from 'app-domain';
import { BookEntity } from '../entities/book.entity.js';
import { AppDataSource } from '../config/data-source.js';

export class BookServiceImpl implements BookService {
  private repository: Repository<BookEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookEntity);
  }

  async findById(id: UUID): Promise<Book | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByTitle(title: string): Promise<Book[]> {
    const entities = await this.repository
      .createQueryBuilder('book')
      .where('book.title LIKE :title', { title: `%${title}%` })
      .getMany();

    return entities.map(entity => this.mapToDomain(entity));
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const isbnNumber = parseInt(isbn);
    const entity = await this.repository.findOne({ where: { isbn: isbnNumber } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByStatus(status: BookStatus): Promise<Book[]> {
    const entities = await this.repository.find({ where: { status } });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findPopularBooks(): Promise<Book[]> {
    const entities = await this.repository.find({
      where: { isPopular: true },
      take: 10,
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async save(book: Book): Promise<Book> {
    const entity = this.mapToEntity(book);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: BookEntity): Book {
    return {
      id: entity.id as UUID,
      title: entity.title,
      ISBN: entity.isbn || 0,
      pages: entity.pages || 0,
      publicationDate: entity.publishedDate || new Date(),
      publisher: entity.publisher || '',
      status: entity.status,
      totalLoans: entity.totalLoans,
      isPopular: entity.isPopular,
      entryDate: entity.entryDate,
    };
  }

  private mapToEntity(book: Book): BookEntity {
    const entity = new BookEntity();
    if (book.id) entity.id = book.id;
    entity.title = book.title;
    entity.isbn = book.ISBN;
    entity.pages = book.pages;
    entity.publisher = book.publisher;
    entity.publishedDate = book.publicationDate;
    entity.status = book.status;
    entity.totalLoans = book.totalLoans;
    entity.isPopular = book.isPopular;
    entity.entryDate = book.entryDate;
    return entity;
  }
}
