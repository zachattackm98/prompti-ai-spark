
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
    logStep("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Verify Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    logStep("Stripe key verified", { keyExists: true, keyLength: stripeKey.length });

    // Create Supabase client for authentication
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      logStep("ERROR: Supabase environment variables missing");
      throw new Error("Supabase configuration is incomplete");
    }

    logStep("Creating Supabase client");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get and validate authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found", { headerLength: authHeader.length });

    // Extract and validate token
    const token = authHeader.replace("Bearer ", "");
    if (!token || token === authHeader) {
      logStep("ERROR: Invalid authorization header format");
      throw new Error("Invalid authorization header format");
    }
    logStep("Token extracted", { tokenLength: token.length });

    // Authenticate user
    let user;
    try {
      const { data, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError) {
        logStep("ERROR: Authentication failed", { error: authError.message, code: authError.status });
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      
      user = data.user;
      if (!user?.email) {
        logStep("ERROR: User not authenticated or email not available", { user: user ? "exists" : "null" });
        throw new Error("User not authenticated or email not available");
      }
      logStep("User authenticated", { userId: user.id, email: user.email });
    } catch (authError) {
      logStep("ERROR: Authentication process failed", authError);
      throw new Error(`Authentication process failed: ${authError.message}`);
    }

    // Parse request body - read only once
    let planType;
    try {
      logStep("Reading request body...");
      
      const requestBody = await req.json();
      logStep("Request body parsed", requestBody);

      planType = requestBody.planType;
      if (!planType) {
        logStep("ERROR: No planType provided", requestBody);
        throw new Error("planType is required in request body");
      }
      
      if (!['creator', 'studio'].includes(planType)) {
        logStep("ERROR: Invalid planType", { planType });
        throw new Error(`Invalid planType: ${planType}. Must be 'creator' or 'studio'`);
      }
      
      logStep("Plan type validated", { planType });
    } catch (parseError) {
      logStep("ERROR: Request body parsing failed", parseError);
      throw new Error(`Failed to parse request body: ${parseError.message}`);
    }

    // Initialize Stripe with error handling
    let stripe;
    try {
      logStep("Initializing Stripe client...");
      stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      logStep("Stripe client initialized successfully");
    } catch (stripeInitError) {
      logStep("ERROR: Failed to initialize Stripe client", stripeInitError);
      throw new Error("Failed to initialize Stripe client");
    }

    // Check if customer exists
    let customers;
    let customerId;
    try {
      logStep("Looking up existing customer", { email: user.email });
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
      logStep("Customer lookup completed", { found: customers.data.length > 0 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      } else {
        logStep("No existing customer found, will create new one");
      }
    } catch (stripeError) {
      logStep("ERROR: Failed to lookup customer", stripeError);
      throw new Error("Failed to lookup customer in Stripe");
    }

    // Define pre-existing Stripe Price IDs
    const priceConfig = {
      creator: {
        name: "Creator Plan",
        priceId: "price_1RaQzNICZdHRMUzHItWsxCd2", // $19/month
        description: "Unlimited prompts, all platforms, advanced features"
      },
      studio: {
        name: "Studio Plan", 
        priceId: "price_1RaRHXICZdHRMUzHVqbk8v4i", // $49/month
        description: "Everything in Creator plus team collaboration and API access"
      }
    };

    const selectedPlan = priceConfig[planType as keyof typeof priceConfig];
    if (!selectedPlan) {
      logStep("ERROR: Invalid plan configuration", { planType });
      throw new Error(`Invalid plan type: ${planType}`);
    }

    logStep("Using pre-existing price", { plan: selectedPlan });

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";
    logStep("Using origin for redirects", { origin });

    // Create checkout session with pre-existing Price ID
    let session;
    try {
      logStep("Preparing checkout session configuration...");
      
      const sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price: selectedPlan.priceId, // Use pre-existing Price ID
            quantity: 1,
          },
        ],
        mode: "subscription" as const,
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancelled`,
        metadata: {
          user_id: user.id,
          plan_type: planType,
          user_email: user.email
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required' as const,
      };

      logStep("Session config prepared", {
        customer: customerId ? "EXISTING_CUSTOMER_ID" : undefined,
        customer_email: customerId ? undefined : "USER_EMAIL",
        priceId: selectedPlan.priceId,
        planType: planType
      });
      
      logStep("Creating Stripe checkout session...");
      
      session = await stripe.checkout.sessions.create(sessionConfig);

      logStep("Checkout session created successfully", { 
        sessionId: session.id, 
        url: session.url ? "URL_PRESENT" : "NO_URL",
        status: session.status,
        mode: session.mode,
        paymentStatus: session.payment_status
      });
    } catch (stripeError: any) {
      logStep("ERROR: Stripe session creation failed", { 
        message: stripeError.message, 
        type: stripeError.type,
        code: stripeError.code,
        statusCode: stripeError.statusCode
      });
      
      // Provide more specific error information
      if (stripeError.type === 'invalid_request_error') {
        throw new Error(`Invalid request to Stripe: ${stripeError.message}`);
      } else {
        throw new Error(`Stripe error: ${stripeError.message}`);
      }
    }

    // Validate session response
    if (!session) {
      logStep("ERROR: No session returned from Stripe");
      throw new Error("No session returned from Stripe");
    }

    if (!session.url) {
      logStep("ERROR: No checkout URL in session response", { sessionId: session.id });
      throw new Error("No checkout URL returned from Stripe");
    }

    const response = { url: session.url };
    logStep("Returning successful response", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      message: errorMessage,
      timestamp: new Date().toISOString()
    };
    
    logStep("ERROR in create-checkout", errorDetails);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check the function logs for more information",
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
