'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  Volume2, 
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  signal?: 'buy' | 'sell' | 'neutral';
  gainzAlgoScore?: number;
}

export default function MarketScanner() {
  const [activeTab, setActiveTab] = useState('gainers');

  const topGainers: MarketItem[] = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      price: 875.30,
      change: 45.20,
      changePercent: 5.44,
      volume: 28500000,
      marketCap: '2.1T',
      signal: 'buy',
      gainzAlgoScore: 94
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: 185.75,
      change: 8.90,
      changePercent: 5.03,
      volume: 15200000,
      marketCap: '300B',
      signal: 'buy',
      gainzAlgoScore: 89
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 248.75,
      change: 11.25,
      changePercent: 4.74,
      volume: 45600000,
      marketCap: '790B',
      signal: 'neutral',
      gainzAlgoScore: 76
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 175.43,
      change: 6.80,
      changePercent: 4.03,
      volume: 32100000,
      marketCap: '2.7T',
      signal: 'buy',
      gainzAlgoScore: 92
    }
  ];

  const topLosers: MarketItem[] = [
    {
      symbol: 'META',
      name: 'Meta Platforms',
      price: 485.20,
      change: -18.75,
      changePercent: -3.72,
      volume: 18900000,
      marketCap: '1.2T',
      signal: 'sell',
      gainzAlgoScore: 25
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc',
      price: 425.60,
      change: -15.40,
      changePercent: -3.49,
      volume: 8700000,
      marketCap: '189B',
      signal: 'sell',
      gainzAlgoScore: 31
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 142.85,
      change: -4.95,
      changePercent: -3.35,
      volume: 25400000,
      marketCap: '1.8T',
      signal: 'neutral',
      gainzAlgoScore: 58
    }
  ];

  const gainzAlgoSignals: MarketItem[] = [
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp',
      price: 415.30,
      change: 2.85,
      changePercent: 0.69,
      volume: 19800000,
      marketCap: '3.1T',
      signal: 'buy',
      gainzAlgoScore: 96
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc',
      price: 155.75,
      change: -1.20,
      changePercent: -0.76,
      volume: 28900000,
      marketCap: '1.6T',
      signal: 'buy',
      gainzAlgoScore: 93
    },
    {
      symbol: 'CRM',
      name: 'Salesforce Inc',
      price: 285.40,
      change: 8.75,
      changePercent: 3.16,
      volume: 4200000,
      marketCap: '280B',
      signal: 'buy',
      gainzAlgoScore: 91
    }
  ];

  const mostActive: MarketItem[] = [
    {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      price: 485.20,
      change: 2.85,
      changePercent: 0.59,
      volume: 85600000,
      marketCap: '450B',
      signal: 'neutral',
      gainzAlgoScore: 72
    },
    {
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      price: 395.75,
      change: 4.20,
      changePercent: 1.07,
      volume: 42300000,
      marketCap: '220B',
      signal: 'buy',
      gainzAlgoScore: 85
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 248.75,
      change: 11.25,
      changePercent: 4.74,
      volume: 45600000,
      marketCap: '790B',
      signal: 'neutral',
      gainzAlgoScore: 76
    }
  ];

  const getTabData = (tab: string) => {
    switch (tab) {
      case 'gainers': return topGainers;
      case 'losers': return topLosers;
      case 'signals': return gainzAlgoSignals;
      case 'active': return mostActive;
      default: return topGainers;
    }
  };

  const handleSymbolClick = (symbol: string) => {
    console.log('Selected symbol:', symbol);
    // Symbol selection logic would go here
  };

  const getSignalIcon = (signal?: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'sell':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <AlertCircle className="w-3 h-3 text-yellow-400" />;
    }
  };

  const getSignalColor = (signal?: string) => {
    switch (signal) {
      case 'buy': return 'border-green-500 text-green-400';
      case 'sell': return 'border-red-500 text-red-400';
      default: return 'border-yellow-500 text-yellow-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Search className="w-5 h-5 mr-2 text-blue-400" />
          Market Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-700 mb-4">
            <TabsTrigger value="gainers" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="text-xs">
              <TrendingDown className="w-3 h-3 mr-1" />
              Losers
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 bg-slate-700 mb-4">
            <TabsTrigger value="signals" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              GainzAlgo
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              <Volume2 className="w-3 h-3 mr-1" />
              Most Active
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-2 max-h-80 overflow-y-auto">
            {getTabData(activeTab).map((item, index) => (
              <div
                key={item.symbol}
                className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 cursor-pointer transition-colors"
                onClick={() => handleSymbolClick(item.symbol)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{item.symbol}</span>
                    {item.gainzAlgoScore && item.gainzAlgoScore >= 90 && (
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    )}
                    {item.signal && (
                      <Badge variant="outline" className={`text-xs ${getSignalColor(item.signal)}`}>
                        {getSignalIcon(item.signal)}
                        {item.signal.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">${item.price.toFixed(2)}</div>
                    <div className={`text-xs ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 truncate mb-1">
                  {item.name}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <div>
                      <span className="text-slate-400">Vol: </span>
                      <span>{(item.volume / 1000000).toFixed(1)}M</span>
                    </div>
                    {item.marketCap && (
                      <div>
                        <span className="text-slate-400">Cap: </span>
                        <span>{item.marketCap}</span>
                      </div>
                    )}
                  </div>
                  {item.gainzAlgoScore && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.gainzAlgoScore >= 90 ? 'border-green-500 text-green-400' :
                        item.gainzAlgoScore >= 70 ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }`}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {item.gainzAlgoScore}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-slate-600">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => console.log('Refresh scanner')}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => console.log('Add to watchlist')}
            >
              + Watchlist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}