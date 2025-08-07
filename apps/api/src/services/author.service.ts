import { Repository } from 'typeorm';
import { AuthorService, Author, UUID, validateAndNormalizeEmail } from 'app-domain';
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
      .where('author.firstName ILIKE :name OR author.lastName ILIKE :name', {
        name: `%${name}%`,
      })
      .orderBy('author.lastName', 'ASC')
      .addOrderBy('author.firstName', 'ASC')
      .getMany();

    return entities.map(entity => this.mapToDomain(entity));
  }

  async findByNationality(nationality: string): Promise<Author[]> {
    const entities = await this.repository.find({
      where: { nationality },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findPopularAuthors(): Promise<Author[]> {
    const entities = await this.repository.find({
      where: { isPopular: true },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findAll(): Promise<Author[]> {
    const entities = await this.repository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async save(author: Author): Promise<Author> {
    const entity = this.mapToEntity(author);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async delete(id: UUID): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Author with id ${id} not found`);
    }
  }

  private mapToDomain(entity: AuthorEntity): Author {
    return {
      id: entity.id as UUID,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: validateAndNormalizeEmail(entity.email),
      phoneNumber: entity.phoneNumber || null,
      biography: entity.biography,
      nationality: entity.nationality,
      birthDate: entity.birthDate,
      deathDate: entity.deathDate || null,
      isPopular: entity.isPopular,
    };
  }

  private mapToEntity(author: Author): AuthorEntity {
    const entity = new AuthorEntity();

    if (author.id) {
      entity.id = author.id;
    }

    entity.firstName = author.firstName;
    entity.lastName = author.lastName;
    entity.email = author.email || null;
    entity.phoneNumber = author.phoneNumber || null;
    entity.biography = author.biography;
    entity.nationality = author.nationality;
    entity.birthDate = author.birthDate;
    entity.deathDate = author.deathDate || null;
    entity.isPopular = author.isPopular;

    return entity;
  }
}
