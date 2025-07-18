
import { logStep } from './logger.ts';
import { PlanConfig } from './types.ts';
import { TIER_CONFIGS } from '../shared/subscription-config.ts';

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const priceConfig: Record<string, PlanConfig> = {
  creator: {
    name: TIER_CONFIGS.creator.name,
    priceId: TIER_CONFIGS.creator.priceId,
    description: TIER_CONFIGS.creator.description
  },
  studio: {
    name: TIER_CONFIGS.studio.name,
    priceId: TIER_CONFIGS.studio.priceId,
    description: TIER_CONFIGS.studio.description
  }
};

export const validateEnvironment = () => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  
  if (!stripeKey) {
    logStep("ERROR: STRIPE_SECRET_KEY is not set");
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    logStep("ERROR: Supabase environment variables missing");
    throw new Error("Supabase configuration is incomplete");
  }
  
  logStep("Environment variables validated", { 
    stripeKeyExists: true, 
    stripeKeyLength: stripeKey.length,
    supabaseConfigured: true
  });
  
  return { stripeKey, supabaseUrl, supabaseAnonKey };
};
