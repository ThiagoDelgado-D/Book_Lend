import { PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn('varchar')
  id!: string;
}
