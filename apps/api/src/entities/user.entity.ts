import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('users')
export class UserEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'text', name: 'first_name' })
  firstName!: string;

  @Column({ type: 'text', name: 'last_name' })
  lastName!: string;

  @Column({
    type: 'text',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status!: UserStatus;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ type: 'integer', name: 'email_verified', default: 0 })
  emailVerified!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

export type UserSecureFields = 'passwordHash';
export type SecureUser = Omit<UserEntity, UserSecureFields>;

export function filterSecureUserProperties(user: UserEntity): SecureUser {
  const { passwordHash, ...secureUser } = user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void passwordHash; // Explicitly ignored for security
  return secureUser;
}
