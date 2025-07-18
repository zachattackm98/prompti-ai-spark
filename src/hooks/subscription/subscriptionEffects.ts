
import { useEffect } from 'react';
import { UserSubscription } from '@/types/subscription';
import { BillingDetails, checkSubscription as apiCheckSubscription, showToast, clearSubscriptionCache } from './subscriptionApi';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionEffects = (
  user: any,
  setLoading: (loading: boolean) => void,
  setSubscription: (subscription: UserSubscription) => void,
  setBillingDetails: (details: BillingDetails | null) => void,
  checkoutSuccessInProgress: boolean,
  setCheckoutSuccessInProgress: (inProgress: boolean) => void
) => {
  const checkSubscription = async (retryCount = 0, maxRetries = 3) => {
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, setting starter subscription');
      setSubscription({ tier: 'starter', isActive: false });
      setBillingDetails(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('[SUBSCRIPTION] Checking subscription for user:', user.email, `(attempt ${retryCount + 1})`);
      const data = await apiCheckSubscription();

      console.log('[SUBSCRIPTION] Subscription data received:', data);
      
      // Handle subscription state properly
      const isSubscribed = data.subscribed || false;
      const subscriptionTier = data.subscription_tier || 'starter';
      
      // Smart cancellation logic: For starter plans, only consider it "cancelling" 
      // if it's actually ending soon (within current period)
      let isCancelling = false;
      if (data.billing_details?.cancel_at_period_end) {
        if (subscriptionTier === 'starter') {
          // For starter plans, check if subscription is actually ending
          const currentPeriodEnd = data.billing_details?.current_period_end;
          if (currentPeriodEnd) {
            const endDate = new Date(currentPeriodEnd);
            const now = new Date();
            const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            // Only show as cancelling if ending within 7 days
            isCancelling = daysUntilEnd <= 7;
          }
        } else {
          // For non-starter plans, keep existing logic
          isCancelling = true;
        }
      }
      
      // For active subscriptions, even if scheduled for cancellation, they're still active until period end
      const effectivelyActive = isSubscribed;
      
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
      
      // Improved error handling for authentication issues
      if (error.message?.includes('Authentication') || 
          error.message?.includes('Session') || 
          error.message?.includes('JWT') ||
          error.message?.includes('401')) {
        console.log('[SUBSCRIPTION] Authentication error detected, setting default state');
        setSubscription({ tier: 'starter', isActive: false });
        setBillingDetails(null);
        setLoading(false);
        
        showToast(
          "Session Expired",
          "Please sign in again to check your subscription status.",
          "destructive"
        );
        return;
      }
      
      // Retry logic for other errors
      if (retryCount < maxRetries) {
        console.log(`[SUBSCRIPTION] Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          checkSubscription(retryCount + 1, maxRetries);
        }, (retryCount + 1) * 1000);
        return;
      }
      
      // Provide more specific error messages
      let errorMessage = "Failed to check subscription status";
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('STRIPE_SECRET_KEY')) {
        errorMessage = "Subscription service configuration error. Please contact support.";
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

  const verifySubscriptionStatus = async () => {
    console.log('[SUBSCRIPTION] Starting subscription verification');
    
    // Clear any optimistic updates first
    sessionStorage.removeItem('optimistic_update');
    
    // Single definitive check
    await checkSubscription();
  };

  // Optimized subscription check with focus prevention
  useEffect(() => {
    if (checkoutSuccessInProgress) {
      console.log('[SUBSCRIPTION] Skipping user effect check - checkout success in progress');
      return;
    }
    
    // Prevent checking on window focus if we already have recent data
    const cachedData = localStorage.getItem('subscription_cache');
    if (cachedData) {
      try {
        const cached = JSON.parse(cachedData);
        const cacheAge = Date.now() - cached.timestamp;
        
        // If we have fresh cache (less than 2 minutes), use it instead of refetching
        if (cacheAge < 2 * 60 * 1000) {
          console.log('[SUBSCRIPTION] Using fresh cache, skipping API call');
          setSubscription({
            tier: cached.tier,
            isActive: cached.isActive,
            isCancelling: cached.isCancelling || false,
            expiresAt: cached.expiresAt,
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('[SUBSCRIPTION] Failed to parse cached data');
      }
    }
    
    console.log('[SUBSCRIPTION] User state changed:', user?.email || 'no user');
    checkSubscription();
  }, [user, checkoutSuccessInProgress]);

  // Enhanced checkout success/cancel handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    
    if (checkout === 'success') {
      console.log('[SUBSCRIPTION] Checkout success detected');
      
      // Set flag to prevent user effect from running
      setCheckoutSuccessInProgress(true);
      
      showToast(
        "Payment Successful!",
        "Your subscription is being processed. Your new plan will be active shortly."
      );
      
      // Remove URL params immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear all cache and pending states
      clearSubscriptionCache();
      
      // Handle potential upgrade completion
      const handleUpgradeSuccess = async () => {
        try {
          console.log('[SUBSCRIPTION] Checking for upgrade to process...');
          const { data, error } = await supabase.functions.invoke('handle-upgrade-success');
          
          if (error) {
            console.warn('[SUBSCRIPTION] Upgrade handler error:', error);
          } else {
            console.log('[SUBSCRIPTION] Upgrade handler response:', data);
          }
        } catch (error) {
          console.warn('[SUBSCRIPTION] Failed to call upgrade handler:', error);
        }
        
        // Always verify subscription status after attempting upgrade processing
        await verifySubscriptionStatus();
      };
      
      // IMMEDIATE processing including upgrade handling
      handleUpgradeSuccess();
      
      // Give Stripe additional time to sync, then verify again as backup
      setTimeout(() => {
        verifySubscriptionStatus();
      }, 3000);
      
      // Final verification after a longer delay to ensure everything is synced
      setTimeout(() => {
        verifySubscriptionStatus();
        // Clear the flag after all checks are complete
        setCheckoutSuccessInProgress(false);
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

  return {
    checkSubscription,
    verifySubscriptionStatus,
  };
};
