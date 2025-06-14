import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 * Useful for conditional and dynamic class names in component props
 *
 * @param inputs - Class values to be merged
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
