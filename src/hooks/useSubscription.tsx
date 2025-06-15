
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubscription, SubscriptionTier, TIER_FEATURES } from '@/types/subscription';
import { useAuth } from './useAuth';

interface SubscriptionContextType {
  subscription: UserSubscription;
  features: typeof TIER_FEATURES[SubscriptionTier];
  hasFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  canUseFeature: (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => boolean;
  upgradeRequired: (targetTier: SubscriptionTier) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'starter',
    isActive: true,
  });

  useEffect(() => {
    // For now, simulate different subscription tiers for demonstration
    // In production, this would fetch from your database
    if (user) {
      // Simulate different users having different tiers
      const userTier = user.email?.includes('creator') ? 'creator' : 
                     user.email?.includes('studio') ? 'studio' : 'starter';
      setSubscription({
        tier: userTier as SubscriptionTier,
        isActive: true,
      });
    } else {
      setSubscription({
        tier: 'starter',
        isActive: false,
      });
    }
  }, [user]);

  const features = TIER_FEATURES[subscription.tier];

  const hasFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    return features[feature] !== false && features[feature] !== 0;
  };

  const canUseFeature = (feature: keyof typeof TIER_FEATURES[SubscriptionTier]) => {
    return subscription.isActive && hasFeature(feature);
  };

  const upgradeRequired = (targetTier: SubscriptionTier) => {
    const tierOrder = { starter: 0, creator: 1, studio: 2 };
    return tierOrder[subscription.tier] < tierOrder[targetTier];
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      features,
      hasFeature,
      canUseFeature,
      upgradeRequired,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
