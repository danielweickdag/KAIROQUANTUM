import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface TradeData {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  executedAt: Date;
}

interface BenchmarkData {
  symbol: string;
  name: string;
  startPrice: number;
  endPrice: number;
  startDate: Date;
  endDate: Date;
  returns: number;
}

interface ComparativeAnalysis {
  userReturns: number;
  userProfitDollar: number;
  userProfitPercent: number;
  benchmarks: {
    symbol: string;
    name: string;
    returns: number;
    difference: number;
    outperformance: boolean;
  }[];
  timeframe: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  summary: {
    bestBenchmark: string;
    worstBenchmark: string;
    averageBenchmarkReturn: number;
    userVsAverageOutperformance: number;
  };
}

export class ComparativeProfitService {
  private alpacaApiKey: string;
  private alpacaSecretKey: string;
  private alpacaBaseUrl: string;

  constructor() {
    this.alpacaApiKey = process.env.ALPACA_API_KEY || '';
    this.alpacaSecretKey = process.env.ALPACA_SECRET_KEY || '';
    this.alpacaBaseUrl = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';
  }

  /**
   * Get available benchmark indices
   */
  getAvailableBenchmarks() {
    return [
      { symbol: 'SPY', name: 'S&P 500 ETF' },
      { symbol: 'QQQ', name: 'NASDAQ-100 ETF' },
      { symbol: 'DIA', name: 'Dow Jones Industrial Average ETF' },
      { symbol: 'IWM', name: 'Russell 2000 ETF' },
      { symbol: 'VTI', name: 'Total Stock Market ETF' },
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
      { symbol: 'AGG', name: 'Bond Market ETF' },
      { symbol: 'GLD', name: 'Gold ETF' },
    ];
  }

  /**
   * Fetch historical price data for a benchmark
   */
  private async fetchBenchmarkData(
    symbol: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ startPrice: number; endPrice: number }> {
    try {
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      const response = await axios.get(
        `${this.alpacaBaseUrl}/v2/stocks/${symbol}/bars`,
        {
          params: {
            start,
            end,
            timeframe: '1Day',
            limit: 10000,
          },
          headers: {
            'APCA-API-KEY-ID': this.alpacaApiKey,
            'APCA-API-SECRET-KEY': this.alpacaSecretKey,
          },
        }
      );

      const bars = response.data.bars;
      if (!bars || bars.length === 0) {
        throw new Error(`No data available for ${symbol}`);
      }

      const startPrice = bars[0].c; // First close price
      const endPrice = bars[bars.length - 1].c; // Last close price

      return { startPrice, endPrice };
    } catch (error) {
      console.error(`Error fetching benchmark data for ${symbol}:`, error);
      // Fallback to mock data if API fails
      return this.getMockBenchmarkData(symbol, startDate, endDate);
    }
  }

  /**
   * Mock benchmark data for testing/fallback
   */
  private getMockBenchmarkData(
    symbol: string,
    startDate: Date,
    endDate: Date
  ): { startPrice: number; endPrice: number } {
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const annualReturn = 0.1; // 10% annual return
    const dailyReturn = Math.pow(1 + annualReturn, 1 / 365) - 1;
    const totalReturn = Math.pow(1 + dailyReturn, days) - 1;

    const mockReturns: Record<string, number> = {
      SPY: 0.10,    // S&P 500: ~10% annual
      QQQ: 0.15,    // NASDAQ: ~15% annual
      DIA: 0.08,    // Dow: ~8% annual
      IWM: 0.09,    // Russell 2000: ~9% annual
      VTI: 0.10,    // Total Market: ~10% annual
      VOO: 0.10,    // Vanguard S&P: ~10% annual
      AGG: 0.03,    // Bonds: ~3% annual
      GLD: 0.05,    // Gold: ~5% annual
    };

    const baseReturn = mockReturns[symbol] || 0.10;
    const adjustedReturn = Math.pow(1 + baseReturn, days / 365) - 1;

    return {
      startPrice: 100,
      endPrice: 100 * (1 + adjustedReturn),
    };
  }

