import { describe, expect, test } from 'vitest';
import { trimOrDefault, trimOrNull } from './index';

describe('String Utils', () => {
  describe('trimOrNull', () => {
    test('should return trimmed string for valid input', () => {
      expect(trimOrNull('  test  ')).toBe('test');
      expect(trimOrNull('test')).toBe('test');
      expect(trimOrNull(' hello world ')).toBe('hello world');
    });

    test('should return null for empty or whitespace input', () => {
      expect(trimOrNull('')).toBeNull();
      expect(trimOrNull('   ')).toBeNull();
      expect(trimOrNull('\t\n')).toBeNull();
      expect(trimOrNull(null)).toBeNull();
      expect(trimOrNull(undefined)).toBeNull();
    });

    test('should handle special characters', () => {
      expect(trimOrNull('  @#$%  ')).toBe('@#$%');
      expect(trimOrNull(' 123 ')).toBe('123');
    });
  });

  describe('trimOrDefault', () => {
    test('should return trimmed string for valid input', () => {
      expect(trimOrDefault('  test  ', 'default')).toBe('test');
      expect(trimOrDefault('test', 'default')).toBe('test');
      expect(trimOrDefault(' hello world ', 'fallback')).toBe('hello world');
    });

    test('should return default for empty or whitespace input', () => {
      expect(trimOrDefault('', 'default')).toBe('default');
      expect(trimOrDefault('   ', 'default')).toBe('default');
      expect(trimOrDefault('\t\n', 'fallback')).toBe('fallback');
      expect(trimOrDefault(null, 'default')).toBe('default');
      expect(trimOrDefault(undefined, 'default')).toBe('default');
    });

    test('should handle different default values', () => {
      expect(trimOrDefault('', 'N/A')).toBe('N/A');
      expect(trimOrDefault(null, 'Unknown')).toBe('Unknown');
      expect(trimOrDefault(undefined, '')).toBe('');
    });

    test('should handle special characters in input and default', () => {
      expect(trimOrDefault('  @#$%  ', 'default')).toBe('@#$%');
      expect(trimOrDefault('', '@#$%')).toBe('@#$%');
    });
  });
});
