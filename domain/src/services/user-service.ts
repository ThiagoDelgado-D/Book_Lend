import { User, UserStatus } from '../entities';
import { Email } from '../types/email';
import { UUID } from '../types/uuid';

export interface UserService {
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByStatus(status: UserStatus): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: UUID): Promise<void>;
}
