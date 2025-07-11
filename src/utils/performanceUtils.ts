/**
 * Performance utilities to prevent excessive API calls and optimize user experience
 */

// Cache for tracking recent API calls
const apiCallCache = new Map<string, number>();

/**
 * Debounce function to prevent rapid successive calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle API calls to prevent excessive requests
 */
export function throttleApiCall(key: string, minInterval: number = 2000): boolean {
  const now = Date.now();
  const lastCall = apiCallCache.get(key);
  
  if (!lastCall || now - lastCall >= minInterval) {
    apiCallCache.set(key, now);
    return true; // Allow the call
  }
  
  console.log(`[PERFORMANCE] API call throttled: ${key}`);
  return false; // Block the call
}

/**
 * Clear throttle cache for a specific key
 */
export function clearThrottle(key: string): void {
  apiCallCache.delete(key);
}

/**
 * Clear all throttle cache
 */
export function clearAllThrottles(): void {
  apiCallCache.clear();
}

/**
 * Check if we're in a focus state that should prevent API calls
 */
export function shouldPreventApiCall(): boolean {
  // Don't make API calls if the page is hidden or the user is navigating
  return document.hidden || 
         performance.navigation?.type === performance.navigation.TYPE_BACK_FORWARD;
}

/**
 * Optimized state comparison to prevent unnecessary updates
 */
export function isStateEqual<T>(oldState: T, newState: T): boolean {
  if (oldState === newState) return true;
  
  // For objects, do a shallow comparison
  if (typeof oldState === 'object' && typeof newState === 'object') {
    if (oldState === null || newState === null) return oldState === newState;
    
    const oldKeys = Object.keys(oldState);
    const newKeys = Object.keys(newState);
    
    if (oldKeys.length !== newKeys.length) return false;
    
    return oldKeys.every(key => 
      (oldState as any)[key] === (newState as any)[key]
    );
  }
  
  return false;
}