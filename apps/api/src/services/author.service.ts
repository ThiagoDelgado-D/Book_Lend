import { Repository } from 'typeorm';
import { AuthorService, Author, UUID } from 'app-domain';
import { AuthorEntity } from '../entities/author.entity.js';
import { AppDataSource } from '../config/data-source.js';

export class AuthorServiceImpl implements AuthorService {
  private repository: Repository<AuthorEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AuthorEntity);
  }

  async findById(id: UUID): Promise<Author | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(name: string): Promise<Author[]> {
    const entities = await this.repository
      .createQueryBuilder('author')
      .where('author.firstName LIKE :name OR author.lastName LIKE :name', { name: `%${name}%` })
      .getMany();

    return entities.map(entity => this.mapToDomain(entity));
  }

  async findByNationality(nationality: string): Promise<Author[]> {
    const entities = await this.repository.find({ where: { nationality } });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findPopularAuthors(): Promise<Author[]> {
    const entities = await this.repository.find({ where: { isPopular: true } });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async save(author: Author): Promise<Author> {
    const entity = this.mapToEntity(author);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: AuthorEntity): Author {
    return {
      id: entity.id as UUID,
      firstName: entity.firstName,
      lastName: entity.lastName,
      biography: entity.biography || '',
      nationality: entity.nationality || '',
      birthDate: entity.birthDate || new Date(),
      deathDate: entity.deathDate || null,
      isPopular: entity.isPopular,
      email: null,
      phoneNumber: null,
    };
  }

  private mapToEntity(author: Author): AuthorEntity {
    const entity = new AuthorEntity();
    if (author.id) entity.id = author.id;
    entity.firstName = author.firstName;
    entity.lastName = author.lastName;
    entity.biography = author.biography;
    entity.nationality = author.nationality;
    entity.birthDate = author.birthDate;
    entity.deathDate = author.deathDate || undefined;
    entity.isPopular = author.isPopular;
    return entity;
  }
}
