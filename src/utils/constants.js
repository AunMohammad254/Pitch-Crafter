// src/utils/constants.js

export const TIMEOUTS = {
  NOTIFICATION: 4000,
  NOTIFICATION_LONG: 6000,
  API_REQUEST: 30000,
  DEBOUNCE: 300,
};

export const VALIDATION = {
  API_KEY_MIN_LENGTH: 35,
  PROMPT_MIN_LENGTH: 50,
  PROMPT_MAX_LENGTH: 5000,
};

export const ROUTES = {
  HOME: 'home',
  AUTH: 'auth',
  GENERATE: 'generate',
  HISTORY: 'history',
  INVESTOR_CHAT: 'investor-chat',
  PITCH_PRACTICE: 'pitch-practice',
};

export const MODELS = {
  AUTO: 'auto',
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-2.5-pro',
};
