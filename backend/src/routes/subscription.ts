import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { stripeService, SUBSCRIPTION_PLANS } from '../services/StripeService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all available plans
router.get('/plans', async (req, res) => {
  try {
    const plans = Object.values(SUBSCRIPTION_PLANS);

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
});

// Get current user's subscription
router.get('/current', authenticateToken, asyncHandler(async (req, res) => {
  const userId = (req as any).user.id;

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
      subscriptionEndDate: true
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  let activeSubscription = null;

  // If user has Stripe customer ID, get their subscriptions
  if (user.stripeCustomerId) {
    try {
      const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
      if (subscriptions.data.length > 0) {
        activeSubscription = subscriptions.data[0];
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  }

  res.json({
    success: true,
    data: {
      plan: user.subscriptionPlan || 'free',
      status: user.subscriptionStatus || 'inactive',
      endDate: user.subscriptionEndDate,
      stripeSubscription: activeSubscription
    }
  });
}));

// Create checkout session
router.post('/checkout', authenticateToken, asyncHandler(async (req, res) => {
  const userId = (req as any).user.id;
  const { planId } = req.body;

  if (!planId || !SUBSCRIPTION_PLANS[planId]) {
    return res.status(400).json({
      success: false,
      message: 'Invalid plan selected'
    });
  }

  const plan = SUBSCRIPTION_PLANS[planId];

  if (plan.id === 'free') {
    return res.status(400).json({
      success: false,
      message: 'Cannot create checkout for free plan'
    });
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      stripeCustomerId: true
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Create or get Stripe customer
  let customer;
  if (user.stripeCustomerId) {
    customer = await stripeService.getStripe().customers.retrieve(user.stripeCustomerId);
  } else {
    customer = await stripeService.createOrGetCustomer(
      user.email,
      userId,
      `${user.firstName} ${user.lastName}`
    );

    // Save customer ID to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    });
  }

  // Create checkout session
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_URL || 'https://yourdomain.com'
    : 'http://localhost:3000';

  const session = await stripeService.createCheckoutSession(
    customer.id,
    plan.stripePriceId,
    `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    `${baseUrl}/subscription/cancel`
  );

  res.json({
    success: true,
    data: {
      sessionId: session.id,
      url: session.url
    }
  });
}));

// Create portal session for managing subscription
router.post('/portal', authenticateToken, asyncHandler(async (req, res) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  });

  if (!user || !user.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_URL || 'https://yourdomain.com'
    : 'http://localhost:3000';

  const session = await stripeService.createPortalSession(
    user.stripeCustomerId,
    `${baseUrl}/subscription`
  );

  res.json({
    success: true,
    data: {
      url: session.url
    }
  });
}));

// Cancel subscription
router.post('/cancel', authenticateToken, asyncHandler(async (req, res) => {
  const userId = (req as any).user.id;
  const { immediately = false } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  });

  if (!user || !user.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  // Get active subscriptions
  const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);

  if (subscriptions.data.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  const subscription = subscriptions.data[0];

  // Cancel subscription
  const canceledSubscription = await stripeService.cancelSubscription(
    subscription.id,
    immediately
  );

  res.json({
    success: true,
    data: {
      subscription: canceledSubscription,
      message: immediately
        ? 'Subscription canceled immediately'
        : 'Subscription will be canceled at the end of the billing period'
    }
  });
}));

export default router;
