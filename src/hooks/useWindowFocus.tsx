
import { useEffect, useCallback, useRef } from 'react';

export const useWindowFocus = () => {
  // Track focus state to prevent duplicate handling
  const lastFocusStateRef = useRef<boolean>(true);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFocus = useCallback(() => {
    // Clear any pending timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    // Only log if we were previously unfocused
    if (!lastFocusStateRef.current) {
      console.log('[WINDOW-FOCUS] Window gained focus - maintaining current state');
      lastFocusStateRef.current = true;
    }
    
    // Prevent any actions that might cause reloads
    // Just log for debugging purposes
  }, []);

  const handleBlur = useCallback(() => {
    // Use a short timeout to prevent flickering between focus/blur events
    focusTimeoutRef.current = setTimeout(() => {
      if (lastFocusStateRef.current) {
        console.log('[WINDOW-FOCUS] Window lost focus');
        lastFocusStateRef.current = false;
      }
    }, 100);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    // Clear any pending timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    if (document.visibilityState === 'visible') {
      if (!lastFocusStateRef.current) {
        console.log('[WINDOW-FOCUS] Tab became visible - maintaining state');
        lastFocusStateRef.current = true;
      }
    } else {
      // Use timeout for visibility change as well
      focusTimeoutRef.current = setTimeout(() => {
        if (lastFocusStateRef.current) {
          console.log('[WINDOW-FOCUS] Tab became hidden');
          lastFocusStateRef.current = false;
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    // Add window focus/blur listeners to monitor tab switching
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Also listen for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Clear timeout on cleanup
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleFocus, handleBlur, handleVisibilityChange]);
};
