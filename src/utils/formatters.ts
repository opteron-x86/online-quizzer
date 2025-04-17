/**
 * Formats a number of seconds into a readable time string (MM:SS)
 * @param seconds - The number of seconds to format
 * @returns A string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  /**
   * Formats a date as a readable string
   * @param timestamp - The timestamp to format (milliseconds since epoch)
   * @returns A formatted date string
   */
  export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  /**
   * Formats a full datetime as a readable string
   * @param timestamp - The timestamp to format (milliseconds since epoch)
   * @returns A formatted datetime string
   */
  export const formatDateTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Formats a percentage value
   * @param value - The decimal value (e.g., 0.75)
   * @param decimalPlaces - Number of decimal places to show
   * @returns A formatted percentage string
   */
  export const formatPercentage = (value: number, decimalPlaces = 1): string => {
    return `${(value * 100).toFixed(decimalPlaces)}%`;
  };
  
  /**
   * Formats a duration between two timestamps
   * @param startTime - Start timestamp (milliseconds)
   * @param endTime - End timestamp (milliseconds)
   * @returns A formatted duration string
   */
  export const formatDuration = (startTime: number, endTime: number): string => {
    const durationMs = endTime - startTime;
    const seconds = Math.floor(durationMs / 1000);
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let result = '';
    
    if (hours > 0) {
      result += `${hours}h `;
    }
    
    if (minutes > 0 || hours > 0) {
      result += `${minutes}m `;
    }
    
    result += `${remainingSeconds}s`;
    
    return result.trim();
  };
  
  /**
   * Truncates text to a specified length with ellipsis
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns The truncated text
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  };
  
  export default {
    formatTime,
    formatDate,
    formatDateTime,
    formatPercentage,
    formatDuration,
    truncateText
  };