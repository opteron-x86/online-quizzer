import React, { useEffect } from 'react';
import { Typography, useTheme, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatTime } from '../../utils/formatters';
import { useTimer } from '../../hooks/useTimer';

interface TimerProps {
  initialSeconds?: number;
  onTimeEnd?: () => void;
  isActive?: boolean;
  isCountDown?: boolean;
}

const Timer: React.FC<TimerProps> = ({ 
  initialSeconds = 0,
  onTimeEnd,
  isActive = true,
  isCountDown = false
}) => {
  const theme = useTheme();
  const { 
    seconds, 
    isRunning, 
    start, 
    pause, 
    // reset 
  } = useTimer(initialSeconds, isCountDown, onTimeEnd);

  useEffect(() => {
    if (isActive && !isRunning) {
      start();
    } else if (!isActive && isRunning) {
      pause();
    }
  }, [isActive, isRunning, start, pause]);

  // Format the time to display in MM:SS format
  const formattedTime = formatTime(seconds);

  // Calculate color for countdown timer
  const getTimerColor = () => {
    if (!isCountDown) return theme.palette.text.primary;
    
    const warningThreshold = initialSeconds * 0.25;
    if (seconds <= warningThreshold) {
      return theme.palette.error.main;
    } else if (seconds <= initialSeconds * 0.5) {
      return theme.palette.warning.main;
    }
    return theme.palette.success.main;
  };

  return (
    <Paper 
      elevation={1}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
      }}
    >
      <AccessTimeIcon color="action" />
      <Typography 
        variant="h6" 
        component="div"
        sx={{ 
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: getTimerColor(),
          minWidth: '80px',
          textAlign: 'center'
        }}
      >
        {formattedTime}
      </Typography>
    </Paper>
  );
};

export default Timer;