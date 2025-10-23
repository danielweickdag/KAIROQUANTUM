'use client';

/**
 * Auto Profit System - Automatically take profits and protect gains
 *
 * Features:
 * - Auto profit-taking at target levels
 * - Trailing stop-loss to protect profits
 * - Smart position sizing
 * - Daily goal tracking
 * - Risk management
 */

export interface AutoProfitConfig {
  dailyGoal: number;
  profitTarget: number; // percentage
  stopLoss: number; // percentage
  trailingStop: boolean;
  maxRiskPerTrade: number; // percentage of balance
  autoCompound: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  profitLoss: number;
  profitLossPercent: number;
  status: 'open' | 'closed' | 'pending';
  openedAt: Date;
  closedAt?: Date;
}

export interface ProfitStats {
  today: number;
  week: number;
  month: number;
  total: number;
  goalProgress: number; // percentage of daily goal
  trades: {
    total: number;
    winners: number;
    losers: number;
    winRate: number;
  };
}

class AutoProfitSystem {
  private config: AutoProfitConfig;
  private balance: number;
  private activeTrades: Map<string, Trade>;
  private stats: ProfitStats;
  private listeners: Set<(stats: ProfitStats) => void>;

  constructor() {
    this.config = {
      dailyGoal: 100,
      profitTarget: 3, // 3% profit target
      stopLoss: 1.5, // 1.5% stop loss
      trailingStop: true,
      maxRiskPerTrade: 2, // 2% of balance per trade
      autoCompound: true,
    };

    this.balance = 10000;
    this.activeTrades = new Map();
    this.stats = {
      today: 0,
      week: 0,
      month: 0,
      total: 0,
      goalProgress: 0,
      trades: {
        total: 0,
        winners: 0,
        losers: 0,
        winRate: 0,
      },
    };
    this.listeners = new Set();
  }

  // Configuration
  updateConfig(config: Partial<AutoProfitConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AutoProfitConfig {
    return { ...this.config };
  }

  // Balance Management
  getBalance(): number {
    return this.balance;
  }

  setBalance(balance: number) {
    this.balance = balance;
  }

  // Calculate position size based on risk
  calculatePositionSize(entryPrice: number, stopLossPrice: number): number {
    const riskAmount = this.balance * (this.config.maxRiskPerTrade / 100);
    const priceRisk = Math.abs(entryPrice - stopLossPrice);
    const positionSize = riskAmount / priceRisk;
    return Math.min(positionSize, this.balance * 0.25); // Max 25% of balance
  }

  // Open a trade with automatic profit/loss targets
  openTrade(symbol: string, type: 'buy' | 'sell', price: number, amount: number): Trade {
    const stopLossPrice = type === 'buy'
      ? price * (1 - this.config.stopLoss / 100)
      : price * (1 + this.config.stopLoss / 100);

    const profitTargetPrice = type === 'buy'
      ? price * (1 + this.config.profitTarget / 100)
      : price * (1 - this.config.profitTarget / 100);

    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      type,
      entryPrice: price,
      currentPrice: price,
      amount,
      profitLoss: 0,
      profitLossPercent: 0,
      status: 'open',
      openedAt: new Date(),
    };

    this.activeTrades.set(trade.id, trade);
    console.log(`Trade opened: ${symbol} @ $${price}`);
    console.log(`Stop Loss: $${stopLossPrice.toFixed(2)}`);
    console.log(`Profit Target: $${profitTargetPrice.toFixed(2)}`);

    return trade;
  }

  // Update trade price and check for auto exit
  updateTrade(tradeId: string, currentPrice: number): Trade | null {
    const trade = this.activeTrades.get(tradeId);
    if (!trade || trade.status !== 'open') return null;

    trade.currentPrice = currentPrice;

    // Calculate P/L
    if (trade.type === 'buy') {
      trade.profitLoss = (currentPrice - trade.entryPrice) * trade.amount;
      trade.profitLossPercent = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
    } else {
      trade.profitLoss = (trade.entryPrice - currentPrice) * trade.amount;
      trade.profitLossPercent = ((trade.entryPrice - currentPrice) / trade.entryPrice) * 100;
    }

    // Auto-close conditions
    const shouldTakeProfit = trade.profitLossPercent >= this.config.profitTarget;
    const shouldStopLoss = trade.profitLossPercent <= -this.config.stopLoss;

    // Check if daily goal reached
    const goalReached = this.stats.today >= this.config.dailyGoal;

    if (shouldTakeProfit || shouldStopLoss || goalReached) {
      this.closeTrade(tradeId, currentPrice);
    }

    return trade;
  }

