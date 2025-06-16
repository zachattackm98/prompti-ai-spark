
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
      
      // Store expected tier for verification
      sessionStorage.setItem('pending_tier', planType);
      
      const data = await createCheckoutSession(planType);
      
      console.log('[SUBSCRIPTION] Checkout session created, redirecting...');
      
      // Show optimistic feedback
      showToast(
        "Redirecting to Payment",
        "Opening secure payment page...",
      );
      
      handleCheckoutRedirect(data.url);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error creating checkout:', error);
      
      // Clear pending tier on error
      clearSubscriptionCache();
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to create checkout session';
      let errorTitle = 'Checkout Error';
      
      if (error.message?.includes('Authentication')) {
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

  const createOptimisticCheckout = async (planType: 'creator' | 'studio') => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for checkout');
      showToast(
        "Authentication Required",
        "Please sign in to subscribe.",
        "destructive"
      );
      return;
    }

    console.log('[SUBSCRIPTION] Starting optimistic checkout for:', planType);
    setLoading(true);
    
    // Store current subscription state for rollback
    const previousState = { ...subscription };
    
    try {
      // Clear any existing cache/optimistic updates
      clearSubscriptionCache();
      
      // Optimistic UI update - immediately show the new tier
      console.log('[SUBSCRIPTION] Applying optimistic update');
      setSubscription({
        tier: planType,
        isActive: true,
        isCancelling: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      });
      
      // Store for verification
      sessionStorage.setItem('pending_tier', planType);
      sessionStorage.setItem('optimistic_update', 'true');
      
      showToast(
        "Processing Payment",
        "Setting up your subscription...",
      );
      
      const data = await createCheckoutSession(planType);
      
      console.log('[SUBSCRIPTION] Checkout session created, redirecting...');
      handleCheckoutRedirect(data.url);
      
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error creating optimistic checkout:', error);
      
      // Rollback optimistic update
      console.log('[SUBSCRIPTION] Rolling back optimistic update');
      setSubscription(previousState);
      clearSubscriptionCache();
      
      let errorMessage = 'Failed to create checkout session';
      let errorTitle = 'Checkout Error';
      
      if (error.message?.includes('Authentication')) {
        errorTitle = 'Authentication Error';
        errorMessage = 'Your session has expired. Please sign in again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorTitle = 'Network Error';
        errorMessage = 'Connection failed. Please check your internet and try again.';
      }
      
      showToast(errorTitle, errorMessage, "destructive");
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    createOptimisticCheckout,
  };
};
