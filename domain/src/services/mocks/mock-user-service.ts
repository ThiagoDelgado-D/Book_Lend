import { User, UserStatus } from '../../entities';
import { UserService } from '../user-service';
import { UUID } from '../../types/uuid';
import { Email } from '../../types/email';

export interface MockedUserService extends UserService {
  users: User[];
}

export function mockUserService(users: User[] = []): MockedUserService {
  return {
    users: [...users],

    async findById(id: UUID): Promise<User | null> {
      const user = this.users.find(user => user.id === id);
      return user ?? null;
    },

    async findByEmail(email: Email): Promise<User | null> {
      const user = this.users.find(
        user => user.email && user.email.toLowerCase() === email.toLowerCase()
      );
      return user ?? null;
    },

    async findByStatus(status: UserStatus): Promise<User[]> {
      return this.users.filter(user => user.status === status);
    },

    async findActiveUsers(): Promise<User[]> {
      return this.users.filter(user => user.status === UserStatus.ACTIVE && user.enabled);
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

    async delete(id: UUID): Promise<void> {
      this.users = this.users.filter(user => user.id !== id);
    },
    async findAll() {
      return this.users;
    },
  };
}
