import { useEffect, useRef, useCallback } from 'react';

interface FocusManagerOptions {
  onFocus?: () => void;
  onBlur?: () => void;
  throttleMs?: number;
  enabled?: boolean;
}

/**
 * Hook to manage window focus events and prevent excessive API calls
 * when users switch between tabs/windows
 */
export const useFocusManager = ({
  onFocus,
  onBlur,
  throttleMs = 2000,
  enabled = true
}: FocusManagerOptions = {}) => {
  const lastFocusTime = useRef<number>(0);
  const isFocused = useRef<boolean>(true);

  const handleFocus = useCallback(() => {
    if (!enabled) return;
    
    const now = Date.now();
    const timeSinceLastFocus = now - lastFocusTime.current;
    
    // Only trigger if enough time has passed (throttling)
    if (timeSinceLastFocus >= throttleMs) {
      console.log('[FOCUS] Window focused, triggering callbacks');
      lastFocusTime.current = now;
      isFocused.current = true;
      onFocus?.();
    } else {
      console.log('[FOCUS] Window focus throttled, skipping callbacks');
    }
  }, [onFocus, throttleMs, enabled]);

  const handleBlur = useCallback(() => {
    if (!enabled) return;
    
    console.log('[FOCUS] Window blurred');
    isFocused.current = false;
    onBlur?.();
  }, [onBlur, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // Set initial focus state
    isFocused.current = document.hasFocus();

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleFocus, handleBlur, enabled]);

  return {
    isFocused: isFocused.current,
    lastFocusTime: lastFocusTime.current
  };
};