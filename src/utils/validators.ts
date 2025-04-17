/**
 * Validates if a value is not empty (null, undefined, empty string, empty array)
 * @param value - The value to check
 * @returns True if the value is not empty
 */
export const isNotEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) {
      return false;
    }
    
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    return true;
  };
  
  /**
   * Validates if the value is in a range
   * @param value - The value to check
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   * @returns True if the value is within the range
   */
  export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  };
  
  /**
   * Validates if a string is a valid email address
   * @param email - The email address to validate
   * @returns True if the email is valid
   */
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates if two values are equal
   * @param value1 - The first value
   * @param value2 - The second value
   * @returns True if the values are equal
   */
  export const areEqual = (value1: unknown, value2: unknown): boolean => {
    return value1 === value2;
  };
  
  /**
   * Validates if a value is a valid URL
   * @param url - The URL to validate
   * @returns True if the URL is valid
   */
  export const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  /**
   * Validates if a string has a minimum length
   * @param value - The string to check
   * @param minLength - The minimum length required
   * @returns True if the string is at least the minimum length
   */
  export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  };
  
  /**
   * Validates if a string has a maximum length
   * @param value - The string to check
   * @param maxLength - The maximum length allowed
   * @returns True if the string doesn't exceed the maximum length
   */
  export const hasMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  };
  
  /**
   * Checks if all required quiz settings are configured
   * @param settings - The quiz settings object
   * @returns True if settings are valid
   */
  export const areQuizSettingsValid = (settings: {
    numberOfQuestions: number;
    timeLimit: number;
  }): boolean => {
    if (!isInRange(settings.numberOfQuestions, 1, 100)) {
      return false;
    }
    
    if (!isInRange(settings.timeLimit, 0, 180)) {
      return false;
    }
    
    return true;
  };
  
  export default {
    isNotEmpty,
    isInRange,
    isValidEmail,
    areEqual,
    isValidUrl,
    hasMinLength,
    hasMaxLength,
    areQuizSettingsValid
  };