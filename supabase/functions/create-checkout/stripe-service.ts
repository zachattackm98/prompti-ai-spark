
import Stripe from "https://esm.sh/stripe@14.21.0";
import { logStep } from './logger.ts';
import { priceConfig } from './config.ts';
import { PlanConfig } from './types.ts';

export class StripeService {
  private stripe: Stripe;

  constructor(stripeKey: string) {
    try {
      logStep("Initializing Stripe client...");
      this.stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      logStep("Stripe client initialized successfully");
    } catch (stripeInitError) {
      logStep("ERROR: Failed to initialize Stripe client", stripeInitError);
      throw new Error("Failed to initialize Stripe client");
    }
  }

  async findOrCreateCustomer(email: string): Promise<string | undefined> {
    try {
      logStep("Looking up existing customer", { email });
      const customers = await this.stripe.customers.list({ email, limit: 1 });
      logStep("Customer lookup completed", { found: customers.data.length > 0 });
      
      if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
        return customerId;
      } else {
        logStep("No existing customer found, will create new one");
        return undefined;
      }
    } catch (stripeError) {
      logStep("ERROR: Failed to lookup customer", stripeError);
      throw new Error("Failed to lookup customer in Stripe");
    }
  }

  async createCheckoutSession(
    planType: string,
    customerId: string | undefined,
    userEmail: string,
    userId: string,
    origin: string
  ): Promise<Stripe.Checkout.Session> {
    const selectedPlan = priceConfig[planType as keyof typeof priceConfig];
    if (!selectedPlan) {
      logStep("ERROR: Invalid plan configuration", { planType });
      throw new Error(`Invalid plan type: ${planType}`);
    }

    logStep("Using pre-existing price", { plan: selectedPlan });

    try {
      logStep("Preparing checkout session configuration...");
      
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [
          {
            price: selectedPlan.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancelled`,
        metadata: {
          user_id: userId,
          plan_type: planType,
          user_email: userEmail
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
      };

      logStep("Session config prepared", {
        customer: customerId ? "EXISTING_CUSTOMER_ID" : undefined,
        customer_email: customerId ? undefined : "USER_EMAIL",
        priceId: selectedPlan.priceId,
        planType: planType
      });
      
      logStep("Creating Stripe checkout session...");
      
      const session = await this.stripe.checkout.sessions.create(sessionConfig);

      logStep("Checkout session created successfully", { 
        sessionId: session.id, 
        url: session.url ? "URL_PRESENT" : "NO_URL",
        status: session.status,
        mode: session.mode,
        paymentStatus: session.payment_status
      });

      return session;
    } catch (stripeError: any) {
      logStep("ERROR: Stripe session creation failed", { 
        message: stripeError.message, 
        type: stripeError.type,
        code: stripeError.code,
        statusCode: stripeError.statusCode
      });
      
      if (stripeError.type === 'invalid_request_error') {
        throw new Error(`Invalid request to Stripe: ${stripeError.message}`);
      } else {
        throw new Error(`Stripe error: ${stripeError.message}`);
      }
    }
  }
}
