
export type SubscriptionTier = 'starter' | 'creator' | 'studio';

export interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  isCancelling?: boolean;
  expiresAt?: string;
}

export interface TierFeatures {
  maxPrompts: number;
  platforms: string[];
  emotions: string[];
  cameraControls: boolean;
  lightingOptions: boolean;
  visualStyles: boolean;
  enhancedPrompts: boolean;
  batchProcessing: boolean;
  teamCollaboration: boolean;
  apiAccess: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  starter: {
    maxPrompts: 5,
    platforms: ['veo3', 'sora'],
    emotions: ['Dramatic', 'Uplifting', 'Mysterious', 'Serene'],
    cameraControls: false,
    lightingOptions: false,
    visualStyles: false,
    enhancedPrompts: false,
    batchProcessing: false,
    teamCollaboration: false,
    apiAccess: false,
  },
  creator: {
    maxPrompts: 500, // Changed from -1 to 500
    platforms: ['veo3', 'sora', 'runway', 'pika'],
    emotions: ['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'],
    cameraControls: true,
    lightingOptions: false,
    visualStyles: true,
    enhancedPrompts: true,
    batchProcessing: true,
    teamCollaboration: false,
    apiAccess: false,
  },
  studio: {
    maxPrompts: 1000, // Changed from -1 to 1000
    platforms: ['veo3', 'sora', 'runway', 'pika'],
    emotions: ['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'],
    cameraControls: true,
    lightingOptions: true,
    visualStyles: true,
    enhancedPrompts: true,
    batchProcessing: true,
    teamCollaboration: true,
    apiAccess: true,
  },
};
