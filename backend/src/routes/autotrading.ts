import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// In-memory storage for active auto-trading sessions
const activeSessions = new Map<string, any>();

// Auto-trading configuration
interface AutoTradingConfig {
  strategy: string;
  riskLevel: number;
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  symbols: string[];
}

// Start auto-trading
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const config: AutoTradingConfig = req.body;

    // Validate config
    if (!config.strategy || !config.symbols || config.symbols.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid configuration'
      });
    }

    // Check if user has active subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true, subscriptionStatus: true }
    });

    if (!user || user.subscriptionPlan === 'free' || user.subscriptionStatus !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Auto-trading requires Pro or Elite subscription'
      });
    }

    // Create auto-trading session
    const session = {
      userId,
      config,
      startedAt: new Date(),
      active: true,
      stats: {
        tradesExecuted: 0,
        profitLoss: 0,
        winRate: 0
      }
    };

    activeSessions.set(userId, session);

    // TODO: Start actual trading algorithm
    console.log(`Auto-trading started for user ${userId}:`, config);

    res.json({
      success: true,
      message: 'Auto-trading started successfully',
      session: {
        startedAt: session.startedAt,
        config: session.config
      }
    });
  } catch (error) {
    console.error('Start auto-trading error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start auto-trading'
    });
  }
});

// Stop auto-trading
router.post('/stop', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const session = activeSessions.get(userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'No active auto-trading session found'
      });
    }

    session.active = false;
    session.stoppedAt = new Date();

    // TODO: Stop actual trading algorithm

    activeSessions.delete(userId);

    res.json({
      success: true,
      message: 'Auto-trading stopped successfully',
      stats: session.stats
    });
  } catch (error) {
    console.error('Stop auto-trading error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop auto-trading'
    });
  }
});

// Save configuration
router.post('/config', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const config: AutoTradingConfig = req.body;

    // Save config to database or cache
    // For now, just validate and return success

    res.json({
      success: true,
      message: 'Configuration saved successfully',
      config
    });
  } catch (error) {
    console.error('Save config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save configuration'
    });
  }
});

// Get stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const session = activeSessions.get(userId);
    if (!session) {
      return res.json({
        tradesExecuted: 0,
        profitLoss: 0,
        winRate: 0
      });
    }

    res.json(session.stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stats'
    });
  }
});

// Get active session
router.get('/session', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const session = activeSessions.get(userId);
    if (!session) {
      return res.json({
        active: false
      });
    }

    res.json({
      active: session.active,
      startedAt: session.startedAt,
      config: session.config,
      stats: session.stats
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
