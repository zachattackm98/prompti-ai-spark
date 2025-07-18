// Shared subscription configuration for price ID to tier mapping
export interface SubscriptionTierConfig {
  tier: 'starter' | 'creator' | 'studio';
  name: string;
  priceId: string;
  description: string;
}

// Map of price IDs to subscription tiers
export const PRICE_TO_TIER_MAP: Record<string, SubscriptionTierConfig['tier']> = {
  // Creator plan - $12/month (1200 cents)
  'price_1Rm3ujICZdHRMUzHAeOSK5eP': 'creator',
  
  // Studio plan - $49/month (4900 cents)
  'price_1Rm3pxICZdHRMUzHCW9t1q6d': 'studio',
  
  // Legacy price IDs for backward compatibility
  // Add any old price IDs here if they exist
};

// Subscription tier configurations
export const TIER_CONFIGS: Record<SubscriptionTierConfig['tier'], SubscriptionTierConfig> = {
  starter: {
    tier: 'starter',
    name: 'Starter Plan',
    priceId: '', // No price ID for free tier
    description: '5 prompts per month, all platforms'
  },
  creator: {
    tier: 'creator',
    name: 'Creator Plan',
    priceId: 'price_1Rm3ujICZdHRMUzHAeOSK5eP',
    description: '500 prompts per month, all platforms, advanced features'
  },
  studio: {
    tier: 'studio',
    name: 'Studio Plan',
    priceId: 'price_1Rm3pxICZdHRMUzHCW9t1q6d',
    description: '1000 prompts per month, all platforms, priority support'
  }
};

// Helper function to determine tier from price ID
export function getTierFromPriceId(priceId: string): SubscriptionTierConfig['tier'] {
  const tier = PRICE_TO_TIER_MAP[priceId];
  if (tier) {
    return tier;
  }
  
  // Fallback logic for unknown price IDs (legacy support)
  console.log(`[SUBSCRIPTION-CONFIG] Unknown price ID: ${priceId}, falling back to starter tier`);
  return 'starter';
}

// Helper function to get tier config
export function getTierConfig(tier: SubscriptionTierConfig['tier']): SubscriptionTierConfig {
  return TIER_CONFIGS[tier];
}