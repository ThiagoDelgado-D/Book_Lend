import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @Column('varchar', { length: 255 })
  firstName!: string;

  @Column('varchar', { length: 255 })
  lastName!: string;

  @Column('varchar', { length: 320, nullable: true })
  email?: string | null;

  @Column('varchar', { length: 20, nullable: true })
  phoneNumber?: string | null;

  @Column('text')
  biography!: string;

  @Column('varchar', { length: 100 })
  nationality!: string;

  @Column('date')
  birthDate!: Date;

  @Column('date', { nullable: true })
  deathDate?: Date | null;

  @Column('boolean', { default: false })
  isPopular!: boolean;
}
