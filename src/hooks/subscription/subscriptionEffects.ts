
import { useEffect } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails, checkSubscription as apiCheckSubscription, showToast, clearSubscriptionCache } from './subscriptionApi';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: UserSubscription) => void,
  setBillingDetails: (details: BillingDetails | null) => void
) => {
  const checkSubscription = async (retryCount = 0, maxRetries = 3) => {
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email, `(attempt ${retryCount + 1})`);
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Subscription data received:', data);
      
      // Handle cancellation state properly
      const isSubscribed = data.subscribed || false;
      const isCancelling = data.billing_details?.cancel_at_period_end || false;
      const subscriptionTier = data.subscription_tier || 'starter';
      
      // If subscription is cancelled but still active, we need special handling
      const effectivelyActive = isSubscribed && !isCancelling;
      
      console.log('[SUBSCRIPTION] Processing subscription state:', {
        isSubscribed,
        isCancelling,
        subscriptionTier,
        effectivelyActive
      });
      
      setSubscription({
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end,
      });

      setBillingDetails(data.billing_details || null);
      
      console.log('[SUBSCRIPTION] Subscription state updated:', {
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end
      });

      // Store successful subscription data in localStorage for persistence
      // But only if not cancelling to avoid stale cache
      if (!isCancelling) {
        localStorage.setItem('subscription_cache', JSON.stringify({
          tier: subscriptionTier,
          isActive: effectivelyActive,
          isCancelling: false,
          expiresAt: data.subscription_end,
          timestamp: Date.now()
        }));
      } else {
        // Clear cache if subscription is being cancelled
        clearSubscriptionCache();
      }

    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      
      // Retry logic for failed attempts
      if (retryCount < maxRetries) {
        console.log(`[SUBSCRIPTION] Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          checkSubscription(retryCount + 1, maxRetries);
        }, (retryCount + 1) * 1000);
        return;
      }
      
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
      
      // Try to load from cache as fallback, but be careful with cancelled subscriptions
      const cachedData = localStorage.getItem('subscription_cache');
      if (cachedData) {
        try {
          const cached = JSON.parse(cachedData);
          const cacheAge = Date.now() - cached.timestamp;
          
          // Only use cache if it's recent (less than 5 minutes) and not for cancelled subscriptions
          if (cacheAge < 5 * 60 * 1000 && !cached.isCancelling) {
            console.log('[SUBSCRIPTION] Loading from cache:', cached);
            setSubscription({
              tier: cached.tier,
              isActive: cached.isActive,
              isCancelling: cached.isCancelling || false,
              expiresAt: cached.expiresAt,
            });
          } else {
            console.log('[SUBSCRIPTION] Cache too old or for cancelled subscription, clearing');
            clearSubscriptionCache();
            setSubscription({ tier: 'starter', isActive: false });
          }
        } catch (e) {
          console.error('[SUBSCRIPTION] Failed to parse cached data');
          clearSubscriptionCache();
          setSubscription({ tier: 'starter', isActive: false });
        }
      } else {
        setSubscription({ tier: 'starter', isActive: false });
      }
      setBillingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Simplified verification system - no more progressive verification for cancellations
  const verifySubscriptionStatus = async () => {
    console.log('[SUBSCRIPTION] Starting subscription verification');
    
    // Clear any optimistic updates first
    sessionStorage.removeItem('optimistic_update');
    
    // Single definitive check
    await checkSubscription();
  };

  // Check subscription when user changes
  useEffect(() => {
    console.log('[SUBSCRIPTION] User state changed:', user?.email || 'no user');
    checkSubscription();
  }, [user]);

  // Enhanced checkout success/cancel handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      
      showToast(
        "Payment Successful!",
        "Your subscription is being activated. We're updating your account status..."
      );
      
      // Remove URL params immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear all cache and pending states
      clearSubscriptionCache();
      
      // Give Stripe a moment to process, then verify
      setTimeout(() => {
        verifySubscriptionStatus();
      }, 2000);
      
    } else if (checkout === 'cancelled') {
      console.log('[SUBSCRIPTION] Checkout cancelled detected');
      showToast(
        "Payment Cancelled",
        "Your subscription process was cancelled.",
        "destructive"
      );
      window.history.replaceState({}, document.title, window.location.pathname);
      clearSubscriptionCache();
    }
  }, []);

  return {
    checkSubscription,
    verifySubscriptionStatus,
  };
};
