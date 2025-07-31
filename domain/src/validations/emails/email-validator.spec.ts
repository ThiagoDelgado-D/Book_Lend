import { describe, expect, test } from 'vitest';
import { isValidEmail, validateAndNormalizeEmail } from './email-validator';

describe('Email Validator', () => {
  describe('isValidEmail', () => {
    test('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('admin+tag@example.org')).toBe(true);
      expect(isValidEmail('test123@test-domain.com')).toBe(true);
    });

    test('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('test..test@example.com')).toBe(false);
      expect(isValidEmail('test@example..com')).toBe(false);
    });

    test('should return false for empty or whitespace', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
    });
  });

  describe('validateAndNormalizeEmail', () => {
    test('should return null for empty or null inputs', () => {
      expect(validateAndNormalizeEmail('')).toBeNull();
      expect(validateAndNormalizeEmail(null)).toBeNull();
      expect(validateAndNormalizeEmail(undefined)).toBeNull();
      expect(validateAndNormalizeEmail('   ')).toBeNull();
    });

    test('should return trimmed valid email', () => {
      expect(validateAndNormalizeEmail('  test@example.com  ')).toBe('test@example.com');
      expect(validateAndNormalizeEmail('user@domain.co.uk')).toBe('user@domain.co.uk');
    });

    test('should throw error for invalid email format', () => {
      expect(() => validateAndNormalizeEmail('invalid-email')).toThrow('Invalid email format');
      expect(() => validateAndNormalizeEmail('test@')).toThrow('Invalid email format');
      expect(() => validateAndNormalizeEmail('@example.com')).toThrow('Invalid email format');
      expect(() => validateAndNormalizeEmail('  invalid-email  ')).toThrow('Invalid email format');
    });

    test('should handle edge cases', () => {
      expect(() => validateAndNormalizeEmail('test@example')).toThrow('Invalid email format');
      expect(() => validateAndNormalizeEmail('test@.com')).toThrow('Invalid email format');
    });
  });
});
