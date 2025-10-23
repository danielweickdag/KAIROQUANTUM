'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  Clock, 
  Globe, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface AlgoFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  performance: number;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'warning';
}

export default function GainzAlgoPanel() {
  const [features, setFeatures] = useState<AlgoFeature[]>([
    {
      id: 'multi-market',
      name: 'Multi-Market Support',
      description: 'Works on all markets & timeframes',
      enabled: true,
      performance: 95,
      icon: <Globe className="w-4 h-4" />,
      status: 'active'
    },
    {
      id: 'high-winrate',
      name: 'High Win Rate',
      description: '95% probability algorithm',
      enabled: true,
      performance: 95,
      icon: <Target className="w-4 h-4" />,
      status: 'active'
    },
    {
      id: 'no-repaint',
      name: 'No Repainting',
      description: 'Reliable signals, no false alerts',
      enabled: true,
      performance: 100,
      icon: <CheckCircle className="w-4 h-4" />,
      status: 'active'
    },
    {
      id: 'realtime-execution',
      name: 'Real-time Execution',
      description: 'Instant signal processing',
      enabled: true,
      performance: 98,
      icon: <Zap className="w-4 h-4" />,
      status: 'active'
    },
    {
      id: 'risk-management',
      name: 'Risk Management',
      description: 'Auto SL/TP integration',
      enabled: true,
      performance: 92,
      icon: <Shield className="w-4 h-4" />,
      status: 'active'
    },
    {
      id: 'low-drawdown',
      name: 'Low Drawdown',
      description: 'Minimal capital risk exposure',
      enabled: true,
      performance: 88,
      icon: <TrendingUp className="w-4 h-4" />,
      status: 'active'
    }
  ]);

  const [algoStats] = useState({
    totalSignals: 1247,
    winRate: 94.8,
    profitFactor: 3.2,
    avgReturn: 12.5,
    maxDrawdown: 3.2,
    sharpeRatio: 2.8,
    activeTimeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
    supportedMarkets: ['Stocks', 'Crypto', 'Forex', 'Commodities']
  });

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'inactive': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'inactive': return <AlertTriangle className="w-3 h-3 text-red-400" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            GainzAlgo V2
          </div>
          <Badge variant="outline" className="border-green-500 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-700/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{algoStats.winRate}%</div>
            <div className="text-xs text-slate-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{algoStats.profitFactor}</div>
            <div className="text-xs text-slate-400">Profit Factor</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-400">{algoStats.avgReturn}%</div>
            <div className="text-xs text-slate-400">Avg Return</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">{algoStats.sharpeRatio}</div>
            <div className="text-xs text-slate-400">Sharpe Ratio</div>
          </div>
        </div>

        {/* Algorithm Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Algorithm Features</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Settings className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {features.map((feature) => (
              <div key={feature.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={getStatusColor(feature.status)}>
                      {feature.icon}
                    </div>
                    <span className="font-medium text-sm">{feature.name}</span>
                    {getStatusIcon(feature.status)}
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <p className="text-xs text-slate-400 mb-2">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <Progress 
                      value={feature.performance} 
                      className="h-1 bg-slate-600"
                    />
                  </div>
                  <span className="text-xs font-medium text-green-400">
                    {feature.performance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Coverage */}
        <div className="space-y-2">
          <h4 className="font-medium">Market Coverage</h4>
          <div className="grid grid-cols-2 gap-2">
            {algoStats.supportedMarkets.map((market) => (
              <Badge key={market} variant="outline" className="justify-center border-blue-500 text-blue-400">
                {market}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeframes */}
        <div className="space-y-2">
          <h4 className="font-medium">Active Timeframes</h4>
          <div className="flex flex-wrap gap-1">
            {algoStats.activeTimeframes.map((timeframe) => (
              <Badge key={timeframe} variant="outline" className="text-xs border-green-500 text-green-400">
                {timeframe}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="space-y-2 p-3 bg-slate-700/20 rounded-lg">
          <h4 className="font-medium">Recent Performance</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-slate-400">Signals Today</div>
              <div className="font-semibold text-blue-400">23</div>
            </div>
            <div>
              <div className="text-slate-400">Success Rate</div>
              <div className="font-semibold text-green-400">96.2%</div>
            </div>
            <div>
              <div className="text-slate-400">Profit Today</div>
              <div className="font-semibold text-yellow-400">+$2,847</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-600">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => console.log('View detailed stats')}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Detailed Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => console.log('Optimize settings')}
          >
            <Settings className="w-3 h-3 mr-1" />
            Optimize
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 p-2 bg-green-900/20 border border-green-500/30 rounded">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">GainzAlgo V2 is actively monitoring markets</span>
        </div>
      </CardContent>
    </Card>
  );
}