import { Router, Request, Response } from 'express';
import { BinanceService } from '../services/BinanceService';
import { authenticateToken as auth } from '../middleware/auth';

const router = Router();

// Initialize Binance service
const binance = new BinanceService({
  testnet: process.env.NODE_ENV !== 'production',
});

/**
 * @route   GET /api/binance/ping
 * @desc    Test Binance API connectivity
 * @access  Public
 */
router.get('/ping', async (req: Request, res: Response) => {
  try {
    const isConnected = await binance.ping();
    res.json({
      success: true,
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/time
 * @desc    Get Binance server time
 * @access  Public
 */
router.get('/time', async (req: Request, res: Response) => {
  try {
    const serverTime = await binance.getServerTime();
    res.json({
      success: true,
      serverTime,
      localTime: Date.now(),
      diff: Date.now() - serverTime,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/exchange-info
 * @desc    Get exchange information
 * @access  Public
 */
router.get('/exchange-info', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.query;
    const info = await binance.getExchangeInfo(symbol as string | undefined);
    res.json({
      success: true,
      data: info,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/orderbook/:symbol
 * @desc    Get order book for a symbol
 * @access  Public
 */
router.get('/orderbook/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { limit = 100 } = req.query;

    const orderBook = await binance.getOrderBook(
      symbol.toUpperCase(),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      data: orderBook,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/trades/:symbol
 * @desc    Get recent trades for a symbol
 * @access  Public
 */
router.get('/trades/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { limit = 100 } = req.query;

    const trades = await binance.getRecentTrades(
      symbol.toUpperCase(),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      count: trades.length,
      data: trades,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/ticker/:symbol
 * @desc    Get 24hr ticker statistics
 * @access  Public
 */
router.get('/ticker/:symbol?', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const ticker = await binance.get24hrTicker(
      symbol ? symbol.toUpperCase() : undefined
    );

    res.json({
      success: true,
      data: ticker,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/price/:symbol
 * @desc    Get latest price for symbol(s)
 * @access  Public
 */
router.get('/price/:symbol?', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const price = await binance.getPrice(
      symbol ? symbol.toUpperCase() : undefined
    );

    res.json({
      success: true,
      data: price,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/book-ticker/:symbol
 * @desc    Get best bid/ask price
 * @access  Public
 */
router.get('/book-ticker/:symbol?', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const bookTicker = await binance.getBookTicker(
      symbol ? symbol.toUpperCase() : undefined
    );

    res.json({
      success: true,
      data: bookTicker,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/candlesticks/:symbol
 * @desc    Get candlestick/kline data
 * @access  Public
 */
router.get('/candlesticks/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { interval = '1h', limit = 100, startTime, endTime } = req.query;

    const candlesticks = await binance.getCandlesticks(
      symbol.toUpperCase(),
      interval as string,
      parseInt(limit as string),
      startTime ? parseInt(startTime as string) : undefined,
      endTime ? parseInt(endTime as string) : undefined
    );

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      interval,
      count: candlesticks.length,
      data: candlesticks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/popular-pairs
 * @desc    Get list of popular trading pairs
 * @access  Public
 */
router.get('/popular-pairs', async (req: Request, res: Response) => {
  try {
    const pairs = binance.getPopularPairs();

    // Get current prices for all popular pairs
    const prices = await binance.getPrice();
    const pairData = pairs.map((symbol) => {
      const priceData = Array.isArray(prices)
        ? prices.find((p) => p.symbol === symbol)
        : prices.symbol === symbol
        ? prices
        : null;

      return {
        symbol,
        price: priceData ? priceData.price : null,
      };
    });

    res.json({
      success: true,
      count: pairs.length,
      data: pairData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================
// AUTHENTICATED TRADING ENDPOINTS
// ============================================

/**
 * @route   POST /api/binance/order/test
 * @desc    Test new order creation
 * @access  Private
 */
router.post('/order/test', auth, async (req: Request, res: Response) => {
  try {
    const orderParams = req.body;
    const result = await binance.testNewOrder(orderParams);

    res.json({
      success: true,
      message: 'Order test successful',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/binance/order
 * @desc    Create a new order
 * @access  Private
 */
router.post('/order', auth, async (req: Request, res: Response) => {
  try {
    const orderParams = req.body;
    const order = await binance.createOrder(orderParams);

    res.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/binance/order
 * @desc    Cancel an order
 * @access  Private
 */
router.delete('/order', auth, async (req: Request, res: Response) => {
  try {
    const { symbol, orderId, origClientOrderId } = req.body;

    const result = await binance.cancelOrder(
      symbol,
      orderId,
      origClientOrderId
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/binance/orders/:symbol
 * @desc    Cancel all orders for a symbol
 * @access  Private
 */
router.delete('/orders/:symbol', auth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const result = await binance.cancelAllOrders(symbol.toUpperCase());

    res.json({
      success: true,
      message: 'All orders cancelled successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/order
 * @desc    Query order status
 * @access  Private
 */
router.get('/order', auth, async (req: Request, res: Response) => {
  try {
    const { symbol, orderId, origClientOrderId } = req.query;

    const order = await binance.getOrder(
      symbol as string,
      orderId ? parseInt(orderId as string) : undefined,
      origClientOrderId as string | undefined
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/open-orders/:symbol?
 * @desc    Get all open orders
 * @access  Private
 */
router.get('/open-orders/:symbol?', auth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const orders = await binance.getOpenOrders(
      symbol ? symbol.toUpperCase() : undefined
    );

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/all-orders/:symbol
 * @desc    Get all orders (active, canceled, filled)
 * @access  Private
 */
router.get('/all-orders/:symbol', auth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { orderId, startTime, endTime, limit = 500 } = req.query;

    const orders = await binance.getAllOrders(
      symbol.toUpperCase(),
      orderId ? parseInt(orderId as string) : undefined,
      startTime ? parseInt(startTime as string) : undefined,
      endTime ? parseInt(endTime as string) : undefined,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/account
 * @desc    Get account information
 * @access  Private
 */
router.get('/account', auth, async (req: Request, res: Response) => {
  try {
    const account = await binance.getAccountInfo();

    res.json({
      success: true,
      data: account,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/binance/my-trades/:symbol
 * @desc    Get account trade history
 * @access  Private
 */
router.get('/my-trades/:symbol', auth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { startTime, endTime, fromId, limit = 500 } = req.query;

    const trades = await binance.getMyTrades(
      symbol.toUpperCase(),
      startTime ? parseInt(startTime as string) : undefined,
      endTime ? parseInt(endTime as string) : undefined,
      fromId ? parseInt(fromId as string) : undefined,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      count: trades.length,
      data: trades,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
