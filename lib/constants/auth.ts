/**
 * Auth-related constants
 */
import { generateDummyPassword } from '../db/utils';

// Regular expressions
export const guestRegex = /^guest-\d+$/;

// Authentication constants
export const DUMMY_PASSWORD = generateDummyPassword();

// Session-related constants
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
export const COOKIE_NAME = 'ai-chatbot-session';
