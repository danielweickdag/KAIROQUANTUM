import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { SubscriptionAutomationService } from '../services/SubscriptionAutomationService';

const router = Router();

// Manual sync for a specific user
router.post('/sync/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = (req as any).user.id;

    // Only allow users to sync their own subscription or admins
    if (userId !== requestingUserId) {
      // TODO: Check if user is admin
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    await SubscriptionAutomationService.syncSubscriptionStatus(userId);

    res.json({
      success: true,
      message: 'Subscription synced successfully'
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sync all subscriptions (admin only)
router.post('/sync-all', authenticateToken, async (req, res) => {
  try {
    // TODO: Check if user is admin

    const result = await SubscriptionAutomationService.syncAllSubscriptions();

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Sync all error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Handle subscription change
router.post('/change', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { plan } = req.body;

    if (!['free', 'pro', 'elite'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan'
      });
    }

    const result = await SubscriptionAutomationService.handleSubscriptionChange(userId, plan);

    res.json(result);
  } catch (error: any) {
    console.error('Change subscription error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
