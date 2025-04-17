/**
 * Service for handling local storage operations
 */
export const storageService = {
    /**
     * Saves data to localStorage
     * @param key - The key to store the data under
     * @param data - The data to store
     */
    saveData: <T>(key: string, data: T): void => {
      try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
      } catch (error) {
        console.error(`Error saving to localStorage (key: ${key}):`, error);
      }
    },
    
    /**
     * Retrieves data from localStorage
     * @param key - The key to retrieve data from
     * @param defaultValue - Default value if key doesn't exist
     * @returns The retrieved data or defaultValue if not found
     */
    getData: <T>(key: string, defaultValue: T): T => {
      try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
          return defaultValue;
        }
        return JSON.parse(serializedData) as T;
      } catch (error) {
        console.error(`Error retrieving from localStorage (key: ${key}):`, error);
        return defaultValue;
      }
    },
    
    /**
     * Removes data from localStorage
     * @param key - The key to remove
     */
    removeData: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from localStorage (key: ${key}):`, error);
      }
    },
    
    /**
     * Clears all data from localStorage
     */
    clearAll: (): void => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
    
    /**
     * Checks if a key exists in localStorage
     * @param key - The key to check
     * @returns True if the key exists
     */
    hasKey: (key: string): boolean => {
      return localStorage.getItem(key) !== null;
    },
    
    /**
     * Gets the total size of localStorage in use
     * @returns Size in bytes
     */
    getStorageSize: (): number => {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      }
      return total * 2; // Approximate size in bytes (UTF-16 characters are 2 bytes)
    },
    
    /**
     * Gets all keys in localStorage
     * @returns Array of keys
     */
    getAllKeys: (): string[] => {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    }
  };
  
  export default storageService;