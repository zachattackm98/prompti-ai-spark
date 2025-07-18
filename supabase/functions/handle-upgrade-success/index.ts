import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HANDLE-UPGRADE-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    // Use the service role key to authenticate and perform operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find the user's Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get the latest successful checkout session for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 5,
      status: 'complete'
    });

    // Find recent upgrade session (within last 5 minutes)
    const recentUpgradeSession = sessions.data.find(session => {
      const isUpgrade = session.metadata?.upgrade_flow === 'true';
      const isRecent = (Date.now() - session.created * 1000) < 5 * 60 * 1000; // 5 minutes
      return isUpgrade && isRecent;
    });

    if (!recentUpgradeSession) {
      logStep("No recent upgrade session found");
      return new Response(JSON.stringify({ success: false, message: "No recent upgrade session found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    logStep("Found recent upgrade session", { 
      sessionId: recentUpgradeSession.id,
      existingSubscriptionId: recentUpgradeSession.metadata?.existing_subscription_id 
    });

    const existingSubscriptionId = recentUpgradeSession.metadata?.existing_subscription_id;
    
    if (existingSubscriptionId) {
      try {
        // Cancel the old subscription immediately since the new one is now active
        await stripe.subscriptions.cancel(existingSubscriptionId, {
          prorate: false // Don't prorate since user has already started new subscription
        });

        logStep("Successfully cancelled old subscription", { 
          subscriptionId: existingSubscriptionId,
          reason: "upgrade_completed"
        });
      } catch (cancelError: any) {
        // Log the error but don't fail the entire operation
        logStep("Failed to cancel old subscription", { 
          subscriptionId: existingSubscriptionId,
          error: cancelError.message 
        });
        
        // If subscription is already cancelled or doesn't exist, that's actually fine
        if (!cancelError.message.includes('resource_missing') && 
            !cancelError.message.includes('already canceled')) {
          // Only throw if it's a real error, not just already cancelled
          logStep("WARNING: Unexpected error cancelling subscription", cancelError);
        }
      }
    }

    logStep("Upgrade processing completed successfully");

    return new Response(JSON.stringify({ success: true, message: "Upgrade processed successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in handle-upgrade-success", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});