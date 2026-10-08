import { useEffect, useRef } from 'react';

export const useIdleTimer = (timeoutMinutes: number, onIdle: () => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Set new timeout
      timeoutRef.current = setTimeout(onIdle, timeoutMinutes * 60 * 1000);
    };

    // Events to track activity
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Attach event listeners
    events.forEach(e => window.addEventListener(e, handleActivity));

    // Initial setup
    handleActivity();

    return () => {
      // Cleanup
      events.forEach(e => window.removeEventListener(e, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeoutMinutes, onIdle]);
};
