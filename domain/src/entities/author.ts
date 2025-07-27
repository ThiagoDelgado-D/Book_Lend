import { Entity, Person } from './base-entities';

export interface Author extends Entity, Person {
  biography: string;
  nationality: string;
  birthDate: Date;
  deathDate: Date | null;
  isPopular: boolean;
}
