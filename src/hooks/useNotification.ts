import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  hideNotification: () => void;
}

/**
 * Custom hook for managing notification states
 * @returns Object with notification state and control functions
 */
export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    type: 'info',
    duration: 6000
  });

  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 6000
  ) => {
    setNotification({
      open: true,
      message,
      type,
      duration
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
};

export default useNotification;