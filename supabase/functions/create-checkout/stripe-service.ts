
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

  private getTierHierarchy(): Record<string, number> {
    return {
      'starter': 0,
      'creator': 1,
      'studio': 2
    };
  }

  private getTierFromPriceId(priceId: string): string {
    for (const [tier, config] of Object.entries(priceConfig)) {
      if (config.priceId === priceId) {
        return tier;
      }
    }
    return 'starter';
  }

  async checkAndCancelExistingSubscription(customerId: string, requestedTier: string): Promise<void> {
    try {
      logStep("Checking for existing active subscriptions", { customerId, requestedTier });
      
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 10
      });

      if (subscriptions.data.length === 0) {
        logStep("No active subscriptions found");
        return;
      }

      const tierHierarchy = this.getTierHierarchy();
      const requestedTierLevel = tierHierarchy[requestedTier] || 0;

      for (const subscription of subscriptions.data) {
        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) continue;

        const currentTier = this.getTierFromPriceId(priceId);
        const currentTierLevel = tierHierarchy[currentTier] || 0;

        logStep("Found active subscription", {
          subscriptionId: subscription.id,
          currentTier,
          currentTierLevel,
          requestedTierLevel,
          priceId
        });

        // Cancel existing subscription if upgrading to higher tier
        if (requestedTierLevel > currentTierLevel) {
          logStep("Upgrading subscription - cancelling existing", {
            from: currentTier,
            to: requestedTier,
            subscriptionId: subscription.id
          });

          await this.stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: false, // Cancel immediately
            proration_behavior: 'create_prorations' // Create prorations for unused time
          });

          // Actually cancel the subscription now
          await this.stripe.subscriptions.cancel(subscription.id, {
            prorate: true,
            invoice_now: true
          });

          logStep("Successfully cancelled existing subscription", {
            subscriptionId: subscription.id,
            previousTier: currentTier
          });

        } else if (requestedTierLevel === currentTierLevel) {
          logStep("User already has this tier", { currentTier: currentTier });
          throw new Error(`You already have an active ${currentTier} subscription`);

        } else if (requestedTierLevel < currentTierLevel) {
          logStep("Attempting to downgrade", { from: currentTier, to: requestedTier });
          throw new Error(`Cannot downgrade from ${currentTier} to ${requestedTier}. Please use the customer portal to manage your subscription.`);
        }
      }

    } catch (error: any) {
      if (error.message.includes('already have') || error.message.includes('Cannot downgrade')) {
        throw error; // Re-throw user-facing errors
      }
      logStep("ERROR: Failed to check/cancel existing subscriptions", error);
      throw new Error("Failed to process existing subscriptions");
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

    // If customer exists, check and cancel existing subscriptions
    if (customerId) {
      await this.checkAndCancelExistingSubscription(customerId, planType);
    }

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
          user_email: userEmail,
          upgrade_flow: customerId ? 'true' : 'false'
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        // Enable proration for upgrades
        subscription_data: {
          proration_behavior: 'create_prorations'
        }
      };

      logStep("Session config prepared", {
        customer: customerId ? "EXISTING_CUSTOMER_ID" : undefined,
        customer_email: customerId ? undefined : "USER_EMAIL",
        priceId: selectedPlan.priceId,
        planType: planType,
        upgradeFlow: customerId ? true : false
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
