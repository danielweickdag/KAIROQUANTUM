import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  details?: any;
  error?: string;
}

/**
 * Comprehensive health check endpoint
 * GET /api/health/status
 */
router.get('/status', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const checks: HealthCheckResult[] = [];

  // 1. Check Database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.push({
      service: 'PostgreSQL Database',
      status: 'healthy',
      responseTime: Date.now() - dbStart,
      details: { connected: true }
    });
  } catch (error: any) {
    checks.push({
      service: 'PostgreSQL Database',
      status: 'unhealthy',
      error: error.message
    });
  }

  // 2. Check Python Analytics Service
  const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
  try {
    const pyStart = Date.now();
    const response = await axios.get(`${pythonUrl}/health`, { timeout: 5000 });
    checks.push({
      service: 'Python Analytics',
      status: 'healthy',
      responseTime: Date.now() - pyStart,
      details: { url: pythonUrl, version: response.data?.version }
    });
  } catch (error: any) {
    checks.push({
      service: 'Python Analytics',
      status: 'unhealthy',
      error: error.message,
      details: { url: pythonUrl }
    });
  }

  // 3. Check Stripe API
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const stripeStart = Date.now();
    await stripe.balance.retrieve();
    checks.push({
      service: 'Stripe Payment API',
      status: 'healthy',
      responseTime: Date.now() - stripeStart,
      details: { configured: true }
    });
  } catch (error: any) {
    checks.push({
      service: 'Stripe Payment API',
      status: error.message.includes('Invalid API') ? 'degraded' : 'unhealthy',
      error: error.message
    });
  }

  // 4. Check Environment Variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
  checks.push({
    service: 'Environment Configuration',
    status: missingEnvVars.length === 0 ? 'healthy' : 'degraded',
    details: {
      required: requiredEnvVars.length,
      configured: requiredEnvVars.length - missingEnvVars.length,
      missing: missingEnvVars
    }
  });

  // 5. Check Alpaca Broker Connection
  if (process.env.ALPACA_API_KEY && process.env.ALPACA_SECRET_KEY) {
    try {
      const alpacaStart = Date.now();
      const alpacaResponse = await axios.get(
        `${process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets'}/v2/account`,
        {
          headers: {
            'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
            'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
          },
          timeout: 5000
        }
      );
      checks.push({
        service: 'Alpaca Broker API',
        status: 'healthy',
        responseTime: Date.now() - alpacaStart,
        details: {
          account: alpacaResponse.data?.account_number,
          status: alpacaResponse.data?.status
        }
      });
    } catch (error: any) {
      checks.push({
        service: 'Alpaca Broker API',
        status: 'degraded',
        error: error.message
      });
    }
  }

  // Determine overall status
  const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
  const degradedCount = checks.filter(c => c.status === 'degraded').length;

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (unhealthyCount > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedCount > 0) {
    overallStatus = 'degraded';
  }

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: Date.now() - startTime,
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
    summary: {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      degraded: degradedCount,
      unhealthy: unhealthyCount
    }
  };

  const statusCode = overallStatus === 'healthy' ? 200 :
                    overallStatus === 'degraded' ? 200 : 503;

  res.status(statusCode).json(response);
});

/**
 * Database health check
 * GET /api/health/database
 */
router.get('/database', async (req: Request, res: Response) => {
  try {
    const start = Date.now();

    // Test connection
    await prisma.$queryRaw`SELECT 1`;

    // Get database stats
    const userCount = await prisma.user.count();
    const tradeCount = await prisma.trade?.count() || 0;

    res.json({
      status: 'healthy',
      responseTime: Date.now() - start,
      stats: {
        users: userCount,
        trades: tradeCount
      },
      connection: {
        url: process.env.DATABASE_URL?.split('@')[1] || 'configured',
        poolSize: 10
      }
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

/**
 * Get all API endpoints
 * GET /api/health/endpoints
 */
router.get('/endpoints', (req: Request, res: Response) => {
  const endpoints = {
    authentication: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/auth/refresh',
      'POST /api/auth/logout'
    ],
    users: [
      'GET /api/users/me',
      'PUT /api/users/me',
      'GET /api/users/:id'
    ],
    trading: [
      'POST /api/trades',
      'GET /api/trades',
      'GET /api/trades/:id',
      'POST /api/live-trading/execute'
    ],
    portfolios: [
      'GET /api/portfolios',
      'GET /api/portfolios/:id',
      'PUT /api/portfolios/:id'
    ],
    fees: [
      'POST /api/fees/calculate/trading',
      'POST /api/fees/calculate/withdrawal',
      'POST /api/fees/calculate/deposit',
      'POST /api/fees/calculate/payout',
      'POST /api/fees/withdrawal',
      'POST /api/fees/payout',
      'GET /api/fees/summary',
      'GET /api/fees/schedule'
    ],
    subscriptions: [
      'POST /api/checkout/create-checkout-session',
      'GET /api/checkout/session/:sessionId',
      'GET /api/subscription/plans',
      'POST /api/subscription-sync/sync/:userId'
    ],
    autotrading: [
      'POST /api/autotrading/start',
      'POST /api/autotrading/stop',
      'POST /api/autotrading/config',
      'GET /api/autotrading/stats',
      'GET /api/autotrading/session'
    ],
    brokers: [
      'GET /api/brokers',
      'POST /api/brokers/connect',
      'DELETE /api/brokers/:id'
    ],
    analytics: [
      'GET /api/comparative-profit/:userId'
    ],
    webhooks: [
      'POST /api/webhooks/stripe'
    ],
    health: [
      'GET /api/health/status',
      'GET /api/health/database',
      'GET /api/health/endpoints'
    ]
  };

  res.json({
    success: true,
    totalEndpoints: Object.values(endpoints).flat().length,
    endpoints
  });
});

/**
 * Quick ping endpoint
 * GET /api/health/ping
 */
router.get('/ping', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
