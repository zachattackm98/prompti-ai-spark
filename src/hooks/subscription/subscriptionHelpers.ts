
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

  return {
    features,
    hasFeature,
    canUseFeature,
    upgradeRequired,
  };
};
