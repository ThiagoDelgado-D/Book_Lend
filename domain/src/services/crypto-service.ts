import type { UUID } from 'src/types/uuid';

export interface CryptoService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashPass: string): Promise<boolean>;
  generateUUID(): Promise<UUID>;
}
