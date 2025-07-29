import { CryptoService } from '../crypto-service';
import { UUID } from '../../types/uuid';

export function mockCryptoService(): CryptoService {
  return {
    async generateUUID(): Promise<UUID> {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as UUID;
    },
    async generateRandomToken(): Promise<string> {
      return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    },

    async hashPassword(password: string): Promise<string> {
      return `[HASHED]${password}`;
    },

    async comparePassword(password: string, hashPass: string): Promise<boolean> {
      return `[HASHED]${password}` === hashPass;
    },
  };
}
