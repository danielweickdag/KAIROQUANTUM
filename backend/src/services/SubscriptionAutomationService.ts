import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import axios from 'axios';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export class SubscriptionAutomationService {
  /**
   * Automatically sync subscription status from Stripe to database
   */
  static async syncSubscriptionStatus(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
      });

      if (!user?.stripeCustomerId) {
        console.log(`No Stripe customer ID for user ${userId}`);
        return;
      }

      // Get subscriptions from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'all',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        // No subscription, set to free
        await this.updateUserSubscription(userId, {
          status: 'inactive',
          plan: 'free',
          endDate: null
        });
        return;
      }

      const subscription = subscriptions.data[0];
      const tier = subscription.items.data[0]?.price.metadata?.tier || 'pro';

      await this.updateUserSubscription(userId, {
        status: subscription.status,
        plan: tier,
        endDate: new Date(subscription.current_period_end * 1000)
      });

      console.log(`✅ Synced subscription for user ${userId}: ${tier} (${subscription.status})`);
    } catch (error) {
      console.error(`Failed to sync subscription for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user subscription in database and Python service
   */
  static async updateUserSubscription(
    userId: string,
    data: {
      status: string;
      plan: string;
      endDate: Date | null;
    }
  ): Promise<void> {
    // Update in main database
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: data.status,
        subscriptionPlan: data.plan,
        subscriptionEndDate: data.endDate
      }
    });

    // Sync to Python service
    try {
      await axios.post(`${pythonServiceUrl}/webhooks/stripe`, {
        type: 'subscription.updated',
        data: {
          object: {
            metadata: {
              user_id: userId,
              tier: data.plan
            },
            status: data.status,
            current_period_end: data.endDate ? Math.floor(data.endDate.getTime() / 1000) : null
          }
        }
      });
    } catch (error) {
      console.error('Failed to sync to Python service:', error);
    }
  }

  /**
   * Automatically handle subscription upgrades/downgrades
   */
  static async handleSubscriptionChange(
    userId: string,
    newPlan: 'free' | 'pro' | 'elite'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          stripeCustomerId: true,
          subscriptionPlan: true,
          subscriptionStatus: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // If downgrading to free, cancel subscription
      if (newPlan === 'free') {
        if (user.stripeCustomerId) {
          const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active'
          });

          for (const sub of subscriptions.data) {
            await stripe.subscriptions.cancel(sub.id);
          }
        }

        await this.updateUserSubscription(userId, {
          status: 'canceled',
          plan: 'free',
          endDate: null
        });

        return {
          success: true,
          message: 'Subscription canceled successfully'
        };
      }

      // For upgrades/downgrades, this would be handled by Stripe Checkout
      // This is just the automation after the fact
      return {
        success: true,
        message: 'Subscription change initiated'
      };
    } catch (error: any) {
      console.error('Subscription change error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Automatically handle failed payments
   */
  static async handlePaymentFailure(userId: string): Promise<void> {
    try {
      // Mark subscription as past_due
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'past_due'
        }
      });

      // TODO: Send email notification
      console.log(`📧 Should send payment failure notification to user ${userId}`);

      // Optionally, downgrade features after grace period
      // This could be a scheduled job that runs daily
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
    }
  }

  /**
   * Automatically provision features based on subscription tier
   */
  static async provisionFeatures(
    userId: string,
    tier: 'free' | 'pro' | 'elite'
  ): Promise<void> {
    const features = {
      free: {
        maxPositions: 5,
        autoTradingEnabled: false,
        aiSignalsEnabled: false,
        comparativeAnalyticsEnabled: false
      },
      pro: {
        maxPositions: 50,
        autoTradingEnabled: true,
        aiSignalsEnabled: true,
        comparativeAnalyticsEnabled: true
      },
      elite: {
        maxPositions: -1, // unlimited
        autoTradingEnabled: true,
        aiSignalsEnabled: true,
        comparativeAnalyticsEnabled: true
      }
    };

    const tierFeatures = features[tier];

    // Update user features in database
    // This assumes you have a UserFeatures table
    console.log(`Provisioning features for user ${userId}:`, tierFeatures);

    // You can create feature flags table:
    /*
    await prisma.userFeatures.upsert({
      where: { userId },
      create: {
        userId,
        ...tierFeatures
      },
      update: tierFeatures
    });
    */
  }

  /**
   * Scheduled job: Sync all active subscriptions
   * Run this daily to ensure consistency
   */
  static async syncAllSubscriptions(): Promise<{
    synced: number;
    failed: number;
  }> {
    let synced = 0;
    let failed = 0;

    try {
      const users = await prisma.user.findMany({
        where: {
          stripeCustomerId: { not: null }
        },
        select: { id: true }
      });

      for (const user of users) {
        try {
          await this.syncSubscriptionStatus(user.id);
          synced++;
        } catch (error) {
          console.error(`Failed to sync user ${user.id}:`, error);
          failed++;
        }
      }

      console.log(`✅ Subscription sync complete: ${synced} synced, ${failed} failed`);
      return { synced, failed };
    } catch (error) {
      console.error('Sync all subscriptions error:', error);
      throw error;
    }
  }

  /**
   * Automatically handle trial period expiration
   */
  static async handleTrialExpiration(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
      });

      if (!user?.stripeCustomerId) return;

      // Check for trial subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'trialing'
      });

      for (const sub of subscriptions.data) {
        const trialEnd = new Date(sub.trial_end! * 1000);
        const now = new Date();

        if (trialEnd <= now) {
          console.log(`Trial expired for user ${userId}, subscription ${sub.id}`);

          // Send notification
          // TODO: Implement email service
          console.log(`📧 Should notify user ${userId} about trial expiration`);
        }
      }
    } catch (error) {
      console.error('Handle trial expiration error:', error);
    }
  }
}
