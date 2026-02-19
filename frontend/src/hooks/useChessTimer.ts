import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerOptions {
  initialTime: number;
  increment: number;
  onTimeUp: (loserColor: 'w' | 'b') => void;
}

export const useChessTimer = (
  gameStarted: boolean,
  currentTurn: 'w' | 'b',
  isGameOver: boolean,
  options: TimerOptions
) => {
  const [whiteTime, setWhiteTime] = useState(options.initialTime);
  const [blackTime, setBlackTime] = useState(options.initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = useCallback(() => {
    setWhiteTime(options.initialTime);
    setBlackTime(options.initialTime);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [options.initialTime]);
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    if (currentTurn === 'b') {
      setWhiteTime((prev) => prev + options.increment);
    } else {
      setBlackTime((prev) => prev + options.increment);
    }
  }, [currentTurn, gameStarted, options.increment]); 

  useEffect(() => {
    if (!gameStarted || isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            options.onTimeUp('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            options.onTimeUp('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, currentTurn, isGameOver, options.onTimeUp]); 

  return { whiteTime, blackTime, resetTimers };
};