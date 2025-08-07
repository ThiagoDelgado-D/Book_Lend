import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('email_verification_tokens')
export class EmailVerificationTokenEntity extends BaseEntity {
  @Column({ type: 'text', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text', unique: true })
  token!: string;

  @Column({ type: 'datetime', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'integer', default: 0 })
  used!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
