import { User } from '../entities';
import { UUID } from '../types/uuid';

export interface AuthService {
  findByEmail(email: string): Promise<User | null>;
  findById(id: UUID): Promise<User | null>;
  save(user: User): Promise<User>;
}
