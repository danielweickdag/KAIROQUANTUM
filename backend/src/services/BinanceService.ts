import crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';
import WebSocket from 'ws';

/**
 * Binance API Integration Service
 * Provides access to Binance spot trading, market data, and account management
 *
 * Features:
 * - Market data (prices, order book, trades, candlesticks)
 * - Trading (place orders, cancel orders, get positions)
 * - Account information
 * - WebSocket real-time updates
 */

interface BinanceConfig {
  apiKey?: string;
  apiSecret?: string;
  testnet?: boolean;
}

interface OrderBookEntry {
  price: string;
  quantity: string;
}

interface OrderBook {
  lastUpdateId: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface Ticker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface Trade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

interface Candlestick {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

interface NewOrderParams {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  quantity?: string;
  quoteOrderQty?: string;
  price?: string;
  stopPrice?: string;
  icebergQty?: string;
  newClientOrderId?: string;
  newOrderRespType?: 'ACK' | 'RESULT' | 'FULL';
}

interface Order {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime?: number;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  fills?: Array<{
    price: string;
    qty: string;
    commission: string;
    commissionAsset: string;
  }>;
}

interface AccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: Array<{
    asset: string;
    free: string;
    locked: string;
  }>;
  permissions: string[];
}

export class BinanceService {
  private client: AxiosInstance;
  private baseURL: string;
  private wsBaseURL: string;
  private apiKey: string;
  private apiSecret: string;
  private websockets: Map<string, WebSocket>;

