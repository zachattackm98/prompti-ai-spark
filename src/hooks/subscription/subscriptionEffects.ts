
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
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Subscription data received:', data);
      
      // Handle subscription state properly
      const isSubscribed = data.subscribed || false;
      const isCancelling = data.billing_details?.cancel_at_period_end || false;
      const subscriptionTier = data.subscription_tier || 'starter';
      
      // For starter tier users, they should be considered active for basic features
      // For paid subscriptions, only active if actually subscribed
      const effectivelyActive = subscriptionTier === 'starter' ? true : isSubscribed;
      
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
      localStorage.setItem('subscription_cache', JSON.stringify({
        tier: subscriptionTier,
        isActive: effectivelyActive,
        isCancelling: isCancelling,
        expiresAt: data.subscription_end,
        timestamp: Date.now()
      }));

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
      
      // Try to load from cache as fallback
      const cachedData = localStorage.getItem('subscription_cache');
      if (cachedData) {
        try {
          const cached = JSON.parse(cachedData);
          const cacheAge = Date.now() - cached.timestamp;
          
          // Only use cache if it's recent (less than 5 minutes)
          if (cacheAge < 5 * 60 * 1000) {
            console.log('[SUBSCRIPTION] Loading from cache:', cached);
            setSubscription({
              tier: cached.tier,
              isActive: cached.isActive,
              isCancelling: cached.isCancelling || false,
              expiresAt: cached.expiresAt,
            });
          } else {
            console.log('[SUBSCRIPTION] Cache too old, clearing');
            clearSubscriptionCache();
            // Default to active starter for users when cache fails
            setSubscription({ tier: 'starter', isActive: true });
          }
        } catch (e) {
          console.error('[SUBSCRIPTION] Failed to parse cached data');
          clearSubscriptionCache();
          // Default to active starter for users when cache fails
          setSubscription({ tier: 'starter', isActive: true });
        }
      } else {
        // Default to active starter for users when no cache
        setSubscription({ tier: 'starter', isActive: true });
      }
      setBillingDetails(null);
    } finally {
      if (!skipLoadingState) setLoading(false);
    }
  };

  const verifySubscriptionStatus = async () => {
    console.log('[SUBSCRIPTION] Starting subscription verification');
    
    // Single definitive check
    await checkSubscription();
  };

  // Enhanced checkout success/cancel handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      
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

  // Optimized subscription check - only check when user actually changes (not just state updates)
  useEffect(() => {
    const currentUserId = user?.id || null;
    
    // Skip if this is the same user (prevents tab focus reload issues)
    if (currentUserId === lastUserIdRef.current && isInitializedRef.current) {
      console.log('[SUBSCRIPTION] User state update detected but same user, skipping check');
      return;
    }

    console.log('[SUBSCRIPTION] User changed:', {
      previousUserId: lastUserIdRef.current,
      currentUserId,
      isInitialized: isInitializedRef.current
    });

    // Update refs
    lastUserIdRef.current = currentUserId;
    isInitializedRef.current = true;

    // Check subscription for new user or initial load
    checkSubscription();
  }, [user?.id]); // Only depend on user.id, not entire user object

  return {
    checkSubscription,
    verifySubscriptionStatus,
  };
};
