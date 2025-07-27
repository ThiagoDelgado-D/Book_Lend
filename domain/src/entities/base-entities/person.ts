import { Email } from '../../types/email.js';

export interface Person {
  firstName: string;
  lastName: string;
  email?: Email | null;
  phoneNumber?: string | null;
}
