
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      return new Response(JSON.stringify({ 
        error: "No authorization header provided",
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    if (!token || token === authHeader) {
      logStep("ERROR: Invalid authorization header format");
      return new Response(JSON.stringify({ 
        error: "Invalid authorization header format",
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    logStep("Token extracted", { tokenLength: token.length });

    // Create a client for authentication using anon key
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: Authentication failed", { error: userError.message, code: userError.status });
      return new Response(JSON.stringify({ 
        error: `Authentication failed: ${userError.message}`,
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available", { user: user ? "exists" : "null" });
      return new Response(JSON.stringify({ 
        error: "User not authenticated or email not available",
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // CHECK FOR TEST MODE - Clean separation point
    const testMode = Deno.env.get("TEST_MODE");
    if (testMode === "true") {
      logStep("🧪 TEST MODE ACTIVE - Reading from Supabase instead of Stripe");
      
      try {
        // Read subscription data directly from subscribers table
        const { data: subscriberData, error: subscriberError } = await supabaseClient
          .from("subscribers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (subscriberError && subscriberError.code !== 'PGRST116') {
          logStep("Test mode: Error fetching subscriber data", { error: subscriberError });
          throw subscriberError;
        }

        if (!subscriberData) {
          logStep("Test mode: No subscriber record found, creating default");
          // Create default subscriber record
          const { data: newSubscriber, error: insertError } = await supabaseClient
            .from("subscribers")
            .insert({
              email: user.email,
              user_id: user.id,
              stripe_customer_id: null,
              subscribed: false,
              subscription_tier: "starter",
              subscription_end: null,
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            logStep("Test mode: Error creating subscriber record", { error: insertError });
            throw insertError;
          }

          logStep("Test mode: Created default subscriber record", newSubscriber);
          return new Response(JSON.stringify({
            subscribed: false,
            subscription_tier: "starter",
            subscription_end: null,
            billing_details: null
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        logStep("Test mode: Found subscriber data", {
          subscribed: subscriberData.subscribed,
          tier: subscriberData.subscription_tier,
          end: subscriberData.subscription_end
        });

        // Return the same format as production mode
        return new Response(JSON.stringify({
          subscribed: subscriberData.subscribed || false,
          subscription_tier: subscriberData.subscription_tier || "starter",
          subscription_end: subscriberData.subscription_end,
          billing_details: null // No billing details in test mode
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      } catch (testError: any) {
        logStep("Test mode: Error in test mode logic", { error: testError.message });
        // Fallback to default in test mode
        return new Response(JSON.stringify({
          subscribed: false,
          subscription_tier: "starter",
          subscription_end: null,
          billing_details: null
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // PRODUCTION MODE - All existing Stripe logic remains unchanged
    logStep("🚀 PRODUCTION MODE - Using Stripe verification");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      return new Response(JSON.stringify({ 
        error: "STRIPE_SECRET_KEY is not set",
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    try {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length === 0) {
        logStep("No customer found, updating unsubscribed state");
        await supabaseClient.from("subscribers").upsert({
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: "starter",
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        return new Response(JSON.stringify({ 
          subscribed: false, 
          subscription_tier: "starter",
          billing_details: null
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      const hasActiveSub = subscriptions.data.length > 0;
      let subscriptionTier = "starter";
      let subscriptionEnd = null;
      let billingDetails = null;

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
        
        // Determine subscription tier from price
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount >= 4900) {
          subscriptionTier = "studio";
        } else if (amount >= 1900) {
          subscriptionTier = "creator";
        } else {
          subscriptionTier = "starter";
        }

        // Get billing details
        billingDetails = {
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          amount: amount / 100, // Convert from cents to dollars
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          created: new Date(subscription.created * 1000).toISOString()
        };

        logStep("Determined subscription tier and billing details", { 
          priceId, 
          amount, 
          subscriptionTier,
          billingDetails 
        });
      } else {
        logStep("No active subscription found");
      }

      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
      return new Response(JSON.stringify({
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        billing_details: billingDetails
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError: any) {
      logStep("ERROR: Stripe API error", { error: stripeError.message });
      return new Response(JSON.stringify({ 
        error: `Stripe error: ${stripeError.message}`,
        subscription_tier: "starter",
        subscribed: false,
        billing_details: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      subscription_tier: "starter",
      subscribed: false,
      billing_details: null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
