
import { UserSubscription, SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { BillingDetails } from './subscriptionApi';

export interface SubscriptionContextType {
  subscription: UserSubscription;
  billingDetails: BillingDetails | null;
  features: typeof TIER_FEATURES[SubscriptionTier];
  hasFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  canUseFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  upgradeRequired: (targetTier: SubscriptionTier) => boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (planType: 'creator' | 'studio') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  loading: boolean;
}
