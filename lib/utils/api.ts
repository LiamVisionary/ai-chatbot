import { ChatSDKError, type ErrorCode } from '../errors';
import { ApiResponse } from '../types';

/**
 * Fetches data from an API with proper error handling
 * 
 * @param url - The URL to fetch from
 * @returns Promise with the parsed JSON response
 */
export const fetcher = async <T = any>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatSDKError(code as ErrorCode, cause);
  }

  return response.json();
};

/**
 * Extended fetch with better error handling for network issues
 * 
 * @param input - Request info or URL
 * @param init - Request init options
 * @returns Response object
 */
export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatSDKError('offline:chat');
    }

    throw error;
  }
}

/**
 * Creates a standardized API response
 * 
 * @param data - The data to include in the response
 * @param status - HTTP status code
 * @returns Standardized API response object
 */
export function createApiResponse<T>(data: T, status = 200): ApiResponse<T> {
  return {
    data,
    status
  };
}

/**
 * Creates an error API response
 * 
 * @param error - Error message
 * @param status - HTTP status code
 * @returns Standardized API error response
 */
export function createApiErrorResponse(error: string, status = 400): ApiResponse<undefined> {
  return {
    error,
    status
  };
}
