
import { useEffect, useCallback } from 'react';

export const useWindowFocus = () => {
  const handleFocus = useCallback(() => {
    console.log('[WINDOW-FOCUS] Window gained focus - maintaining current state');
    // Prevent any actions that might cause reloads
    // Just log for debugging purposes
  }, []);

  const handleBlur = useCallback(() => {
    console.log('[WINDOW-FOCUS] Window lost focus');
  }, []);

  useEffect(() => {
    // Add window focus/blur listeners to monitor tab switching
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Also listen for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[WINDOW-FOCUS] Tab became visible - maintaining state');
      } else {
        console.log('[WINDOW-FOCUS] Tab became hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleFocus, handleBlur]);
};
