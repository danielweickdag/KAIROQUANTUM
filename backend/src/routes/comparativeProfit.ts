import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { comparativeProfitService } from '../services/ComparativeProfitService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Middleware to check subscription tier for premium features
 */
const requireProOrElite = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true, subscriptionStatus: true },
    });

    const allowedPlans = ['pro', 'elite'];
    const isActive = user?.subscriptionStatus === 'active';
    const hasPlan = user?.subscriptionPlan && allowedPlans.includes(user.subscriptionPlan.toLowerCase());

    if (!hasPlan || !isActive) {
      return res.status(403).json({
        success: false,
        error: 'This feature requires a Pro or Elite subscription',
        upgrade: {
          message: 'Upgrade to Pro or Elite to access comparative profit analysis',
          plans: [
            { name: 'Pro', price: 99, features: ['Comparative Profit Analysis', '95% Profit Bot', 'Advanced Analytics'] },
            { name: 'Elite', price: 299, features: ['Everything in Pro', 'Custom AI Strategies', 'API Access', 'Dedicated Manager'] },
          ],
        },
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify subscription',
    });
  }
};

/**
 * GET /api/comparative-profit/benchmarks
 * Get available benchmark indices
 */
router.get('/benchmarks', authenticateToken, asyncHandler(async (req, res) => {
  const benchmarks = comparativeProfitService.getAvailableBenchmarks();

  res.json({
    success: true,
    data: benchmarks,
  });
}));

/**
 * GET /api/comparative-profit/performance
 * Get user's trading performance
 */
router.get('/performance', authenticateToken, requireProOrElite, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate as string) : undefined;
  const end = endDate ? new Date(endDate as string) : undefined;

  const performance = await comparativeProfitService.calculateUserPerformance(userId, start, end);

  res.json({
    success: true,
    data: performance,
  });
}));

/**
 * POST /api/comparative-profit/compare
 * Compare user performance against benchmarks
 */
router.post('/compare', authenticateToken, requireProOrElite, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { benchmarks, startDate, endDate } = req.body;

  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  const comparison = await comparativeProfitService.compareAgainstBenchmarks(
    userId,
    benchmarks,
    start,
    end
  );

  res.json({
    success: true,
    data: comparison,
  });
}));

/**
 * GET /api/comparative-profit/breakdown
 * Get performance breakdown by time period
 */
router.get('/breakdown', authenticateToken, requireProOrElite, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period } = req.query;

  const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
  const selectedPeriod = (period && validPeriods.includes(period as string))
    ? period as 'daily' | 'weekly' | 'monthly' | 'yearly'
    : 'monthly';

  const breakdown = await comparativeProfitService.getPerformanceBreakdown(userId, selectedPeriod);

  res.json({
    success: true,
    data: breakdown,
    period: selectedPeriod,
  });
}));

/**
 * GET /api/comparative-profit/sharpe-ratio
 * Calculate Sharpe Ratio (risk-adjusted returns)
 */
router.get('/sharpe-ratio', authenticateToken, requireProOrElite, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { riskFreeRate } = req.query;

  const rate = riskFreeRate ? parseFloat(riskFreeRate as string) : 0.02; // Default 2%

  const sharpeRatio = await comparativeProfitService.calculateSharpeRatio(userId, rate);

  res.json({
    success: true,
    data: {
      sharpeRatio,
      riskFreeRate: rate,
      interpretation: sharpeRatio > 1 ? 'Excellent' : sharpeRatio > 0.5 ? 'Good' : sharpeRatio > 0 ? 'Fair' : 'Poor',
    },
  });
}));

/**
 * GET /api/comparative-profit/dashboard
 * Get comprehensive dashboard data (all-in-one endpoint)
 */
router.get('/dashboard', authenticateToken, requireProOrElite, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all data in parallel for performance
  const [
    userPerformance,
    comparison,
    sharpeRatio,
  ] = await Promise.all([
    comparativeProfitService.calculateUserPerformance(userId),
    comparativeProfitService.compareAgainstBenchmarks(userId, ['SPY', 'QQQ', 'VTI', 'DIA']),
    comparativeProfitService.calculateSharpeRatio(userId),
  ]);

  res.json({
    success: true,
    data: {
      performance: userPerformance,
      comparison,
      riskMetrics: {
        sharpeRatio,
        interpretation: sharpeRatio > 1 ? 'Excellent' : sharpeRatio > 0.5 ? 'Good' : sharpeRatio > 0 ? 'Fair' : 'Poor',
      },
    },
  });
}));

export default router;
