
import { supabase } from './auth.ts';
import { TIER_LIMITS } from './constants.ts';
import type { UsageData } from './types.ts';

export async function checkUsageLimit(userId: string, tier: string) {
  const tierLimit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.starter;
  console.log(`[USAGE-CHECK] Checking prompt usage for ${tier} user:`, userId, 'limit:', tierLimit);
  
  // Get current usage for this user
  const { data: usageData, error: usageError } = await supabase
    .rpc('get_or_create_prompt_usage', { user_uuid: userId });

  if (usageError) {
    console.error('[USAGE-CHECK] Error getting prompt usage:', usageError);
    throw new Error('Failed to check prompt usage');
  }

  console.log('[USAGE-CHECK] Current prompt usage:', usageData);
  console.log('[USAGE-CHECK] User tier:', tier, 'Limit:', tierLimit, 'Current usage:', usageData?.prompt_count || 0);

  // Check if user has exceeded the limit
  if (usageData && usageData.prompt_count >= tierLimit) {
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
    let upgradeMessage = '';
    
    if (tier === 'starter') {
      upgradeMessage = 'Upgrade to Creator (500 prompts/month) or Studio (1000 prompts/month) plan for more prompts.';
    } else if (tier === 'creator') {
      upgradeMessage = 'Upgrade to Studio plan for 1000 prompts per month.';
    } else {
      upgradeMessage = 'You have reached your monthly limit. Your usage will reset next month.';
    }
    
    console.log(`[USAGE-CHECK] Usage limit exceeded for ${tier} user. Current: ${usageData.prompt_count}, Limit: ${tierLimit}`);
    
    return {
      exceeded: true,
      error: 'USAGE_LIMIT_EXCEEDED',
      message: `You have reached your monthly limit of ${tierLimit} prompts on the ${tierName} plan. ${upgradeMessage}`,
      currentUsage: usageData.prompt_count,
      limit: tierLimit,
      tier: tier
    };
  }

  console.log(`[USAGE-CHECK] Usage check passed for ${tier} user. Current: ${usageData?.prompt_count || 0}, Limit: ${tierLimit}`);
  return { exceeded: false };
}

export async function incrementPromptCount(userId: string, tier: string) {
  console.log(`[USAGE-INCREMENT] Incrementing prompt count for ${tier} user:`, userId);
  
  const { data: newCount, error: incrementError } = await supabase
    .rpc('increment_prompt_count', { user_uuid: userId });

  if (incrementError) {
    console.error('[USAGE-INCREMENT] Error incrementing prompt count:', incrementError);
    // Don't fail the request, but log the error
  } else {
    console.log('[USAGE-INCREMENT] New prompt count:', newCount, 'for tier:', tier);
  }

  return newCount;
}
