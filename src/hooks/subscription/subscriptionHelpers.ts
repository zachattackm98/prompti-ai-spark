
import { SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { UserSubscription } from '@/types/subscription';

export const createSubscriptionHelpers = (subscription: UserSubscription) => {
  const features = TIER_FEATURES[subscription.tier];

  const hasFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    const featureValue = features[feature];
    return featureValue !== false && featureValue !== 0;
  };

  const canUseFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    // For starter tier, allow basic features regardless of subscription status
    if (subscription.tier === 'starter' && feature === 'cinematic_prompts') {
      return true;
    }
    
    // For paid tiers, check both active status and feature availability
    return subscription.isActive && hasFeature(feature);
  };

  const upgradeRequired = (targetTier: SubscriptionTier) => {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    return tierOrder[subscription.tier] < tierOrder[targetTier];
  };

  const isSubscribed = subscription.isActive && subscription.tier !== 'starter';

  const getRemainingFeatures = (currentTier: string): string[] => {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    const currentTierLevel = tierOrder[currentTier as SubscriptionTier] || 0;
    
    const allFeatures = ['cameraControls', 'lightingOptions', 'visualStyles', 'enhancedPrompts', 'batchProcessing', 'teamCollaboration', 'apiAccess', 'promptHistory'];
    
    return allFeatures.filter(feature => {
      // Check which tiers have this feature
      const creatorHas = TIER_FEATURES.creator[feature as keyof typeof TIER_FEATURES.creator];
      const studioHas = TIER_FEATURES.studio[feature as keyof typeof TIER_FEATURES.studio];
      
      // Return features that are available in higher tiers but not current tier
      if (currentTierLevel < 1 && creatorHas) return true;
      if (currentTierLevel < 2 && studioHas && !creatorHas) return true;
      return false;
    });
  };

  const getUpgradeMessage = (feature: string, requiredTier: string): string => {
    const tierNames = {
      creator: 'Creator',
      studio: 'Studio'
    };
    
    const tierName = tierNames[requiredTier as keyof typeof tierNames] || requiredTier;
    return `Upgrade to ${tierName} to unlock ${feature}`;
  };

  return {
    features,
    hasFeature,
    canUseFeature,
    upgradeRequired,
    isSubscribed,
    getRemainingFeatures,
    getUpgradeMessage,
  };
};
