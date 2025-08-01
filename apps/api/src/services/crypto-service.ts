import { CryptoService, UUID } from 'app-domain';
import crypto from 'crypto';
import bcrypt, { compare } from 'bcrypt';

export class CryptoServiceImplementation implements CryptoService {
  async comparePassword(password: string, hashPass: string): Promise<boolean> {
    return await compare(password, hashPass);
  }
  async generateUUID(): Promise<UUID> {
    return crypto.randomUUID();
  }
  async generateRandomToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
