'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Target,
  Copy,
  Play,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Brain,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfitTracker {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface TopTrader {
  id: string;
  name: string;
  avatar: string;
  profit: number;
  winRate: number;
  followers: number;
  isFollowing: boolean;
}

export default function SimpleTradeHub() {
  const router = useRouter();
  const [balance, setBalance] = useState(10000);
  const [profits, setProfits] = useState<ProfitTracker>({
    today: 247.50,
    week: 1850.25,
    month: 6420.80,
    total: 12847.50,
  });

  const [quickTradeAmount, setQuickTradeAmount] = useState('100');
  const [autoProtect, setAutoProtect] = useState(true);
  const [profitTarget, setProfitTarget] = useState(500);
  const [isTrading, setIsTrading] = useState(false);

  const [topTraders] = useState<TopTrader[]>([
    { id: '1', name: 'ProTrader Mike', avatar: '👨‍💼', profit: 12450, winRate: 89, followers: 2340, isFollowing: false },
    { id: '2', name: 'Sarah Crypto', avatar: '👩‍💻', profit: 9820, winRate: 85, followers: 1890, isFollowing: true },
    { id: '3', name: 'AI Bot Alpha', avatar: '🤖', profit: 15600, winRate: 92, followers: 5670, isFollowing: false },
  ]);

  // Simulate real-time profit updates
  useEffect(() => {
    if (!isTrading) return;

    const interval = setInterval(() => {
      const profitChange = (Math.random() - 0.3) * 50; // Slight positive bias
      setProfits(prev => ({
        ...prev,
        today: prev.today + profitChange,
        total: prev.total + profitChange,
      }));
      setBalance(prev => prev + profitChange);
    }, 2000);

    return () => clearInterval(interval);
  }, [isTrading]);

  const handleQuickTrade = (direction: 'buy' | 'sell') => {
    setIsTrading(true);
    // Simulate trade execution
    setTimeout(() => {
      const profit = parseFloat(quickTradeAmount) * (Math.random() * 0.1);
      setProfits(prev => ({
        ...prev,
        today: prev.today + profit,
        total: prev.total + profit,
      }));
      setBalance(prev => prev + profit);
    }, 1000);
  };

  const handleCopyTrader = (traderId: string) => {
    console.log('Following trader:', traderId);
    // In real app, this would start copying trades
  };

  const todayProfitColor = profits.today >= 0 ? 'text-green-500' : 'text-red-500';
  const todayProfitIcon = profits.today >= 0 ? TrendingUp : TrendingDown;
  const TodayIcon = todayProfitIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      {/* Header with Balance */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              KAIRO Simple Trade
            </h1>
            <p className="text-slate-400 text-sm">Make money in 3 clicks</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Your Balance</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profit Tracking */}
        <div className="lg:col-span-1 space-y-4">
          {/* Today's Profit - Big and Bold */}
          <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Today's Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-4xl font-bold ${todayProfitColor}`}>
                    ${Math.abs(profits.today).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TodayIcon className={`w-5 h-5 mr-1 ${todayProfitColor}`} />
                    <span className={`text-sm ${todayProfitColor}`}>
                      {profits.today >= 0 ? '+' : '-'}{((Math.abs(profits.today) / balance) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-6xl opacity-20">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Breakdown */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">This Week</span>
                <span className="text-green-400 font-semibold">+${profits.week.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">This Month</span>
                <span className="text-green-400 font-semibold">+${profits.month.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                <span className="text-white font-medium">Total Profit</span>
                <span className="text-green-400 text-xl font-bold">+${profits.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Target */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Daily Target
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {((profits.today / profitTarget) * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Goal: ${profitTarget}</span>
                  <span className="text-white font-medium">${profits.today.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 transition-all duration-500"
                    style={{ width: `${Math.min((profits.today / profitTarget) * 100, 100)}%` }}
                  />
                </div>
                {profits.today >= profitTarget && (
                  <div className="flex items-center text-green-400 text-sm mt-2">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Target Achieved! 🎉
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Quick Trading */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Quick Trade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Trade Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    value={quickTradeAmount}
                    onChange={(e) => setQuickTradeAmount(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white text-xl h-14"
                    placeholder="100"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000, 5000].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickTradeAmount(amount.toString())}
                      className="flex-1 text-xs"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Buy/Sell Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleQuickTrade('buy')}
                  className="h-24 text-xl font-bold bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <div className="flex flex-col items-center">
                    <ArrowUpRight className="w-8 h-8 mb-1" />
                    <span>BUY</span>
                  </div>
                </Button>
                <Button
                  onClick={() => handleQuickTrade('sell')}
                  className="h-24 text-xl font-bold bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  <div className="flex flex-col items-center">
                    <ArrowDownRight className="w-8 h-8 mb-1" />
                    <span>SELL</span>
                  </div>
                </Button>
              </div>

              {/* Auto-Protect Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center">
                  {autoProtect ? (
                    <Lock className="w-5 h-5 mr-2 text-green-400" />
                  ) : (
                    <Unlock className="w-5 h-5 mr-2 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Auto-Protect Profits</p>
                    <p className="text-xs text-slate-400">
                      {autoProtect ? 'Stops active' : 'Manual mode'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={autoProtect ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoProtect(!autoProtect)}
                  className={autoProtect ? "bg-green-600" : ""}
                >
                  {autoProtect ? 'ON' : 'OFF'}
                </Button>
              </div>

              {/* Active Trade Indicator */}
              {isTrading && (
                <div className="flex items-center justify-center p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  <span className="text-sm">Trade Active - Monitoring...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Copy Trading */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copy className="w-5 h-5 mr-2 text-blue-400" />
                Copy Top Traders
              </CardTitle>
              <p className="text-sm text-slate-400">Automatically follow profitable traders</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topTraders.map(trader => (
                <div
                  key={trader.id}
                  className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{trader.avatar}</div>
                      <div>
                        <p className="font-medium">{trader.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            {trader.winRate}% Win Rate
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-slate-400 text-xs">Monthly Profit</p>
                      <p className="text-green-400 font-semibold">+${trader.profit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Followers</p>
                      <p className="text-white font-semibold">{trader.followers.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCopyTrader(trader.id)}
                    className={`w-full ${
                      trader.isFollowing
                        ? 'bg-slate-600 hover:bg-slate-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    size="sm"
                  >
                    {trader.isFollowing ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Trades
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="max-w-7xl mx-auto mt-6 space-y-4">
        {/* AI Bot Card */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Want to make ${profitTarget}/day automatically?</p>
                <p className="text-sm text-slate-400">95% win rate AI bot trades for you 24/7</p>
              </div>
              <Button
                onClick={() => router.push('/profit-bot')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
              >
                <Brain className="w-5 h-5 mr-2" />
                Activate 95% Bot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Banking Quick Access Card */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Deposit or withdraw your profits instantly</p>
                <p className="text-sm text-slate-400">Connect any bank • Same-day withdrawals</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/banking')}
                  variant="outline"
                  className="bg-green-600 border-green-500 hover:bg-green-700"
                >
                  <ArrowDownToLine className="w-5 h-5 mr-2" />
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push('/banking')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-6"
                >
                  <ArrowUpFromLine className="w-5 h-5 mr-2" />
                  Withdraw Profits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