  constructor(config: BinanceConfig = {}) {
    this.apiKey = config.apiKey || process.env.BINANCE_API_KEY || '';
    this.apiSecret = config.apiSecret || process.env.BINANCE_API_SECRET || '';

    // Use testnet or production
    if (config.testnet) {
      this.baseURL = 'https://testnet.binance.vision/api';
      this.wsBaseURL = 'wss://testnet.binance.vision/ws';
    } else {
      this.baseURL = 'https://api.binance.com/api';
      this.wsBaseURL = 'wss://stream.binance.com:9443/ws';
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    this.websockets = new Map();
  }

  /**
   * Generate signature for authenticated requests
   */
  private sign(params: Record<string, any>): string {
    const query = new URLSearchParams(params).toString();
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(query)
      .digest('hex');
  }

  /**
   * Add timestamp and signature to params
   */
  private signRequest(params: Record<string, any> = {}): Record<string, any> {
    const timestamp = Date.now();
    const signedParams = { ...params, timestamp };
    const signature = this.sign(signedParams);
    return { ...signedParams, signature };
  }

  // ============================================
  // MARKET DATA ENDPOINTS
  // ============================================

  /**
   * Test connectivity to the API
   */
  async ping(): Promise<boolean> {
    try {
      await this.client.get('/v3/ping');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current server time
   */
  async getServerTime(): Promise<number> {
    const response = await this.client.get('/v3/time');
    return response.data.serverTime;
  }

  /**
   * Get exchange information (symbols, trading rules, etc.)
   */
  async getExchangeInfo(symbol?: string): Promise<any> {
    const params = symbol ? { symbol } : {};
    const response = await this.client.get('/v3/exchangeInfo', { params });
    return response.data;
  }

  /**
   * Get order book for a symbol
   * @param symbol - Trading pair (e.g., 'BTCUSDT')
   * @param limit - Depth level (5, 10, 20, 50, 100, 500, 1000, 5000)
   */
  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBook> {
    const response = await this.client.get('/v3/depth', {
      params: { symbol, limit },
    });
    return response.data;
  }

  /**
   * Get recent trades for a symbol
   * @param symbol - Trading pair
   * @param limit - Number of trades (max 1000)
   */
  async getRecentTrades(symbol: string, limit: number = 500): Promise<Trade[]> {
    const response = await this.client.get('/v3/trades', {
      params: { symbol, limit },
    });
    return response.data;
  }

  /**
   * Get 24-hour ticker price change statistics
   * @param symbol - Trading pair (optional, returns all if not specified)
   */
  async get24hrTicker(symbol?: string): Promise<Ticker24hr | Ticker24hr[]> {
    const params = symbol ? { symbol } : {};
    const response = await this.client.get('/v3/ticker/24hr', { params });
    return response.data;
  }

  /**
   * Get latest price for symbol(s)
   * @param symbol - Trading pair (optional, returns all if not specified)
   */
  async getPrice(symbol?: string): Promise<{ symbol: string; price: string } | { symbol: string; price: string }[]> {
    const params = symbol ? { symbol } : {};
    const response = await this.client.get('/v3/ticker/price', { params });
    return response.data;
  }

  /**
   * Get best bid/ask price for symbol(s)
   * @param symbol - Trading pair (optional, returns all if not specified)
   */
  async getBookTicker(symbol?: string): Promise<any> {
    const params = symbol ? { symbol } : {};
    const response = await this.client.get('/v3/ticker/bookTicker', { params });
    return response.data;
  }

  /**
   * Get candlestick/kline data
   * @param symbol - Trading pair
   * @param interval - Kline interval (1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
   * @param limit - Number of candles (max 1000)
   * @param startTime - Start time in ms
   * @param endTime - End time in ms
   */
  async getCandlesticks(
    symbol: string,
    interval: string,
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<Candlestick[]> {
    const params: any = { symbol, interval, limit };
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    const response = await this.client.get('/v3/klines', { params });

    return response.data.map((candle: any[]) => ({
      openTime: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      closeTime: candle[6],
      quoteAssetVolume: candle[7],
      numberOfTrades: candle[8],
      takerBuyBaseAssetVolume: candle[9],
      takerBuyQuoteAssetVolume: candle[10],
    }));
  }

  // ============================================
  // TRADING ENDPOINTS (Authenticated)
  // ============================================

  /**
   * Test new order creation (doesn't actually create an order)
   */
  async testNewOrder(params: NewOrderParams): Promise<any> {
    const signedParams = this.signRequest(params as any);
    const response = await this.client.post('/v3/order/test', null, {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Create a new order
   */
  async createOrder(params: NewOrderParams): Promise<Order> {
    const signedParams = this.signRequest(params as any);
    const response = await this.client.post('/v3/order', null, {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Cancel an active order
   */
  async cancelOrder(symbol: string, orderId?: number, origClientOrderId?: string): Promise<any> {
    const params: any = { symbol };
    if (orderId) params.orderId = orderId;
    if (origClientOrderId) params.origClientOrderId = origClientOrderId;

    const signedParams = this.signRequest(params);
    const response = await this.client.delete('/v3/order', {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Cancel all open orders on a symbol
   */
  async cancelAllOrders(symbol: string): Promise<any> {
    const signedParams = this.signRequest({ symbol });
    const response = await this.client.delete('/v3/openOrders', {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Query order status
   */
  async getOrder(symbol: string, orderId?: number, origClientOrderId?: string): Promise<Order> {
    const params: any = { symbol };
    if (orderId) params.orderId = orderId;
    if (origClientOrderId) params.origClientOrderId = origClientOrderId;

    const signedParams = this.signRequest(params);
    const response = await this.client.get('/v3/order', {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Get all open orders
   */
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params = symbol ? { symbol } : {};
    const signedParams = this.signRequest(params);
    const response = await this.client.get('/v3/openOrders', {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Get all account orders (active, canceled, or filled)
   */
  async getAllOrders(symbol: string, orderId?: number, startTime?: number, endTime?: number, limit: number = 500): Promise<Order[]> {
    const params: any = { symbol, limit };
    if (orderId) params.orderId = orderId;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    const signedParams = this.signRequest(params);
    const response = await this.client.get('/v3/allOrders', {
      params: signedParams,
    });
    return response.data;
  }

  // ============================================
  // ACCOUNT ENDPOINTS (Authenticated)
  // ============================================

  /**
   * Get current account information
   */
  async getAccountInfo(): Promise<AccountInfo> {
    const signedParams = this.signRequest();
    const response = await this.client.get('/v3/account', {
      params: signedParams,
    });
    return response.data;
  }

  /**
   * Get account trade list
   */
  async getMyTrades(symbol: string, startTime?: number, endTime?: number, fromId?: number, limit: number = 500): Promise<any[]> {
    const params: any = { symbol, limit };
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (fromId) params.fromId = fromId;

    const signedParams = this.signRequest(params);
    const response = await this.client.get('/v3/myTrades', {
      params: signedParams,
    });
    return response.data;
  }

  // ============================================
  // WEBSOCKET STREAMS
  // ============================================

  /**
   * Subscribe to trade stream
   */
  subscribeToTrades(symbol: string, callback: (trade: any) => void): void {
    const stream = `${symbol.toLowerCase()}@trade`;
    this.subscribeToStream(stream, callback);
  }

  /**
   * Subscribe to candlestick/kline stream
   */
  subscribeToKline(symbol: string, interval: string, callback: (kline: any) => void): void {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    this.subscribeToStream(stream, callback);
  }

  /**
   * Subscribe to depth/order book stream
   */
  subscribeToDepth(symbol: string, callback: (depth: any) => void, level?: '5' | '10' | '20'): void {
    const stream = level
      ? `${symbol.toLowerCase()}@depth${level}`
      : `${symbol.toLowerCase()}@depth`;
    this.subscribeToStream(stream, callback);
  }

  /**
   * Subscribe to 24hr ticker stream
   */
  subscribeToTicker(symbol: string, callback: (ticker: any) => void): void {
    const stream = `${symbol.toLowerCase()}@ticker`;
    this.subscribeToStream(stream, callback);
  }

  /**
   * Subscribe to all market tickers stream
   */
  subscribeToAllTickers(callback: (tickers: any) => void): void {
    const stream = '!ticker@arr';
    this.subscribeToStream(stream, callback);
  }

  /**
   * Generic stream subscription
   */
  private subscribeToStream(stream: string, callback: (data: any) => void): void {
    if (this.websockets.has(stream)) {
      console.warn(`Already subscribed to ${stream}`);
      return;
    }

    const ws = new WebSocket(`${this.wsBaseURL}/${stream}`);

    ws.on('open', () => {
      console.log(`WebSocket connected to ${stream}`);
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const json = JSON.parse(data.toString());
        callback(json);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error on ${stream}:`, error);
    });

    ws.on('close', () => {
      console.log(`WebSocket disconnected from ${stream}`);
      this.websockets.delete(stream);
    });

    this.websockets.set(stream, ws);
  }

  /**
   * Unsubscribe from a stream
   */
  unsubscribeFromStream(stream: string): void {
    const ws = this.websockets.get(stream);
    if (ws) {
      ws.close();
      this.websockets.delete(stream);
    }
  }

  /**
   * Close all WebSocket connections
   */
  closeAllStreams(): void {
    this.websockets.forEach((ws) => ws.close());
    this.websockets.clear();
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Format price to symbol precision
   */
  formatPrice(price: number, precision: number = 8): string {
    return price.toFixed(precision);
  }

  /**
   * Format quantity to symbol precision
   */
  formatQuantity(quantity: number, precision: number = 8): string {
    return quantity.toFixed(precision);
  }

  /**
   * Calculate order value in quote currency
   */
  calculateOrderValue(price: number, quantity: number): number {
    return price * quantity;
  }

  /**
   * Get popular trading pairs
   */
  getPopularPairs(): string[] {
    return [
      'BTCUSDT',
      'ETHUSDT',
      'BNBUSDT',
      'SOLUSDT',
      'ADAUSDT',
      'XRPUSDT',
      'DOGEUSDT',
      'MATICUSDT',
      'DOTUSDT',
      'AVAXUSDT',
      'LINKUSDT',
      'UNIUSDT',
      'ATOMUSDT',
      'LTCUSDT',
      'ETCUSDT',
    ];
  }
}

export default BinanceService;
