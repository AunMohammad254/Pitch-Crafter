import { describe, it, expect } from 'vitest';
import { TIMEOUTS, VALIDATION, ROUTES, MODELS } from './constants';

describe('Constants', () => {
  it('should have notification timeout', () => {
    expect(TIMEOUTS.NOTIFICATION).toBe(4000);
  });

  it('should have validation min length for API key', () => {
    expect(VALIDATION.API_KEY_MIN_LENGTH).toBe(35);
  });

  it('should have correct home route', () => {
    expect(ROUTES.HOME).toBe('home');
  });

  it('should have flash model ID', () => {
    expect(MODELS.FLASH).toBe('gemini-2.5-flash');
  });
});
