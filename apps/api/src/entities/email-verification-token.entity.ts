import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_verification_tokens')
export class EmailVerificationTokenEntity {
  @PrimaryColumn('text')
  id!: string;

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
