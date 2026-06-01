import { describe, it, expect } from 'vitest';
import { validateEmail, getPasswordStrength } from './validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
    });

    it('should return invalid for malformed email', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Enter a valid email address');
    });

    it('should return valid for correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return 0 for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.score).toBe(0);
    });

    it('should return weak for short password', () => {
      const result = getPasswordStrength('123');
      expect(result.label).toBe('Weak');
    });

    it('should return strong for complex password', () => {
      const result = getPasswordStrength('StrongP@ss123');
      expect(result.score).toBeGreaterThanOrEqual(4);
    });
  });
});
