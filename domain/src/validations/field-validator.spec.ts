import { describe, expect, test } from 'vitest';
import { validateRequiredField, validateRequiredFields } from './field-validator';

describe('Field Validator', () => {
  describe('validateRequiredField', () => {
    test('should return success for valid non-empty string', () => {
      const result = validateRequiredField('Valid Value', 'Test Field');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Field is valid');
    });

    test('should return success for string with leading/trailing spaces', () => {
      const result = validateRequiredField('  Valid Value  ', 'Test Field');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Field is valid');
    });

    test('should return failure for empty string', () => {
      const result = validateRequiredField('', 'Test Field');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Field is required');
    });

    test('should return failure for whitespace only string', () => {
      const result = validateRequiredField('   ', 'Test Field');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Field is required');
    });

    test('should return failure for null', () => {
      const result = validateRequiredField(null, 'Test Field');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Field is required');
    });

    test('should return failure for undefined', () => {
      const result = validateRequiredField(undefined, 'Test Field');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Field is required');
    });

    test('should work with different field names', () => {
      const result = validateRequiredField('', 'First Name');

      expect(result.success).toBe(false);
      expect(result.message).toBe('First Name is required');
    });
  });

  describe('validateRequiredFields', () => {
    test('should return success when all fields are valid', () => {
      const fields = [
        { value: 'Value 1', name: 'Field 1' },
        { value: 'Value 2', name: 'Field 2' },
        { value: 'Value 3', name: 'Field 3' },
      ];

      const result = validateRequiredFields(fields);

      expect(result.success).toBe(true);
      expect(result.message).toBe('All fields are valid');
    });

    test('should return success for empty array', () => {
      const result = validateRequiredFields([]);

      expect(result.success).toBe(true);
      expect(result.message).toBe('All fields are valid');
    });

    test('should return failure on first invalid field', () => {
      const fields = [
        { value: 'Value 1', name: 'Field 1' },
        { value: '', name: 'Field 2' },
        { value: 'Value 3', name: 'Field 3' },
      ];

      const result = validateRequiredFields(fields);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Field 2 is required');
    });

    test('should return failure on first invalid field with null', () => {
      const fields = [
        { value: 'Value 1', name: 'First Name' },
        { value: null, name: 'Last Name' },
        { value: 'Value 3', name: 'Biography' },
      ];

      const result = validateRequiredFields(fields);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Last Name is required');
    });

    test('should handle mixed valid and invalid fields', () => {
      const fields = [
        { value: '  Valid Value  ', name: 'Field 1' },
        { value: '   ', name: 'Field 2' },
      ];

      const result = validateRequiredFields(fields);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Field 2 is required');
    });
  });
});
