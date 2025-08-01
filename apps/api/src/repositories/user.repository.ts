import { Repository } from 'typeorm';
import { UserEntity, UserRole, UserStatus } from '../entities/user.entity.js';
import { AppDataSource } from '../config/data-source.js';

export class UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | null> {
    const result = await this.repository.update(id, userData);
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    return await this.repository.find({ where: { role } });
  }

  async findByStatus(status: UserStatus): Promise<UserEntity[]> {
    return await this.repository.find({ where: { status } });
  }

  async updateStatus(id: string, status: UserStatus): Promise<boolean> {
    const result = await this.repository.update(id, { status });
    return result.affected !== 0;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      emailVerified: 1,
      status: UserStatus.ACTIVE,
    });
    return result.affected !== 0;
  }
}
