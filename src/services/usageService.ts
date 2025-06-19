
import { SubscriptionTier, TIER_FEATURES } from '@/types/subscription';

export interface UsageCheckResult {
  canProceed: boolean;
  remainingUsage: number;
  limitReached: boolean;
  errorMessage?: string;
  upgradeMessage?: string;
}

export class UsageService {
  /**
   * Comprehensive usage validation before allowing prompt generation
   */
  static validateUsageBeforeGeneration(
    subscription: { tier: SubscriptionTier; isActive: boolean },
    currentUsage: number
  ): UsageCheckResult {
    const tierLimit = TIER_FEATURES[subscription.tier].maxPrompts;
    const remaining = Math.max(0, tierLimit - currentUsage);
    const limitReached = currentUsage >= tierLimit;

    console.log('[USAGE-SERVICE] Validating usage:', {
      tier: subscription.tier,
      isActive: subscription.isActive,
      currentUsage,
      tierLimit,
      remaining,
      limitReached
    });

    // Check if limit is reached
    if (limitReached) {
      const upgradeMessage = this.getUpgradeMessage(subscription.tier);
      
      return {
        canProceed: false,
        remainingUsage: 0,
        limitReached: true,
        errorMessage: `You have reached your monthly limit of ${tierLimit} prompts on the ${subscription.tier} plan.`,
        upgradeMessage
      };
    }

    // For paid tiers, also check subscription status
    if (subscription.tier !== 'starter' && !subscription.isActive) {
      return {
        canProceed: false,
        remainingUsage: remaining,
        limitReached: false,
        errorMessage: 'Your subscription is not active. Please update your billing to continue.',
        upgradeMessage: 'Manage your subscription in the customer portal.'
      };
    }

    return {
      canProceed: true,
      remainingUsage: remaining,
      limitReached: false
    };
  }

  /**
   * Gets contextual upgrade message based on current tier
   */
  private static getUpgradeMessage(currentTier: SubscriptionTier): string {
    switch (currentTier) {
      case 'starter':
        return 'Upgrade to Creator (500 prompts/month) or Studio (1000 prompts/month) for more prompts.';
      case 'creator':
        return 'Upgrade to Studio plan for 1000 prompts per month.';
      case 'studio':
        return 'You have reached your Studio plan limit. Your usage will reset next month.';
      default:
        return 'Upgrade your plan for more prompts.';
    }
  }

  /**
   * Calculates usage percentage for display
   */
  static getUsagePercentage(currentUsage: number, tier: SubscriptionTier): number {
    const limit = TIER_FEATURES[tier].maxPrompts;
    return Math.min(100, (currentUsage / limit) * 100);
  }

  /**
   * Determines urgency level for usage warnings
   */
  static getUsageUrgency(currentUsage: number, tier: SubscriptionTier): 'low' | 'medium' | 'high' | 'critical' {
    const percentage = this.getUsagePercentage(currentUsage, tier);
    
    if (percentage >= 100) return 'critical';
    if (percentage >= 90) return 'high';
    if (percentage >= 75) return 'medium';
    return 'low';
  }
}
