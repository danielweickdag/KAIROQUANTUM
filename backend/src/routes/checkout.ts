import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import stripeService, { SUBSCRIPTION_PLANS } from '../services/StripeService';

const router = Router();

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: 'Price ID is required'
      });
    }

    // Find plan by price ID
    const plan = Object.values(SUBSCRIPTION_PLANS).find(
      p => p.stripePriceId === priceId
    );

    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price ID'
      });
    }

    // Get or create customer
    const user = (req as any).user;
    const customer = await stripeService.createOrGetCustomer(
      user.email,
      userId,
      user.name
    );

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripeService.createCheckoutSession(
      customer.id,
      priceId,
      `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}/pricing`
    );

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

// Get checkout session
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripeService.getStripe().checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session'
    });
  }
});

export default router;
