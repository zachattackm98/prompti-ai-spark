
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, validateEnvironment } from './config.ts';
import { authenticateUser } from './auth.ts';
import { parseRequestBody } from './request-parser.ts';
import { StripeService } from './stripe-service.ts';
import { logStep } from './logger.ts';
import { CheckoutResponse, ErrorResponse } from './types.ts';

serve(async (req) => {
  logStep("Request received", { method: req.method, url: req.url });

  if (req.method === "OPTIONS") {
    logStep("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Validate environment variables
    const { stripeKey, supabaseUrl, supabaseAnonKey } = validateEnvironment();

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    const user = await authenticateUser(supabaseUrl, supabaseAnonKey, authHeader);

    // Parse request body
    const { planType } = await parseRequestBody(req);

    // Initialize Stripe service
    const stripeService = new StripeService(stripeKey);

    // Find or create customer
    const customerId = await stripeService.findOrCreateCustomer(user.email!);

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";
    logStep("Using origin for redirects", { origin });

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      planType,
      customerId,
      user.email!,
      user.id,
      origin
    );

    // Validate session response
    if (!session) {
      logStep("ERROR: No session returned from Stripe");
      throw new Error("No session returned from Stripe");
    }

    if (!session.url) {
      logStep("ERROR: No checkout URL in session response", { sessionId: session.id });
      throw new Error("No checkout URL returned from Stripe");
    }

    const response: CheckoutResponse = { url: session.url };
    logStep("Returning successful response", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorResponse: ErrorResponse = {
      error: errorMessage,
      details: "Check the function logs for more information",
      timestamp: new Date().toISOString()
    };
    
    logStep("ERROR in create-checkout", errorResponse);
    
    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
