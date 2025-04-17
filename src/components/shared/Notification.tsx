import React from 'react';
import { Snackbar, Alert, AlertProps, SnackbarProps } from '@mui/material';
import { NotificationType } from '../hooks/useNotification';

interface NotificationProps {
  open: boolean;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
  anchorOrigin?: SnackbarProps['anchorOrigin'];
  action?: React.ReactNode;
}

/**
 * Reusable notification component for displaying alerts and messages
 */
const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  type = 'info',
  duration = 6000,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  action
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      action={action}
    >
      <Alert 
        onClose={onClose} 
        severity={type} 
        sx={{ width: '100%' }}
        variant="filled"
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;