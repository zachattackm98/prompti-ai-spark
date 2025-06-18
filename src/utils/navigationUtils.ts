
import { getBaseUrl, logEnvironmentInfo } from './environmentUtils';

export type NavigationSpeed = 'instant' | 'smooth';

/**
 * Navigate to home page with environment awareness
 */
export const navigateToHome = (speed: NavigationSpeed = 'smooth') => {
  const baseUrl = getBaseUrl();
  console.log('[NAV] Navigating to home:', baseUrl);
  
  if (speed === 'instant') {
    window.location.replace(baseUrl);
  } else {
    window.location.href = baseUrl;
  }
};

/**
 * Navigate to reset password page with environment awareness
 */
export const navigateToResetPassword = () => {
  const resetUrl = `${getBaseUrl()}/reset-password`;
  console.log('[NAV] Navigating to reset password:', resetUrl);
  window.location.href = resetUrl;
};

/**
 * Navigate to account page with environment awareness
 */
export const navigateToAccount = () => {
  const accountUrl = `${getBaseUrl()}/account`;
  console.log('[NAV] Navigating to account:', accountUrl);
  window.location.href = accountUrl;
};

/**
 * Get environment-aware URL for any path
 */
export const getEnvironmentUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
};
