'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  DollarSign, 
  BarChart3, 
  Activity,
  CheckCircle,
  XCircle,
  Settings,
  Zap,
  Brain,
  Clock,
  TrendingUp
} from 'lucide-react';

interface RiskManagementProps {
  accountBalance?: number;
  currentDrawdown?: number;
  onRiskSettingsChange?: (settings: RiskSettings) => void;
}

interface RiskSettings {
  maxRiskPerTrade: number;
  maxDailyRisk: number;
  maxDrawdown: number;
  stopLossEnabled: boolean;
  takeProfitEnabled: boolean;
  trailingStopEnabled: boolean;
  positionSizingMethod: 'FIXED' | 'PERCENTAGE' | 'KELLY' | 'VOLATILITY';
  riskRewardRatio: number;
  maxPositions: number;
  correlationLimit: number;
}

interface DrawdownData {
  current: number;
  maximum: number;
  duration: number;
  recovery: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

interface PositionSizing {
  symbol: string;
  recommendedSize: number;
  maxSize: number;
  riskAmount: number;
  stopLossDistance: number;
  confidence: number;
}

export default function RiskManagement({ 
  accountBalance = 50000, 
  currentDrawdown = 2.3,
  onRiskSettingsChange 
}: RiskManagementProps) {
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxRiskPerTrade: 2,
    maxDailyRisk: 6,
    maxDrawdown: 10,
    stopLossEnabled: true,
    takeProfitEnabled: true,
    trailingStopEnabled: false,
    positionSizingMethod: 'PERCENTAGE',
    riskRewardRatio: 2,
    maxPositions: 5,
    correlationLimit: 0.7
  });

  const [drawdownData, setDrawdownData] = useState<DrawdownData>({
    current: currentDrawdown,
    maximum: 8.5,
    duration: 3,
    recovery: 65,
    status: currentDrawdown > 5 ? 'WARNING' : 'SAFE'
  });

  const [positionSizing, setPositionSizing] = useState<PositionSizing[]>([
    {
      symbol: 'AAPL',
      recommendedSize: 1250,
      maxSize: 2500,
      riskAmount: 100,
      stopLossDistance: 2.5,
      confidence: 85
    },
    {
      symbol: 'TSLA',
      recommendedSize: 800,
      maxSize: 1600,
      riskAmount: 100,
      stopLossDistance: 4.2,
      confidence: 78
    },
    {
      symbol: 'NVDA',
      recommendedSize: 950,
      maxSize: 1900,
      riskAmount: 100,
      stopLossDistance: 3.8,
      confidence: 92
    }
  ]);

  const [riskMetrics, setRiskMetrics] = useState({
    sharpeRatio: 2.34,
    sortinoRatio: 3.12,
    maxDrawdownPeriod: 12,
    winRate: 68.5,
    profitFactor: 1.85,
    expectancy: 0.42
  });

  // Update risk settings and notify parent
  useEffect(() => {
    onRiskSettingsChange?.(riskSettings);
  }, [riskSettings, onRiskSettingsChange]);

  // Simulate real-time risk monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setDrawdownData(prev => ({
        ...prev,
        current: Math.max(0, prev.current + (Math.random() - 0.5) * 0.5),
        recovery: Math.min(100, prev.recovery + Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRiskSettingChange = (key: keyof RiskSettings, value: any) => {
    setRiskSettings(prev => ({ ...prev, [key]: value }));
  };

  const getDrawdownStatus = () => {
    if (drawdownData.current > riskSettings.maxDrawdown * 0.8) return 'CRITICAL';
    if (drawdownData.current > riskSettings.maxDrawdown * 0.6) return 'WARNING';
    return 'SAFE';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE': return 'text-green-400 border-green-500';
      case 'WARNING': return 'text-yellow-400 border-yellow-500';
      case 'CRITICAL': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const calculatePositionSize = (symbol: string, price: number, stopLoss: number) => {
    const riskAmount = (accountBalance * riskSettings.maxRiskPerTrade) / 100;
    const stopLossDistance = Math.abs(price - stopLoss);
    
    switch (riskSettings.positionSizingMethod) {
      case 'FIXED':
        return 1000; // Fixed $1000 position
      case 'PERCENTAGE':
        return riskAmount / stopLossDistance;
      case 'KELLY':
        // Simplified Kelly criterion
        const winRate = riskMetrics.winRate / 100;
        const avgWin = 1.5; // Average win ratio
        const avgLoss = 1; // Average loss ratio
        const kellyPercent = (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin;
        return (accountBalance * Math.max(0, kellyPercent)) / stopLossDistance;
      case 'VOLATILITY':
        // Volatility-based sizing (simplified)
        const volatilityFactor = 0.8; // Mock volatility
        return (riskAmount * volatilityFactor) / stopLossDistance;
      default:
        return riskAmount / stopLossDistance;
    }
  };

  return (
    <div className="space-y-4">
      {/* Risk Management Header */}
      <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-400" />
              Risk Management
            </CardTitle>
            <Badge variant="outline" className={getStatusColor(getDrawdownStatus())}>
              {getDrawdownStatus()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-red-400">{drawdownData.current.toFixed(1)}%</div>
              <div className="text-xs text-slate-400">Current Drawdown</div>
              <div className="text-xs text-slate-500">Max: {drawdownData.maximum}%</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-green-400">{drawdownData.recovery.toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Recovery Progress</div>
              <div className="text-xs text-slate-500">{drawdownData.duration} days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Risk Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Per Trade */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Max Risk Per Trade</label>
              <span className="text-sm text-red-400">{riskSettings.maxRiskPerTrade}%</span>
            </div>
            <Slider
              value={[riskSettings.maxRiskPerTrade]}
              onValueChange={(value) => handleRiskSettingChange('maxRiskPerTrade', value[0])}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Daily Risk */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Max Daily Risk</label>
              <span className="text-sm text-red-400">{riskSettings.maxDailyRisk}%</span>
            </div>
            <Slider
              value={[riskSettings.maxDailyRisk]}
              onValueChange={(value) => handleRiskSettingChange('maxDailyRisk', value[0])}
              max={20}
              min={2}
              step={1}
              className="w-full"
            />
          </div>

          {/* Max Drawdown */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Max Drawdown Limit</label>
              <span className="text-sm text-red-400">{riskSettings.maxDrawdown}%</span>
            </div>
            <Slider
              value={[riskSettings.maxDrawdown]}
              onValueChange={(value) => handleRiskSettingChange('maxDrawdown', value[0])}
              max={25}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Risk/Reward Ratio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Risk/Reward Ratio</label>
              <span className="text-sm text-green-400">1:{riskSettings.riskRewardRatio}</span>
            </div>
            <Slider
              value={[riskSettings.riskRewardRatio]}
              onValueChange={(value) => handleRiskSettingChange('riskRewardRatio', value[0])}
              max={5}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stop Loss & Take Profit */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Stop Loss & Take Profit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Stop Loss Protection</div>
              <div className="text-xs text-slate-400">Automatically close losing positions</div>
            </div>
            <Switch
              checked={riskSettings.stopLossEnabled}
              onCheckedChange={(checked) => handleRiskSettingChange('stopLossEnabled', checked)}
              className="data-[state=checked]:bg-red-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Take Profit Targets</div>
              <div className="text-xs text-slate-400">Lock in profits at target levels</div>
            </div>
            <Switch
              checked={riskSettings.takeProfitEnabled}
              onCheckedChange={(checked) => handleRiskSettingChange('takeProfitEnabled', checked)}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Trailing Stop Loss</div>
              <div className="text-xs text-slate-400">Dynamic stop loss that follows price</div>
            </div>
            <Switch
              checked={riskSettings.trailingStopEnabled}
              onCheckedChange={(checked) => handleRiskSettingChange('trailingStopEnabled', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Position Sizing */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            Position Sizing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Position Sizing Method */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sizing Method</label>
            <div className="grid grid-cols-2 gap-2">
              {['FIXED', 'PERCENTAGE', 'KELLY', 'VOLATILITY'].map((method) => (
                <Button
                  key={method}
                  variant={riskSettings.positionSizingMethod === method ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRiskSettingChange('positionSizingMethod', method)}
                  className="text-xs"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          {/* Max Positions */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Max Concurrent Positions</label>
              <span className="text-sm text-blue-400">{riskSettings.maxPositions}</span>
            </div>
            <Slider
              value={[riskSettings.maxPositions]}
              onValueChange={(value) => handleRiskSettingChange('maxPositions', value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Recommended Position Sizes */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Recommended Sizes</div>
            {positionSizing.map((position) => (
              <div key={position.symbol} className="p-2 bg-slate-700/30 rounded border border-slate-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{position.symbol}</span>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {position.confidence}% confidence
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Recommended:</span>
                    <div className="font-semibold text-green-400">${position.recommendedSize}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Max Size:</span>
                    <div className="font-semibold text-blue-400">${position.maxSize}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk:</span>
                    <div className="font-semibold text-red-400">${position.riskAmount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-yellow-400" />
            Risk Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{riskMetrics.sharpeRatio}</div>
              <div className="text-xs text-slate-400">Sharpe Ratio</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{riskMetrics.sortinoRatio}</div>
              <div className="text-xs text-slate-400">Sortino Ratio</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-green-400">{riskMetrics.winRate}%</div>
              <div className="text-xs text-slate-400">Win Rate</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-yellow-400">{riskMetrics.profitFactor}</div>
              <div className="text-xs text-slate-400">Profit Factor</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card className="bg-gradient-to-br from-red-900/30 to-yellow-900/30 border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="destructive" size="sm" className="w-full">
              <XCircle className="w-4 h-4 mr-2" />
              Close All Positions
            </Button>
            <Button variant="outline" size="sm" className="w-full border-yellow-500 text-yellow-400">
              <Zap className="w-4 h-4 mr-2" />
              Pause All Trading
            </Button>
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center">
            Use emergency controls only when necessary
          </div>
        </CardContent>
      </Card>
    </div>
  );
}