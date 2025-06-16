import { 
  createCheckoutSession,
  openCustomerPortal as apiOpenCustomerPortal,
  handleCheckoutRedirect,
  showToast
} from './subscriptionApi';
import { toast } from '@/hooks/use-toast';

export const useSubscriptionOperations = (
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
      
      // Store expected tier for optimistic updates
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
      sessionStorage.removeItem('pending_tier');
      
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
      // Optimistic UI update - immediately show the new tier
      console.log('[SUBSCRIPTION] Applying optimistic update');
      setSubscription({
        tier: planType,
        isActive: true,
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
      sessionStorage.removeItem('pending_tier');
      sessionStorage.removeItem('optimistic_update');
      
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

  const openCustomerPortal = async () => {
    if (!user) {
      console.error('[SUBSCRIPTION] No user found for customer portal');
      return;
    }

    console.log('[SUBSCRIPTION] Opening customer portal...');
    setLoading(true);
    
    try {
      // Pre-open a blank window to avoid popup blockers
      const popupWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      // Check if popup was blocked
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
        console.log('[SUBSCRIPTION] Popup blocked, using fallback method');
        
        // Get the portal URL first
        const data = await apiOpenCustomerPortal();
        
        if (data?.url) {
          // Show toast with direct link as fallback - use a simpler approach
          showToast(
            "Popup Blocked",
            `Your browser blocked the popup. Click here to open billing portal: ${data.url}`,
            "default"
          );
          
          // Also provide a direct redirect option after a short delay
          setTimeout(() => {
            if (confirm('Would you like to open the billing portal now?')) {
              window.location.href = data.url;
            }
          }, 1000);
        } else {
          throw new Error('No portal URL received');
        }
      } else {
        // Popup opened successfully, now get the URL and redirect
        const data = await apiOpenCustomerPortal();
        
        if (data?.url) {
          console.log('[SUBSCRIPTION] Redirecting popup to customer portal');
          popupWindow.location.href = data.url;
          
          // Show success message
          showToast(
            "Portal Opened",
            "Billing portal opened in new window"
          );
        } else {
          // Close the blank popup if we can't get the URL
          popupWindow.close();
          throw new Error('No portal URL received');
        }
      }
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error opening customer portal:', error);
      
      let errorMessage = "Failed to open customer portal";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Your session has expired. Please sign in again.";
      } else if (error.message?.includes('No Stripe customer')) {
        errorMessage = "No subscription found. Please subscribe first.";
      }
      
      showToast(
        "Portal Error",
        errorMessage,
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    createOptimisticCheckout,
    openCustomerPortal,
  };
};