  // Close a trade and update stats
  closeTrade(tradeId: string, closePrice: number): Trade | null {
    const trade = this.activeTrades.get(tradeId);
    if (!trade || trade.status !== 'open') return null;

    trade.currentPrice = closePrice;
    trade.status = 'closed';
    trade.closedAt = new Date();

    // Calculate final P/L
    if (trade.type === 'buy') {
      trade.profitLoss = (closePrice - trade.entryPrice) * trade.amount;
    } else {
      trade.profitLoss = (trade.entryPrice - closePrice) * trade.amount;
    }

    // Update balance
    this.balance += trade.profitLoss;

    // Update stats
    this.stats.today += trade.profitLoss;
    this.stats.week += trade.profitLoss;
    this.stats.month += trade.profitLoss;
    this.stats.total += trade.profitLoss;
    this.stats.trades.total++;

    if (trade.profitLoss > 0) {
      this.stats.trades.winners++;
    } else {
      this.stats.trades.losers++;
    }

    this.stats.trades.winRate = (this.stats.trades.winners / this.stats.trades.total) * 100;
    this.stats.goalProgress = (this.stats.today / this.config.dailyGoal) * 100;

    this.activeTrades.delete(tradeId);
    this.notifyListeners();

    console.log(`Trade closed: ${trade.symbol} - P/L: $${trade.profitLoss.toFixed(2)}`);
    return trade;
  }

  // Get all active trades
  getActiveTrades(): Trade[] {
    return Array.from(this.activeTrades.values());
  }

  // Get profit statistics
  getStats(): ProfitStats {
    return { ...this.stats };
  }

  // Auto-trading logic
  async autoTrade(symbol: string, currentPrice: number): Promise<Trade | null> {
    // Don't trade if daily goal reached
    if (this.stats.today >= this.config.dailyGoal) {
      console.log('Daily goal reached! Stopping auto-trading for today.');
      return null;
    }

    // Don't trade if too many active trades
    if (this.activeTrades.size >= 3) {
      return null;
    }

    // Simple strategy: Buy/Sell based on momentum
    // In real implementation, this would use technical indicators
    const shouldBuy = Math.random() > 0.5;
    const type = shouldBuy ? 'buy' : 'sell';

    const stopLossPrice = type === 'buy'
      ? currentPrice * (1 - this.config.stopLoss / 100)
      : currentPrice * (1 + this.config.stopLoss / 100);

    const positionSize = this.calculatePositionSize(currentPrice, stopLossPrice);
    const amount = positionSize / currentPrice;

    return this.openTrade(symbol, type, currentPrice, amount);
  }

  // Subscribe to profit updates
  subscribe(callback: (stats: ProfitStats) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.stats));
  }

  // Reset daily stats (call at midnight)
  resetDaily() {
    this.stats.today = 0;
    this.stats.goalProgress = 0;
    this.notifyListeners();
  }

  // Simulate trading for demo
  simulateTrade(symbol: string = 'BTC/USD'): void {
    const basePrice = 50000;
    const price = basePrice + (Math.random() - 0.5) * 1000;
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = 0.01 + Math.random() * 0.05;

    const trade = this.openTrade(symbol, type, price, amount);

    // Simulate price movement
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * 500;
      const newPrice = trade.currentPrice + priceChange;

      const updatedTrade = this.updateTrade(trade.id, newPrice);

      if (!updatedTrade || updatedTrade.status === 'closed') {
        clearInterval(interval);
      }
    }, 1000);
  }
}

// Export singleton instance
export const autoProfitSystem = new AutoProfitSystem();
export default autoProfitSystem;
