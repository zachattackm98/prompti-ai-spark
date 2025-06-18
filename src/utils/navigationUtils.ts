
import { scrollToTop } from './scrollUtils';

// Navigation utility to avoid hard redirects that cause full page reloads
export const navigateToHome = (scrollBehavior: 'smooth' | 'instant' = 'smooth') => {
  console.log('[NAVIGATION] Navigating to home page with React Router');
  scrollToTop(scrollBehavior);
  
  // Use React Router's programmatic navigation if available
  // This will be enhanced when we update the auth providers
  window.history.pushState(null, '', '/');
  
  // Dispatch a custom event to notify React Router of the navigation
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const navigateToResetPassword = () => {
  console.log('[NAVIGATION] Navigating to reset password page');
  window.history.pushState(null, '', '/reset-password');
  window.dispatchEvent(new PopStateEvent('popstate'));
};
