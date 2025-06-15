
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Request received", { method: req.method, url: req.url });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    logStep("Stripe key verified");

    // Create a Supabase client using the anon key for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      logStep("ERROR: Authentication failed", authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available");
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    let requestBody;
    try {
      requestBody = await req.json();
      logStep("Request body parsed", requestBody);
    } catch (parseError) {
      logStep("ERROR: Failed to parse request body", parseError);
      throw new Error("Invalid request body");
    }

    const { planType } = requestBody;
    if (!planType) {
      logStep("ERROR: No planType provided");
      throw new Error("planType is required");
    }
    logStep("Plan type received", { planType });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
      logStep("Customer lookup completed", { found: customers.data.length > 0 });
    } catch (stripeError) {
      logStep("ERROR: Failed to lookup customer", stripeError);
      throw new Error("Failed to lookup customer in Stripe");
    }

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Define pricing based on plan type
    const pricingConfig = {
      creator: {
        name: "Creator Plan",
        amount: 1900, // $19.00
        description: "Unlimited prompts, all platforms, advanced features"
      },
      studio: {
        name: "Studio Plan", 
        amount: 4900, // $49.00
        description: "Everything in Creator plus team collaboration and API access"
      }
    };

    const selectedPlan = pricingConfig[planType as keyof typeof pricingConfig];
    if (!selectedPlan) {
      logStep("ERROR: Invalid plan type", { planType });
      throw new Error(`Invalid plan type: ${planType}`);
    }

    logStep("Creating checkout session", { plan: selectedPlan });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("Using origin", { origin });

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: selectedPlan.name,
                description: selectedPlan.description
              },
              unit_amount: selectedPlan.amount,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancelled`,
        metadata: {
          user_id: user.id,
          plan_type: planType
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
      });

      logStep("Checkout session created successfully", { 
        sessionId: session.id, 
        url: session.url ? "URL_PRESENT" : "NO_URL" 
      });
    } catch (stripeError) {
      logStep("ERROR: Failed to create checkout session", stripeError);
      throw new Error(`Failed to create checkout session: ${stripeError.message}`);
    }

    if (!session.url) {
      logStep("ERROR: No checkout URL in session");
      throw new Error("No checkout URL returned from Stripe");
    }

    const response = { url: session.url };
    logStep("Returning response", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage, stack: error.stack });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check the function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
