/**
 * Centralized error handler to transform technical errors into user-friendly messages.
 */

export class AppError extends Error {
  code: string;
  isOperational: boolean;

  constructor(message: string, code: string, isOperational = true) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  API_LIMIT_REACHED: 'API_LIMIT_REACHED',
  DB_WRITE_FAILED: 'DB_WRITE_FAILED',
  GEMINI_RESPONSE_ERROR: 'GEMINI_RESPONSE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';

  const message = (error.message || '').toLowerCase();

  // Auth Errors
  if (message.includes('invalid login credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }

  // API Errors
  if (message.includes('rate limit') || message.includes('429')) {
    return 'AI generation limit reached for this hour. Please try again shortly.';
  }
  if (message.includes('api key') || message.includes('unauthorized')) {
    return 'Authentication failed. Please sign in again or contact support.';
  }
  if (message.includes('safety') || message.includes('candidate')) {
    return 'The AI was unable to generate a response for this prompt due to safety guidelines. Try rephrasing.';
  }

  // Network Errors
  if (message.includes('fetch') || message.includes('network') || message.includes('failed to fetch')) {
    return 'Connection lost. Please check your internet and try again.';
  }

  // Database Errors
  if (message.includes('permission denied') || message.includes('rls')) {
    return 'You do not have permission to perform this action.';
  }

  return error.message || 'Something went wrong. Please try again.';
}

export function handleError(error: any, context = ''): string {
  const friendlyMessage = getFriendlyErrorMessage(error);
  console.error(`[Error Context: ${context}]`, error);
  return friendlyMessage;
}
