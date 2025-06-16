
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
    logStep("WARNING: Unknown price ID, defaulting to starter", { priceId });
    return 'starter';
  }

  private getTierDisplayName(tier: string): string {
    const displayNames: Record<string, string> = {
      'starter': 'Starter',
      'creator': 'Creator',
      'studio': 'Studio'
    };
    return displayNames[tier] || tier;
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
        if (!priceId) {
          logStep("WARNING: Subscription found without price ID", { subscriptionId: subscription.id });
          continue;
        }

        const currentTier = this.getTierFromPriceId(priceId);
        const currentTierLevel = tierHierarchy[currentTier] || 0;

        logStep("Found active subscription", {
          subscriptionId: subscription.id,
          currentTier,
          currentTierLevel,
          requestedTierLevel,
          priceId,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        });

        // Handle tier comparisons
        if (requestedTierLevel === currentTierLevel) {
          const tierDisplayName = this.getTierDisplayName(currentTier);
          logStep("User already has this tier", { currentTier });
          throw new Error(`You already have an active ${tierDisplayName} subscription. Use the customer portal to manage your existing subscription.`);

        } else if (requestedTierLevel < currentTierLevel) {
          const currentTierDisplay = this.getTierDisplayName(currentTier);
          const requestedTierDisplay = this.getTierDisplayName(requestedTier);
          logStep("Attempting to downgrade", { from: currentTier, to: requestedTier });
          throw new Error(`Cannot downgrade from ${currentTierDisplay} to ${requestedTierDisplay} through checkout. Please use the customer portal to manage your subscription.`);

        } else if (requestedTierLevel > currentTierLevel) {
          // Upgrading to higher tier - schedule cancellation at period end
          const currentTierDisplay = this.getTierDisplayName(currentTier);
          const requestedTierDisplay = this.getTierDisplayName(requestedTier);
          
          logStep("Upgrading subscription - scheduling cancellation at period end", {
            from: currentTier,
            to: requestedTier,
            subscriptionId: subscription.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
          });

          // Check if already scheduled for cancellation
          if (subscription.cancel_at_period_end) {
            logStep("Subscription already scheduled for cancellation", {
              subscriptionId: subscription.id,
              cancelAt: new Date(subscription.current_period_end * 1000).toISOString()
            });
            // Continue with checkout - new subscription will start after current period
          } else {
            // Schedule current subscription for cancellation at period end
            await this.stripe.subscriptions.update(subscription.id, {
              cancel_at_period_end: true,
              metadata: {
                cancelled_for_upgrade: 'true',
                upgrade_to_tier: requestedTier,
                upgrade_timestamp: new Date().toISOString()
              }
            });

            logStep("Successfully scheduled existing subscription for cancellation", {
              subscriptionId: subscription.id,
              previousTier: currentTier,
              upgradeToTier: requestedTier,
              willCancelAt: new Date(subscription.current_period_end * 1000).toISOString()
            });
          }

          // Add informative message for user
          logStep("UPGRADE_INFO: Current subscription continues until period end", {
            currentTier: currentTierDisplay,
            newTier: requestedTierDisplay,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
          });
        }
      }

    } catch (error: any) {
      if (error.message.includes('already have') || 
          error.message.includes('Cannot downgrade') || 
          error.message.includes('customer portal')) {
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

    logStep("Using plan configuration", { 
      planType, 
      priceId: selectedPlan.priceId,
      displayName: this.getTierDisplayName(planType)
    });

    // If customer exists, check and handle existing subscriptions
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
          upgrade_flow: customerId ? 'true' : 'false',
          checkout_timestamp: new Date().toISOString()
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        subscription_data: {
          metadata: {
            user_id: userId,
            plan_type: planType,
            created_via: 'lovable_checkout'
          }
        }
      };

      logStep("Session config prepared", {
        customer: customerId ? "EXISTING_CUSTOMER" : "NEW_CUSTOMER",
        customer_email: customerId ? undefined : "PROVIDED",
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
