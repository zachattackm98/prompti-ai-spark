import { useState, useRef, useCallback } from 'react';

/**
 * Hook that provides stable state management with optimistic updates
 * and prevents unnecessary re-renders
 */
export function useStableState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const lastUpdateRef = useRef<number>(0);
  const stableValueRef = useRef<T>(initialValue);

  const setStableState = useCallback((newValue: T | ((prev: T) => T)) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    // Throttle rapid updates (less than 100ms apart)
    if (timeSinceLastUpdate < 100) {
      console.log('[STABLE_STATE] Throttling rapid update');
      return;
    }
    
    const resolvedValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(stableValueRef.current)
      : newValue;
    
    // Only update if value actually changed
    if (JSON.stringify(resolvedValue) !== JSON.stringify(stableValueRef.current)) {
      console.log('[STABLE_STATE] State updated');
      stableValueRef.current = resolvedValue;
      setState(resolvedValue);
      lastUpdateRef.current = now;
    } else {
      console.log('[STABLE_STATE] Same value, skipping update');
    }
  }, []);

  const resetState = useCallback(() => {
    stableValueRef.current = initialValue;
    setState(initialValue);
    lastUpdateRef.current = 0;
  }, [initialValue]);

  return [state, setStableState, resetState] as const;
}