import { SignalGenerator } from './signalGenerator';
import { TechnicalAnalysis } from './technicalAnalysis';
import { RiskManagementService } from './riskManagementService';
import { BacktestingEngine, BacktestConfig } from './backtestingEngine';
import { MarketData, MarketType, BacktestResult, PerformanceMetrics } from './types';

export interface HighConfidencePreset {
  minConfidence: number;
  minRiskReward: number;
  maxRiskReward: number;
  minPatternConfidence: number;
  requiredTimeframeAlignment: number;
  timeframes: string[];
}

export const DefaultHighConfidencePreset: HighConfidencePreset = {
  minConfidence: 0.85,
  minRiskReward: 2.0,
  maxRiskReward: 4.0,
  minPatternConfidence: 0.9,
  requiredTimeframeAlignment: 0.8,
  timeframes: ['5m', '15m', '1h']
};

export function enableHighConfidenceMode(
  signalGenerator: SignalGenerator,
  preset: Partial<HighConfidencePreset> = {}
): void {
  const cfg = { ...DefaultHighConfidencePreset, ...preset };

  signalGenerator.updateConfiguration({
    minConfidence: cfg.minConfidence,
    minRiskReward: cfg.minRiskReward,
    maxRiskReward: cfg.maxRiskReward,
    timeframes: cfg.timeframes,
    gainzAlgoV2: {
      enableAdvancedPatterns: true,
      enableMultiTimeframe: true,
      enableMachineLearning: true,
      minPatternConfidence: cfg.minPatternConfidence,
      requiredTimeframeAlignment: cfg.requiredTimeframeAlignment,
      adaptiveLearning: true
    }
  });
}

// Simple historical data generator for backtesting (mocked). In production, replace with real data source.
async function generateHistoricalData(
  symbol: string,
  market: keyof MarketType,
  startDate: Date,
  endDate: Date,
  points: number = 500
): Promise<MarketData[]> {
  const data: MarketData[] = [];
  const durationMs = endDate.getTime() - startDate.getTime();
  const step = Math.max(1, Math.floor(durationMs / points));
  let current = startDate.getTime();
  let basePrice = 100 + Math.random() * 50;

  for (let i = 0; i < points; i++) {
    const timestamp = new Date(current);
    const volatility = 0.01 + Math.random() * 0.05;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const close = Math.max(1, basePrice + change);
    const open = basePrice;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    const volume = Math.floor(100000 + Math.random() * 900000);

    data.push({
      symbol,
      market,
      price: close,
      volume,
      high24h: close * 1.02,
      low24h: close * 0.98,
      change24h: (Math.random() - 0.5) * 10,
      timestamp,
      ohlcv: [{ open, high, low, close, volume }]
    });

    basePrice = close;
    current += step;
    if (current > endDate.getTime()) break;
  }

  return data;
}

export async function backtestHighConfidenceConfig(
  signalGenerator: SignalGenerator,
  technicalAnalysis: TechnicalAnalysis,
  riskManagement: RiskManagementService,
  overrides: Partial<BacktestConfig> = {}
): Promise<BacktestResult> {
  const endDate = overrides.endDate || new Date();
  const startDate = overrides.startDate || new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days

  const baseConfig: BacktestConfig = {
    startDate,
    endDate,
    initialCapital: overrides.initialCapital ?? 10000,
    commission: overrides.commission ?? 0.1,
    slippage: overrides.slippage ?? 0.05,
    maxPositionSize: overrides.maxPositionSize ?? 10,
    riskPerTrade: overrides.riskPerTrade ?? 2,
    timeframes: overrides.timeframes ?? DefaultHighConfidencePreset.timeframes,
    markets: overrides.markets ?? ['CRYPTO', 'STOCKS'],
    symbols: overrides.symbols ?? ['BTCUSDT', 'ETHUSDT', 'AAPL', 'GOOGL'],
    enableRiskManagement: overrides.enableRiskManagement ?? true,
    enableOptimization: overrides.enableOptimization ?? false,
    optimizationMetric: overrides.optimizationMetric ?? 'winRate'
  };

  const engine = new BacktestingEngine(baseConfig, signalGenerator, technicalAnalysis, riskManagement);

  // Prepare historical data per symbol/market
  const marketDataHistory = new Map<string, MarketData[]>();
  for (const market of baseConfig.markets) {
    for (const symbol of baseConfig.symbols) {
      const key = `${symbol}_${market}`;
      const series = await generateHistoricalData(symbol, market as keyof MarketType, baseConfig.startDate, baseConfig.endDate, 1000);
      marketDataHistory.set(key, series);
    }
  }

  return engine.runBacktest(marketDataHistory);
}

export function meetsLiveTradingGuard(metrics: PerformanceMetrics): boolean {
  // Realistic safety gating: prioritize profit factor, drawdown, and consistency over raw win rate
  const winRateOk = metrics.winRate >= 70; // ambitious but realistic threshold
  const profitFactorOk = metrics.profitFactor >= 1.5;
  const drawdownOk = metrics.maxDrawdown <= 15;
  const tradeCountOk = metrics.totalTrades >= 30; // avoid overfitting on tiny samples
  return winRateOk && profitFactorOk && drawdownOk && tradeCountOk;
}

export interface StrategyAssessment {
  shouldEnableLive: boolean;
  summary: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    totalTrades: number;
  };
}

export function assessStrategyForLive(metrics: PerformanceMetrics): StrategyAssessment {
  return {
    shouldEnableLive: meetsLiveTradingGuard(metrics),
    summary: {
      winRate: metrics.winRate,
      profitFactor: metrics.profitFactor,
      maxDrawdown: metrics.maxDrawdown,
      totalTrades: metrics.totalTrades
    }
  };
}

// Example usage (invoke from your bootstrap or optimization flow):
// const sg = new SignalGenerator();
// await sg.initialize();
// enableHighConfidenceMode(sg);
// const ta = new TechnicalAnalysis();
// const rms = new RiskManagementService();
// const result = await backtestHighConfidenceConfig(sg, ta, rms);
// const assessment = assessStrategyForLive(result.metrics);
// if (assessment.shouldEnableLive) {
//   // Proceed to connect execution service and place guarded orders
// }