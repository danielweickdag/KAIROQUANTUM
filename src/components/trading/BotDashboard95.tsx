'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Activity,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Settings,
  PlayCircle,
  StopCircle,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  BarChart3,
  Brain,
  Lock,
  Unlock,
} from 'lucide-react';
import { profitBot95, BotPerformance, BotSignal } from '@/services/profitBot95';

export default function BotDashboard95() {
  const [isRunning, setIsRunning] = useState(false);
  const [performance, setPerformance] = useState<BotPerformance | null>(null);
  const [recentSignals, setRecentSignals] = useState<BotSignal[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  // Configuration states
  const [profitTarget, setProfitTarget] = useState('2.5');
  const [stopLoss, setStopLoss] = useState('0.8');
  const [maxDailyTrades, setMaxDailyTrades] = useState('20');
  const [dailyGoal, setDailyGoal] = useState('500');
  const [minConfidence, setMinConfidence] = useState('88');

  // Load initial config
  useEffect(() => {
    const config = profitBot95.getConfig();
    setProfitTarget(config.profitPerTrade.toString());
    setStopLoss(config.maxRiskPerTrade.toString());
    setMaxDailyTrades(config.maxDailyTrades.toString());
    setDailyGoal(config.dailyProfitGoal.toString());
  }, []);

  // Update performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const perf = profitBot95.getPerformance();
      setPerformance(perf);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe to bot signals
  useEffect(() => {
    const unsubscribe = profitBot95.subscribe((signal) => {
      setRecentSignals(prev => [signal, ...prev].slice(0, 10));
    });

    return unsubscribe;
  }, []);

  const handleStartBot = () => {
    // Update config first
    profitBot95.updateConfig({
      profitPerTrade: parseFloat(profitTarget),
      maxRiskPerTrade: parseFloat(stopLoss),
      maxDailyTrades: parseInt(maxDailyTrades),
      dailyProfitGoal: parseFloat(dailyGoal),
    });

    profitBot95.start();
    setIsRunning(true);
  };

  const handleStopBot = () => {
    profitBot95.stop();
    setIsRunning(false);
  };

  const handleEmergencyStop = () => {
    profitBot95.stop();
    setIsRunning(false);
    // Could also close all positions here
    alert('Emergency Stop Activated! All bot activity halted.');
  };

  const winRateColor = performance && performance.winRate >= 90
    ? 'text-green-500'
    : performance && performance.winRate >= 80
    ? 'text-yellow-500'
    : 'text-red-500';

  const profitColor = performance && performance.totalProfit >= 0
    ? 'text-green-500'
    : 'text-red-500';

  return (
    <div className="space-y-4">
      {/* Header Card - Bot Status */}
      <Card className={`border-2 ${isRunning ? 'bg-green-500/10 border-green-500' : 'bg-slate-800/50 border-slate-700'}`}>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${isRunning ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                <Brain className={`w-8 h-8 ${isRunning ? 'text-green-400 animate-pulse' : 'text-slate-400'}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  95% Profit Bot {isRunning && <Badge className="ml-2 bg-green-500/20 text-green-400">ACTIVE</Badge>}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isRunning ? 'AI actively scanning markets and executing trades' : 'Bot is currently stopped'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {isRunning ? (
                <>
                  <Button
                    onClick={handleStopBot}
                    variant="outline"
                    className="bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Bot
                  </Button>
                  <Button
                    onClick={handleEmergencyStop}
                    variant="outline"
                    className="bg-red-500/20 border-red-500 hover:bg-red-500/30"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Emergency Stop
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStartBot}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Bot
                </Button>
              )}
              <Button
                onClick={() => setShowConfig(!showConfig)}
                variant="outline"
                className="bg-slate-700 border-slate-600"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {showConfig && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Bot Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Daily Profit Goal ($)
                </label>
                <Input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-lg font-bold"
                  step="50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Default: $500 | Bot stops automatically when goal is reached
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Profit Target per Trade (%)
                </label>
                <Input
                  type="number"
                  value={profitTarget}
                  onChange={(e) => setProfitTarget(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                  step="0.1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Default: 2.5% | Higher = more profit but lower win rate
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Stop Loss per Trade (%)
                </label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                  step="0.1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Default: 0.8% | Lower = safer but tighter stops
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Max Daily Trades
                </label>
                <Input
                  type="number"
                  value={maxDailyTrades}
                  onChange={(e) => setMaxDailyTrades(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Default: 20 | More trades = more opportunities
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Risk/Reward Ratio</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Current: {(parseFloat(profitTarget) / parseFloat(stopLoss)).toFixed(2)}:1
                    {' '}(Risk ${stopLoss} to make ${profitTarget})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                Today
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1">Daily Profit</p>
            <p className={`text-3xl font-bold ${performance && performance.todayProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${performance?.todayProfit.toFixed(2) || '0.00'}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((performance?.todayProfit || 0) / parseFloat(dailyGoal)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Goal: ${dailyGoal} ({(((performance?.todayProfit || 0) / parseFloat(dailyGoal)) * 100).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                Target: 95%
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1">Win Rate</p>
            <p className={`text-3xl font-bold ${winRateColor}`}>
              {performance?.winRate.toFixed(1) || '0.0'}%
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(performance?.winRate || 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-slate-400 mb-1">Total Profit</p>
            <p className={`text-3xl font-bold ${profitColor}`}>
              ${performance?.totalProfit.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {performance?.totalTrades || 0} trades executed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-xs">
                Today
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1">Trades Today</p>
            <p className="text-3xl font-bold text-white">
              {performance?.tradesRemaining !== undefined
                ? (maxDailyTrades ? parseInt(maxDailyTrades) : 20) - performance.tradesRemaining
                : 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {performance?.tradesRemaining || 0} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-orange-400" />
              <Badge variant="outline" className={`text-xs ${isRunning ? 'bg-green-500/20 text-green-400' : ''}`}>
                {isRunning ? 'Live' : 'Stopped'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1">Profit Factor</p>
            <p className="text-3xl font-bold text-white">
              {performance?.profitFactor.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Sharpe: {performance?.sharpeRatio.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Strategies */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Active Trading Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'Momentum Surge', weight: 30, active: isRunning },
              { name: 'Mean Reversion', weight: 25, active: isRunning },
              { name: 'Breakout Scanner', weight: 20, active: isRunning },
              { name: 'AI Pattern', weight: 15, active: isRunning },
              { name: 'Volume Spike', weight: 10, active: isRunning },
            ].map((strategy) => (
              <div
                key={strategy.name}
                className={`p-3 rounded-lg border ${
                  strategy.active
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-2 h-2 rounded-full ${strategy.active ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                  <Badge variant="outline" className="text-xs">
                    {strategy.weight}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-white">{strategy.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {strategy.active ? 'Scanning...' : 'Inactive'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Signals */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Trading Signals
            {isRunning && (
              <Badge className="ml-2 bg-blue-500/20 text-blue-400 animate-pulse">
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSignals.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No signals yet. Start the bot to see live trading signals.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSignals.map((signal, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    signal.action === 'buy'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {signal.action === 'buy' ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                          <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white uppercase">{signal.action}</p>
                          <Badge variant="outline" className="text-xs">
                            {signal.strategy}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Expected: +${signal.expectedProfit.toFixed(2)} | Risk: {(signal.riskLevel * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-700 rounded-full h-2 w-24">
                          <div
                            className={`h-2 rounded-full ${
                              signal.confidence >= 0.9
                                ? 'bg-green-500'
                                : signal.confidence >= 0.8
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${signal.confidence * 100}%` }}
                          />
                        </div>
                        <p className="text-sm font-bold text-white">
                          {(signal.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Confidence</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Features */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardContent className="py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
              <div>
                <p className="font-medium text-white mb-1">Advanced Protection Systems Active</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Auto Stop-Loss
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Daily Limit Protection
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Win Rate Monitoring
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Kelly Criterion Sizing
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Multi-Strategy Consensus
                  </Badge>
                </div>
              </div>
            </div>
            {isRunning ? (
              <Lock className="w-5 h-5 text-green-400" />
            ) : (
              <Unlock className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
