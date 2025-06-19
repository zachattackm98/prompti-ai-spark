
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
  promptHistory: boolean;
  cinematic_prompts: boolean; // Add the missing feature that the code checks for
}

// Ensure these limits match the edge function constants exactly
export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  starter: {
    maxPrompts: 5, // Matches TIER_LIMITS.starter in edge function
    platforms: ['veo3', 'sora'],
    emotions: ['Dramatic', 'Uplifting', 'Mysterious', 'Serene'],
    cameraControls: false,
    lightingOptions: false,
    visualStyles: false,
    enhancedPrompts: false,
    batchProcessing: false,
    teamCollaboration: false,
    apiAccess: false,
    promptHistory: false,
    cinematic_prompts: true, // Allow starter users to generate basic cinematic prompts
  },
  creator: {
    maxPrompts: 500, // Matches TIER_LIMITS.creator in edge function
    platforms: ['veo3', 'sora', 'runway', 'pika'],
    emotions: ['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'],
    cameraControls: true,
    lightingOptions: false,
    visualStyles: true,
    enhancedPrompts: true,
    batchProcessing: true,
    teamCollaboration: false,
    apiAccess: false,
    promptHistory: true,
    cinematic_prompts: true,
  },
  studio: {
    maxPrompts: 1000, // Matches TIER_LIMITS.studio in edge function
    platforms: ['veo3', 'sora', 'runway', 'pika'],
    emotions: ['Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 'Suspenseful', 'Romantic', 'Epic', 'Intimate'],
    cameraControls: true,
    lightingOptions: true,
    visualStyles: true,
    enhancedPrompts: true,
    batchProcessing: true,
    teamCollaboration: true,
    apiAccess: true,
    promptHistory: true,
    cinematic_prompts: true,
  },
};
