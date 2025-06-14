/**
 * Gets data from local storage with safe parsing
 * 
 * @param key - The storage key to retrieve
 * @returns The parsed value or empty array if not found
 */
export function getLocalStorage<T = any>(key: string): T {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [] as unknown as T;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return [] as unknown as T;
    }
  }
  return [] as unknown as T;
}

/**
 * Saves data to local storage with safe stringification
 * 
 * @param key - The storage key
 * @param data - The data to store
 */
export function setLocalStorage<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

/**
 * Removes an item from local storage
 * 
 * @param key - The storage key to remove
 */
export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
}
