import { User } from '../../entities';
import { AuthService } from '../auth-service';
import { UUID } from '../../types/uuid';
import { Email } from '../../types/email';

export interface MockedAuthService extends AuthService {
  users: User[];
}

export function mockAuthService(users: User[] = []): MockedAuthService {
  return {
    users: [...users],

    async findByEmail(email: Email): Promise<User | null> {
      const user = this.users.find(
        user => user.email && user.email.toLowerCase() === email.toLowerCase()
      );
      return user ?? null;
    },

    async findById(id: UUID): Promise<User | null> {
      const user = this.users.find(user => user.id === id);
      return user ?? null;
    },

    async save(user: User): Promise<User> {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
      } else {
        this.users.push(user);
      }
      return user;
    },
  };
}
