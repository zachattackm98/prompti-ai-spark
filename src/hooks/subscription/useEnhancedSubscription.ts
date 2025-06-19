
import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { useSubscriptionState } from './subscriptionState';
import { useSubscriptionEffects } from './useSubscriptionEffects';
import { useSubscriptionOperations } from './useSubscriptionOperations';
import { SubscriptionService } from '@/services/subscriptionService';
import { UsageService } from '@/services/usageService';
import { usePromptUsage } from '../usePromptUsage';
import { SubscriptionTier, UserSubscription, TIER_FEATURES, TierFeatures } from '@/types/subscription';

export const useEnhancedSubscription = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    loading,
    setLoading,
    billingDetails,
    setBillingDetails,
    subscription: rawSubscription,
    setSubscription,
  } = useSubscriptionState();

  // Validate and normalize subscription state
  const subscription = SubscriptionService.validateSubscriptionState(rawSubscription);

  const { usage, hasReachedLimit, refetchUsage } = usePromptUsage();

  const { checkSubscription, verifySubscriptionStatus } = useSubscriptionEffects(
    user,
    setLoading,
    setSubscription,
    setBillingDetails
  );

  const subscriptionOperations = useSubscriptionOperations(user, setLoading);

  // Get features for current tier
  const features = TIER_FEATURES[subscription.tier];

  // Enhanced feature access check
  const canUseFeature = useCallback((feature: keyof TierFeatures) => {
    const canAccess = SubscriptionService.canAccessFeature(subscription, feature);
    
    console.log('[ENHANCED-SUBSCRIPTION] Feature access check:', {
      feature,
      tier: subscription.tier,
      isActive: subscription.isActive,
      canAccess
    });
    
    return canAccess;
  }, [subscription]);

  // Enhanced usage validation
  const validateUsageForGeneration = useCallback(() => {
    if (!usage) {
      console.warn('[ENHANCED-SUBSCRIPTION] Usage data not available');
      return { canProceed: false, errorMessage: 'Usage data not available' };
    }

    return UsageService.validateUsageBeforeGeneration(
      { tier: subscription.tier, isActive: subscription.isActive },
      usage.prompt_count
    );
  }, [subscription, usage]);

  // Enhanced checkout with proper error handling
  const createEnhancedCheckout = useCallback(async (targetTier: 'creator' | 'studio') => {
    console.log('[ENHANCED-SUBSCRIPTION] Starting enhanced checkout:', {
      currentTier: subscription.tier,
      targetTier,
      isActive: subscription.isActive
    });

    // Validate upgrade path
    if (!SubscriptionService.canUpgradeToTier(subscription.tier, targetTier)) {
      const currentName = SubscriptionService.getTierDisplayName(subscription.tier);
      const targetName = SubscriptionService.getTierDisplayName(targetTier);
      throw new Error(`Cannot downgrade from ${currentName} to ${targetName}. Please use the customer portal to manage your subscription.`);
    }

    try {
      await subscriptionOperations.createCheckout(targetTier);
      
      // Force refresh after checkout attempt
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
        verifySubscriptionStatus();
      }, 2000);
    } catch (error) {
      console.error('[ENHANCED-SUBSCRIPTION] Checkout failed:', error);
      throw error;
    }
  }, [subscription.tier, subscriptionOperations.createCheckout, verifySubscriptionStatus]);

  // Force subscription refresh
  const forceRefresh = useCallback(async () => {
    console.log('[ENHANCED-SUBSCRIPTION] Forcing subscription refresh');
    setRefreshTrigger(prev => prev + 1);
    await Promise.all([
      verifySubscriptionStatus(),
      refetchUsage()
    ]);
  }, [verifySubscriptionStatus, refetchUsage]);

  // Check if subscription state is inconsistent
  const needsRefresh = SubscriptionService.shouldRefreshSubscription(subscription);

  return {
    // Core subscription data
    user,
    subscription,
    billingDetails,
    loading,
    
    // Usage data
    usage,
    hasReachedLimit,
    
    // Features
    features,
    
    // Enhanced methods
    canUseFeature,
    validateUsageForGeneration,
    createCheckout: createEnhancedCheckout,
    forceRefresh,
    
    // Status indicators
    needsRefresh,
    usageUrgency: usage ? UsageService.getUsageUrgency(usage.prompt_count, subscription.tier) : 'low',
    
    // Legacy operations (for backward compatibility)
    ...subscriptionOperations,
    checkSubscription,
    verifySubscriptionStatus,
  };
};
