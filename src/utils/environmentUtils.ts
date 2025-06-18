
/**
 * Environment detection and URL utilities
 */

// Production domain
export const PRODUCTION_DOMAIN = 'https://www.aipromptmachine.com';

// Known preview/development domains
const PREVIEW_DOMAINS = [
  'lovable.app',
  'lovableproject.com',
  'lovable.dev'
];

/**
 * Detect if we're running in production environment
 */
export const isProductionEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // Check if we're on the production domain
  if (origin === PRODUCTION_DOMAIN) {
    return true;
  }
  
  // Check if we're on any known preview/dev domains
  return !PREVIEW_DOMAINS.some(domain => hostname.includes(domain));
};

/**
 * Get the appropriate base URL based on environment
 */
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return PRODUCTION_DOMAIN;
  
  if (isProductionEnvironment()) {
    return PRODUCTION_DOMAIN;
  }
  
  // For preview/dev environments, use current origin
  return window.location.origin;
};

/**
 * Get environment-aware redirect URL for auth operations
 */
export const getAuthRedirectUrl = (path: string = ''): string => {
  const baseUrl = getBaseUrl();
  return path ? `${baseUrl}${path}` : baseUrl;
};

/**
 * Log current environment info for debugging
 */
export const logEnvironmentInfo = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log('[ENV] Environment Info:', {
    hostname: window.location.hostname,
    origin: window.location.origin,
    isProduction: isProductionEnvironment(),
    baseUrl: getBaseUrl()
  });
};
