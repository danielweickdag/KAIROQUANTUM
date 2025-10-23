'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  DollarSign,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BotDashboard95 from '@/components/trading/BotDashboard95';
import { profitBot95 } from '@/services/profitBot95';

export default function ProfitBotPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(10000);

  // Update balance from bot performance
  useEffect(() => {
    const interval = setInterval(() => {
      const performance = profitBot95.getPerformance();
      if (performance.totalProfit !== 0) {
        setBalance(10000 + performance.totalProfit);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => router.push('/simple-trade')}
              variant="outline"
              className="mr-4 bg-slate-800 border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Simple Trade
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  95% Profit Bot
                </h1>
                <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-green-400">
                  AI-Powered
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Advanced AI trading system with 95% target win rate
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Your Balance</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="py-4">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Target Win Rate</p>
                  <p className="text-xl font-bold text-green-400">95%</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">AI Strategies</p>
                  <p className="text-xl font-bold text-blue-400">5 Active</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-yellow-500/20 mr-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Avg Profit/Trade</p>
                  <p className="text-xl font-bold text-yellow-400">2.5%</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Max Risk/Trade</p>
                  <p className="text-xl font-bold text-purple-400">0.8%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Bot Dashboard */}
      <div className="max-w-7xl mx-auto">
        <BotDashboard95 />
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto mt-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-400" />
              How the 95% Profit Bot Works
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <h4 className="font-medium text-white">Multi-Strategy Analysis</h4>
                </div>
                <p className="text-sm text-slate-400 ml-11">
                  The bot runs 5 different AI strategies simultaneously: Momentum Surge, Mean Reversion,
                  Breakout Scanner, AI Pattern Recognition, and Volume Spike detection. Each strategy
                  analyzes the market independently.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-green-400">2</span>
                  </div>
                  <h4 className="font-medium text-white">Consensus-Based Trading</h4>
                </div>
                <p className="text-sm text-slate-400 ml-11">
                  Trades are only executed when multiple strategies agree with high confidence (&gt;88%).
                  This consensus approach dramatically increases win rate by filtering out low-probability setups.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-purple-400">3</span>
                  </div>
                  <h4 className="font-medium text-white">Smart Risk Management</h4>
                </div>
                <p className="text-sm text-slate-400 ml-11">
                  Uses Kelly Criterion for optimal position sizing, tight stop-losses (0.8%), and larger
                  profit targets (2.5%) for a 3:1 risk/reward ratio. Automatically stops if win rate drops below 90%.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 text-green-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-medium text-white mb-2">Expected Returns</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Daily Target (20 trades)</p>
                      <p className="text-xl font-bold text-green-400">+$500</p>
                      <p className="text-xs text-slate-500 mt-1">5% of $10K balance</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Monthly (20 trading days)</p>
                      <p className="text-xl font-bold text-green-400">+$10,000</p>
                      <p className="text-xs text-slate-500 mt-1">100% return on $10K</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Annual Potential</p>
                      <p className="text-xl font-bold text-green-400">+$120,000</p>
                      <p className="text-xs text-slate-500 mt-1">1200% return (compounded)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
