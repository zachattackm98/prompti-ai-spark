
import { useEffect, useRef } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails, checkSubscription as apiCheckSubscription, showToast, clearSubscriptionCache } from './subscriptionApi';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: UserSubscription) => void,
  setBillingDetails: (details: BillingDetails | null) => void
) => {
  // Track the last user ID to prevent unnecessary checks
  const lastUserIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  const checkSubscription = async (retryCount = 0, maxRetries = 3, skipLoadingState = false) => {
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      // For starter users, they should be active to use basic features
      setSubscription({ tier: 'starter', isActive: true });
      setBillingDetails(null);
      if (!skipLoadingState) setLoading(false);
      return;
    }

    if (!skipLoadingState) setLoading(true);
    
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email, `(attempt ${retryCount + 1})`);
      
      // Clear all cache before checking to ensure fresh data
      console.log('[SUBSCRIPTION] Clearing all cache for fresh check');
      clearSubscriptionCache();
      
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Raw subscription data received:', data);
      
      // Handle subscription state properly with detailed logging
      const isSubscribed = data.subscribed || false;
      const isCancelling = data.billing_details?.cancel_at_period_end || false;
      const subscriptionTier = data.subscription_tier || 'starter';
      
      console.log('[SUBSCRIPTION] Processing subscription state:', {
        isSubscribed,
        isCancelling,
        subscriptionTier,
        rawData: data
      });
      
      // For starter tier users, they should be considered active for basic features
      // For paid subscriptions, only active if actually subscribed
      const effectivelyActive = subscriptionTier === 'starter' ? true : isSubscribed;
      
      console.log('[SUBSCRIPTION] Final subscription state:', {
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end
      });
      
      setSubscription({
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end,
      });

      setBillingDetails(data.billing_details || null);
      
      // Store successful subscription data in localStorage for persistence
      const cacheData = {
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end,
        timestamp: Date.now()
      };
      
      console.log('[SUBSCRIPTION] Storing cache data:', cacheData);
      localStorage.setItem('subscription_cache', JSON.stringify(cacheData));

      // Show success toast for paid subscriptions
      if (subscriptionTier !== 'starter' && isSubscribed) {
        showToast(
          "Subscription Active",
          `Your ${subscriptionTier} subscription is active and ready to use.`
        );
      }

    } catch (error: any) {
      console.error('[SUBSCRIPTION] Error checking subscription:', error);
      
      // Retry logic for failed attempts
      if (retryCount < maxRetries) {
        console.log(`[SUBSCRIPTION] Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          checkSubscription(retryCount + 1, maxRetries, skipLoadingState);
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
      
      // Clear cache and set to starter as fallback
      clearSubscriptionCache();
      setSubscription({ tier: 'starter', isActive: true });
      setBillingDetails(null);
    } finally {
      if (!skipLoadingState) setLoading(false);
    }
  };

  const verifySubscriptionStatus = async () => {
    console.log('[SUBSCRIPTION] Starting subscription verification - forcing fresh check');
    
    // Clear all cache and force fresh check
    clearSubscriptionCache();
    
    // Single definitive check
    await checkSubscription();
  };

  // Enhanced checkout success/cancel handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected - clearing cache and verifying');
      
      showToast(
        "Payment Successful!",
        "Your subscription is being processed. Your new plan will be active shortly."
      );
      
      // Remove URL params immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear all cache and pending states
      clearSubscriptionCache();
      
      // Give Stripe and our webhook time to process, then verify
      setTimeout(() => {
        verifySubscriptionStatus();
      }, 3000);
      
      // Additional verification after a longer delay to ensure everything is synced
      setTimeout(() => {
        verifySubscriptionStatus();
      }, 10000);
      
    } else if (checkout === 'cancelled') {
      console.log('[SUBSCRIPTION] Checkout cancelled detected');
      showToast(
        "Payment Cancelled",
        "Your subscription process was cancelled. No charges were made.",
        "destructive"
      );
      window.history.replaceState({}, document.title, window.location.pathname);
      clearSubscriptionCache();
    }
  }, []);

  // Force fresh subscription check when user changes
  useEffect(() => {
    const currentUserId = user?.id || null;
    
    // Check if this is a new user or initial load
    if (currentUserId !== lastUserIdRef.current || !isInitializedRef.current) {
      console.log('[SUBSCRIPTION] User changed or initial load:', {
        previousUserId: lastUserIdRef.current,
        currentUserId,
        isInitialized: isInitializedRef.current
      });

      // Update refs
      lastUserIdRef.current = currentUserId;
      isInitializedRef.current = true;

      // Force fresh check for any user change
      console.log('[SUBSCRIPTION] Forcing fresh subscription check');
      verifySubscriptionStatus();
    }
  }, [user?.id]);

  return {
    checkSubscription,
    verifySubscriptionStatus,
  };
};
