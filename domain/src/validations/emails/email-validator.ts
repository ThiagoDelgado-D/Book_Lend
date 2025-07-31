import { Email } from '../../types/email';

export const isValidEmail = (email: string): email is Email => {
  const emailRegex = /^[^\s@]+(?:\.[^\s@]+)*@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) return false;

  const [local, domain] = email.split('@');
  if (!local || !domain) return false;

  if (local.includes('..') || domain.includes('..')) return false;

  return true;
};

export const validateAndNormalizeEmail = (email?: string | null): Email | null => {
  if (!email) return null;

  const trimmedEmail = email.trim();
  if (!trimmedEmail) return null;

  if (!isValidEmail(trimmedEmail)) {
    throw new Error('Invalid email format');
  }

  return trimmedEmail as Email;
};
