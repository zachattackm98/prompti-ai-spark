
import { 
  createCheckoutSession,
  handleCheckoutRedirect,
  showToast,
  clearSubscriptionCache
} from './subscriptionApi';

export const useCheckoutOperations = (
  user: any,
  setLoading: (loading: boolean) => void,
  subscription: any,
  setSubscription: (subscription: any) => void
) => {
  const createCheckout = async (planType: 'creator' | 'studio') => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for checkout');
      showToast(
        "Authentication Required",
        "Please sign in to subscribe.",
        "destructive"
      );
      return;
    }

    console.log('[SUBSCRIPTION] Starting checkout process for:', planType);
    setLoading(true);
    
    try {
      console.log('[SUBSCRIPTION] Creating checkout session...');
      
      // Clear any existing cache before starting new checkout
      clearSubscriptionCache();
      
      const data = await createCheckoutSession(planType);
      
      console.log('[SUBSCRIPTION] Checkout session created, redirecting...');
      
      // Show simple feedback message
      showToast(
        "Redirecting to Payment",
        "Opening secure payment page...",
      );
      
      handleCheckoutRedirect(data.url);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error creating checkout:', error);
      
      // Clear any pending state on error
      clearSubscriptionCache();
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to create checkout session';
      let errorTitle = 'Checkout Error';
      
      if (error.message?.includes('already have an active')) {
        errorTitle = 'Subscription Already Active';
        errorMessage = error.message;
      } else if (error.message?.includes('Cannot downgrade')) {
        errorTitle = 'Downgrade Not Allowed';
        errorMessage = error.message;
      } else if (error.message?.includes('Authentication')) {
        errorTitle = 'Authentication Error';
        errorMessage = 'Your session has expired. Please sign in again.';
      } else if (error.message?.includes('Invalid plan')) {
        errorTitle = 'Invalid Plan';
        errorMessage = 'The selected plan is not available. Please try again.';
      } else if (error.message?.includes('STRIPE_SECRET_KEY')) {
        errorTitle = 'Configuration Error';
        errorMessage = 'Payment system is not configured. Please contact support.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorTitle = 'Network Error';
        errorMessage = 'Connection failed. Please check your internet and try again.';
      } else if (error.message?.includes('checkout URL')) {
        errorTitle = 'Checkout Error';
        errorMessage = 'Failed to create payment page. Please try again.';
      }
      
      showToast(errorTitle, errorMessage, "destructive");
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
  };
};
