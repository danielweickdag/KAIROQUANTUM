'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bitcoin, 
  BarChart3,
  Search,
  Star,
  Plus,
  Minus,
  RefreshCw,
  Clock,
  Volume2,
  Target,
  AlertCircle,
  Zap,
  Shield,
  Activity
} from 'lucide-react';

interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
  exchange: string;
  isWatchlisted: boolean;
  gainzAlgoSignal?: 'BUY' | 'SELL' | 'HOLD';
  signalStrength?: number;
}

interface MarketData {
  stocks: MarketAsset[];
  crypto: MarketAsset[];
  forex: MarketAsset[];
}

interface MarketStats {
  totalAssets: number;
  activeSignals: number;
  avgPerformance: number;
  topPerformer: string;
}

export default function MultiMarketPanel() {
  const [marketData, setMarketData] = useState<MarketData>({
    stocks: [],
    crypto: [],
    forex: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<'stocks' | 'crypto' | 'forex'>('stocks');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalAssets: 0,
    activeSignals: 0,
    avgPerformance: 0,
    topPerformer: ''
  });

  // Mock data initialization
  useEffect(() => {
    const mockStocks: MarketAsset[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 185.42,
        change: 4.23,
        changePercent: 2.34,
        volume: 52840000,
        marketCap: 2890000000000,
        sector: 'Technology',
        exchange: 'NASDAQ',
        isWatchlisted: true,
        gainzAlgoSignal: 'BUY',
        signalStrength: 85
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.90,
        change: -8.45,
        changePercent: -3.28,
        volume: 89420000,
        marketCap: 790000000000,
        sector: 'Automotive',
        exchange: 'NASDAQ',
        isWatchlisted: false,
        gainzAlgoSignal: 'SELL',
        signalStrength: 72
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 875.30,
        change: 28.75,
        changePercent: 3.40,
        volume: 45680000,
        marketCap: 2160000000000,
        sector: 'Technology',
        exchange: 'NASDAQ',
        isWatchlisted: true,
        gainzAlgoSignal: 'BUY',
        signalStrength: 92
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.90,
        change: 6.82,
        changePercent: 1.83,
        volume: 28340000,
        marketCap: 2810000000000,
        sector: 'Technology',
        exchange: 'NASDAQ',
        isWatchlisted: true,
        gainzAlgoSignal: 'HOLD',
        signalStrength: 65
      }
    ];

    const mockCrypto: MarketAsset[] = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 67420.50,
        change: 1840.30,
        changePercent: 2.81,
        volume: 28500000000,
        marketCap: 1320000000000,
        exchange: 'Binance',
        isWatchlisted: true,
        gainzAlgoSignal: 'BUY',
        signalStrength: 88
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3420.80,
        change: -125.40,
        changePercent: -3.54,
        volume: 15200000000,
        marketCap: 410000000000,
        exchange: 'Binance',
        isWatchlisted: true,
        gainzAlgoSignal: 'SELL',
        signalStrength: 76
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 142.30,
        change: 8.95,
        changePercent: 6.71,
        volume: 2840000000,
        marketCap: 63000000000,
        exchange: 'Binance',
        isWatchlisted: false,
        gainzAlgoSignal: 'BUY',
        signalStrength: 82
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.485,
        change: 0.023,
        changePercent: 4.98,
        volume: 890000000,
        marketCap: 17000000000,
        exchange: 'Binance',
        isWatchlisted: false,
        gainzAlgoSignal: 'HOLD',
        signalStrength: 58
      }
    ];

    const mockForex: MarketAsset[] = [
      {
        symbol: 'EURUSD',
        name: 'Euro / US Dollar',
        price: 1.0842,
        change: 0.0023,
        changePercent: 0.21,
        volume: 1200000000,
        exchange: 'FOREX',
        isWatchlisted: true,
        gainzAlgoSignal: 'BUY',
        signalStrength: 71
      },
      {
        symbol: 'GBPUSD',
        name: 'British Pound / US Dollar',
        price: 1.2634,
        change: -0.0089,
        changePercent: -0.70,
        volume: 890000000,
        exchange: 'FOREX',
        isWatchlisted: true,
        gainzAlgoSignal: 'SELL',
        signalStrength: 68
      },
      {
        symbol: 'USDJPY',
        name: 'US Dollar / Japanese Yen',
        price: 149.85,
        change: 0.42,
        changePercent: 0.28,
        volume: 1450000000,
        exchange: 'FOREX',
        isWatchlisted: false,
        gainzAlgoSignal: 'HOLD',
        signalStrength: 62
      },
      {
        symbol: 'AUDUSD',
        name: 'Australian Dollar / US Dollar',
        price: 0.6589,
        change: 0.0034,
        changePercent: 0.52,
        volume: 420000000,
        exchange: 'FOREX',
        isWatchlisted: false,
        gainzAlgoSignal: 'BUY',
        signalStrength: 74
      }
    ];

    setMarketData({ stocks: mockStocks, crypto: mockCrypto, forex: mockForex });

    // Calculate stats
    const allAssets = [...mockStocks, ...mockCrypto, ...mockForex];
    const activeSignals = allAssets.filter(asset => asset.gainzAlgoSignal !== 'HOLD').length;
    const avgPerformance = allAssets.reduce((sum, asset) => sum + asset.changePercent, 0) / allAssets.length;
    const topPerformer = allAssets.reduce((top, asset) => 
      asset.changePercent > top.changePercent ? asset : top
    );

    setMarketStats({
      totalAssets: allAssets.length,
      activeSignals,
      avgPerformance,
      topPerformer: topPerformer.symbol
    });
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updateAssets = (assets: MarketAsset[]) => 
          assets.map(asset => ({
            ...asset,
            price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
            change: asset.change + (Math.random() - 0.5) * 0.5,
            changePercent: asset.changePercent + (Math.random() - 0.5) * 0.1
          }));

        return {
          stocks: updateAssets(prev.stocks),
          crypto: updateAssets(prev.crypto),
          forex: updateAssets(prev.forex)
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const toggleWatchlist = (symbol: string, market: 'stocks' | 'crypto' | 'forex') => {
    setMarketData(prev => ({
      ...prev,
      [market]: prev[market].map(asset =>
        asset.symbol === symbol
          ? { ...asset, isWatchlisted: !asset.isWatchlisted }
          : asset
      )
    }));
  };

  const getSignalColor = (signal?: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-400 border-green-500';
      case 'SELL': return 'text-red-400 border-red-500';
      case 'HOLD': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getSignalStrengthColor = (strength?: number) => {
    if (!strength) return 'bg-gray-500';
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatPrice = (price: number, market: 'stocks' | 'crypto' | 'forex') => {
    if (market === 'forex') return price.toFixed(4);
    if (market === 'crypto' && price < 1) return price.toFixed(6);
    if (market === 'crypto') return price.toLocaleString('en-US', { minimumFractionDigits: 2 });
    return price.toFixed(2);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const currentAssets = marketData[selectedMarket].filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Globe className="w-5 h-5 mr-2 text-green-400" />
              Multi-Market Trading
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{marketStats.totalAssets}</div>
              <div className="text-xs text-slate-400">Total Assets</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-green-400">{marketStats.activeSignals}</div>
              <div className="text-xs text-slate-400">Active Signals</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className={`text-lg font-bold ${marketStats.avgPerformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {marketStats.avgPerformance >= 0 ? '+' : ''}{marketStats.avgPerformance.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-400">Avg Performance</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{marketStats.topPerformer}</div>
              <div className="text-xs text-slate-400">Top Performer</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Market Tabs */}
      <Tabs value={selectedMarket} onValueChange={(value) => setSelectedMarket(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="stocks" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            Stocks
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center">
            <Bitcoin className="w-4 h-4 mr-1" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="forex" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Forex
          </TabsTrigger>
        </TabsList>

        {/* Assets List */}
        <TabsContent value={selectedMarket} className="mt-4">
          <div className="space-y-2">
            {currentAssets.map((asset) => (
              <Card key={asset.symbol} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Asset Info */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWatchlist(asset.symbol, selectedMarket)}
                        className="p-1 h-auto"
                      >
                        <Star className={`w-4 h-4 ${asset.isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
                      </Button>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{asset.symbol}</span>
                          {asset.gainzAlgoSignal && (
                            <Badge variant="outline" className={`text-xs ${getSignalColor(asset.gainzAlgoSignal)}`}>
                              {asset.gainzAlgoSignal}
                            </Badge>
                          )}
                          {asset.signalStrength && (
                            <div className="flex items-center space-x-1">
                              <div className="w-12 h-1 bg-slate-600 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getSignalStrengthColor(asset.signalStrength)}`}
                                  style={{ width: `${asset.signalStrength}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">{asset.signalStrength}%</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">{asset.name}</div>
                        {asset.sector && (
                          <div className="text-xs text-slate-500">{asset.sector}</div>
                        )}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="text-right">
                      <div className="font-semibold">
                        ${formatPrice(asset.price, selectedMarket)}
                      </div>
                      <div className={`text-sm flex items-center ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.changePercent >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-400">
                        {asset.changePercent >= 0 ? '+' : ''}${asset.change.toFixed(2)}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-right text-xs text-slate-400">
                      <div className="flex items-center">
                        <Volume2 className="w-3 h-3 mr-1" />
                        {formatVolume(asset.volume)}
                      </div>
                      {asset.marketCap && (
                        <div>MCap: {formatMarketCap(asset.marketCap)}</div>
                      )}
                      <div>{asset.exchange}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Buy
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Minus className="w-3 h-3 mr-1" />
                        Sell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* GainzAlgo Multi-Market Features */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Zap className="w-4 h-4 mr-2 text-purple-400" />
            GainzAlgo Multi-Market Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="font-semibold text-sm">Cross-Market Analysis</div>
              <div className="text-xs text-slate-400 mt-1">
                Unified signals across stocks, crypto, and forex
              </div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="font-semibold text-sm">Real-Time Execution</div>
              <div className="text-xs text-slate-400 mt-1">
                Instant order placement across all markets
              </div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="font-semibold text-sm">Risk Management</div>
              <div className="text-xs text-slate-400 mt-1">
                Unified portfolio risk across asset classes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}