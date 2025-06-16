
import { logStep } from './logger.ts';
import { PlanConfig } from './types.ts';

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const priceConfig: Record<string, PlanConfig> = {
  creator: {
    name: "Creator Plan",
    priceId: "price_1RaScVICZdHRMUzHTatFuEle", // Live price for $19/month
    description: "Unlimited prompts, all platforms, advanced features"
  },
  studio: {
    name: "Studio Plan", 
    priceId: "price_1RaScvICZdHRMUzHNyN6F1uS", // Live price for $49/month
    description: "Everything in Creator plus team collaboration and API access"
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
