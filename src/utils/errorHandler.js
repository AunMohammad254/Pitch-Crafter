/**
 * Centralized error handler to transform technical errors into user-friendly messages.
 */

export class AppError extends Error {
  constructor(message, code, isOperational = true) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;
  }
}

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  API_LIMIT_REACHED: 'API_LIMIT_REACHED',
  DB_WRITE_FAILED: 'DB_WRITE_WRITE_FAILED',
  GENINI_RESPONSE_ERROR: 'GEMINI_RESPONSE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

export function getFriendlyErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';

  const message = error.message || '';

  // Auth Errors
  if (message.includes('Invalid login credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists.';
  }

  // API Errors
  if (message.includes('rate limit')) {
    return 'AI generation limit reached for this hour. Please try again shortly.';
  }
  if (message.includes('API key')) {
    return 'Server configuration error. Please contact support.';
  }

  // Network Errors
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network connection lost. Please check your internet.';
  }

  return message || 'Something went wrong. Please try again.';
}

export function handleError(error, context = '') {
  const friendlyMessage = getFriendlyErrorMessage(error);
  console.error(`[Error Context: ${context}]`, error);
  return friendlyMessage;
}
