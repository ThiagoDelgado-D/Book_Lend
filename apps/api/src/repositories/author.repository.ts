import { Repository } from 'typeorm';
import { AuthorEntity } from '../entities/author.entity.js';
import { AppDataSource } from '../config/data-source.js';

export class AuthorRepository {
  private repository: Repository<AuthorEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AuthorEntity);
  }

  async create(authorData: Partial<AuthorEntity>): Promise<AuthorEntity> {
    const author = this.repository.create(authorData);
    return await this.repository.save(author);
  }

  async findById(id: string): Promise<AuthorEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByName(firstName: string, lastName: string): Promise<AuthorEntity | null> {
    return await this.repository.findOne({
      where: { firstName, lastName },
    });
  }

  async findAll(): Promise<AuthorEntity[]> {
    return await this.repository.find();
  }

  async findPopular(): Promise<AuthorEntity[]> {
    return await this.repository.find({
      where: { isPopular: true },
      take: 10,
    });
  }

  async searchByName(searchTerm: string): Promise<AuthorEntity[]> {
    return await this.repository
      .createQueryBuilder('author')
      .where('author.firstName LIKE :term OR author.lastName LIKE :term', {
        term: `%${searchTerm}%`,
      })
      .getMany();
  }

  async findByNationality(nationality: string): Promise<AuthorEntity[]> {
    return await this.repository.find({ where: { nationality } });
  }

  async update(id: string, authorData: Partial<AuthorEntity>): Promise<AuthorEntity | null> {
    const result = await this.repository.update(id, authorData);
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async setPopular(id: string, isPopular: boolean): Promise<boolean> {
    const result = await this.repository.update(id, { isPopular });
    return result.affected !== 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
