
import { useEffect } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails, checkSubscription as apiCheckSubscription, showToast } from './subscriptionApi';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: UserSubscription) => void,
  setBillingDetails: (details: BillingDetails | null) => void
) => {
  const checkSubscription = async () => {
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email);
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Subscription data received:', data);
      
      setSubscription({
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end,
      });

      setBillingDetails(data.billing_details || null);
      
      console.log('[SUBSCRIPTION] Subscription state updated:', {
        tier: data.subscription_tier || 'starter',
        isActive: data.subscribed || false,
        expiresAt: data.subscription_end
      });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to check subscription status";
      if (error.message?.includes('Authentication')) {
        errorMessage = "Authentication failed. Please sign in again.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      showToast(
        "Subscription Check Failed",
        errorMessage,
        "destructive"
      );
      
      // Set fallback state
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Check subscription when user changes
  useEffect(() => {
    console.log('[SUBSCRIPTION] User state changed:', user?.email || 'no user');
    checkSubscription();
  }, [user]);

  // Check for checkout success/cancel in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      showToast(
        "Payment Successful!",
        "Your subscription has been activated. Refreshing your account status..."
      );
      // Remove the URL param and refresh subscription
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        console.log('[SUBSCRIPTION] Refreshing subscription after successful checkout');
        checkSubscription();
      }, 2000);
    } else if (checkout === 'cancelled') {
      console.log('[SUBSCRIPTION] Checkout cancelled detected');
      showToast(
        "Payment Cancelled",
        "Your subscription process was cancelled.",
        "destructive"
      );
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return {
    checkSubscription,
  };
};
