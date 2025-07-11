
import { SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { UserSubscription } from '@/types/subscription';

export const createSubscriptionHelpers = (subscription: UserSubscription) => {
  const features = TIER_FEATURES[subscription.tier];

  const hasFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    const featureValue = features[feature];
    return featureValue !== false && featureValue !== 0;
  };

  const canUseFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    return subscription.isActive && hasFeature(feature);
  };

  const upgradeRequired = (targetTier: SubscriptionTier) => {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    return tierOrder[subscription.tier] < tierOrder[targetTier];
  };

  const isSubscribed = subscription.isActive && subscription.tier !== 'starter';

  const getRemainingFeatures = (currentTier: string): string[] => {
    // Since all features are now available to starter users,
    // the only remaining features are the advanced ones for team collaboration
    if (currentTier === 'starter') {
      return ['teamCollaboration', 'apiAccess'];
    } else if (currentTier === 'creator') {
      return ['teamCollaboration', 'apiAccess'];
    }
    return [];
  };

  const getUpgradeMessage = (feature: string, requiredTier: string): string => {
    const tierNames = {
      creator: 'Creator',
      studio: 'Studio'
    };
    
    const tierName = tierNames[requiredTier as keyof typeof tierNames] || requiredTier;
    
    // Updated messaging to focus on limits rather than feature access
    if (requiredTier === 'creator') {
      return `Upgrade to ${tierName} for 500 prompts/month and priority support`;
    } else if (requiredTier === 'studio') {
      return `Upgrade to ${tierName} for 1000 prompts/month, team collaboration, and API access`;
    }
    
    return `Upgrade to ${tierName} for enhanced limits and features`;
  };

  const getNextUpgradeTier = (): SubscriptionTier | null => {
    if (subscription.tier === 'starter') return 'creator';
    if (subscription.tier === 'creator') return 'studio';
    return null; // Already on highest tier
  };

  const getUpgradeDetails = () => {
    const nextTier = getNextUpgradeTier();
    if (!nextTier) return null;

    const currentPrompts = TIER_FEATURES[subscription.tier].maxPrompts;
    const nextPrompts = TIER_FEATURES[nextTier].maxPrompts;
    const additionalPrompts = nextPrompts - currentPrompts;

    return {
      targetTier: nextTier,
      targetTierName: nextTier === 'creator' ? 'Creator' : 'Studio',
      currentPrompts,
      nextPrompts,
      additionalPrompts,
      upgradeText: `Upgrade to ${nextTier === 'creator' ? 'Creator' : 'Studio'}`
    };
  };

  return {
    features,
    hasFeature,
    canUseFeature,
    upgradeRequired,
    isSubscribed,
    getRemainingFeatures,
    getUpgradeMessage,
    getNextUpgradeTier,
    getUpgradeDetails,
  };
};
