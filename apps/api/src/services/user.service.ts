import { Repository } from 'typeorm';
import { UserService, User, UserStatus, UUID, Email } from 'app-domain';
import { UserEntity, UserStatus as EntityUserStatus } from '../entities/user.entity.js';
import { AppDataSource } from '../config/data-source.js';

export class UserServiceImpl implements UserService {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: UUID): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const entityStatus = this.mapEntityStatus(status);
    const entities = await this.repository.find({ where: { status: entityStatus } });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findActiveUsers(): Promise<User[]> {
    const entities = await this.repository.find({
      where: {
        status: EntityUserStatus.ACTIVE,
        emailVerified: 1,
      },
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async save(user: User): Promise<User> {
    const entity = this.mapToEntity(user);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: UserEntity): User {
    return {
      id: entity.id as UUID,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email as Email,
      phoneNumber: null,
      bookLimit: 5,
      registrationDate: entity.createdAt,
      hashedPassword: entity.passwordHash,
      status: this.mapUserStatus(entity.status),
      enabled: entity.emailVerified === 1,
      role: entity.role,
    };
  }

  private mapToEntity(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) entity.id = user.id;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.email = user.email || '';
    entity.passwordHash = user.hashedPassword;
    entity.status = this.mapEntityStatus(user.status);
    entity.role = user.role;
    entity.emailVerified = user.enabled ? 1 : 0;
    return entity;
  }

  private mapUserStatus(entityStatus: EntityUserStatus): UserStatus {
    switch (entityStatus) {
      case EntityUserStatus.ACTIVE:
        return UserStatus.ACTIVE;
      case EntityUserStatus.INACTIVE:
        return UserStatus.INACTIVE;
      case EntityUserStatus.PENDING_VERIFICATION:
        return UserStatus.INACTIVE;
      default:
        return UserStatus.INACTIVE;
    }
  }

  private mapEntityStatus(domainStatus: UserStatus): EntityUserStatus {
    switch (domainStatus) {
      case UserStatus.ACTIVE:
        return EntityUserStatus.ACTIVE;
      case UserStatus.INACTIVE:
        return EntityUserStatus.INACTIVE;
      case UserStatus.SUSPENDED:
        return EntityUserStatus.INACTIVE;
      default:
        return EntityUserStatus.INACTIVE;
    }
  }
}
