/**
 * @fileoverview Error handling system for the AI chatbot application
 * This module defines error types, surfaces, and handling mechanisms
 * for consistent error management throughout the application.
 */

/**
 * Types of errors that can occur in the application
 * Maps to standard HTTP status codes
 */
export type ErrorType =
  | 'bad_request'   // 400
  | 'unauthorized'  // 401
  | 'forbidden'     // 403
  | 'not_found'     // 404
  | 'rate_limit'    // 429
  | 'offline';      // 503

/**
 * Application surfaces where errors can originate
 * Helps with categorizing and routing error handling
 */
export type Surface =
  | 'chat'
  | 'auth'
  | 'api'
  | 'stream'
  | 'database'
  | 'history'
  | 'vote'
  | 'document'
  | 'suggestions';

/**
 * Combined error code using type and surface
 * Example: 'not_found:chat' or 'unauthorized:auth'
 */
export type ErrorCode = `${ErrorType}:${Surface}`;

/**
 * Error visibility level determines how errors are presented
 * - response: Send to client
 * - log: Only log on server
 * - none: Silently ignore
 */
export type ErrorVisibility = 'response' | 'log' | 'none';

/**
 * Maps application surfaces to visibility levels
 * Determines how errors from each surface should be handled
 */
export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  database: 'log',      // Database errors are logged only
  chat: 'response',     // Chat errors are sent to the client
  auth: 'response',     
  stream: 'response',
  api: 'response',
  history: 'response',
  vote: 'response',
  document: 'response',
  suggestions: 'response',
};

/**
 * Main error class for the ChatSDK
 * Provides standardized error handling and response formatting
 */
export class ChatSDKError extends Error {
  /** Type of error (maps to HTTP status) */
  public type: ErrorType;
  
  /** Surface where the error occurred */
  public surface: Surface;
  
  /** HTTP status code */
  public statusCode: number;

  /**
   * Creates a new ChatSDKError
   * @param errorCode - Combined error type and surface (e.g. 'not_found:chat')
   * @param cause - Optional additional context about the error
   */
  constructor(errorCode: ErrorCode, cause?: string) {
    super();

    const [type, surface] = errorCode.split(':');

    this.type = type as ErrorType;
    this.cause = cause;
    this.surface = surface as Surface;
    this.message = getMessageByErrorCode(errorCode);
    this.statusCode = getStatusCodeByType(this.type);
  }

  /**
   * Converts the error to a Response object based on visibility settings
   * @returns Response object with appropriate status and body
   */
  public toResponse(): Response {
    const code: ErrorCode = `${this.type}:${this.surface}`;
    const visibility = visibilityBySurface[this.surface];

    const { message, cause, statusCode } = this;

    // For log-only errors, don't expose details to client
    if (visibility === 'log') {
      console.error({
        code,
        message,
        cause,
      });

      return Response.json(
        { code: '', message: 'Something went wrong. Please try again later.' },
        { status: statusCode },
      );
    }

    return Response.json({ code, message, cause }, { status: statusCode });
  }
}

/**
 * Maps error codes to human-readable messages
 * @param errorCode - The error code to get a message for
 * @returns A user-friendly error message
 */
export function getMessageByErrorCode(errorCode: ErrorCode): string {
  // Handle all database errors with a generic message
  if (errorCode.includes('database')) {
    return 'An error occurred while executing a database query.';
  }

  switch (errorCode) {
    // API errors
    case 'bad_request:api':
      return "The request couldn't be processed. Please check your input and try again.";

    // Auth errors
    case 'unauthorized:auth':
      return 'You need to sign in before continuing.';
    case 'forbidden:auth':
      return 'Your account does not have access to this feature.';

    // Chat errors
    case 'rate_limit:chat':
      return 'You have exceeded your maximum number of messages for the day. Please try again later.';
    case 'not_found:chat':
      return 'The requested chat was not found. Please check the chat ID and try again.';
    case 'forbidden:chat':
      return 'This chat belongs to another user. Please check the chat ID and try again.';
    case 'unauthorized:chat':
      return 'You need to sign in to view this chat. Please sign in and try again.';
    case 'offline:chat':
      return "We're having trouble sending your message. Please check your internet connection and try again.";

    // Document errors
    case 'not_found:document':
      return 'The requested document was not found. Please check the document ID and try again.';
    case 'forbidden:document':
      return 'This document belongs to another user. Please check the document ID and try again.';
    case 'unauthorized:document':
      return 'You need to sign in to view this document. Please sign in and try again.';
    case 'bad_request:document':
      return 'The request to create or update the document was invalid. Please check your input and try again.';

    // Default fallback
    default:
      return 'Something went wrong. Please try again later.';
  }
}

/**
 * Maps error types to HTTP status codes
 * @param type - The error type
 * @returns The corresponding HTTP status code
 */
function getStatusCodeByType(type: ErrorType): number {
  switch (type) {
    case 'bad_request':
      return 400;
    case 'unauthorized':
      return 401;
    case 'forbidden':
      return 403;
    case 'not_found':
      return 404;
    case 'rate_limit':
      return 429;
    case 'offline':
      return 503;
    default:
      return 500;
  }
}
