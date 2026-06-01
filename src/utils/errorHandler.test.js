import { describe, it, expect } from 'vitest';
import { getFriendlyErrorMessage } from './errorHandler';

describe('errorHandler - getFriendlyErrorMessage', () => {
  it('should return default message for null/undefined error', () => {
    expect(getFriendlyErrorMessage(null)).toBe('An unexpected error occurred.');
    expect(getFriendlyErrorMessage(undefined)).toBe('An unexpected error occurred.');
  });

  it('should handle invalid login credentials', () => {
    const error = { message: 'Invalid login credentials' };
    expect(getFriendlyErrorMessage(error)).toBe('The email or password you entered is incorrect.');
  });

  it('should handle existing user registration', () => {
    const error = { message: 'User already registered' };
    expect(getFriendlyErrorMessage(error)).toBe('An account with this email already exists.');
  });

  it('should handle rate limit errors', () => {
    const error = { message: 'Rate limit exceeded: 429' };
    expect(getFriendlyErrorMessage(error)).toBe('AI generation limit reached for this hour. Please try again shortly.');
  });

  it('should handle network fetch errors', () => {
    const error = { message: 'Failed to fetch' };
    expect(getFriendlyErrorMessage(error)).toBe('Connection lost. Please check your internet and try again.');
  });

  it('should handle safety/content filter errors from Gemini', () => {
    const error = { message: 'Candidate was blocked due to safety' };
    expect(getFriendlyErrorMessage(error)).toBe('The AI was unable to generate a response for this prompt due to safety guidelines. Try rephrasing.');
  });

  it('should return the original message if no mapping is found', () => {
    const error = { message: 'Something totally unique happened' };
    expect(getFriendlyErrorMessage(error)).toBe('Something totally unique happened');
  });
});
