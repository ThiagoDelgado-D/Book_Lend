import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  LOST = 'lost',
}

@Entity('books')
export class BookEntity extends BaseEntity {
  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', nullable: true })
  pages?: number;

  @Column({ type: 'text', nullable: true })
  publisher?: string;

  @Column({ type: 'date', name: 'published_date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'bigint', unique: true, nullable: true })
  isbn?: number;

  @Column({
    type: 'text',
    enum: BookStatus,
    default: BookStatus.AVAILABLE,
  })
  status!: BookStatus;

  @Column({ type: 'integer', default: 0 })
  totalLoans!: number;

  @Column({ type: 'boolean', default: false })
  isPopular!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  entryDate!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'text', name: 'author_id', nullable: true })
  authorId?: string;
}
