import { describe, expect, test } from 'vitest';
import { validateBirthDeathDates } from './date-validator';

describe('Date Validator', () => {
  describe('validateBirthDeathDates', () => {
    test('should return success when death date is after birth date', () => {
      const birthDate = new Date('1980-01-01');
      const deathDate = new Date('2020-01-01');

      const result = validateBirthDeathDates(birthDate, deathDate);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Dates are valid');
    });

    test('should return success when death date is null', () => {
      const birthDate = new Date('1980-01-01');

      const result = validateBirthDeathDates(birthDate, null);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Dates are valid');
    });

    test('should return failure when death date is before birth date', () => {
      const birthDate = new Date('1980-01-01');
      const deathDate = new Date('1970-01-01');

      const result = validateBirthDeathDates(birthDate, deathDate);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Death date must be after birth date');
    });

    test('should return failure when death date equals birth date', () => {
      const date = new Date('1980-01-01');
      const result = validateBirthDeathDates(date, new Date(date.getTime()));

      expect(result.success).toBe(false);
      expect(result.message).toBe('Death date must be after birth date');
    });

    test('should handle dates with time components', () => {
      const birthDate = new Date('1980-01-01T10:00:00');
      const deathDate = new Date('1980-01-01T09:00:00');

      const result = validateBirthDeathDates(birthDate, deathDate);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Death date must be after birth date');
    });
  });
});
