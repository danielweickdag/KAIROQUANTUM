'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Bot, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Shield, 
  Activity, 
  Settings,
  Play,
  Pause,
  BarChart3,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock
} from 'lucide-react';

interface AITradingBotProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

interface AIBotStats {
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  totalProfit: number;
  avgProfit: number;
  maxDrawdown: number;
  profitFactor: number;
  sharpeRatio: number;
}

interface AISignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  expectedGain: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
  timestamp: Date;
}

export default function AITradingBot({ isActive, onToggle }: AITradingBotProps) {
  const [botStats, setBotStats] = useState<AIBotStats>({
    totalTrades: 247,
    winningTrades: 235,
    winRate: 95.1,
    totalProfit: 28450.75,
    avgProfit: 115.24,
    maxDrawdown: 2.8,
    profitFactor: 2.34,
    sharpeRatio: 3.12
  });

  const [recentSignals, setRecentSignals] = useState<AISignal[]>([]);
  const [riskLevel, setRiskLevel] = useState(2); // 1-5 scale
  const [maxPositionSize, setMaxPositionSize] = useState(10000);
  const [autoExecute, setAutoExecute] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Bot Configuration
  const [botConfig, setBotConfig] = useState({
    gainzAlgoEnabled: true,
    multiMarketScanning: true,
    realTimeExecution: true,
    riskManagement: true,
    stopLossEnabled: true,
    takeProfitEnabled: true,
    drawdownProtection: true,
    signalFiltering: true
  });

  // Generate AI signals
  useEffect(() => {
    if (isActive) {
      const generateSignals = () => {
        const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META'];
        const newSignals: AISignal[] = [];

        for (let i = 0; i < 3; i++) {
          const signal: AISignal = {
            id: `signal_${Date.now()}_${i}`,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            action: Math.random() > 0.5 ? 'BUY' : 'SELL',
            confidence: 90 + Math.random() * 10, // 90-100% confidence
            expectedGain: 2 + Math.random() * 8, // 2-10% expected gain
            riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as 'LOW' | 'MEDIUM' | 'HIGH',
            timeframe: ['1m', '5m', '15m', '1h', '4h'][Math.floor(Math.random() * 5)],
            timestamp: new Date()
          };
          newSignals.push(signal);
        }

        setRecentSignals(newSignals);
      };

      // Generate initial signals
      generateSignals();

      // Update signals every 30 seconds when active
      const interval = setInterval(generateSignals, 30000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  // Simulate processing when bot is activated
  useEffect(() => {
    if (isActive) {
      setIsProcessing(true);
      const timer = setTimeout(() => setIsProcessing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleToggleBot = () => {
    onToggle(!isActive);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 border-green-500';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500';
      case 'HIGH': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Bot Header */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bot className="w-5 h-5 mr-2 text-blue-400" />
              GainzAlgo AI Bot
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Brain className="w-3 h-3 mr-1" />
                95% Win Rate
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleBot}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                {isActive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="font-semibold">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
              {isProcessing && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing signals...</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{botStats.winRate}%</div>
              <div className="text-xs text-slate-400">Win Rate</div>
              <div className="text-xs text-slate-500">{botStats.winningTrades}/{botStats.totalTrades} trades</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">${botStats.totalProfit.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total Profit</div>
              <div className="text-xs text-slate-500">Avg: ${botStats.avgProfit}</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{botStats.profitFactor}</div>
              <div className="text-xs text-slate-400">Profit Factor</div>
              <div className="text-xs text-slate-500">Sharpe: {botStats.sharpeRatio}</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{botStats.maxDrawdown}%</div>
              <div className="text-xs text-slate-400">Max Drawdown</div>
              <div className="text-xs text-slate-500">Low risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Level */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Risk Level</label>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Level {riskLevel}
              </Badge>
            </div>
            <Slider
              value={[riskLevel]}
              onValueChange={(value) => setRiskLevel(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Max Position Size */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Max Position Size</label>
              <span className="text-sm text-blue-400">${maxPositionSize.toLocaleString()}</span>
            </div>
            <Slider
              value={[maxPositionSize]}
              onValueChange={(value) => setMaxPositionSize(value[0])}
              max={50000}
              min={1000}
              step={1000}
              className="w-full"
            />
          </div>

          {/* Auto Execute */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto Execute Trades</div>
              <div className="text-xs text-slate-400">Automatically execute high-confidence signals</div>
            </div>
            <Switch
              checked={autoExecute}
              onCheckedChange={setAutoExecute}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* GainzAlgo Features */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-400" />
            GainzAlgo Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(botConfig).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {enabled ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={enabled ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
              >
                {enabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent AI Signals */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Recent AI Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSignals.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No signals generated yet</p>
              <p className="text-xs">Activate the bot to start receiving signals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSignals.map((signal) => (
                <div 
                  key={signal.id}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={signal.action === 'BUY' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                      >
                        {signal.action}
                      </Badge>
                      <span className="font-semibold">{signal.symbol}</span>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {signal.timeframe}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getRiskColor(signal.riskLevel)}>
                      {signal.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Confidence:</span>
                      <div className="font-semibold text-purple-400">{signal.confidence.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Expected Gain:</span>
                      <div className="font-semibold text-green-400">+{signal.expectedGain.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {signal.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        View Details
                      </Button>
                      {autoExecute && (
                        <Button size="sm" className="h-6 text-xs bg-green-600 hover:bg-green-700">
                          Execute
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}