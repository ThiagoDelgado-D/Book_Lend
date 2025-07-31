import { Entity, Person } from './base-entities';

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User extends Entity, Person {
  bookLimit: number;
  registrationDate: Date;
  hashedPassword: string;
  status: UserStatus;
  enabled: boolean;
  role: UserRole;
}
export type UserSecureFields = 'hashedPassword';
export type SecureUser = Omit<User, UserSecureFields>;

export function filterSecureProperties(user: User): SecureUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    status: user.status,
    bookLimit: user.bookLimit,
    enabled: user.enabled,
    registrationDate: user.registrationDate,
    role: user.role,
  };
}
