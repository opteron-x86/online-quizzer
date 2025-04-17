import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newInitialSeconds?: number) => void;
  restart: () => void;
}

/**
 * Custom hook for timer functionality
 * @param initialSeconds - The initial seconds for the timer
 * @param isCountDown - Whether the timer should count down or up
 * @param onTimeEnd - Callback function to execute when countdown reaches zero
 * @returns Timer control functions and state
 */
export const useTimer = (
  initialSeconds: number = 0,
  isCountDown: boolean = false,
  onTimeEnd?: () => void
): UseTimerReturn => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const initialSecondsRef = useRef<number>(initialSeconds);
  const intervalRef = useRef<number | null>(null);

  // Clear the interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update initialSecondsRef when initialSeconds changes
  useEffect(() => {
    initialSecondsRef.current = initialSeconds;
    if (!isRunning) {
      setSeconds(initialSeconds);
    }
  }, [initialSeconds, isRunning]);

  // Handle countdown reaching zero
  useEffect(() => {
    if (isCountDown && seconds === 0 && isRunning) {
      pause();
      if (onTimeEnd) {
        onTimeEnd();
      }
    }
  }, [seconds, isCountDown, isRunning, onTimeEnd]);

  const start = useCallback(() => {
    if (isRunning) return;
    
    // Don't start if countdown already at zero
    if (isCountDown && seconds === 0) return;
    
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      setSeconds(prevSeconds => {
        if (isCountDown) {
          // For countdown, decrement but not below zero
          return prevSeconds > 0 ? prevSeconds - 1 : 0;
        } else {
          // For countup, just increment
          return prevSeconds + 1;
        }
      });
    }, 1000);
  }, [isRunning, seconds, isCountDown]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback((newInitialSeconds?: number) => {
    pause();
    const resetValue = newInitialSeconds !== undefined 
      ? newInitialSeconds 
      : initialSecondsRef.current;
    setSeconds(resetValue);
    initialSecondsRef.current = resetValue;
  }, [pause]);

  const restart = useCallback(() => {
    reset();
    start();
  }, [reset, start]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    restart
  };
};

export default useTimer;