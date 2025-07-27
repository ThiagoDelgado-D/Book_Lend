import { Entity } from './base-entities/entity.js';

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  LOST = 'lost',
}

export interface Book extends Entity {
  title: string;
  ISBN: number;
  pages: number;
  publicationDate: Date;
  publisher: string;
  status: BookStatus;
  totalLoans: number;
  isPopular: boolean;
  entryDate: Date;
}
