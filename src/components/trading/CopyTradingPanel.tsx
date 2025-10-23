'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Copy, 
  DollarSign, 
  Target, 
  Shield, 
  Activity,
  UserPlus,
  UserMinus,
  BarChart3,
  Clock,
  Award,
  Zap
} from 'lucide-react';

interface CopyTradingPanelProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

interface Trader {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  winRate: number;
  totalReturn: number;
  monthlyReturn: number;
  maxDrawdown: number;
  totalTrades: number;
  avgHoldTime: string;
  riskScore: number;
  copiers: number;
  isFollowing: boolean;
  recentTrades: Trade[];
}

interface Trade {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  profit: number;
  profitPercent: number;
  timestamp: Date;
  status: 'open' | 'closed';
}

export default function CopyTradingPanel({ isActive, onToggle }: CopyTradingPanelProps) {
  const [topTraders, setTopTraders] = useState<Trader[]>([]);
  const [followedTraders, setFollowedTraders] = useState<Trader[]>([]);
  const [copyAmount, setCopyAmount] = useState(1000);
  const [riskLevel, setRiskLevel] = useState(3);
  const [autoFollow, setAutoFollow] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  // Initialize traders data
  useEffect(() => {
    const mockTraders: Trader[] = [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: '/api/placeholder/40/40',
        verified: true,
        followers: 12450,
        winRate: 87.3,
        totalReturn: 234.5,
        monthlyReturn: 18.7,
        maxDrawdown: 4.2,
        totalTrades: 156,
        avgHoldTime: '2.3 days',
        riskScore: 3,
        copiers: 2340,
        isFollowing: true,
        recentTrades: [
          {
            id: 't1',
            symbol: 'AAPL',
            action: 'BUY',
            amount: 5000,
            price: 175.43,
            profit: 287.50,
            profitPercent: 5.75,
            timestamp: new Date(Date.now() - 3600000),
            status: 'closed'
          },
          {
            id: 't2',
            symbol: 'TSLA',
            action: 'SELL',
            amount: 3000,
            price: 248.87,
            profit: -45.20,
            profitPercent: -1.51,
            timestamp: new Date(Date.now() - 7200000),
            status: 'closed'
          }
        ]
      },
      {
        id: '2',
        name: 'Sarah Williams',
        avatar: '/api/placeholder/40/40',
        verified: true,
        followers: 8920,
        winRate: 92.1,
        totalReturn: 189.3,
        monthlyReturn: 15.2,
        maxDrawdown: 2.8,
        totalTrades: 89,
        avgHoldTime: '4.1 days',
        riskScore: 2,
        copiers: 1890,
        isFollowing: false,
        recentTrades: []
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        avatar: '/api/placeholder/40/40',
        verified: false,
        followers: 5670,
        winRate: 78.9,
        totalReturn: 156.7,
        monthlyReturn: 12.4,
        maxDrawdown: 6.1,
        totalTrades: 203,
        avgHoldTime: '1.8 days',
        riskScore: 4,
        copiers: 1120,
        isFollowing: true,
        recentTrades: []
      }
    ];

    setTopTraders(mockTraders);
    setFollowedTraders(mockTraders.filter(t => t.isFollowing));
  }, []);

  const handleFollowTrader = (traderId: string) => {
    setTopTraders(prev => prev.map(trader => {
      if (trader.id === traderId) {
        const updated = { ...trader, isFollowing: !trader.isFollowing };
        if (updated.isFollowing) {
          setFollowedTraders(current => [...current, updated]);
        } else {
          setFollowedTraders(current => current.filter(t => t.id !== traderId));
        }
        return updated;
      }
      return trader;
    }));
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 2) return 'text-green-400 border-green-500';
    if (risk <= 3) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 2) return 'LOW';
    if (risk <= 3) return 'MEDIUM';
    return 'HIGH';
  };

  return (
    <div className="space-y-4">
      {/* Copy Trading Header */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-green-900/30 border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Copy Trading
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Copy className="w-3 h-3 mr-1" />
                {followedTraders.length} Following
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-green-400">+$2,847</div>
              <div className="text-xs text-slate-400">Total Copied Profit</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-xl font-bold text-blue-400">89.2%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Copy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Copy Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Copy Amount per Trade</label>
              <span className="text-sm text-blue-400">${copyAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={[copyAmount]}
              onValueChange={(value) => setCopyAmount(value[0])}
              max={10000}
              min={100}
              step={100}
              className="w-full"
            />
          </div>

          {/* Risk Level */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Risk Tolerance</label>
              <Badge variant="outline" className={getRiskColor(riskLevel)}>
                {getRiskLabel(riskLevel)}
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
          </div>

          {/* Auto Follow */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-Follow Top Performers</div>
              <div className="text-xs text-slate-400">Automatically follow traders with 90%+ win rate</div>
            </div>
            <Switch
              checked={autoFollow}
              onCheckedChange={setAutoFollow}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Followed Traders */}
      {followedTraders.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Following ({followedTraders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {followedTraders.map((trader) => (
                <div 
                  key={trader.id}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition-colors"
                  onClick={() => setSelectedTrader(trader)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{trader.name}</span>
                          {trader.verified && (
                            <Badge variant="outline" className="border-blue-500 text-blue-400 h-4 text-xs">
                              <Award className="w-2 h-2 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{trader.copiers} copiers</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowTrader(trader.id);
                      }}
                      className="h-6 text-xs border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <UserMinus className="w-3 h-3 mr-1" />
                      Unfollow
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-green-400">{trader.winRate}%</div>
                      <div className="text-slate-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-400">+{trader.monthlyReturn}%</div>
                      <div className="text-slate-400">Monthly</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-400">{trader.maxDrawdown}%</div>
                      <div className="text-slate-400">Drawdown</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Traders */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTraders.map((trader) => (
              <div 
                key={trader.id}
                className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => setSelectedTrader(trader)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={trader.avatar} />
                      <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{trader.name}</span>
                        {trader.verified && (
                          <Badge variant="outline" className="border-blue-500 text-blue-400 h-4 text-xs">
                            <Award className="w-2 h-2 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className={getRiskColor(trader.riskScore)}>
                          {getRiskLabel(trader.riskScore)}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        {trader.followers.toLocaleString()} followers • {trader.copiers} copiers
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={trader.isFollowing ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowTrader(trader.id);
                    }}
                    className={trader.isFollowing 
                      ? "h-6 text-xs border-red-500 text-red-400 hover:bg-red-500/10" 
                      : "h-6 text-xs bg-green-600 hover:bg-green-700"
                    }
                  >
                    {trader.isFollowing ? (
                      <>
                        <UserMinus className="w-3 h-3 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-400">{trader.winRate}%</div>
                    <div className="text-slate-400">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-400">+{trader.totalReturn}%</div>
                    <div className="text-slate-400">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-400">+{trader.monthlyReturn}%</div>
                    <div className="text-slate-400">Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-400">{trader.totalTrades}</div>
                    <div className="text-slate-400">Trades</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Copied Trades */}
      {selectedTrader && selectedTrader.recentTrades.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Recent Trades - {selectedTrader.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTrader.recentTrades.map((trade) => (
                <div 
                  key={trade.id}
                  className={`p-3 rounded-lg border ${
                    trade.profit >= 0 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={trade.action === 'BUY' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                      >
                        {trade.action === 'BUY' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {trade.action}
                      </Badge>
                      <span className="font-semibold">{trade.symbol}</span>
                      <span className="text-sm text-slate-400">${trade.price.toFixed(2)}</span>
                    </div>
                    <div className={`text-right ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="font-semibold">{trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}</div>
                      <div className="text-xs">{trade.profitPercent >= 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Amount: ${trade.amount.toLocaleString()}</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {trade.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}