'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  Zap, 
  Clock, 
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface DailyProfitTargetProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

interface ProfitTargetData {
  dailyTarget: number;
  currentProfit: number;
  progressPercentage: number;
  tradesExecuted: number;
  successfulTrades: number;
  timeRemaining: string;
  estimatedCompletion: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface AIStrategy {
  id: string;
  name: string;
  description: string;
  expectedReturn: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
  isActive: boolean;
}

export default function DailyProfitTarget({ isActive = false, onToggle }: DailyProfitTargetProps) {
  const [targetData, setTargetData] = useState<ProfitTargetData>({
    dailyTarget: 500,
    currentProfit: 347.50,
    progressPercentage: 69.5,
    tradesExecuted: 12,
    successfulTrades: 11,
    timeRemaining: "4h 23m",
    estimatedCompletion: "2:45 PM",
    riskLevel: 'MEDIUM'
  });

  const [aiStrategies, setAiStrategies] = useState<AIStrategy[]>([
    {
      id: '1',
      name: 'Momentum Scalping',
      description: 'Quick profits from price momentum',
      expectedReturn: 2.5,
      riskLevel: 'MEDIUM',
      timeframe: '1-5m',
      isActive: true
    },
    {
      id: '2',
      name: 'Mean Reversion',
      description: 'Profit from price corrections',
      expectedReturn: 1.8,
      riskLevel: 'LOW',
      timeframe: '15-30m',
      isActive: true
    },
    {
      id: '3',
      name: 'Breakout Trading',
      description: 'Capture strong directional moves',
      expectedReturn: 4.2,
      riskLevel: 'HIGH',
      timeframe: '5-15m',
      isActive: false
    }
  ]);

  const [autoTradeSettings, setAutoTradeSettings] = useState({
    enabled: isActive,
    maxRiskPerTrade: 2,
    maxDailyRisk: 10,
    stopOnTarget: true,
    stopOnLoss: true,
    maxLossLimit: 200
  });

  const [targetAmount, setTargetAmount] = useState(500);

  // Update auto trade enabled state when prop changes
  useEffect(() => {
    setAutoTradeSettings(prev => ({ ...prev, enabled: isActive }));
  }, [isActive]);

  // Simulate real-time updates
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTargetData(prev => {
          const newProfit = prev.currentProfit + (Math.random() * 10 - 3); // Random profit change
          const newProgress = Math.min((newProfit / prev.dailyTarget) * 100, 100);
          
          return {
            ...prev,
            currentProfit: Math.max(0, newProfit),
            progressPercentage: Math.max(0, newProgress),
            tradesExecuted: prev.tradesExecuted + (Math.random() > 0.8 ? 1 : 0),
            successfulTrades: prev.successfulTrades + (Math.random() > 0.9 ? 1 : 0)
          };
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleToggleAutoTrade = () => {
    const newState = !autoTradeSettings.enabled;
    setAutoTradeSettings(prev => ({ ...prev, enabled: newState }));
    onToggle?.(newState);
  };

  const handleStrategyToggle = (strategyId: string) => {
    setAiStrategies(prev => 
      prev.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 border-green-500';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500';
      case 'HIGH': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getProgressColor = () => {
    if (targetData.progressPercentage >= 100) return 'bg-green-500';
    if (targetData.progressPercentage >= 75) return 'bg-blue-500';
    if (targetData.progressPercentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* Daily Target Header */}
      <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-400" />
              Daily Profit Target
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Brain className="w-3 h-3 mr-1" />
                AI Driven
              </Badge>
              <Switch
                checked={autoTradeSettings.enabled}
                onCheckedChange={handleToggleAutoTrade}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Overview */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                ${targetData.currentProfit.toFixed(2)}
              </div>
              <div className="text-sm text-slate-400">
                of ${targetData.dailyTarget} target ({targetData.progressPercentage.toFixed(1)}%)
              </div>
              <Progress 
                value={targetData.progressPercentage} 
                className="mt-2 h-3"
                style={{ 
                  background: 'rgba(71, 85, 105, 0.3)' 
                }}
              />
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {autoTradeSettings.enabled ? (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Play className="w-4 h-4" />
                    <span>AUTO TRADING</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-400">
                    <Pause className="w-4 h-4" />
                    <span>PAUSED</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{targetData.timeRemaining} left</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>{targetData.tradesExecuted} trades</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Target Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Daily Target Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Daily Target</label>
              <span className="text-sm text-green-400">${targetAmount}</span>
            </div>
            <Slider
              value={[targetAmount]}
              onValueChange={(value) => setTargetAmount(value[0])}
              max={2000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>

          {/* Risk Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Max Risk Per Trade</label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[autoTradeSettings.maxRiskPerTrade]}
                  onValueChange={(value) => setAutoTradeSettings(prev => ({ ...prev, maxRiskPerTrade: value[0] }))}
                  max={10}
                  min={0.5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-xs text-blue-400 w-8">{autoTradeSettings.maxRiskPerTrade}%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Daily Risk</label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[autoTradeSettings.maxDailyRisk]}
                  onValueChange={(value) => setAutoTradeSettings(prev => ({ ...prev, maxDailyRisk: value[0] }))}
                  max={25}
                  min={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-blue-400 w-8">{autoTradeSettings.maxDailyRisk}%</span>
              </div>
            </div>
          </div>

          {/* Auto Stop Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Stop on Target Reached</div>
                <div className="text-xs text-slate-400">Automatically stop trading when target is met</div>
              </div>
              <Switch
                checked={autoTradeSettings.stopOnTarget}
                onCheckedChange={(checked) => setAutoTradeSettings(prev => ({ ...prev, stopOnTarget: checked }))}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Stop on Loss Limit</div>
                <div className="text-xs text-slate-400">Stop trading if losses exceed ${autoTradeSettings.maxLossLimit}</div>
              </div>
              <Switch
                checked={autoTradeSettings.stopOnLoss}
                onCheckedChange={(checked) => setAutoTradeSettings(prev => ({ ...prev, stopOnLoss: checked }))}
                className="data-[state=checked]:bg-red-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Trading Strategies */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Trading Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiStrategies.map((strategy) => (
              <div 
                key={strategy.id}
                className="p-3 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold">{strategy.name}</div>
                    <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                      {strategy.riskLevel}
                    </Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {strategy.timeframe}
                    </Badge>
                  </div>
                  <Switch
                    checked={strategy.isActive}
                    onCheckedChange={() => handleStrategyToggle(strategy.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <div className="text-sm text-slate-400 mb-2">
                  {strategy.description}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-slate-400">Expected Return:</span>
                    <span className="text-green-400 font-semibold ml-1">+{strategy.expectedReturn}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {strategy.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-xs text-slate-400">
                      {strategy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
            Today's Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-green-400">
                {((targetData.successfulTrades / targetData.tradesExecuted) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Success Rate</div>
              <div className="text-xs text-slate-500">
                {targetData.successfulTrades}/{targetData.tradesExecuted} trades
              </div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-blue-400">
                ${(targetData.currentProfit / targetData.tradesExecuted).toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">Avg Per Trade</div>
              <div className="text-xs text-slate-500">
                ETA: {targetData.estimatedCompletion}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}