  /**
   * Calculate user's trading performance
   */
  async calculateUserPerformance(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ totalInvested: number; totalValue: number; returns: number; profitDollar: number }> {
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Default: 1 year ago
    const end = endDate || new Date();

    // Get all executed trades in the timeframe
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        status: 'EXECUTED',
        executedAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        executedAt: 'asc',
      },
    });

    if (trades.length === 0) {
      return {
        totalInvested: 0,
        totalValue: 0,
        returns: 0,
        profitDollar: 0,
      };
    }

    // Calculate total invested and total value
    let totalBuyValue = 0;
    let totalSellValue = 0;

    for (const trade of trades) {
      if (trade.side === 'BUY') {
        totalBuyValue += trade.totalValue;
      } else if (trade.side === 'SELL') {
        totalSellValue += trade.totalValue;
      }
    }

    // Calculate current value of unsold positions
    const holdings = await prisma.holding.findMany({
      where: {
        portfolio: {
          userId,
        },
      },
    });

    let currentHoldingsValue = 0;
    for (const holding of holdings) {
      currentHoldingsValue += holding.marketValue;
    }

    const totalValue = totalSellValue + currentHoldingsValue;
    const profitDollar = totalValue - totalBuyValue;
    const returns = totalBuyValue > 0 ? (profitDollar / totalBuyValue) * 100 : 0;

    return {
      totalInvested: totalBuyValue,
      totalValue,
      returns,
      profitDollar,
    };
  }

  /**
   * Compare user performance against benchmarks
   */
  async compareAgainstBenchmarks(
    userId: string,
    benchmarkSymbols?: string[],
    startDate?: Date,
    endDate?: Date
  ): Promise<ComparativeAnalysis> {
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // Get user performance
    const userPerformance = await this.calculateUserPerformance(userId, start, end);

    // Default benchmarks if none specified
    const symbols = benchmarkSymbols || ['SPY', 'QQQ', 'DIA', 'VTI'];
    const availableBenchmarks = this.getAvailableBenchmarks();

    // Fetch benchmark data
    const benchmarkPromises = symbols.map(async (symbol) => {
      const benchmark = availableBenchmarks.find((b) => b.symbol === symbol);
      const data = await this.fetchBenchmarkData(symbol, start, end);

      const returns = ((data.endPrice - data.startPrice) / data.startPrice) * 100;
      const difference = userPerformance.returns - returns;

      return {
        symbol,
        name: benchmark?.name || symbol,
        returns: parseFloat(returns.toFixed(2)),
        difference: parseFloat(difference.toFixed(2)),
        outperformance: difference > 0,
      };
    });

    const benchmarks = await Promise.all(benchmarkPromises);

    // Calculate summary statistics
    const benchmarkReturns = benchmarks.map((b) => b.returns);
    const avgBenchmarkReturn = benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length;
    const bestBenchmark = benchmarks.reduce((prev, curr) =>
      curr.returns > prev.returns ? curr : prev
    );
    const worstBenchmark = benchmarks.reduce((prev, curr) =>
      curr.returns < prev.returns ? curr : prev
    );

    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      userReturns: parseFloat(userPerformance.returns.toFixed(2)),
      userProfitDollar: parseFloat(userPerformance.profitDollar.toFixed(2)),
      userProfitPercent: parseFloat(userPerformance.returns.toFixed(2)),
      benchmarks,
      timeframe: {
        startDate: start,
        endDate: end,
        days,
      },
      summary: {
        bestBenchmark: bestBenchmark.name,
        worstBenchmark: worstBenchmark.name,
        averageBenchmarkReturn: parseFloat(avgBenchmarkReturn.toFixed(2)),
        userVsAverageOutperformance: parseFloat((userPerformance.returns - avgBenchmarkReturn).toFixed(2)),
      },
    };
  }

  /**
   * Get detailed performance breakdown by time period
   */
  async getPerformanceBreakdown(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ) {
    const endDate = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case 'weekly':
        startDate = new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000); // Last 12 weeks
        break;
      case 'monthly':
        startDate = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000); // Last 12 months
        break;
      case 'yearly':
        startDate = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000); // Last 5 years
        break;
    }

    return await this.compareAgainstBenchmarks(userId, ['SPY', 'QQQ', 'VTI'], startDate, endDate);
  }

  /**
   * Calculate Sharpe Ratio (risk-adjusted returns)
   */
  async calculateSharpeRatio(userId: string, riskFreeRate: number = 0.02): Promise<number> {
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        status: 'EXECUTED',
      },
      orderBy: {
        executedAt: 'asc',
      },
    });

    if (trades.length < 2) return 0;

    // Calculate returns for each trade
    const returns: number[] = [];
    for (let i = 1; i < trades.length; i++) {
      const prevValue = trades[i - 1].totalValue;
      const currValue = trades[i].totalValue;
      const ret = (currValue - prevValue) / prevValue;
      returns.push(ret);
    }

    // Calculate average return and standard deviation
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Sharpe Ratio = (Average Return - Risk Free Rate) / Standard Deviation
    const sharpeRatio = stdDev > 0 ? (avgReturn - riskFreeRate) / stdDev : 0;

    return parseFloat(sharpeRatio.toFixed(2));
  }
}

export const comparativeProfitService = new ComparativeProfitService();
