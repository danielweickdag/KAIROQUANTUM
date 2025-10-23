'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Search, 
  Filter,
  RefreshCw,
  AlertCircle,
  DollarSign,
  BarChart3,
  Globe,
  Zap,
  Bell,
  Eye,
  ExternalLink
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  symbols: string[];
  category: 'EARNINGS' | 'ECONOMIC' | 'COMPANY' | 'MARKET' | 'CRYPTO' | 'FOREX';
  url?: string;
}

interface MarketUpdate {
  id: string;
  type: 'PRICE_ALERT' | 'VOLUME_SPIKE' | 'BREAKOUT' | 'NEWS_IMPACT';
  symbol: string;
  message: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  price?: number;
  change?: number;
}

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast?: string;
  previous?: string;
  timestamp: Date;
  currency: string;
}

export default function MarketNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [marketUpdates, setMarketUpdates] = useState<MarketUpdate[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cut in Q2',
        summary: 'Fed officials hint at monetary policy easing amid economic uncertainty, potentially boosting equity markets.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        impact: 'HIGH',
        sentiment: 'BULLISH',
        symbols: ['SPY', 'QQQ', 'IWM'],
        category: 'ECONOMIC',
        url: '#'
      },
      {
        id: '2',
        title: 'NVIDIA Reports Record Q4 Earnings',
        summary: 'AI chip giant beats expectations with 265% revenue growth, driven by data center demand.',
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        impact: 'HIGH',
        sentiment: 'BULLISH',
        symbols: ['NVDA'],
        category: 'EARNINGS',
        url: '#'
      },
      {
        id: '3',
        title: 'Tesla Recalls 2M Vehicles Over Autopilot Safety',
        summary: 'NHTSA investigation leads to software update for Autopilot system across Model S, 3, X, and Y.',
        source: 'CNBC',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        impact: 'MEDIUM',
        sentiment: 'BEARISH',
        symbols: ['TSLA'],
        category: 'COMPANY',
        url: '#'
      },
      {
        id: '4',
        title: 'Bitcoin ETF Sees Record Inflows',
        summary: 'Spot Bitcoin ETFs attract $1.2B in single day as institutional adoption accelerates.',
        source: 'CoinDesk',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        impact: 'MEDIUM',
        sentiment: 'BULLISH',
        symbols: ['BTC', 'ETH'],
        category: 'CRYPTO',
        url: '#'
      }
    ];

    const mockUpdates: MarketUpdate[] = [
      {
        id: '1',
        type: 'BREAKOUT',
        symbol: 'AAPL',
        message: 'Breaking above $185 resistance with high volume',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        severity: 'WARNING',
        price: 185.42,
        change: 2.3
      },
      {
        id: '2',
        type: 'VOLUME_SPIKE',
        symbol: 'MSFT',
        message: 'Unusual volume spike detected - 3x average',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        severity: 'INFO',
        price: 378.90,
        change: 1.8
      },
      {
        id: '3',
        type: 'PRICE_ALERT',
        symbol: 'SPY',
        message: 'Approaching key support level at $485',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        severity: 'CRITICAL',
        price: 485.12,
        change: -0.8
      }
    ];

    const mockEvents: EconomicEvent[] = [
      {
        id: '1',
        title: 'Non-Farm Payrolls',
        country: 'US',
        importance: 'HIGH',
        actual: '275K',
        forecast: '200K',
        previous: '150K',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
        currency: 'USD'
      },
      {
        id: '2',
        title: 'CPI (Consumer Price Index)',
        country: 'US',
        importance: 'HIGH',
        forecast: '3.2%',
        previous: '3.4%',
        timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        currency: 'USD'
      },
      {
        id: '3',
        title: 'ECB Interest Rate Decision',
        country: 'EU',
        importance: 'HIGH',
        forecast: '4.50%',
        previous: '4.50%',
        timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        currency: 'EUR'
      }
    ];

    setNewsItems(mockNews);
    setMarketUpdates(mockUpdates);
    setEconomicEvents(mockEvents);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new market update occasionally
      if (Math.random() > 0.7) {
        const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'];
        const types: MarketUpdate['type'][] = ['PRICE_ALERT', 'VOLUME_SPIKE', 'BREAKOUT'];
        const severities: MarketUpdate['severity'][] = ['INFO', 'WARNING', 'CRITICAL'];
        
        const newUpdate: MarketUpdate = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          message: 'Real-time market movement detected',
          timestamp: new Date(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          price: 100 + Math.random() * 400,
          change: (Math.random() - 0.5) * 10
        };

        setMarketUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.symbols.some(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-400 border-red-500';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500';
      case 'LOW': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return 'text-green-400 border-green-500';
      case 'BEARISH': return 'text-red-400 border-red-500';
      case 'NEUTRAL': return 'text-gray-400 border-gray-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 border-red-500';
      case 'WARNING': return 'text-yellow-400 border-yellow-500';
      case 'INFO': return 'text-blue-400 border-blue-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Newspaper className="w-5 h-5 mr-2 text-blue-400" />
              Market News & Updates
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
          {/* Search and Filter */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search news, symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['ALL', 'EARNINGS', 'ECONOMIC', 'COMPANY', 'MARKET', 'CRYPTO', 'FOREX'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="news">News Feed</TabsTrigger>
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="events">Economic Events</TabsTrigger>
        </TabsList>

        {/* News Feed */}
        <TabsContent value="news" className="mt-4">
          <div className="space-y-3">
            {filteredNews.map((item) => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getImpactColor(item.impact)}>
                        {item.impact}
                      </Badge>
                      <Badge variant="outline" className={getSentimentColor(item.sentiment)}>
                        {item.sentiment}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(item.timestamp)}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-slate-300 mb-3 line-clamp-2">{item.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Source: {item.source}</span>
                      {item.symbols.length > 0 && (
                        <div className="flex space-x-1">
                          {item.symbols.slice(0, 3).map((symbol) => (
                            <Badge key={symbol} variant="outline" className="text-xs border-purple-500 text-purple-400">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Live Alerts */}
        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-3">
            {marketUpdates.map((update) => (
              <Card key={update.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getSeverityColor(update.severity)}>
                        {update.severity}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {update.type.replace('_', ' ')}
                      </Badge>
                      <span className="font-semibold">{update.symbol}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatTimeAgo(update.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-2">{update.message}</p>
                  
                  {update.price && (
                    <div className="flex items-center space-x-4 text-xs">
                      <div>
                        <span className="text-slate-400">Price: </span>
                        <span className="font-semibold">${update.price.toFixed(2)}</span>
                      </div>
                      {update.change && (
                        <div className={`flex items-center ${update.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {update.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          <span>{update.change >= 0 ? '+' : ''}{update.change.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Economic Events */}
        <TabsContent value="events" className="mt-4">
          <div className="space-y-3">
            {economicEvents.map((event) => (
              <Card key={event.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getImpactColor(event.importance)}>
                        {event.importance}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {event.country}
                      </Badge>
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        {event.currency}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      {event.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-3">{event.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-xs text-slate-400">Previous</div>
                      <div className="font-semibold">{event.previous || 'N/A'}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-xs text-slate-400">Forecast</div>
                      <div className="font-semibold text-blue-400">{event.forecast || 'N/A'}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-xs text-slate-400">Actual</div>
                      <div className={`font-semibold ${event.actual ? 'text-green-400' : 'text-slate-400'}`}>
                        {event.actual || 'Pending'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}