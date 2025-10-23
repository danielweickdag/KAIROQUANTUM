import Stripe from 'stripe';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic trading dashboard',
      'Manual trading',
      'Standard support',
      'Limited trades per month'
    ],
    stripePriceId: '' // No Stripe price for free plan
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Free',
      '95% Profit Bot access',
      'Advanced analytics',
      'Priority support',
      '20% trading fee discount',
      'Unlimited trades'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || ''
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 299,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom AI strategies',
      'Dedicated account manager',
      '50% trading fee discount',
      'API access',
      'Advanced risk management',
      'Real-time trade alerts'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_ELITE || ''
  }
};

class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }

  // Create or retrieve customer
  async createOrGetCustomer(email: string, userId: string, name?: string) {
    // Check if customer already exists
    const existingCustomers = await this.stripe.customers.list({
      email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    return await this.stripe.customers.create({
      email,
      metadata: {
        userId
      },
      name
    });
  }

  // Create checkout session for subscription
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });
  }

  // Create payment intent for one-time payment
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    description?: string
  ) {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  // Get customer's active subscriptions
  async getCustomerSubscriptions(customerId: string) {
    return await this.stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, immediately: boolean = false) {
    if (immediately) {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } else {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, newPriceId: string) {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
  }

  // Create portal session for customer to manage subscription
  async createPortalSession(customerId: string, returnUrl: string) {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  // Get invoice
  async getInvoice(invoiceId: string) {
    return await this.stripe.invoices.retrieve(invoiceId);
  }

  // Create invoice item for trading fees
  async createInvoiceItem(
    customerId: string,
    amount: number,
    description: string
  ) {
    return await this.stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(amount * 100),
      currency: 'usd',
      description,
    });
  }

  // Create and finalize invoice
  async createAndFinalizeInvoice(customerId: string) {
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      auto_advance: true, // Auto-finalize and attempt payment
    });

    return await this.stripe.invoices.finalizeInvoice(invoice.id);
  }

  // Get customer payment methods
  async getPaymentMethods(customerId: string) {
    return await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  // Get Stripe instance
  getStripe() {
    return this.stripe;
  }
}

export const stripeService = new StripeService();
export default stripeService;
