import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { FeeAndTaxService } from '../services/FeeAndTaxService';
import { TRANSACTION_FEES, SUBSCRIPTION_FEE_DISCOUNTS } from '../config/fees';

const router = Router();

/**
 * Calculate trading fee
 * POST /api/fees/calculate/trading
 */
router.post('/calculate/trading', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, assetType, quantity } = req.body;

    if (!amount || !assetType) {
      return res.status(400).json({
        success: false,
        error: 'Amount and asset type are required'
      });
    }

    const calculation = await FeeAndTaxService.calculateTradingFee(
      userId,
      Math.floor(amount * 100), // Convert to cents
      assetType,
      quantity
    );

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Trading fee calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate trading fee'
    });
  }
});

/**
 * Calculate withdrawal fee
 * POST /api/fees/calculate/withdrawal
 */
router.post('/calculate/withdrawal', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, method, wireDomestic } = req.body;

    if (!amount || !method) {
      return res.status(400).json({
        success: false,
        error: 'Amount and method are required'
      });
    }

    const calculation = await FeeAndTaxService.calculateWithdrawalFee(
      userId,
      Math.floor(amount * 100),
      method,
      wireDomestic
    );

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Withdrawal fee calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate withdrawal fee'
    });
  }
});

/**
 * Calculate deposit fee
 * POST /api/fees/calculate/deposit
 */
router.post('/calculate/deposit', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({
        success: false,
        error: 'Amount and method are required'
      });
    }

    const calculation = await FeeAndTaxService.calculateDepositFee(
      userId,
      Math.floor(amount * 100),
      method
    );

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Deposit fee calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate deposit fee'
    });
  }
});

/**
 * Calculate payout fee
 * POST /api/fees/calculate/payout
 */
router.post('/calculate/payout', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, speed } = req.body;

    if (!amount || !speed) {
      return res.status(400).json({
        success: false,
        error: 'Amount and speed are required'
      });
    }

    const calculation = await FeeAndTaxService.calculatePayoutFee(
      userId,
      Math.floor(amount * 100),
      speed
    );

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Payout fee calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate payout fee'
    });
  }
});

/**
 * Create withdrawal
 * POST /api/fees/withdrawal
 */
router.post('/withdrawal', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, method, speed, destination, metadata } = req.body;

    if (!amount || !method || !speed || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Amount, method, speed, and destination are required'
      });
    }

    const withdrawal = await FeeAndTaxService.createWithdrawal(
      userId,
      Math.floor(amount * 100),
      method,
      speed,
      destination,
      metadata
    );

    res.json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        amount: (withdrawal.amount / 100).toFixed(2),
        fee: (withdrawal.fee / 100).toFixed(2),
        tax: (withdrawal.fee / 100).toFixed(2),
        netAmount: (withdrawal.total / 100).toFixed(2),
        status: withdrawal.status,
        method: withdrawal.method,
        speed: (withdrawal.metadata as any)?.speed || 'standard'
      }
    });
  } catch (error) {
    console.error('Withdrawal creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create withdrawal'
    });
  }
});

/**
 * Create payout
 * POST /api/fees/payout
 */
router.post('/payout', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount, method, speed, destination, metadata } = req.body;

    if (!amount || !method || !speed || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Amount, method, speed, and destination are required'
      });
    }

    const payout = await FeeAndTaxService.createPayout(
      userId,
      Math.floor(amount * 100),
      method,
      speed,
      destination,
      metadata
    );

    res.json({
      success: true,
      payout: {
        id: payout.id,
        amount: (payout.amount / 100).toFixed(2),
        fee: (payout.fee / 100).toFixed(2),
        tax: (payout.fee / 100).toFixed(2),
        netAmount: (payout.total / 100).toFixed(2),
        status: payout.status,
        method: payout.method,
        speed: (payout.metadata as any)?.speed || 'standard'
      }
    });
  } catch (error) {
    console.error('Payout creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payout'
    });
  }
});

/**
 * Get fee summary
 * GET /api/fees/summary
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { startDate, endDate } = req.query;

    const summary = await FeeAndTaxService.getUserFeeSummary(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Fee summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fee summary'
    });
  }
});

/**
 * Get fee schedule (for transparency)
 * GET /api/fees/schedule
 */
router.get('/schedule', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // Get user's subscription tier
    const user = await require('@prisma/client').PrismaClient().user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true }
    });

    const tier = user?.subscriptionPlan || 'free';
    const discounts = SUBSCRIPTION_FEE_DISCOUNTS[tier as keyof typeof SUBSCRIPTION_FEE_DISCOUNTS];

    res.json({
      success: true,
      schedule: {
        trading: {
          stock: {
            baseRate: '0.25%',
            discount: discounts?.tradingFeeDiscount ? `${discounts.tradingFeeDiscount / 100}%` : '0%',
            effectiveRate: discounts?.tradingFeeDiscount
              ? `${(25 * (10000 - discounts.tradingFeeDiscount) / 10000 / 100).toFixed(2)}%`
              : '0.25%',
            min: '$1.00',
            max: '$100.00'
          },
          crypto: {
            baseRate: '0.50%',
            discount: discounts?.tradingFeeDiscount ? `${discounts.tradingFeeDiscount / 100}%` : '0%',
            min: '$2.00',
            max: 'None'
          },
          options: {
            perContract: '$0.65'
          }
        },
        withdrawal: {
          ach: 'Free',
          wireDomestic: '$25.00',
          wireInternational: '$45.00',
          crypto: '1% (min $5.00, max $50.00)',
          instant: '1.5% (min $3.00)',
          discount: discounts?.withdrawalFeeDiscount ? `${discounts.withdrawalFeeDiscount / 100}%` : '0%'
        },
        deposit: {
          ach: 'Free',
          wire: 'Free',
          creditCard: '2.9% + $0.30',
          crypto: '0.5% (min $1.00)'
        },
        payout: {
          standard: 'Free (7-10 days)',
          express: '1% (1-3 days, min $2.00, max $20.00)',
          instant: '1.5% (same day, min $3.00, max $50.00)'
        },
        subscriptionTier: tier,
        upgradeInfo: tier === 'free' ? 'Upgrade to Pro or Elite for reduced fees' : null
      }
    });
  } catch (error) {
    console.error('Fee schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fee schedule'
    });
  }
});

export default router;
