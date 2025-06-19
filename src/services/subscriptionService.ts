
import { SubscriptionTier, UserSubscription, TIER_FEATURES } from '@/types/subscription';

export class SubscriptionService {
  /**
   * Validates if a subscription state is consistent and active
   */
  static validateSubscriptionState(subscription: UserSubscription): UserSubscription {
    // Ensure starter tier users are always considered active for basic features
    if (subscription.tier === 'starter') {
      return {
        ...subscription,
        isActive: true
      };
    }

    // For paid tiers, require explicit active status
    return subscription;
  }

  /**
   * Determines if a user can access a specific feature
   */
  static canAccessFeature(
    subscription: UserSubscription, 
    feature: keyof typeof TIER_FEATURES[SubscriptionTier]
  ): boolean {
    const validatedSubscription = this.validateSubscriptionState(subscription);
    const tierFeatures = TIER_FEATURES[validatedSubscription.tier];
    
    // Special handling for basic features on starter tier
    if (validatedSubscription.tier === 'starter' && feature === 'cinematic_prompts') {
      return true;
    }

    // For paid features, check both subscription status and feature availability
    if (validatedSubscription.tier !== 'starter') {
      return validatedSubscription.isActive && !!tierFeatures[feature];
    }

    // For starter tier, only basic features are available
    return !!tierFeatures[feature];
  }

  /**
   * Gets the upgrade path for a feature
   */
  static getRequiredTierForFeature(feature: keyof typeof TIER_FEATURES[SubscriptionTier]): SubscriptionTier {
    // Check which tier first supports this feature
    if (TIER_FEATURES.creator[feature]) return 'creator';
    if (TIER_FEATURES.studio[feature]) return 'studio';
    return 'starter';
  }

  /**
   * Validates upgrade transitions
   */
  static canUpgradeToTier(currentTier: SubscriptionTier, targetTier: SubscriptionTier): boolean {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    return tierOrder[targetTier] > tierOrder[currentTier];
  }

  /**
   * Gets user-friendly tier display name
   */
  static getTierDisplayName(tier: SubscriptionTier): string {
    const names = { starter: 'Starter', creator: 'Creator', studio: 'Studio' };
    return names[tier];
  }

  /**
   * Checks if subscription needs refresh due to state inconsistency
   */
  static shouldRefreshSubscription(subscription: UserSubscription): boolean {
    // Check for obviously invalid states
    if (!subscription.tier) return true;
    if (subscription.tier !== 'starter' && subscription.isActive === undefined) return true;
    if (subscription.isCancelling && !subscription.expiresAt) return true;
    
    return false;
  }
}
