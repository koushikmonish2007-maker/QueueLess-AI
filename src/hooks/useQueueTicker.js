import { useState, useEffect } from 'react';

/**
 * Custom hook for simulating queue intervals and ticker updates
 * 
 * @param {number} initialSeconds
 * @returns {{ seconds: number, formatted: string }}
 */
export function useQueueTicker(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : initialSeconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [initialSeconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return { seconds, formatted };
}
