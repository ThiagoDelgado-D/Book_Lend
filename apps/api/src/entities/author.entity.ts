import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('authors')
export class AuthorEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column({ type: 'text', name: 'first_name' })
  firstName!: string;

  @Column({ type: 'text', name: 'last_name' })
  lastName!: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'date', name: 'death_date', nullable: true })
  deathDate?: Date;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @Column({ type: 'text', nullable: true })
  nationality?: string;

  @Column({ type: 'boolean', name: 'is_popular', default: false })
  isPopular!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
